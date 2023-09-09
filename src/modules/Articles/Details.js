import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Divider,
	Grid,
	Button,
	TextField,
	FormControl
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import Select from 'react-select';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { SnackbarContext } from '../../contexts/snackBarContext';
import { ArticleContext } from '../../contexts/articleContext';
import { CategoryContext } from '../../contexts/categoryContext';
import FormDialog from '../Global/Modal';
import { getCroppedImg, fileToBase64 } from '../../utils/cropper';
import Cropper from '../Global/Cropper';
import config from '../../constants/config';
import { ARTICLE } from '../../constants';
import { convertHtmlToEditorState, createFormData } from '../../utils';

const useStyles = makeStyles(theme => ({
	root: {},
	formItem: { marginBottom: '5px' },
	formControl: {
		margin: theme.spacing(1),
		width: '100%'
	}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddArticle = props => {
	let history = useHistory();
	const { className } = props;
	const { id } = props.match.params;

	const classes = useStyles();
	const { getArticleDetails, updateArticle } = useContext(ArticleContext);
	const { listAllCategory } = useContext(CategoryContext);

	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const [defaultCategory, setDefaultCategory] = useState([]);
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
			summary: '',
			categories: '',
			title: '',
			description: '',
			featuredImg: '',
			imageUrl: ''
		},
		errors: {},
		isValid: true
	});

	const onImageLoaded = image => {
		setImgRef(image);
		makeClientCrop(cropDetails, image);
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

	const getArticle = () => {
		let catglist = [];
		getArticleDetails(id)
			.then(d => {
				let cat_ids = d.categories.map(i => {
					let obj = { value: i._id, label: i.name };
					catglist.push(obj);
					return i._id;
				});
				let details = d;
				details.categories = cat_ids.toString();
				setDefaultCategory(catglist);
				const { description } = details;
				const contentState = convertHtmlToEditorState(description);
				const newEditorState = EditorState.push(editorState, contentState);

				setEditorState(newEditorState);

				setFormState({
					...formState,
					values: details
				});
			})
			.catch(e => {
				console.log('ERR:', e);
			});
	};

	useEffect(getAllCategories, []);
	useEffect(getArticle, []);

	const handleQuickSubmit = e => {
		e.preventDefault();
		updateArticleDetails(true);
	};

	const handleSubmit = e => {
		e.preventDefault();
		updateArticleDetails();
	};

	const handleSelectChange = values => {
		let _categories = '';
		if (values && values.length) {
			let category_ids = values.map(d => {
				return d.value;
			});
			_categories = category_ids.toString();
		}
		setDefaultCategory(values);
		setFormState({
			...formState,
			values: {
				...formState.values,
				categories: _categories
			}
		});
	};

	const formValidate = payload => {
		let isValid = true;
		if (!payload.title || !payload.summary || !payload.categories) isValid = false;
		return isValid;
	};

	const onEditorChange = editorState => {
		setEditorState(editorState);
	};

	const updateArticleDetails = (quick_save = false) => {
		const { values } = formState;
		const data = editorState.getCurrentContent();

		const rawContentState = convertToRaw(data);
		const markup = draftToHtml(rawContentState);

		const allFormValues = { ...values, description: markup };
		const isValid = formValidate(allFormValues);
		if (!isValid) {
			return setSnackState({
				open: true,
				severity: 'error',
				message: 'Required fields are missing!'
			});
		}
		if (allFormValues.featuredImg) delete allFormValues.featuredImg;
		const formData = createFormData(allFormValues);
		setSubmitStatus(true);
		updateArticle(id, formData)
			.then(d => {
				if (d.success === false) {
					setSubmitStatus(false);
					return setSnackState({
						open: true,
						severity: 'error',
						message: d.message
					});
				}
				if (quick_save === true) {
					setSubmitStatus(false);
					return setSnackState({
						open: true,
						severity: 'success',
						message: 'Current article data is saved.'
					});
				}
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

	const handleChange = e => {
		let val = '';
		e.preventDefault();
		if (e.target.type === 'file') val = e.target.files[0];
		if (e.target.type === 'checkbox') val = e.target.checked;
		val = e.target.value;
		setFormState({
			...formState,
			values: {
				...formState.values,
				[e.target.name]: val
			}
		});
	};

	const featureImgUrl = formState.values.featuredImg
		? formState.values.featuredImg
		: '/images/products/product_1.png';

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
				<CardHeader title="Update an article" />
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
									<FormControl className={classes.formControl}>
										<Select
											value={defaultCategory}
											defaultValue={defaultCategory}
											isMulti
											options={categoryList}
											className="basic-multi-select"
											classNamePrefix="select"
											onChange={handleSelectChange}
											placeholder="* Select categories..."
										/>
									</FormControl>
								</Grid>
								<Grid className={classes.formItem} item md={12} xs={12}>
									<FormControl className={classes.formControl}>
										<TextField
											multiline
											rows={4}
											fullWidth
											margin="dense"
											name="summary"
											placeholder="*Summary - Short description about article."
											required
											onChange={handleChange}
											value={formState.values.summary || ''}
											variant="outlined"
										/>
									</FormControl>
								</Grid>
								<Grid item className={classes.formItem} md={12} xs={12}>
									<Button fullWidth onClick={() => setOpenModal(true)} variant="contained">
										Featured Image
									</Button>
								</Grid>
								<Grid item md={12} xs={12}>
									<img
										alt="Featured"
										src={croppedPreview ? croppedPreview : featureImgUrl}
										width="300px"
										height="200px"
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
