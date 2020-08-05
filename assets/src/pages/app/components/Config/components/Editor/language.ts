import * as monaco from 'monaco-editor'
import {INI, Toml, Yaml} from "./languages";

const languages = [
  Toml,
  INI,
  Yaml
]

export default function initLanguage() {

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
