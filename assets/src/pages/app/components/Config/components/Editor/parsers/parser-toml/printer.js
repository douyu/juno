import { BaseTomlCstVisitor } from './parser';
import { tokensDictionary as t } from './lexer/api';
import prettier from 'prettier/standalone';

const {
  trimComment,
  collectComments,
  arrItemOffset,
  arrItemProp,
  getSingle,
} = require('./printer-utils');
const { concat, join, line, hardline, softline, ifBreak, indent, group } = prettier.doc.builders;

class TomlBeautifierVisitor extends BaseTomlCstVisitor {
  constructor() {
    super();
    this.validateVisitor();

    // TODO: this methods should be defined on the prototype
    // defining as instance members **after** the validations to avoid
    // false positive errors on redundant methods
    this.mapVisit = (elements) => {
      if (elements === undefined) {
        // TODO: can optimize this by returning an immutable empty array singleton.
        return [];
      }

      return elements.map(this.visit, this);
    };

    this.visitSingle = function (ctx) {
      const singleElement = getSingle(ctx);
      return this.visit(singleElement);
    };

    // hack to get a reference to the inherited visit method from
    // the prototype because we cannot user "super.visit" inside the function
    // below
    const orgVisit = this.visit;
    this.visit = function (ctx, inParam) {
      if (ctx === undefined) {
        // empty Doc
        return '';
      }

      return orgVisit.call(this, ctx, inParam);
    };
  }

  toml(ctx) {
    // empty toml document
    if (ctx.expression === undefined) {
      return concat([line]);
    }

    function isTable(node) {
      return node.children.table !== undefined;
    }

    function isOnlyComment(node) {
      return node.children.Comment !== undefined && Object.keys(node.children).length === 1;
    }

    const expsCsts = ctx.expression;
    const cstGroups = [];
    let currCstGroup = [];

    // TODO: EXTRACT to print utils?
    // Split the expressions into groups defined by the tables.
    for (let i = expsCsts.length - 1; i >= 0; i--) {
      const currCstNode = expsCsts[i];
      currCstGroup.push(currCstNode);
      if (isTable(currCstNode)) {
        let j = i - 1;
        let stillInComments = true;
        // add leading comments to the current group
        while (j >= 0 && stillInComments === true) {
          const priorCstNode = expsCsts[j];
          if (isOnlyComment(priorCstNode)) {
            currCstGroup.push(priorCstNode);
            j--;
            i--;
          } else {
            stillInComments = false;
          }
        }
        // scanning and adding items in reverse so we must now reverse the result
        currCstGroup.reverse();
        cstGroups.push(currCstGroup);
        currCstGroup = [];
      }
    }
    if (currCstGroup.length > 0) {
      currCstGroup.reverse();
      cstGroups.push(currCstGroup);
    }

    // once again adjust to scanning in reverse.
    cstGroups.reverse();
    const docGroups = cstGroups.map((currGroup) => this.mapVisit(currGroup));
    // newlines between each group's elements
    const docGroupsInnerNewlines = docGroups.map((currGroup) => join(line, currGroup));
    const docGroupsOuterNewlines = join(concat([line, line]), docGroupsInnerNewlines);
    return concat([
      docGroupsOuterNewlines,
      // Terminating newline
      line,
    ]);
  }

  expression(ctx) {
    if (ctx.keyval) {
      let keyValDoc = this.visit(ctx.keyval);
      if (ctx.Comment) {
        const commentText = trimComment(ctx.Comment[0].image);
        keyValDoc = concat([keyValDoc, ' ' + commentText]);
      }
      return keyValDoc;
    } else if (ctx.table) {
      let tableDoc = this.visit(ctx.table);
      if (ctx.Comment) {
        const commentText = trimComment(ctx.Comment[0].image);
        tableDoc = concat([tableDoc, ' ' + commentText]);
      }
      return tableDoc;
    } else {
      return trimComment(ctx.Comment[0].image);
    }
  }

  keyval(ctx) {
    const keyDoc = this.visit(ctx.key);
    const valueDoc = this.visit(ctx.val);
    return concat([keyDoc, ' = ', valueDoc]);
  }

  key(ctx) {
    const keyTexts = ctx.IKey.map((tok) => tok.image);
    // TODO: inspect if the use of a quoted key was really needed
    //       and remove quotes if not.
    return join('.', keyTexts);
  }

  val(ctx) {
    const actualValueNode = getSingle(ctx);
    if (actualValueNode.image !== undefined) {
      // A Terminal
      return actualValueNode.image;
    } else {
      return this.visitSingle(ctx);
    }
  }

  array(ctx) {
    const arrayValuesDocs = ctx.arrayValues ? this.visit(ctx.arrayValues) : '';
    const postComments = collectComments(ctx.commentNewline);
    const commentsDocs = concat(
      postComments.map((commentTok) => {
        const trimmedCommentText = trimComment(commentTok.image);
        return concat([hardline, trimmedCommentText]);
      }),
    );
    return group(concat(['[', indent(concat([arrayValuesDocs, commentsDocs])), softline, ']']));
  }

  arrayValues(ctx) {
    const values = ctx.val ? ctx.val : [];
    const commas = ctx.Comma ? ctx.Comma : [];
    const comments = collectComments(ctx.commentNewline);

    const itemsCst = values.concat(commas, comments);
    itemsCst.sort((a, b) => {
      const aOffset = arrItemOffset(a);
      const bOffset = arrItemOffset(b);
      return aOffset - bOffset;
    });

    const itemsDoc = [];
    for (let i = 0; i < itemsCst.length; i++) {
      const cstItem = itemsCst[i];
      if (cstItem.name === 'val') {
        const valDoc = this.visit(cstItem);
        const valEndLine = arrItemProp(cstItem, 'endLine');
        let potentialComma = '';

        // Another Item means either a comma or a Comma followed by a Comment
        if (itemsCst[i + 1] !== undefined) {
          let nextPossibleComment = itemsCst[i + 1];
          // skip Commas
          if (nextPossibleComment.tokenType === t.Comma) {
            potentialComma = ',';
            i++;
            nextPossibleComment = itemsCst[i + 1];
          }
          // Comment on **same line** as the value
          if (
            nextPossibleComment !== undefined &&
            nextPossibleComment.tokenType === t.Comment &&
            nextPossibleComment.startLine === valEndLine
          ) {
            i++;
            const trimmedComment = trimComment(nextPossibleComment.image);
            // adding a single space between the comma and the comment
            const comment = ' ' + trimmedComment;
            // a hardline is used to ensure a lineBreak after the comment
            itemsDoc.push(concat([valDoc, potentialComma, comment, hardline]));
          }
          // no comment on the same line
          else {
            const isTrailingComma = i === itemsCst.length - 1;
            const optionalCommaLineBreak = isTrailingComma
              ? // only print trailing comma if this is a multiline array.
                ifBreak(',', '')
              : concat([potentialComma, line]);
            itemsDoc.push(concat([valDoc, optionalCommaLineBreak]));
          }
        }
        // last item without any followup
        else {
          itemsDoc.push(concat([valDoc]));
        }
      }
      // separate line comment
      else if (cstItem.tokenType === t.Comment) {
        const trimmedComment = trimComment(cstItem.image);
        itemsDoc.push(concat([trimmedComment, hardline]));
      } else {
        throw Error('non exhaustive match');
      }
    }
    return concat([softline, concat(itemsDoc)]);
  }

  inlineTable(ctx) {
    const inlineTableKeyValsDocs = ctx.inlineTableKeyVals ? this.visit(ctx.inlineTableKeyVals) : '';
    return group(concat(['{ ', inlineTableKeyValsDocs, ' }']));
  }

  inlineTableKeyVals(ctx) {
    const keyValDocs = this.mapVisit(ctx.keyval);
    return join(', ', keyValDocs);
  }

  table(ctx) {
    return this.visitSingle(ctx);
  }

  stdTable(ctx) {
    const keyDoc = this.visit(ctx.key);
    return concat(['[', keyDoc, ']'], line);
  }

  arrayTable(ctx) {
    const keyDoc = this.visit(ctx.key);
    return concat(['[[', keyDoc, ']]'], line);
  }

  resource(ctx) {
    return concat(['{{', ctx.ResourceName[0].image, '}}'], line);
  }

  nl(ctx) {
    // We do not currently care about newlines
    // Perhaps this will change in the future...
    throw Error('Should not get here!');
  }

  commentNewline(ctx) {}
}

const beautifierVisitor = new TomlBeautifierVisitor();

function print(path, options, print) {
  const cst = path.getValue();
  const doc = beautifierVisitor.visit(cst);
  return doc;
}

export { print };
