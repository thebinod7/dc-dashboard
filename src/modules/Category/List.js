import React, { useEffect, useState, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import TableWrapper from '../Global/TableWrapper';
import { CategoryContext } from '../../contexts/categoryContext';
import { SnackbarContext } from '../../contexts/snackBarContext';
import FormDialog from '../Global/Modal';

const useStyles = makeStyles(theme => ({
	table: {
		minWidth: 650
	},
	root: {
		padding: theme.spacing(3)
	},
	content: {
		marginTop: theme.spacing(2)
	}
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function List() {
	const classes = useStyles();
	const [tableData, setTableData] = useState({});
	const [categoryModal, setCategoryModal] = useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });

	const searchByQuery = query => {
		getCategoryList(query);
	};

	const { addCategory, listCategory } = useContext(CategoryContext);
	const { snackState, setSnackState, handleClose } = useContext(SnackbarContext);

	const getCategoryList = query => {
		listCategory(query)
			.then(d => setTableData(d))
			.catch(e => console.log('ERR:', e));
	};

	const handleFormChange = e => {
		e.preventDefault();
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCreateNewClick = e => {
		e.preventDefault();
		setCategoryModal(!categoryModal);
	};

	const handleModalClose = () => {
		setCategoryModal(false);
		setFormData({});
	};

	const handleSubmit = e => {
		if (!formData.name) {
			setSnackState({
				open: true,
				severity: 'warning',
				message: 'Category name is required.'
			});
			return;
		}
		e.preventDefault();
		addCategory(formData)
			.then(d => {
				handleModalClose();
				setSnackState({
					open: true,
					severity: 'success',
					message: 'Category added successfully!'
				});
				getCategoryList();
			})
			.catch(e => {
				console.log('ERR==>', e);
				setSnackState({
					open: true,
					severity: 'error',
					message: 'Something went wrong!'
				});
			});
	};

	useEffect(getCategoryList, []);

	const rows = tableData.data ? tableData.data : [];
	const _totalPages = tableData.totalPages ? tableData.totalPages : 1;

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
			<FormDialog
				title="Add Category"
				handleModalClose={handleModalClose}
				open={categoryModal}
				handleSubmit={handleSubmit}
			>
				<form onSubmit={handleSubmit}>
					<TextField
						autoFocus
						margin="dense"
						name="name"
						value={formData.name || ''}
						required
						label="Category Name"
						type="text"
						fullWidth
						onChange={handleFormChange}
					/>
					<TextField
						margin="dense"
						name="description"
						label="Category Description"
						type="text"
						fullWidth
						value={formData.description || ''}
						onChange={handleFormChange}
					/>
				</form>
			</FormDialog>
			<TableWrapper
				handleCreateNewClick={handleCreateNewClick}
				searchByQuery={searchByQuery}
				totalPages={_totalPages}
			>
				<div className={classes.content}>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Category</TableCell>
									<TableCell align="center">Created By</TableCell>
									<TableCell align="center">Created At</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map(row => (
									<TableRow key={row._id}>
										<TableCell component="th" scope="row">
											{row.name}
										</TableCell>
										<TableCell align="center">{row.user ? row.user.name : 'N/A'}</TableCell>
										<TableCell align="center">{moment(row.createdAt).format('LL')}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</TableWrapper>
		</div>
	);
}
