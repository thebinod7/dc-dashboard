import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import { UserContext } from '../../contexts/userContext';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

const UserList = () => {
	const { listUsers } = useContext(UserContext);
	const classes = useStyles();
	const [userInfo, setUserInfo] = useState({});

	const getUsersList = query => {
		return new Promise((resolve, reject) => {
			listUsers(query)
				.then(d => {
					resolve(d);
				})
				.catch(e => reject(e));
		});
	};

	const handleChangeRowsPerPage = query => {
		getUsersList(query)
			.then(d => setUserInfo(d))
			.catch(e => console.log(e));
	};

	const handlePageChange = query => {
		getUsersList(query)
			.then(d => setUserInfo(d))
			.catch(e => console.log(e));
	};

	const handleSearchChange = query => {
		getUsersList(query)
			.then(d => setUserInfo(d))
			.catch(e => console.log(e));
	};

	const loadUsersList = () => {
		listUsers()
			.then(d => setUserInfo(d))
			.catch(e => console.log('ERR:', e));
	};
	useEffect(loadUsersList, []);

	return (
		<div className={classes.root}>
			<UsersToolbar handleSearchChange={handleSearchChange} />
			<div className={classes.content}>
				<UsersTable
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					handlePageChange={handlePageChange}
					searchResult={userInfo}
				/>
			</div>
		</div>
	);
};

export default UserList;
