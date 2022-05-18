import { Lexer } from 'chevrotain';
import { tokensArray, tokensDictionary } from './tokens';

const tomlLexer = new Lexer(tokensArray, {
  // Reducing the amount of position tracking can provide a small performance boost (<10%)
  // Likely best to keep the full info for better error position reporting and
  // to expose "fuller" ITokens from the Lexer.
  positionTracking: 'full',
  ensureOptimizations: true,

  // Both TOML lineTerminators contain a "\n"
  // The "lineTerminatorCharacters" parameter is only used to flag patterns that **may**
  // contain line terminators, so this is still correct.
  lineTerminatorCharacters: ['\n'],
  lineTerminatorsPattern: /\n|\r\n/g,
});

function tokenize(text) {
  return tomlLexer.tokenize(text);
}

export { tokenize, tokensDictionary };
