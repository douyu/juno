import { locEnd, locStart } from './loc';
import { parse } from './parser';
import { print } from './printer';

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    extensions: ['.toml'],
    name: 'Toml',
    parsers: ['toml'],
    type: 'data',
    filenames: ['Cargo.lock', 'Gopkg.lock'],
    tmScope: 'source.toml',
    aceMode: 'toml',
    codemirrorMode: 'toml',
    codemirrorMimeType: 'text/x-toml',
    language_id: 365,
  },
];

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  'toml-cst': {
    print,
  },
};

export default function tomlParser(config) {
  return {
    languages,
    // https://prettier.io/docs/en/plugins.html#parsers
    parsers: {
      toml: {
        astFormat: 'toml-cst',
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
