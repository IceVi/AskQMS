import React from "react";
import { DirectLine } from "botframework-directlinejs";
import ReactWebChat from "botframework-webchat";
import { Container, Typography } from "@material-ui/core";
import "./App.css";
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  const directLine = new DirectLine({
    token: "nhSXCzZ_vd0.dJYInKtoLnpr2Bntxzyvq7zw6cINLQ04ZfEdadH-gVM"
  });

  return (
    <div>
      <div className="header">
        <Logo className="logo" />
      </div>
      <Typography variant="h3" align="center" m="50px">
        Chatbot
      </Typography>
      <div id="webchat">
        <ReactWebChat
          directLine={directLine}
          userID="9caba56d-38a5-4232-9597-a45e5dce3799"
        />
        </div>
        </div>
  );
}

export default App;
