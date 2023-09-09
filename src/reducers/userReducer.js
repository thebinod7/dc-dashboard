import { saveUser, saveTokenExpiry, saveUserToken, logoutUser } from '../utils/sessionManager';

export default (state, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			saveUser(action.res.data);
			saveUserToken(action.res.token.toString());
			saveTokenExpiry(action.res.expiresIn);
			return {
				...state,
				currentUser: action.res.data,
				userDetails: action.res.data,
				loggedIn: true
			};

		case 'LOGIN_FAIL':
			return {
				...state
			};

		case 'GET_USER_DETAILS':
			return { ...state, userDetails: action.res.data };

		case 'UPDATE_PROFILE':
			return {
				...state,
				currentUser: action.res,
				userDetails: action.res
			};

		case 'UPLOAD_AVATAR':
			return {
				...state,
				currentUser: action.res.data,
				userDetails: action.res.data
			};

		case 'LIST_USERS':
			return {
				...state,
				userData: action.res,
				users: [...action.res.data]
			};

		case 'CHANGE_PASSWORD':
			return {
				...state
			};

		case 'LOGOUT_USER':
			logoutUser();
			return { ...state, currentUser: {}, userDetails: {}, loggedIn: false };

		default:
			return state;
	}
};
