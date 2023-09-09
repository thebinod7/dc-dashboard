import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";

import SearchInput from "../../../../modules/SearchInput/";

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
}));

const UsersToolbar = (props) => {
  const { className } = props;

  const changeSearchText = (e) => {
    props.handleSearchChange({ name: e.target.value });
  };

  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button className={classes.importButton}>Import</Button>
        <Button className={classes.exportButton}>Export</Button>
        <Button color="primary" variant="contained">
          Add user
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search user"
          onChange={changeSearchText}
        />
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
};

export default UsersToolbar;
