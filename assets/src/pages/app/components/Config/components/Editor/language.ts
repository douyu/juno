import * as monaco from 'monaco-editor'

const LanguageDYConf = "dy/conf"

import {editor} from 'monaco-editor';

export default function initLanguage(editor: editor.IStandaloneCodeEditor) {

  let initLanguageToken: () => void = function () {
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

    monaco.languages.setMonarchTokensProvider(LanguageDYConf, {
      tokenPostfix: '.toml',
      // @ts-ignore
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      tokenizer: {
        root: [
          // sections
          [/\[[^\]]*\]/, 'metatag'],

          // keys
          [/(^\w+)(\s*)(\=)/, ['key', '', 'delimiter']],

          [/([\w\.]+)(\s*)(\=)/, ['key', '', 'delimiter']],

          [/\d+/, 'number'],

          [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
          [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
          [/"/, 'string', '@string."'],
          [/'/, 'string', '@string.\''],

          {include: '@whitespace'},

          //variable
          [/(\{\{)(\w+)(\}\})/, ['', 'variable', '']],
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
          }]
        ],
      }
    })

  }

  // @ts-ignore
  let initCodeLensProvider: any = () => {
    debugger;
    let CommandPublish = editor.addCommand(0, function () {
      console.log("???")
    }, '')

    monaco.languages.registerCodeLensProvider(LanguageDYConf, {
      provideCodeLenses: function (model: monaco.editor.ITextModel, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeLensList> {
        return {
          lenses: [
            {
              range: {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 1
              },
              id: "First Line",
              command: {
                id: CommandPublish || '',
                title: "First Line"
              }
            }
          ],
          dispose() {
          },
        }
      },
      resolveCodeLens: function (model, codeLens, token) {
        return codeLens;
      }
    });
  }

  initLanguageToken()
  // initCodeLensProvider()
}
