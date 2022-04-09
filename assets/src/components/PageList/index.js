import Search from './search';
import Query from '@/utils/query';
import { parse, stringify } from 'qs';
import { history } from 'umi';

const count = (params) => {
  let count = 0;
  for (var property in params) {
    if (Object.prototype.hasOwnProperty.call(params, property)) {
      count++;
    }
  }
  return count;
};

class PageList {
  static Search = Search;
  currentPage = 1;
  pageSize = 10;
  /**
   * string | function
   */
  router;
  param = {};
  rule = [];
  refresh = () => {};
  defaultParam = {};
  submit = (values) => {
    console.log('### submit 1', values);
    this.param = values;
    this.setPage(1);
    this.push();
  };
  reset = (values) => {
    console.log('### reset 1', values);
    this.param = this.defaultParam;
    this.setPage(1);
    this.push();
    console.log('### reset', this.param);
  };
  setPage = (currentPage) => {
    this.currentPage = currentPage ? currentPage : 1;
    return this;
  };
  getParam = () => {
    return this.param;
  };
  push = () => {
    let path;
    if (typeof this.router === 'function') {
      path = this.router();
    } else {
      path = this.router;
    }
    const search = stringify(this.filter(), { arrayFormat: 'brackets' });
    // console.log("###### path",path);
    if (count(search) > 0) {
      path = `${path}${path.indexOf('?') === -1 ? '?' : '&'}${search}`;
    }
    history.push(path);
    this.refresh();
  };

  filter = () => {
    const query = new Query();
    return query
      .setParams({
        ...this.param,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      })
      .delEmptyParams()
      .delParams(this.rule)
      .getParams();
  };

  constructor(options) {
    // console.log("########### options",options);
    const params = parse(window.location.href.split('?')[1]);
    if (typeof options['currentPage'] !== 'undefined') {
      this.currentPage = options['currentPage'];
    } else if (typeof params['currentPage'] !== 'undefined') {
      this.currentPage = parseInt(params['currentPage']);
    }
    if (typeof options['pageSize'] !== 'undefined') {
      this.pageSize = options['pageSize'];
    } else if (typeof params['pageSize'] !== 'undefined') {
      this.pageSize = parseInt(params['pageSize']);
    }
    if (typeof options['router'] !== 'undefined') {
      this.router = options['router'];
    }
    if (typeof options['param'] !== 'undefined') {
      this.param = options['param'];
      this.defaultParam = options['param'];
    }
    if (typeof options['rule'] !== 'undefined') {
      this.rule = options['rule'];
    }
    if (typeof options['refresh'] !== 'undefined') {
      this.refresh = options['refresh'];
    }
    if (typeof options['submit'] !== 'undefined') {
      this.submit = options['submit'];
    }
    if (typeof options['reset'] !== 'undefined') {
      this.reset = options['reset'];
    }
    if (count(params) > 0) {
      let _params = {};
      Object.keys(params).forEach((key) => {
        if (typeof params[key] !== 'undefined') {
          _params[key] = params[key];
        }
      });
      this.param = Object.assign({}, options['param'], _params);
    }
  }
}

export default PageList;
