import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const LanguageDYConf = "dy/conf"

export function registerLanguage() {
  monaco.languages.register({
    id: LanguageDYConf
  })

  monaco.languages.setLanguageConfiguration(LanguageDYConf, {
    brackets: [
      ['[', ']']
    ],
    comments: {
      lineComment: '#'
    }
  })
}

function initTokens() {

  monaco.languages.setMonarchTokensProvider(LanguageDYConf, {
    tokenPostfix: '.toml',
    // @ts-ignore
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
      root: [
        //variable
        [/(\{\{)([\w\@]+)(\}\})/, ['', 'variable', '']],

        // sections
        [/\[[^\]]*\]/, 'metatag'],

        // keys
        [/(^\w+)(\s*)(\=)/, ['key', '', 'delimiter']],

        [/([\w\.]+)(\s*)(\=)/, ['key', '', 'delimiter']],

        [/\d+/, 'number'],

        // [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        // [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        // [/"/, 'string', '@string."'],
        // [/'/, 'string', '@string.\''],

        [/"([^"\\])"/, 'string'],
        [/'([^"\\])'/, 'string'],

        {include: '@whitespace'},

      ],
      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/^\s*[#;].*$/, 'comment'],
        [/(#.*)$/, 'comment'],
      ],
      string: [
        [/[^\\"']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/["']/, {
          cases: {
            '$#==$S2': {token: 'string', next: '@pop'},
            '@default': 'string'
          }
        }],
      ],
      variable: [
        [/[\{]/, {
          cases: {
            '$#==$S2': {token: 'variable', next: '@pop'},
            '@default': 'variable'
          }
        }]
      ]
    }
  })
}

export default function initLanguage() {

  registerLanguage()
  initTokens()

}
