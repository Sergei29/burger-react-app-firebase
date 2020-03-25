import * as actionTypes from "../actions/actionTypes";
import axios from "axios";

const API_KEY = "AIzaSyBTkyW_r2_PTRiT9bd_FiiRT8wqXdRbIzs";

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken,
		userId
	};
};

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error
	};
};

export const logout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const checkAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime * 1000);
	};
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());

		const authData = {
			email,
			password,
			returnSecureToken: true
		};

		let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
		if (!isSignup) {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
		}

		axios
			.post(url, authData)
			.then(response => {
				console.log(response);
				dispatch(
					authSuccess(response.data.idToken, response.data.localId)
				);
				dispatch(checkAuthTimeout(response.data.expiresIn));
			})
			.catch(error => {
				console.log(error);
				dispatch(authFail(error.response.data.error));
			});
	};
};