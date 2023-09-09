import React from "react";
import { makeStyles } from "@material-ui/styles";

import TableToolbar from "./TableToolbar";
import TablePagination from "./TablePagination";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

export default function TableWrapper(props) {
  const classes = useStyles();

  const handlePageChange = (p) => {
    props.searchByQuery({ page: p });
  };

  const handleSearchChange = (search) => {
    props.searchByQuery({ title: search });
  };

  return (
    <div className={classes.root}>
      <TableToolbar
        handleCreateNewClick={props.handleCreateNewClick}
        handleSearchChange={handleSearchChange}
      />
      <div className={classes.content}>{props.children}</div>
      <TablePagination
        handlePageChange={handlePageChange}
        pages={props.totalPages}
      />
    </div>
  );
}
