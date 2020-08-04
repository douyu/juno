import * as monaco from 'monaco-editor'
import {INI, Toml, Yaml} from "./languages";

const languages = [
  Toml,
  INI,
  Yaml
]

export default function initLanguage() {
  monaco.editor.defineTheme('dy-vs-dark', {
    colors: {},
    inherit: true,
    base: 'vs-dark',
    rules: [
      {
        token: 'variable',
        foreground: '#8fd9ff',
        fontStyle: 'bold'
      },
      {
        token: 'string.escape',
        foreground: '#668658',
        fontStyle: 'bold'
      }
    ]
  })

  for (let lang of languages) {
    monaco.languages.register({
      id: lang.id()
    })

    monaco.languages.setLanguageConfiguration(
      lang.id(),
      lang.configuration(),
    )

    monaco.languages.setMonarchTokensProvider(
      lang.id(),
      lang.tokensProvider()
    )
  }

}
