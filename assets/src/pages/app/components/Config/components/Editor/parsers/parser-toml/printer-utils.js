function trimComment(commentText) {
  return commentText.replace(/[ \t]+$/, '');
}

function canUnquote(quotedText) {
  // TODO: TBD
}

function collectComments(commentsNL) {
  const comments = [];
  commentsNL.forEach((commentNLNode) => {
    const commentsTok = commentNLNode.children.Comment;
    if (commentsTok !== undefined) {
      Array.prototype.push.apply(comments, commentsTok);
    }
  });

  return comments;
}

function getSingle(ctx) {
  const ctxKeys = Object.keys(ctx);
  if (ctxKeys.length !== 1) {
    throw Error(`Expecting single key CST ctx but found: <${ctxKeys.length}> keys`);
  }
  const singleElementKey = ctxKeys[0];
  const singleElementValues = ctx[singleElementKey];

  if (singleElementValues.length !== 1) {
    throw Error(
      `Expecting single item in CST ctx key but found: <${singleElementValues.length}> items`,
    );
  }

  return singleElementValues[0];
}

// TODO: replace with arrItemProp
function arrItemOffset(item) {
  if (item.name === 'val') {
    item = getSingle(item.children);
  }

  if (item.startOffset) {
    return item.startOffset;
  } else if (item.children.LSquare) {
    return item.children.LSquare[0].startOffset;
  } else if (item.children.LVarCurly) {
    return item.children.LVarCurly[0].startOffset;
  } else if (item.children.LCurly) {
    return item.children.LCurly[0].startOffset;
  } else {
    throw Error('non exhaustive match');
  }
}

function arrItemProp(item, propName) {
  if (item.name === 'val') {
    item = getSingle(item.children);
  }

  if (item[propName]) {
    return item[propName];
  } else if (item.children.LSquare) {
    return item.children.LSquare[0][propName];
  } else if (item.children.LVarCurly) {
    return item.children.LVarCurly[0][propName];
  } else if (item.children.LCurly) {
    return item.children.LCurly[0][propName];
  } else {
    throw Error('non exhaustive match');
  }
}

module.exports = {
  trimComment,
  canUnquote,
  collectComments,
  arrItemOffset,
  arrItemProp,
  getSingle,
};
