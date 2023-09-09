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
import Switch from '@material-ui/core/Switch';
import Chip from '@material-ui/core/Chip';

import TableWrapper from '../Global/TableWrapper';
import { ArticleContext } from '../../contexts/articleContext';
import { STATUS } from '../../constants';

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

export default function List() {
	const { listArticles, updateArticleStatus } = useContext(ArticleContext);

	let history = useHistory();
	const classes = useStyles();
	const [tableData, setTableData] = useState({});
	const [switchState, setSwichtState] = useState({
		selectedId: null,
		status: STATUS.DRAFT
	});

	const [isLoading, setLoading] = useState(false);

	const handleSwitchChange = (rowId, event) => {
		console.log(switchState);
		let _status = STATUS.DRAFT;
		if (event.target.checked === true) {
			_status = STATUS.LIVE;
		}
		setSwichtState({ status: _status, selectedId: rowId });
		updateStatus(rowId, _status);
	};

	const updateStatus = (id, status) => {
		setLoading(true);
		updateArticleStatus(id, status)
			.then(d => {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
				getArticlesList();
			})
			.catch(e => {
				console.log('ERR:', e);
				setLoading(false);
			});
	};

	const searchByQuery = query => {
		getArticlesList(query);
	};

	const handleCreateNewClick = e => {
		e.preventDefault();
		history.push('/add-article');
	};

	const getArticlesList = query => {
		listArticles(query)
			.then(d => {
				setTableData(d);
			})
			.catch(e => console.log('ERR:', e));
	};

	useEffect(getArticlesList, []);

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
									<TableCell align="center">Author</TableCell>
									<TableCell align="center">Categories</TableCell>
									<TableCell align="center">Created At</TableCell>
									<TableCell align="center">Status</TableCell>
									<TableCell align="center">Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.length ? (
									rows.map(row => (
										<TableRow key={row._id}>
											<TableCell component="th" scope="row">
												<Link title="Edit Article" to={`/articles/${row._id}`}>
													{row.title}
												</Link>
											</TableCell>
											<TableCell align="center">{row.user.name}</TableCell>
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
											<TableCell align="center">{moment(row.createdAt).format('LL')}</TableCell>
											<TableCell align="center">{row.status}</TableCell>
											<TableCell align="center">
												<Switch
													checked={row.status === STATUS.LIVE ? true : false}
													onChange={event => handleSwitchChange(row._id, event)}
													color="primary"
													name="status"
													disabled={isLoading ? true : false}
													inputProps={{ 'aria-label': 'primary checkbox' }}
												/>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell>No data available.</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</TableWrapper>
		</div>
	);
}
