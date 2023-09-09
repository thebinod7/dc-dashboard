import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import CategoryIcon from '@material-ui/icons/Category';
import ContactMailIcon from '@material-ui/icons/ContactMail';

import { Profile, SidebarNav } from './components';
import roles from '../../constants/roles';
import { getUser } from '../../services/users';

const useStyles = makeStyles(theme => ({
	drawer: {
		width: 240,
		[theme.breakpoints.up('lg')]: {
			marginTop: 64,
			height: 'calc(100% - 64px)'
		}
	},
	root: {
		backgroundColor: theme.palette.white,
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		padding: theme.spacing(2)
	},
	divider: {
		margin: theme.spacing(2, 0)
	},
	nav: {
		marginBottom: theme.spacing(2)
	}
}));

const Sidebar = props => {
	const { open, variant, onClose, className, ...rest } = props;

	const BASIC_PAGES = [
		{
			title: 'My Articles',
			href: '/my-articles',
			icon: <ContactMailIcon />
		},
		{
			title: 'Account',
			href: '/account',
			icon: <AccountBoxIcon />
		},
		{
			title: 'Settings',
			href: '/settings',
			icon: <SettingsIcon />
		}
	];

	const ADMIN_PAGES = [
		{
			title: 'Dashboard',
			href: '/',
			icon: <DashboardIcon />
		},
		{
			title: 'My Articles',
			href: '/my-articles',
			icon: <ContactMailIcon />
		},
		{
			title: 'Users',
			href: '/users',
			icon: <PeopleIcon />
		},
		{
			title: 'Category',
			href: '/category',
			icon: <CategoryIcon />
		},
		{
			title: 'Articles',
			href: '/articles',
			icon: <DescriptionIcon />
		},

		{
			title: 'Account',
			href: '/account',
			icon: <AccountBoxIcon />
		},
		{
			title: 'Settings',
			href: '/settings',
			icon: <SettingsIcon />
		}
	];

	const [displayPages, setDisplayPages] = useState(BASIC_PAGES);
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function fetchCurrentUser() {
			const user = await getUser();
			if (user.role === roles.USER) setDisplayPages(ADMIN_PAGES);
			setUser(user);
		}
		fetchCurrentUser();
	}, [ADMIN_PAGES]);

	const classes = useStyles();

	return (
		<Drawer anchor="left" classes={{ paper: classes.drawer }} onClose={onClose} open={open} variant={variant}>
			<div {...rest} className={clsx(classes.root, className)}>
				{user && <Profile />}
				<Divider className={classes.divider} />
				<SidebarNav className={classes.nav} pages={displayPages} />
			</div>
		</Drawer>
	);
};

Sidebar.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func,
	open: PropTypes.bool.isRequired,
	variant: PropTypes.string.isRequired
};

export default Sidebar;
