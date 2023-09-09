import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { UserContext } from '../../../../contexts/userContext';
import { ASSETS_BASE_URL } from '../../../../constants/config';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		minHeight: 'fit-content'
	},
	avatar: {
		width: 60,
		height: 60
	},
	name: {
		marginTop: theme.spacing(1)
	}
}));

const Profile = props => {
	const { className, ...rest } = props;

	const classes = useStyles();

	const { currentUser } = useContext(UserContext);

	return (
		<div {...rest} className={clsx(classes.root, className)}>
			<Avatar
				alt="Person"
				className={classes.avatar}
				component={RouterLink}
				src={
					currentUser.profile && currentUser.profile.avatar
						? ASSETS_BASE_URL + '/' + currentUser.profile.avatar
						: ''
				}
				to="/settings"
			/>
			<Typography className={classes.name} variant="h4">
				{currentUser.name.length > 10 ? currentUser.name.substring(0, 10) + '...' : currentUser.name}
			</Typography>
			<Typography variant="body2">{currentUser.role}</Typography>
		</div>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default Profile;
