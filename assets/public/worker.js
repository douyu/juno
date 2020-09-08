/* eslint-env worker */
/* eslint no-var: off, strict: off */
/* globals prettier prettierPlugins */

var imported = Object.create(null);
function importScriptOnce(url) {
  if (!imported[url]) {
    imported[url] = true;
    importScripts(url);
  }
}

// this is required to only load parsers when we need them
var parsers = {
  // JS - Babel
  get babel() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.babel;
  },
  get 'babel-flow'() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers['babel-flow'];
  },
  get 'babel-ts'() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers['babel-ts'];
  },
  get json() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.json;
  },
  get json5() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.json5;
  },
  get 'json-stringify'() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers['json-stringify'];
  },
  get __js_expression() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.__js_expression;
  },
  get __vue_expression() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.__vue_expression;
  },
  get __vue_event_binding() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-babel.js');
    return prettierPlugins.babel.parsers.__vue_event_binding;
  },
  // JS - Flow
  get flow() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-flow.js');
    return prettierPlugins.flow.parsers.flow;
  },
  // JS - TypeScript
  get typescript() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-typescript.js');
    return prettierPlugins.typescript.parsers.typescript;
  },
  // JS - Angular Action
  get __ng_action() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-angular.js');
    return prettierPlugins.angular.parsers.__ng_action;
  },
  // JS - Angular Binding
  get __ng_binding() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-angular.js');
    return prettierPlugins.angular.parsers.__ng_binding;
  },
  // JS - Angular Interpolation
  get __ng_interpolation() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-angular.js');
    return prettierPlugins.angular.parsers.__ng_interpolation;
  },
  // JS - Angular Directive
  get __ng_directive() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-angular.js');
    return prettierPlugins.angular.parsers.__ng_directive;
  },
  // CSS
  get css() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-postcss.js');
    return prettierPlugins.postcss.parsers.css;
  },
  get less() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-postcss.js');
    return prettierPlugins.postcss.parsers.css;
  },
  get scss() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-postcss.js');
    return prettierPlugins.postcss.parsers.css;
  },
  // GraphQL
  get graphql() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-graphql.js');
    return prettierPlugins.graphql.parsers.graphql;
  },
  // Markdown
  get markdown() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-markdown.js');
    return prettierPlugins.markdown.parsers.remark;
  },
  get mdx() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-markdown.js');
    return prettierPlugins.markdown.parsers.mdx;
  },
  // YAML
  get yaml() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-yaml.js');
    return prettierPlugins.yaml.parsers.yaml;
  },
  // Handlebars
  get glimmer() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-glimmer.js');
    return prettierPlugins.glimmer.parsers.glimmer;
  },
  // HTML
  get html() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-html.js');
    return prettierPlugins.html.parsers.html;
  },
  // Vue
  get vue() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-html.js');
    return prettierPlugins.html.parsers.vue;
  },
  // Angular
  get angular() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-html.js');
    return prettierPlugins.html.parsers.angular;
  },
  // Lightning Web Components
  get lwc() {
    importScriptOnce('/ant/js/prettier/v2.0.5/parser-html.js');
    return prettierPlugins.html.parsers.lwc;
  },
};

importScripts('/ant/js/prettier/v2.0.5/standalone.js');
// eslint-disable-next-line no-unused-vars
var PRETTIER_DEBUG = true;

self.onmessage = function (event) {
  self.postMessage({
    uid: event.data.uid,
    message: handleMessage(event.data.message),
  });
};

function handleMessage(message) {
  if (message.type === 'meta') {
    return {
      type: 'meta',
      supportInfo: JSON.parse(
        JSON.stringify(
          prettier.getSupportInfo({
            showUnreleased: true,
          }),
        ),
      ),
      version: prettier.version,
    };
  }

  if (message.type === 'format') {
    var options = message.options || {};

    delete options.ast;
    delete options.doc;
    delete options.output2;

    var plugins = [{ parsers }];
    options.plugins = plugins;

    var response = {
      formatted: formatCode(message.code, options),
      debug: {
        ast: null,
        doc: null,
        reformatted: null,
      },
    };

    if (message.debug.ast) {
      var ast;
      var errored = false;
      try {
        ast = JSON.stringify(prettier.__debug.parse(message.code, options).ast);
      } catch (e) {
        errored = true;
        ast = String(e);
      }

      if (!errored) {
        try {
          ast = formatCode(ast, { parser: 'json', plugins });
        } catch (e) {
          ast = JSON.stringify(ast, null, 2);
        }
      }
      response.debug.ast = ast;
    }

    if (message.debug.doc) {
      try {
        response.debug.doc = prettier.__debug.formatDoc(
          prettier.__debug.printToDoc(message.code, options),
          { parser: 'babel', plugins },
        );
      } catch (e) {
        response.debug.doc = String(e);
      }
    }

    if (message.debug.reformat) {
      response.debug.reformatted = formatCode(response.formatted, options);
    }

    return response;
  }
}

function formatCode(text, options) {
  try {
    return prettier.format(text, options);
  } catch (e) {
    if (e.constructor && e.constructor.name === 'SyntaxError') {
      // Likely something wrong with the user's code
      return String(e);
    }
    // Likely a bug in Prettier
    // Provide the whole stack for debugging
    return e.stack || String(e);
  }
}
