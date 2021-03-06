// const axios = require('axios');
import axios from "axios";
import config from "./config.json";

export default async function fetch(endpoint, method, params, auth?) {
	let env = process.env.NODE_ENV || 'development';
    try {
        let url = config[env] + endpoint;
        if (auth) {
            params.auth = auth;
        }
        if (method === 'get') {
            return (await axios({method, url, params})).data;
        } else {
            return (await axios({method, url, data: params})).data;
        }
    } catch (e) {
        return null;
    }
}