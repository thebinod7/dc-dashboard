import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardActions, CardContent, Avatar, Typography, Divider, Button, Grid } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from '../../../../contexts/userContext';
import config from '../../../../constants/config';
import FormDialog from '../../../Global/Modal';
import { getCroppedImg } from '../../../../utils/cropper';
import Cropper from '../../../Global/Cropper';
import { SnackbarContext } from '../../../../contexts/snackBarContext';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	root: {},
	details: {
		display: 'flex'
	},
	avatar: {
		marginLeft: 'auto',
		height: 150,
		width: 140,
		flexShrink: 0,
		flexGrow: 0
	},
	progress: {
		marginTop: theme.spacing(2)
	},
	uploadButton: {
		marginRight: theme.spacing(2)
	}
}));

const AccountProfile = props => {
	const { user, className, ...rest } = props;

	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);
	let ctx = useContext(UserContext);

	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [imgRef, setImgRef] = useState(null);
	const [previewImg, setPreviewImg] = useState('');
	const [avatarFile, setAvatarFile] = useState('');
	const [cropDetails, setCropDetails] = useState({
		unit: 'px', // default, can be 'px' or '%'
		x: 0,
		y: 0,
		aspect: 16 / 9,
		width: parseInt(400),
		height: parseInt(200)
	});

	const onImageLoaded = image => {
		setImgRef(image);
		return false;
	};

	const makeClientCrop = async (cropDetails, imageRef) => {
		const _imgR = imgRef ? imgRef : imageRef;
		if (_imgR && cropDetails.width && cropDetails.height) {
			const _cropped = await getCroppedImg(_imgR, cropDetails, 'newFile.jpeg');
			//setCroppedPreview(_cropped.fileUrl);
			setAvatarFile(_cropped.file);
		}
	};

	// const getFormData = object => {
	// 	let formData = new FormData();
	// 	for (var key in object) {
	// 		formData.append(key, object[key]);
	// 	}
	// 	return formData;
	// };

	const uploadAvatarPic = file => {
		if (!file)
			return setSnackState({
				open: true,
				severity: 'error',
				message: 'Please select an image file.'
			});

		// let data = getFormData({ file: avatarFile });
		let formData = new FormData();
		formData.append('file', avatarFile);
		setLoading(true);
		ctx.uploadAvatar(formData)
			.then(d => window.location.reload())
			.catch(e => {
				setSnackState({
					open: true,
					severity: 'error',
					message: 'Something went wrong!'
				});
				setLoading(false);
			});
	};

	const onCropComplete = cropDetails => {
		makeClientCrop(cropDetails);
	};

	const onSelectFile = e => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setPreviewImg(reader.result);
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const handleChangeCrop = e => {
		setCropDetails(e);
	};

	const handleAvatarUpload = () => {
		uploadAvatarPic(avatarFile);
	};

	const handleModalClose = e => {
		e.preventDefault();
		setOpenModal(false);
	};

	console.log('USER==>', user);

	const profilePicUrl =
		user.profile && user.profile.avatar ? user.profile.avatar : config.ASSETS_BASE_URL + '/profile.png';

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
			<FormDialog
				actionText="Upload"
				title="Profile picture"
				handleSubmit={handleAvatarUpload}
				handleModalClose={handleModalClose}
				open={openModal}
				maxWidth="sm"
				isLoading={loading}
				hideSubmit={avatarFile ? false : true}
			>
				<form>
					<Grid container spacing={3}>
						<Grid item md={12} xs={12}>
							<Button variant="contained" component="label">
								Select Image
								<input
									name="featuredImg"
									onChange={onSelectFile}
									type="file"
									style={{ display: 'none' }}
								/>
							</Button>
						</Grid>
						<Grid item md={12} xs={12}>
							<div>
								{previewImg && (
									<Cropper
										handleChangeCrop={handleChangeCrop}
										crop={cropDetails}
										src={previewImg}
										onImageLoaded={onImageLoaded}
										onCropComplete={onCropComplete}
									/>
								)}
							</div>
						</Grid>
					</Grid>
				</form>
			</FormDialog>
			<CardContent>
				<div className={classes.details}>
					<div>
						<Typography className={classes.locationText} color="textSecondary" variant="body1">
							{user.name}
						</Typography>
						<Typography className={classes.dateText} color="textSecondary" variant="body1">
							-{user.profile.designation || 'profession'}
						</Typography>
					</div>
					<Avatar className={classes.avatar} src={profilePicUrl} />
				</div>
				<div className={classes.progress}></div>
			</CardContent>
			<Divider />
			<CardActions>
				<Button
					className={classes.uploadButton}
					onClick={() => setOpenModal(true)}
					color="primary"
					variant="text"
				>
					Upload picture
				</Button>
			</CardActions>
		</Card>
	);
};

AccountProfile.propTypes = {
	className: PropTypes.string
};

export default AccountProfile;
