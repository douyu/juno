import { locEnd, locStart } from './loc';
import { parse } from './parser';
import { print } from './printer';

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    name: 'INI',
    parsers: ['ini'],
  },
];

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  'ini-cst': {
    print,
  },
};

export default function iniParser(config) {
  return {
    languages,
    // https://prettier.io/docs/en/plugins.html#parsers
    parsers: {
      ini: {
        astFormat: 'ini-cst',
        parse: (text, parsers, options) => {
          return parse(text, config);
        },
        locStart,
        locEnd,
      },
    },
    printers,
  };
}
