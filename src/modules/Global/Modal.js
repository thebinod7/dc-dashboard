import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog(props) {
  const maxWidth = props.maxWidth || "sm";
  const actionText = props.actionText || "Save";
  return (
    <div>
      <Dialog
        fullWidth={true}
        open={props.open}
        onClose={props.handleModalClose}
        aria-labelledby="form-dialog-title"
        maxWidth={maxWidth}
      >
        <DialogTitle id="form-dialog-title">
          {props.title || "Form Dialog"}
        </DialogTitle>
        <DialogContent>
          {props.subheading ? (
            <DialogContentText>{props.subheading} </DialogContentText>
          ) : (
            ""
          )}
          {props.children}
        </DialogContent>
        <DialogActions>
          {!props.hideCancelButton && (
            <Button onClick={props.handleModalClose} color="primary">
              Cancel
            </Button>
          )}
          {!props.hideSubmit && (
            <Button
              disabled={props.isLoading ? true : false}
              type="button"
              onClick={props.handleSubmit}
              color="primary"
            >
              {props.isLoading ? "Uploading image...." : actionText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
