import React from "react";
import { Card, CardContent, Grid, Typography, Avatar } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import AccountTreeRoundedIcon from "@material-ui/icons/AccountTreeRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  content: {
    alignItems: "center",
    display: "flex",
  },
  title: {
    fontWeight: 700,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    height: 56,
    width: 56,
  },
  icon: {
    height: 32,
    width: 32,
  },
}));

export default function Catogory(props) {
  const classes = useStyles();
  const { className } = props;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Categories
            </Typography>
            <Typography variant="h3">{props.data}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AccountTreeRoundedIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
