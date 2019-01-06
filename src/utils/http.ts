import humps from 'humps';
import request from 'then-request';
import _ from 'lodash';

export class Http {
    async httpReq(method, url, options) {
        const httpOption = options;
        try {
            const response = await request(method, url, httpOption);
            const parseData = this.parseBody(response);
            return parseData;
        } catch (err) {
            throw err;
        }
    }

    parseBody(response) {
        if (response.statusCode === 200) response.body = JSON.parse(response.body);
        return response;
    }

    async get(url, options = {}) {
        const response = await this.httpReq('GET', url, options);
        return response;
    }

    async post(url, options: any = {}) {
        const opt = options;
        opt.json = humps.decamelizeKeys(options.json);

        const response = await this.httpReq('POST', url, opt);
        return response;
    }

    async put(url, options:any = {}) {
        const opt = options;
        opt.json = humps.decamelizeKeys(options.json);

        const response = await this.httpReq('PUT', url, opt);
        return response;
    }

    async delete(url, options = {}) {
        const response = await this.httpReq('DELETE', url, options);
        return response;
    }
}

export const http = new Http();
export default http;
