import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import { UserContext } from '../../contexts/userContext';
import { SnackbarContext } from '../../contexts/snackBarContext';
import ROLES from '../../constants/roles';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.default,
		height: '100%',
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	},
	grid: {
		height: '100%'
	},
	quoteContainer: {
		[theme.breakpoints.down('md')]: {
			display: 'none'
		}
	},
	quote: {
		backgroundColor: theme.palette.neutral,
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundImage: 'url(/images/auth.jpg)',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center'
	},
	quoteInner: {
		textAlign: 'center',
		flexBasis: '600px'
	},
	quoteText: {
		color: theme.palette.white,
		fontWeight: 300
	},
	name: {
		marginTop: theme.spacing(3),
		color: theme.palette.white
	},
	bio: {
		color: theme.palette.white
	},
	contentContainer: {},
	content: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	contentHeader: {
		display: 'flex',
		alignItems: 'center',
		paddingTop: theme.spacing(5),
		paddingBototm: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	logoImage: {
		marginLeft: theme.spacing(4)
	},
	contentBody: {
		flexGrow: 1,
		display: 'flex',
		alignItems: 'center',
		[theme.breakpoints.down('md')]: {
			justifyContent: 'center'
		}
	},
	form: {
		paddingLeft: 100,
		paddingRight: 100,
		paddingBottom: 125,
		flexBasis: 700,
		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2)
		}
	},
	title: {
		marginTop: theme.spacing(3)
	},
	socialButtons: {
		marginTop: theme.spacing(3)
	},
	socialIcon: {
		marginRight: theme.spacing(1)
	},
	sugestion: {
		marginTop: theme.spacing(2)
	},
	textField: {
		marginTop: theme.spacing(2)
	},
	signInButton: {
		margin: theme.spacing(2, 0)
	}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
	const classes = useStyles();
	const { loginUser } = useContext(UserContext);
	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);

	const [formState, setFormState] = useState({
		values: {},
		errors: {},
		isValid: true
	});

	const handleSubmit = e => {
		e.preventDefault();
		loginUser(formState.values)
			.then(d => {
				if (d.data.role !== ROLES.ADMIN) return window.location.replace('/account');
				else window.location.replace('/');
			})
			.catch(e => {
				setSnackState({ open: true, severity: 'error', message: e.message });
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
		<div className={classes.root}>
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
			<Grid className={classes.grid} container>
				<Grid className={classes.quoteContainer} item lg={3}>
					{/* <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                Write some awesome articles...
              </Typography>
              <div className={classes.person}>
                <Typography className={classes.name} variant="body1">
                  Devcolumn
                </Typography>
              </div>
            </div>
          </div> */}
				</Grid>
				<Grid className={classes.content} item lg={9} xs={12}>
					<div className={classes.content}>
						<div className={classes.contentBody}>
							<form className={classes.form} onSubmit={handleSubmit}>
								<Typography className={classes.title} variant="h2">
									Devcolumn Login.
								</Typography>
								<Typography color="textSecondary" gutterBottom></Typography>
								<Divider />
								<TextField
									className={classes.textField}
									fullWidth
									label="Email address"
									name="username"
									required
									onChange={handleChange}
									type="text"
									value={formState.values.username || ''}
									variant="outlined"
								/>
								<TextField
									className={classes.textField}
									fullWidth
									label="Password"
									name="password"
									required
									onChange={handleChange}
									type="password"
									value={formState.values.password || ''}
									variant="outlined"
								/>
								<Button
									className={classes.signInButton}
									color="primary"
									fullWidth
									size="large"
									type="submit"
									variant="contained"
								>
									Sign in now
								</Button>
								{/* <Typography color="textSecondary" variant="body1">
                  Don't have an account?{" "}
                  <a href="fake_value" variant="h6">
                    Sign up
                  </a>
                </Typography> */}
							</form>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

Login.propTypes = {
	history: PropTypes.object
};

export default withRouter(Login);
