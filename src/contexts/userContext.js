import React, { createContext, useReducer } from 'react';
import userReducer from '../reducers/userReducer';
import * as api from '../services/users';
import { getUser } from '../utils/sessionManager';

const initialState = {
	users: [],
	userData: {},
	currentUser: getUser(),
	loggedIn: false,
	userDetails: {}
};

export const UserContext = createContext(initialState);
export const UserContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(userReducer, initialState);

	function changePassword(payload) {
		return new Promise((resolve, reject) => {
			api.changePassword(payload)
				.then(res => {
					dispatch(changePasswordSuccess(res));
					resolve(res);
				})
				.catch(err => reject(err));
		});
	}

	function changePasswordSuccess(res) {
		return {
			type: 'CHANGE_PASSWORD',
			res
		};
	}

	function uploadAvatar(payload) {
		return new Promise((resolve, reject) => {
			api.uploadAvatar(payload)
				.then(res => {
					dispatch(uploadAvatarSuccess(res));
					resolve(res);
				})
				.catch(err => reject(err));
		});
	}

	function uploadAvatarSuccess(res) {
		return {
			type: 'UPLOAD_AVATAR',
			res
		};
	}

	function updateProfile(payload) {
		return new Promise((resolve, reject) => {
			api.updateProfile(payload)
				.then(res => {
					dispatch(updateProfileSuccess(res));
					resolve(res);
				})
				.catch(err => reject(err));
		});
	}

	function updateProfileSuccess(res) {
		return {
			type: 'UPDATE_PROFILE',
			res
		};
	}

	function getUser() {
		return new Promise((resolve, reject) => {
			api.getUser()
				.then(res => {
					dispatch(getUserDetails(res));
					resolve(res);
				})
				.catch(err => reject(err));
		});
	}

	function getUserDetails(res) {
		return {
			type: 'GET_USER_DETAILS',
			res
		};
	}

	function listUsers(query) {
		return new Promise((resolve, reject) => {
			api.listUsers(query)
				.then(res => {
					dispatch(listUsersSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(listUsersFail(err));
					reject(err);
				});
		});
	}

	function listUsersSuccess(res) {
		return {
			type: 'LIST_USERS',
			res
		};
	}

	function listUsersFail(res) {
		return {
			type: 'LIST_USERS_FAIL',
			res
		};
	}

	function loginUser(payload) {
		return new Promise((resolve, reject) => {
			api.loginUser(payload)
				.then(res => {
					dispatch(loginSuccess(res));
					resolve(res);
				})
				.catch(err => {
					dispatch(loginFail(err));
					reject(err);
				});
		});
	}

	function loginSuccess(res) {
		return {
			type: 'LOGIN_SUCCESS',
			res
		};
	}

	function loginFail(res) {
		return {
			type: 'LOGIN_FAIL',
			res
		};
	}

	function logoutUser() {
		dispatch({ type: 'LOGOUT_USER' });
	}

	return (
		<UserContext.Provider
			value={{
				users: state.users,
				currentUser: state.currentUser,
				userDetails: state.userDetails,
				userData: state.userData,
				listUsers,
				loginUser,
				logoutUser,
				getUser,
				updateProfile,
				changePassword,
				uploadAvatar
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
