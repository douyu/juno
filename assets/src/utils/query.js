import { parse, stringify } from "qs";
export default class Query {
    params;

    parse() {
        this.params = parse(window.location.href.split("?")[1]);
        return this;
    }

    setParams(params) {
        this.params = params;
        return this
    }

    delEmptyParams() {
        let params = this.params;
        if (count(params) > 0) {
            Object.keys(params).forEach((key) => {
                if (params[key] === "" || params[key] === null || typeof params[key] === "undefined" || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete this.params[key];
                }
            });
        }
        return this;
    }

    getParams() {
        return this.params;
    }

    addParams(params) {
        Object.keys(params).forEach((key) => {
            this.params[key] = params[key];
        });
    }

    // todo fixed rules eq other field
    /**
     *
     * @param condition
     * @returns {Query}
     *
     * [
     // 等于
     { key: "state", rule: ["eq", "all"] },
     // 依赖另外个字段的存在
     { key: "keywords_type", rule: ["rely", "keywords"] }
     ]
     */
    delParams(condition = []) {
        for (var i = 0; i < condition.length; i++) {
            let rule = condition[i].rule;
            let field = condition[i].key;
            switch (rule[0]) {
                case "eq":
                    if (this.params[field] === rule[1]) {
                        delete this.params[field];
                    }
                    break;
                case "rely":
                    if (this.params[rule[1]] === undefined) {
                        delete this.params[field];
                    }
                    break;
                default:
                    break;
            }
        }
        return this;
    }

    withPageParams() {
        const { page, rows } = Query.getPageLimit();
        this.addParams({ page, rows });
        return this;
    }

    /**
     * todo 思考是否废弃
     * 为了列表类型的接口调用方便
     * @param delCondition
     * @returns {*}
     */
    static make(delCondition = []) {
        const QueryClass = new Query();
        return QueryClass.parse().delEmptyParams().withPageParams().delParams(delCondition).getParams();
    }

    /**
     * 为了列表类型的接口调用方便
     * @param path
     * @param params
     * @param delCondition
     * @returns {*}
     */
    static path(path, params = {}, delCondition = []) {
        const QueryClass = new Query();
        if (count(params) > 0) {
            QueryClass.setParams(params);
        }
        QueryClass.delEmptyParams().withPageParams().delParams(delCondition);
        const search = stringify(QueryClass.params,{ arrayFormat: 'brackets'});
        if (count(search) > 0) {
            return `${path}?${search}`;
        }
        return path;
    }

    static getQuery() {
        return parse(window.location.href.split("?")[1]);
    }

    static getPath(path = "", query = {}) {
        const search = stringify(query,{ arrayFormat: 'brackets'});
        if (search.length) {
            return `${path}?${search}`;
        }
        return path;
    }

    static getPageLimit(page = 1, rows = 10) {
        const query = Query.getQuery();
        return {
            page: query["page"] !== undefined && parseInt(query["page"], 10) > 0 ? parseInt(query["page"], 10) : page,
            rows: query["rows"] !== undefined && parseInt(query["rows"], 10) > 0 ? parseInt(query["rows"], 10) : rows
        };
    }

    static page(page = 1, rows = 10) {
        const { historyPrefix } = window.fashop;
        const path = Query.getPath(window.location.pathname.replace(process.env.NODE_ENV === "production" && APP_TYPE !== "site" ? historyPrefix : historyPrefix, ""), {
            ...Query.getQuery(),
            page,
            rows
        });
        if (path.indexOf("/") === 0) {
            return path;
        } else {
            return `/${path}`;
        }
    }


}
const count = (params) => {
    let count = 0;
    for (var property in params) {
        if (Object.prototype.hasOwnProperty.call(params, property)) {
            count++;
        }
    }
    return count;
};

