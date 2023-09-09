import React, { createContext, useState } from "react";

export const SnackbarContext = createContext();

export function SnackbarProvider(props) {
  const [snackState, setSnackState] = useState({
    open: false,
    severity: "info",
    message: "This is test message.",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackState({ ...snackState, open: false });
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackState,
        setSnackState,
        handleClose,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
}
