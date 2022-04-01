export function trimLeft(str, character) {
  let begin = 0;
  for (let i = 0; i < str.length; ++i) {
    if (str.charAt(i) === character) {
      begin += 1;
    } else {
      break;
    }
  }

  return str.substr(begin, str.length - begin);
}

export function trimRight(str, character) {
  let len = str.length;
  for (let i = str.length - 1; i >= 0; --i) {
    if (str.charAt(i) === character) {
      len -= 1;
    } else {
      break;
    }
  }

  return str.substr(0, len);
}

export function trim(str, character) {
  return trimRight(trimLeft(str, character));
}
