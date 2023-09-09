import axios from 'axios';
import qs from 'query-string';

import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';

//axios.defaults.headers.access_token = getUserToken();
const token = getUserToken();

export function getUser() {
	return new Promise((resolve, reject) => {
		axios
			.get(API.ME, { headers: { access_token: token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function changePassword(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.CHANGE_PASSWORD, payload, {
				headers: { access_token: token }
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function updateProfile(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.PROFILE, payload, { headers: { access_token: token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function uploadAvatar(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.UPLOAD_AVATAR, payload, {
				headers: { access_token: token }
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function listUsers(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(API.USERS + '?' + qs.stringify(query))
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}

export function loginUser(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.USER_LOGIN, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				console.log('ERR:', err);
				reject(err.response.data);
			});
	});
}
