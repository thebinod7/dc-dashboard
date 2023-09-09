import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { getUser } from '../../services/users';

import { AccountProfile, AccountDetails } from './components';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(4)
	}
}));

const Account = () => {
	const classes = useStyles();
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function fetchUserDetails() {
			const user = await getUser();
			setUser(user);
		}
		fetchUserDetails();
	}, []);

	return (
		<div className={classes.root}>
			<Grid container spacing={4}>
				<Grid item lg={4} md={6} xl={4} xs={12}>
					{user && <AccountProfile user={user} />}
				</Grid>
				<Grid item lg={8} md={6} xl={8} xs={12}>
					<AccountDetails />
				</Grid>
			</Grid>
		</div>
	);
};

export default Account;
