import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Button, TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from '../../../../contexts/userContext';
import { SnackbarContext } from '../../../../contexts/snackBarContext';

const useStyles = makeStyles(() => ({
	root: {}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Password = props => {
	const { className, ...rest } = props;

	const classes = useStyles();

	const { changePassword } = useContext(UserContext);
	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);

	const [formState, setFormState] = useState({
		values: {},
		errors: {},
		isValid: true
	});

	const handleSubmit = e => {
		e.preventDefault();
		if (formState.values.newPassword !== formState.values.confirmPassword) {
			setSnackState({
				open: true,
				severity: 'error',
				message: 'New password and confirm must match.'
			});
			return;
		}
		changePassword(formState.values)
			.then(() => {
				setFormState({ ...formState, values: {} });
				setSnackState({
					open: true,
					severity: 'success',
					message: 'Password updated successfully'
				});
			})
			.catch(e => {
				setSnackState({
					open: true,
					severity: 'error',
					message: e.message
				});
			});
	};
	const handleChange = e => {
		e.preventDefault();
		let val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setFormState({
			...formState,
			values: {
				...formState.values,
				[e.target.name]: val
			}
		});
	};

	return (
		<Card {...rest} className={clsx(classes.root, className)}>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				key={('top', 'right')}
				open={snackState.open}
				autoHideDuration={2000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={snackState.severity}>
					{snackState.message}
				</Alert>
			</Snackbar>
			<form onSubmit={handleSubmit}>
				<CardHeader subheader="Update password" title="Password" />
				<Divider />
				<CardContent>
					<TextField
						fullWidth
						label="Old Password"
						name="oldPassword"
						required
						onChange={handleChange}
						type="password"
						value={formState.values.oldPassword || ''}
						variant="outlined"
					/>
					<TextField
						fullWidth
						label="New password"
						name="newPassword"
						required
						onChange={handleChange}
						style={{ marginTop: '1rem' }}
						type="password"
						value={formState.values.newPassword || ''}
						variant="outlined"
					/>
					<TextField
						fullWidth
						label="Confirm password"
						name="confirmPassword"
						required
						onChange={handleChange}
						style={{ marginTop: '1rem' }}
						type="password"
						value={formState.values.confirmPassword || ''}
						variant="outlined"
					/>
				</CardContent>
				<Divider />
				<CardActions>
					<Button color="primary" type="submit" variant="outlined">
						Update
					</Button>
				</CardActions>
			</form>
		</Card>
	);
};

Password.propTypes = {
	className: PropTypes.string
};

export default Password;
