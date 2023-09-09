import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import ArticleStats from './Components/Articles';
import CategoryStats from './Components/Category';
import UserStats from './Components/Users';
import ValuationStat from './Components/Valuation';
import Barchart from './Components/Barchart';

import { ReportContext } from '../../contexts/reportContext';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(4)
	}
}));

const Stats = () => {
	const classes = useStyles();

	const { getCounts } = useContext(ReportContext);

	const [count_report, setCounts] = useState({});

	const loadCountReport = () => {
		getCounts()
			.then(d => {
				setCounts(d);
			})
			.catch(e => console.log('ERR:', e));
	};

	useEffect(loadCountReport, []);

	return (
		<div className={classes.root}>
			<Grid container spacing={4}>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<ArticleStats data={count_report.articles} />
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<CategoryStats data={count_report.category} />
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<UserStats data={count_report.users} />
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<ValuationStat />
				</Grid>
				<Grid item lg={12} sm={12} xl={12} xs={12}>
					<Barchart />
				</Grid>
			</Grid>
		</div>
	);
};

export default Stats;
