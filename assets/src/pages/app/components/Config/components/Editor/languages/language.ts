import {languages, Thenable} from "monaco-editor";
import LanguageConfiguration = languages.LanguageConfiguration;
import IMonarchLanguage = languages.IMonarchLanguage;

export interface Language {
  id: () => string
  configuration: () => LanguageConfiguration
  tokensProvider: () => IMonarchLanguage | Thenable<IMonarchLanguage>
}
