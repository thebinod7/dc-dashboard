import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TablePagination(props) {
  const classes = useStyles();

  const handleChange = (e, p) => {
    props.handlePageChange(parseInt(p));
  };

  return (
    <div className={classes.root}>
      <Pagination
        onChange={(event, page) => {
          handleChange(event, page);
        }}
        count={props.pages}
        variant="outlined"
        color="primary"
      />
    </div>
  );
}
