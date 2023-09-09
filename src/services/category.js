import axios from 'axios';
import qs from 'query-string';

import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';

const _token = getUserToken();

export function addCategory(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.CATEGORY, payload, { headers: { access_token: _token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function listCategory(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(API.CATEGORY + '?' + qs.stringify(query))
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}

export function listAllCategory() {
	return new Promise((resolve, reject) => {
		axios
			.get(API.CATEGORY_ALL)
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}
