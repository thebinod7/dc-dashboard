import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import '../assets/scss/index.scss';
import '../assets/custom.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import theme from '../theme';

import LoginPage from './Login';
import Dashboard from './Dashboard';
import { getUser } from '../utils/sessionManager';

import { ArticleContextProvider } from '../contexts/articleContext';
import { CategoryContextProvider } from '../contexts/categoryContext';
import { ReportContextProvider } from '../contexts/reportContext';
import { SnackbarProvider } from '../contexts/snackBarContext';
import { UserContextProvider } from '../contexts/userContext';

function App() {
	const user = getUser();
	const _tokenExpiry = localStorage.getItem('expireDate');
	const userExpired = _tokenExpiry && _tokenExpiry > Date.now() ? false : true;
	return (
		<div>
			<ThemeProvider theme={theme}>
				<SnackbarProvider>
					<UserContextProvider>
						<CategoryContextProvider>
							<ArticleContextProvider>
								<ReportContextProvider>
									<Router>
										<Switch>
											<Route path="/login" component={LoginPage} />
											{user && userExpired === false ? (
												<Route component={Dashboard} />
											) : (
												<Redirect to="/login" />
											)}
										</Switch>
									</Router>
								</ReportContextProvider>
							</ArticleContextProvider>
						</CategoryContextProvider>
					</UserContextProvider>
				</SnackbarProvider>
			</ThemeProvider>
		</div>
	);
}

export default App;
