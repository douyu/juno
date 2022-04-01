import { Language } from './language';
import { languages, Thenable } from 'monaco-editor';

export const Toml: Language = {
  id() {
    return 'dy/toml';
  },
  configuration() {
    return {
      comments: {
        lineComment: '#',
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    } as languages.LanguageConfiguration;
  },
  tokensProvider() {
    return {
      defaultToken: '',
      tokenPostfix: '.toml',

      // we include these common regular expressions
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      var: /x(?:[abfnrtv\\"'])/,

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          //variable
          [/(\{\{)([\w\@]+)(\}\})/, ['', 'variable', '']],

          // sections
          [/^[\s]*\[[^\]]*\]/, 'metatag'],

          // keys
          [/(^\w+)(\s*)(\=)/, ['key', '', 'delimiter']],

          // whitespace
          { include: '@whitespace' },
          { include: '@comment' },
          [/\s*(true|false)(\s*)/, ['keyword', '']],

          // numbers
          [/\d+/, 'number'],

          // strings: recover on non-terminated strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
          [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
          [/"/, 'string', '@string."'],
          [/'/, 'string', "@string.'"],
        ],

        whitespace: [
          [/[ \s\t\r\n]+/, ''],
          [/^\s*[#;].*$/, 'comment'],
        ],

        string: [
          [/\{\{/, { token: 'delimiter.bracket', next: '@variableCounting' }],
          [/[^\\"'\{]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [
            /["']/,
            {
              cases: {
                '$#==$S2': { token: 'string', next: '@pop' },
                '@default': 'string',
              },
            },
          ],
        ],

        variableCounting: [
          [/[^\}]+/, 'variable'],
          [/\}\}/, 'delimiter.bracket', '@pop'],
        ],

        comment: [[/#.*$/, 'comment']],
      },
    } as languages.IMonarchLanguage | Thenable<languages.IMonarchLanguage>;
  },
};
