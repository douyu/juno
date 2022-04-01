import { trimLeft, trimRight } from '@/utils/strings';

const RegexVariable = /\{{2}\w+\@\w+\}{2}/g;

/**
 * 解析配置文件依赖的资源
 */
export function parseConfigResource(content: string) {
  let matchVars = [...content.matchAll(RegexVariable)].map((item) => item[0]);

  let resourceMap = {};

  return matchVars
    .filter((res) => {
      if (resourceMap[res]) {
        return false;
      }

      resourceMap[res] = true;
      return true;
    })
    .map((v) => {
      v = trimRight(trimLeft(v, '{'), '}');
      let splices = v.split('@');
      return {
        name: splices[0],
        version: parseInt(splices[1]),
      };
    });
}
