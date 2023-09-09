import axios from 'axios';

import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';

const _token = getUserToken();

export function getCounts(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(API.REPORTS + '/counts', {
				headers: { access_token: `${_token}` }
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}
