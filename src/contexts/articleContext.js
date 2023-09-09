import React, { createContext, useReducer } from 'react';
import articleReducer from '../reducers/articleReducer';
import * as api from '../services/articles';

const initialState = {
	articleData: {},
	articleDetails: {},
	myArticleData: {}
};

export const ArticleContext = createContext(initialState);
export const ArticleContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(articleReducer, initialState);

	function getArticleDetails(id, payload) {
		return new Promise((resolve, reject) => {
			api.getArticleDetails(id, payload)
				.then(res => {
					dispatch(getArticleDetailsSucess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(getArticleDetailsFail(err));
					reject(err);
				});
		});
	}

	function getArticleDetailsSucess(res) {
		return {
			type: 'GET_ARTICLE_DETAILS',
			res
		};
	}

	function getArticleDetailsFail(res) {
		return {
			type: 'GET_ARTICLE_DETAILS_FAIL',
			res
		};
	}

	function updateArticle(id, payload) {
		return new Promise((resolve, reject) => {
			api.updateArticle(id, payload)
				.then(res => {
					dispatch(updateArticleSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(updateArticleFail(err));
					reject(err);
				});
		});
	}

	function updateArticleSuccess(res) {
		return {
			type: 'UPDATE_ARTICLE',
			res
		};
	}

	function updateArticleFail(res) {
		return {
			type: 'UPDATE_ARTICLE_FAIL',
			res
		};
	}

	function addArticle(payload) {
		return new Promise((resolve, reject) => {
			api.addArticle(payload)
				.then(res => {
					dispatch(addArticleSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(addArticleFail(err));
					reject(err);
				});
		});
	}

	function addArticleSuccess(res) {
		return {
			type: 'ADD_ARTICLE',
			res
		};
	}

	function addArticleFail(res) {
		return {
			type: 'ADD_ARTICLE_FAIL',
			res
		};
	}

	function myArticles(query) {
		return new Promise((resolve, reject) => {
			api.myArticles(query)
				.then(res => {
					dispatch(myArticlesSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(myArticlesFail(err));
					reject(err);
				});
		});
	}

	function myArticlesSuccess(res) {
		return {
			type: 'MY_ARTICLES',
			res
		};
	}

	function myArticlesFail(res) {
		return {
			type: 'MY_ARTICLES_FAIL',
			res
		};
	}

	function listArticles(query) {
		return new Promise((resolve, reject) => {
			api.listArticles(query)
				.then(res => {
					dispatch(listArticlesSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(listArticlesFail(err));
					reject(err);
				});
		});
	}

	function listArticlesSuccess(res) {
		return {
			type: 'LIST_ARTICLE',
			res
		};
	}

	function listArticlesFail(res) {
		return {
			type: 'LIST_ARTICLE_FAIL',
			res
		};
	}

	function updateArticleStatus(id, status) {
		return api.updateArticleStatus(id, status);
	}

	return (
		<ArticleContext.Provider
			value={{
				articleData: state.articleData,
				articleDetails: state.articleDetails,
				myArticleData: state.myArticleData,
				listArticles,
				addArticle,
				updateArticle,
				getArticleDetails,
				myArticles,
				updateArticleStatus
			}}
		>
			{children}
		</ArticleContext.Provider>
	);
};
