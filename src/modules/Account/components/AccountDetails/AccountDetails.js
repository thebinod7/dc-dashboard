import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from '../../../../contexts/userContext';
import { SnackbarContext } from '../../../../contexts/snackBarContext';

const prettyUserPayload = payload => {
	let obj = {};
	let _profile = payload.profile;
	if (_profile) {
		if (_profile.gender) obj.gender = _profile.gender;
		if (_profile.avatar) obj.avatar = _profile.avatar;
		if (_profile.designation) obj.designation = _profile.designation;
		if (_profile.city) obj.city = _profile.city;
		if (_profile.country) obj.country = _profile.country;
		if (_profile.bio) obj.bio = _profile.bio;
		if (_profile.avatar) obj.avatar = _profile.avatar;
		if (_profile.social && _profile.social.length) {
			for (let i of _profile.social) {
				obj[i.name] = i.fullUrl;
			}
		}
	}
	return obj;
};

const useStyles = makeStyles(() => ({
	root: {}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// TODO Form validation
const AccountDetails = props => {
	const { className, ...rest } = props;

	const classes = useStyles();
	const { getUser, currentUser, updateProfile } = useContext(UserContext);
	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);

	const [formState, setFormState] = useState({
		values: {},
		errors: {},
		isValid: true
	});

	const handleSubmit = e => {
		e.preventDefault();
		updateProfile(formState.values)
			.then(d => {
				setSnackState({
					open: true,
					severity: 'success',
					message: 'Profile updated successfully.'
				});
			})
			.catch(e => {
				setSnackState({
					open: true,
					severity: 'error',
					message: 'Something went wrong!'
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

	const getMe = () => {
		getUser()
			.then(doc => {
				let _data = prettyUserPayload(doc);
				let obj = {
					name: doc.name,
					phone: doc.phone ? doc.phone : '',
					username: doc.username
				};
				const _prettyObj = Object.assign({}, obj, _data);
				setFormState({ ...formState, values: _prettyObj });
			})
			.catch(e => console.log('ERR:', e));
	};

	useEffect(getMe, [currentUser]);

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
			<form autoComplete="off" onSubmit={handleSubmit}>
				<CardHeader title="My Profile" />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								helperText="Please specify the name"
								label="Full name"
								margin="dense"
								name="name"
								onChange={handleChange}
								required
								value={formState.values.name || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Profession"
								margin="dense"
								name="designation"
								onChange={handleChange}
								value={formState.values.designation || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Username"
								margin="dense"
								name="username"
								disabled
								onChange={handleChange}
								required
								value={formState.values.username || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Phone Number"
								margin="dense"
								required
								name="phone"
								onChange={handleChange}
								type="number"
								value={formState.values.phone || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="City"
								margin="dense"
								name="city"
								onChange={handleChange}
								value={formState.values.city || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Country"
								margin="dense"
								name="country"
								onChange={handleChange}
								value={formState.values.country || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								multiline
								fullWidth
								label="Bio"
								margin="dense"
								name="bio"
								onChange={handleChange}
								value={formState.values.bio || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Instagram"
								margin="dense"
								name="instagram"
								onChange={handleChange}
								value={formState.values.instagram || ''}
								variant="outlined"
								placeholder="https://instagram.com/john"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Facebook"
								margin="dense"
								name="facebook"
								onChange={handleChange}
								value={formState.values.facebook || ''}
								variant="outlined"
								placeholder="https://facebook.com/john"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Linkedin"
								margin="dense"
								name="linkedin"
								onChange={handleChange}
								value={formState.values.linkedin || ''}
								variant="outlined"
								placeholder="https://linkedin.com/john"
							/>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<CardActions>
					<Button color="primary" type="submit" variant="contained">
						Save details
					</Button>
				</CardActions>
			</form>
		</Card>
	);
};

AccountDetails.propTypes = {
	className: PropTypes.string
};

export default AccountDetails;
