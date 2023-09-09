import axios from 'axios';
import qs from 'query-string';

import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';

const token = getUserToken();

export function myArticles(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(API.ARTICLES + '/me?' + qs.stringify(query), {
				headers: { access_token: token }
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function updateArticle(id, payload) {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.ARTICLES}/${id}`, payload, {
				headers: { access_token: token }
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function updateArticleStatus(id, status) {
	return new Promise((resolve, reject) => {
		axios
			.post(
				`${API.ARTICLES}/status/${id}`,
				{ status },
				{
					headers: { access_token: token }
				}
			)
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function addArticle(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.ARTICLES, payload, { headers: { access_token: token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function listArticles(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(API.ARTICLES + '?' + qs.stringify(query))
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}

export function getArticleDetails(id) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.ARTICLES}/${id}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(e => {
				reject(e.response.data);
			});
	});
}
