export class Proto {
  static TYPE_DOUBLE = 1;
  static TYPE_FLOAT = 2;
  static TYPE_INT64 = 3;
  static TYPE_UINT64 = 4;
  static TYPE_INT32 = 5;
  static TYPE_FIXED64 = 6;
  static TYPE_FIXED32 = 7;
  static TYPE_BOOL = 8;
  static TYPE_STRING = 9;
  static TYPE_GROUP = 10;
  static TYPE_MESSAGE = 11;
  static TYPE_BYTES = 12;
  static TYPE_UINT32 = 13;
  static TYPE_ENUM = 14;
  static TYPE_SFIXED32 = 15;
  static TYPE_SFIXED64 = 16;
  static TYPE_SINT32 = 17;
  static TYPE_SINT64 = 18;

  static TypeNameMap = {
    1: 'TYPE_DOUBLE',
    2: 'TYPE_FLOAT',
    3: 'TYPE_INT64',
    4: 'TYPE_UINT64',
    5: 'TYPE_INT32',
    6: 'TYPE_FIXED64',
    7: 'TYPE_FIXED32',
    8: 'TYPE_BOOL',
    9: 'TYPE_STRING',
    10: 'TYPE_GROUP',
    11: 'TYPE_MESSAGE',
    12: 'TYPE_BYTES',
    13: 'TYPE_UINT32',
    14: 'TYPE_ENUM',
    15: 'TYPE_SFIXED32',
    16: 'TYPE_SFIXED64',
    17: 'TYPE_SINT32',
    18: 'TYPE_SINT64',
  };

  static ExampleValueMap = {
    1: 'TYPE_DOUBLE',
    2: 'TYPE_FLOAT',
    3: 'TYPE_INT64',
    4: 'TYPE_UINT64',
    5: 'TYPE_INT32',
    6: 'TYPE_FIXED64',
    7: 'TYPE_FIXED32',
    8: 'TYPE_BOOL',
    9: 'TYPE_STRING',
    10: 'TYPE_GROUP',
    11: 'TYPE_MESSAGE',
    12: 'TYPE_BYTES',
    13: 'TYPE_UINT32',
    14: 'TYPE_ENUM',
    15: 'TYPE_SFIXED32',
    16: 'TYPE_SFIXED64',
    17: 'TYPE_SINT32',
    18: 'TYPE_SINT64',
  };
}

/**
 * 格式化Proto描述
 * @param desc
 */
export function formatProtoDesc(desc) {
  let formatter = (proto) => {
    if (!proto && typeof proto !== 'object') return null;

    let ret = {};
    let keys = Object.keys(proto);
    keys.map((key) => {
      let item = proto[key];
      let jsonName = item.json_name;
      ret[jsonName] = Proto.TypeNameMap[item.type];
      if (item.comment) ret[jsonName] += ' ' + item.comment;
      if (item.is_repeated) {
        ret[jsonName] = [ret[jsonName]];
      }
      if (item.type === Proto.TYPE_MESSAGE) {
        ret[jsonName] = formatter(item.message_type);
      }
    });

    return ret;
  };

  return formatter(desc);
}
