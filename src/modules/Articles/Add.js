import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import Select from 'react-select';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { createFormData } from '../../utils';

import { SnackbarContext } from '../../contexts/snackBarContext';
import { ArticleContext } from '../../contexts/articleContext';
import { CategoryContext } from '../../contexts/categoryContext';
import FormDialog from '../Global/Modal';
import { getCroppedImg, fileToBase64 } from '../../utils/cropper';
import Cropper from '../Global/Cropper';
import config from '../../constants/config';
import { ARTICLE } from '../../constants';
import DefaultImg from '../../assets/images/default.jpg';

const useStyles = makeStyles(() => ({
	root: {},
	formItem: { marginBottom: '5px' }
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddArticle = props => {
	let history = useHistory();
	const { className } = props;

	const classes = useStyles();
	const { addArticle } = useContext(ArticleContext);
	const { listAllCategory } = useContext(CategoryContext);

	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);

	const [imgRef, setImgRef] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(false);
	const [categoryList, setCategoryList] = useState([]);
	const [previewImg, setPreviewImg] = useState('');
	const [croppedPreview, setCroppedPreview] = useState('');
	const [cropDetails, setCropDetails] = useState({
		unit: 'px', // default, can be 'px' or '%'
		x: 130,
		y: 50,
		aspect: 16 / 9,
		width: parseInt(config.AWS_IMG_WIDTH),
		height: parseInt(config.AWS_IMG_HEIGHT)
	});

	const [formState, setFormState] = useState({
		values: {
			articleType: ARTICLE.TEXT,
			summary: 'test',
			categories: '',
			title: 'hello world',
			description: 'cool',
			imageUrl: ''
		},
		errors: {},
		isValid: true
	});

	const onImageLoaded = image => {
		setImgRef(image);
		return false;
	};

	const makeClientCrop = async (cropDetails, imageRef) => {
		const _imgR = imgRef ? imgRef : imageRef;
		if (_imgR && cropDetails.width && cropDetails.height) {
			const _cropped = await getCroppedImg(_imgR, cropDetails, 'newFile.jpeg');
			const base64Url = await fileToBase64(_cropped.file);
			setCroppedPreview(_cropped.fileUrl);
			setFormState({
				...formState,
				values: {
					...formState.values,
					file: _cropped.file,
					imageUrl: base64Url
				}
			});
		}
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

	const confirmCropImage = () => {
		makeClientCrop(cropDetails, imgRef);
		setOpenModal(false);
	};

	const resetForm = () => {
		setCroppedPreview('');
		setFormState({
			values: {
				articleType: ARTICLE.TEXT,
				category: '',
				title: '',
				description: '',
				featuredImg: null
			},
			errors: {},
			isValid: true
		});
	};

	const handleModalClose = e => {
		e.preventDefault();
		setOpenModal(false);
	};

	const getAllCategories = () => {
		listAllCategory()
			.then(data => {
				let _arr = data.map(d => {
					return { value: d._id, label: d.name };
				});
				setCategoryList(_arr);
			})
			.catch(e => console.log('ERR:', e));
	};

	useEffect(getAllCategories, []);

	const handleQuickSubmit = e => {
		e.preventDefault();
		saveArticle(true);
	};

	const handleSubmit = e => {
		e.preventDefault();
		saveArticle();
	};

	const formValidate = payload => {
		let isValid = true;
		if (!payload.title || !payload.summary || !payload.categories) {
			isValid = false;
		}
		return isValid;
	};

	const saveArticle = (quick_save = false) => {
		const { values } = formState;
		let _valid = formValidate(values);
		if (!_valid) {
			return setSnackState({
				open: true,
				severity: 'error',
				message: 'Required fields are missing!'
			});
		}
		setSubmitStatus(true);
		const data = editorState.getCurrentContent();
		const htmlData = convertToHTML(data);
		const allFormValues = { ...values, description: htmlData };
		if (allFormValues.featuredImg) delete allFormValues.featuredImg;
		const formData = createFormData(allFormValues);
		console.log('FOrmDa==>', formData);

		addArticle(formData)
			.then(d => {
				if (quick_save === true) {
					setSubmitStatus(false);
					return setSnackState({
						open: true,
						severity: 'success',
						message: 'Current article data is saved.'
					});
				}
				resetForm();
				history.push('/my-articles');
			})
			.catch(e => {
				console.log('ERR:', e);
				setSnackState({
					open: true,
					severity: 'error',
					message: 'Something went wrong!'
				});
				setSubmitStatus(false);
			});
	};

	const handleSelectChange = values => {
		let _categories = '';
		if (values && values.length) {
			let category_ids = values.map(d => {
				return d.value;
			});
			_categories = category_ids.toString();
		}
		setFormState({
			...formState,
			values: {
				...formState.values,
				categories: _categories
			}
		});
	};

	const handleChange = e => {
		let val = '';
		e.preventDefault();
		if (e.target.type === 'checkbox') val = e.target.checked;
		else val = e.target.value;
		setFormState({
			...formState,
			values: {
				...formState.values,
				[e.target.name]: val
			}
		});
	};

	const onEditorChange = editorState => {
		setEditorState(editorState);
	};

	return (
		<Card className={clsx(classes.root, className)}>
			<FormDialog
				actionText="Confirm"
				title="Featured Image"
				handleModalClose={handleModalClose}
				open={openModal}
				maxWidth="md"
				handleSubmit={confirmCropImage}
				hideCancelButton={true}
			>
				<form>
					<Grid container spacing={3}>
						<Grid item md={12} xs={12}>
							<Button variant="contained" component="label">
								Select File
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
				<CardHeader title="Write an article" />
				<Divider />
				<CardContent>
					<Grid container spacing={5}>
						<Grid item md={8} xs={12}>
							<Grid container>
								<Grid className={classes.formItem} item md={12} xs={12}>
									<TextField
										fullWidth
										label="Suitable title"
										margin="dense"
										name="title"
										required
										onChange={handleChange}
										value={formState.values.title || ''}
										variant="outlined"
									/>
								</Grid>
								<Grid className={classes.formItem} item md={12} xs={12}>
									<Editor
										wrapperClassName="wrapper-class"
										editorClassName="editor-class"
										toolbarClassName="toolbar-class"
										editorState={editorState}
										onEditorStateChange={onEditorChange}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item md={4} xs={12}>
							<Grid container>
								<Grid className={classes.formItem} item md={12} xs={12}>
									<Select
										defaultValue={[]}
										isMulti
										options={categoryList}
										className="basic-multi-select"
										classNamePrefix="select"
										onChange={handleSelectChange}
										placeholder="* Select categories..."
									/>
								</Grid>
								<Grid className={classes.formItem} item md={12} xs={12}>
									<TextField
										multiline
										rows={4}
										fullWidth
										margin="dense"
										name="summary"
										placeholder="* Summary - short description about article"
										required
										onChange={handleChange}
										value={formState.values.summary || ''}
										variant="outlined"
									/>
								</Grid>
								<Grid item className={classes.formItem} md={12} xs={12}>
									<Button fullWidth onClick={() => setOpenModal(true)} variant="contained">
										Featured Image
									</Button>
								</Grid>
								<Grid item md={12} xs={12}>
									<img
										alt="Featured"
										src={croppedPreview || DefaultImg}
										width="300px"
										height="220px"
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<CardActions>
					<Button
						startIcon={<PublishIcon />}
						disabled={submitStatus === false ? false : true}
						color="secondary"
						type="submit"
						variant="contained"
					>
						Submit
					</Button>

					<Button
						startIcon={<SaveIcon />}
						onClick={handleQuickSubmit}
						disabled={submitStatus === false ? false : true}
						color="default"
						type="button"
						variant="contained"
					>
						Quick save
					</Button>
				</CardActions>
			</form>
		</Card>
	);
};

AddArticle.propTypes = {
	className: PropTypes.string
};

export default AddArticle;
