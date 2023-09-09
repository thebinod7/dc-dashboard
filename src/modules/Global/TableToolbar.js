import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import SearchInput from "../SearchInput";

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: "5px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  searchInput: {
    marginRight: theme.spacing(10),
  },
}));

export default function TableToolbar(props) {
  const { className } = props;
  const classes = useStyles();

  const handleChange = (e) => {
    props.handleSearchChange(e.target.value);
  };

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          onClick={props.handleCreateNewClick}
          color="primary"
          variant="contained"
        >
          <AddCircleIcon /> &nbsp; Create
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput className={classes.searchInput} onChange={handleChange} />
      </div>
    </div>
  );
}
