import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Stats from "./Stats";
import UsersList from "../Users";
import Account from "../Account";
import Settings from "../Settings";
import Category from "../Category/List";
import Articles from "../Articles/List";
import AddArticle from "../Articles/Add";
import ArticleDetails from "../Articles/Details";
import MyArticles from "../Articles/MyArticles";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64,
    },
  },
  shiftContent: {
    paddingLeft: 240,
  },
  content: {
    height: "100%",
  },
}));

const Dashboard = (props) => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop,
      })}
    >
      <Header onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? "persistent" : "temporary"}
      />
      <Switch>
        <Route exact path="/" component={Stats} />
        <Route path="/account" component={Account} />
        <Route path="/add-article" component={AddArticle} />
        <Route exact path="/articles/:id" component={ArticleDetails} />
        <Route path="/articles" component={Articles} />
        <Route path="/category" component={Category} />
        <Route path="/my-articles" component={MyArticles} />
        <Route path="/settings" component={Settings} />
        <Route path="/users" component={UsersList} />
      </Switch>
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node,
};

export default Dashboard;
