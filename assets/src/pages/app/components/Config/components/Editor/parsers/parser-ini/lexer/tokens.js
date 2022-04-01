import { createToken as createTokenOrg, Lexer } from 'chevrotain';

// A little mini DSL for easier lexer definition.
const fragments = {};
const f = fragments;

function FRAGMENT(name, def) {
  fragments[name] = typeof def === 'string' ? def : def.source;
}

function makePattern(strings, ...args) {
  let combined = '';
  for (let i = 0; i < strings.length; i++) {
    combined += strings[i];
    if (i < args.length) {
      let pattern = args[i];
      // if a TokenType was passed
      if (args[i].PATTERN) {
        pattern = args[i].PATTERN;
      }
      const patternSource = typeof pattern === 'string' ? pattern : pattern.source;
      // By wrapping in a RegExp (none) capturing group
      // We enabled the safe usage of qualifiers and assertions.
      combined += `(?:${patternSource})`;
    }
  }
  return new RegExp(combined);
}

const tokensArray = [];
const tokensDictionary = {};

function createToken(options) {
  const newTokenType = createTokenOrg(options);
  tokensArray.push(newTokenType);
  tokensDictionary[options.name] = newTokenType;
  return newTokenType;
}

const Newline = createToken({ name: 'Newline', pattern: /\n|\r\n/ });
const Whitespace = createToken({
  name: 'Whitespace',
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
});
createToken({
  name: 'Comment',
  pattern: /#(?:[^\n\r]|\r(?!\n))*/,
});
createToken({ name: 'KeyValSep', pattern: '=' });
createToken({ name: 'Dot', pattern: '.' });
const IString = createToken({ name: 'IString', pattern: Lexer.NA });
// TODO: comment on unicode complements and \uFFFF range
FRAGMENT('basic_unescaped', /[\u0020-\u0021]|[\u0023-\u005B]|[\u005D-\u007E]|[\u0080-\uFFFF]/);
FRAGMENT('escaped', /\\(?:[btnfr"\\]|u[0-9a-fA-F]{4}(?:[0-9a-fA-F]{4})?)/);
FRAGMENT('basic_char', makePattern`${f.basic_unescaped}|${f.escaped}`);
FRAGMENT(
  'ML_BASIC_UNESCAPED',
  // TODO: comment on unicode complements and \uFFFF range
  // SPEC Deviation: included backslash (5C)
  //      See: https://github.com/toml-lang/toml/pull/590
  /[\u0020-\u005B]|[\u005D-\u007E]|[\u0080-\uFFFF]/,
);
FRAGMENT('ML_BASIC_CHAR', makePattern`${f.ML_BASIC_UNESCAPED}|${f.escaped}`);
FRAGMENT(
  'ML_BASIC_BODY',
  makePattern`(?:${f.ML_BASIC_CHAR}|${Newline}|\\\\${Whitespace}?${Newline})*`,
);
createToken({
  name: 'ResourceName',
  pattern: /[a-zA-Z0-9_\-]+@\d+/,
});
createToken({
  name: 'LVarCurly',
  pattern: /{{/,
});
createToken({
  name: 'RVarCurly',
  pattern: /}}/,
});
createToken({
  name: 'LSquare',
  pattern: '[',
});
createToken({
  name: 'RSquare',
  pattern: ']',
});
const IKey = createToken({ name: 'IKey', pattern: /[^\[\]=]+/ });
createToken({
  name: 'Value',
  pattern: /[^\n\r]+/,
});
// FRAGMENT("date_fullyear", /\d{4}/);
// FRAGMENT("date_month", /\d{2}/);
// FRAGMENT("date_mday", /\d{2}/);
// FRAGMENT("time_delim", /[tT ]/);
// FRAGMENT("time_hour", /\d{2}/);
// FRAGMENT("time_minute", /\d{2}/);
// FRAGMENT("time_second", /\d{2}/);
// FRAGMENT("time_secfrac", /.\d+/);
// FRAGMENT("time_numoffset", makePattern`[+-]${f.time_hour}:${f.time_minute}`);
// FRAGMENT("time_offset", makePattern`[zZ]|${f.time_numoffset}`);
// FRAGMENT(
//   "partial_time",
//   makePattern`${f.time_hour}:${f.time_minute}:${f.time_second}${
//     f.time_secfrac
//   }?`
// );
// FRAGMENT(
//   "full_date",
//   makePattern`${f.date_fullyear}-${f.date_month}-${f.date_mday}`
// );
// FRAGMENT("full_time", makePattern`${f.partial_time}${f.time_offset}`);
// createToken({
//   name: "OffsetDateTime",
//   pattern: makePattern`${f.full_date}${f.time_delim}${f.full_time}`,
//   categories: [IDateTime]
// });
// createToken({
//   name: "LocalDateTime",
//   pattern: makePattern`${f.full_date}${f.time_delim}${f.partial_time}`,
//   categories: [IDateTime]
// });
// createToken({
//   name: "LocalDate",
//   pattern: makePattern`${f.full_date}`,
//   categories: [IDateTime]
// });
// createToken({
//   name: "LocalTime",
//   pattern: makePattern`${f.partial_time}`,
//   categories: [IDateTime]
// });
// const IFloat = createToken({
//   name: "IFloat",
//   pattern: Lexer.NA
// });

// const decimalIntPatern = /[+-]?(?:0|[1-9](?:_?\d)*)/;
// FRAGMENT("float_int_part", decimalIntPatern);
// FRAGMENT("decimal_point", /\./);
// FRAGMENT("zero_prefixable_int", /\d(?:_?\d)*/);
// FRAGMENT("exp", makePattern`[eE]${f.float_int_part}`);
// FRAGMENT("frac", makePattern`${f.decimal_point}${f.zero_prefixable_int}`);
// createToken({
//   name: "Float",
//   pattern: makePattern`${f.float_int_part}(?:${f.exp}|${f.frac}${f.exp}?)`,
//   categories: [IFloat]
// });
// createToken({
//   name: "SpecialFloat",
//   pattern: /[+-](?:inf|nan)/,
//   categories: [IFloat]
// });
// const IInteger = createToken({
//   name: "IInteger",
//   pattern: Lexer.NA
// });
// const DecimalInt = createToken({
//   name: "DecimalInt",
//   pattern: decimalIntPatern,
//   // Not that DecimalInt is both an IInteger **and** an IUnquotedKey
//   categories: [IInteger, IUnquotedKey]
// });
// createToken({
//   name: "HexInt",
//   pattern: /0x[0-9A-F](?:_?[0-9A-F])*/,
//   categories: [IInteger]
// });
// createToken({
//   name: "OctInt",
//   pattern: /0o[0-7](?:_?[0-7])*/,
//   categories: [IInteger]
// });
// createToken({
//   name: "BinInt",
//   pattern: /0b[0-1](?:_?[0-1])*/,
//   categories: [IInteger]
// });

// createToken({
//   name: "Comma",
//   pattern: ","
// });
// createToken({
//   name: "LCurly",
//   pattern: "{"
// });
// createToken({
//   name: "RCurly",
//   pattern: "}"
// });
//
// const UnquotedKey = createToken({
//   name: "UnquotedKey",
//   pattern: /[A-Za-z0-9_-]+/,
//   categories: [IUnquotedKey]
// });
// const possibleUnquotedKeysPrefixes = [True, False, DecimalInt];
// possibleUnquotedKeysPrefixes.forEach(tokType => {
//   tokType.LONGER_ALT = UnquotedKey;
// });

export { tokensArray, tokensDictionary };
