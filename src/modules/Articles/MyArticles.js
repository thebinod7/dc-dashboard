import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';

import TableWrapper from '../Global/TableWrapper';
import { ArticleContext } from '../../contexts/articleContext';

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

export default function MyArticles() {
	let history = useHistory();
	const classes = useStyles();
	const [tableData, setTableData] = useState({});
	const [loading, setLoading] = useState(false);

	const searchByQuery = query => {
		loadMyArticles(query);
	};

	const handleCreateNewClick = e => {
		e.preventDefault();
		history.push('/add-article');
	};

	const { myArticles } = useContext(ArticleContext);

	const loadMyArticles = query => {
		setLoading(true);
		myArticles(query)
			.then(d => {
				console.log('D==>', d);
				setTableData(d);
				setLoading(false);
			})
			.catch(e => {
				setLoading(false);
			});
	};

	useEffect(loadMyArticles, []);

	const rows = tableData.data ? tableData.data : [];
	const _totalPages = tableData.totalPages ? tableData.totalPages : 1;

	return (
		<div className={classes.root}>
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
									<TableCell>Title</TableCell>
									<TableCell align="center">Categories</TableCell>
									<TableCell align="center">Created At</TableCell>
									<TableCell align="center">Status</TableCell>
									<TableCell align="center">Action</TableCell>
								</TableRow>
							</TableHead>
							{loading ? (
								'<div style={{padding:20}}>Loading...</div>'
							) : (
								<TableBody>
									{rows.length ? (
										rows.map(row => (
											<TableRow key={row._id}>
												<TableCell component="th" scope="row">
													{row.title}
												</TableCell>
												<TableCell align="center">
													{row.categories.length
														? row.categories.map(c => {
																return (
																	<Chip
																		style={{ marginTop: 5, marginRight: 2 }}
																		key={c._id}
																		label={c.name}
																	/>
																);
														  })
														: '-'}
												</TableCell>
												<TableCell align="center">
													{moment(row.createdAt).format('LL')}
												</TableCell>
												<TableCell align="center">{row.status}</TableCell>
												<TableCell align="center">
													<Link title="Edit" to={`/articles/${row._id}`}>
														<EditIcon name="Edit" />
													</Link>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell>No data available.</TableCell>
										</TableRow>
									)}
								</TableBody>
							)}
						</Table>
					</TableContainer>
				</div>
			</TableWrapper>
		</div>
	);
}
