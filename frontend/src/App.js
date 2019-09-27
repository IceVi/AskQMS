import React from "react";
import { DirectLine } from "botframework-directlinejs";
import ReactWebChat from "botframework-webchat";
import { Container, Typography } from "@material-ui/core";
import "./App.css";

function App() {
  const directLine = new DirectLine({
    token: "nhSXCzZ_vd0.dJYInKtoLnpr2Bntxzyvq7zw6cINLQ04ZfEdadH-gVM"
  });
  return (
    <Container fixed className="container">
      <Typography variant="h3" align="center" m="50px">
        Chatbot
      </Typography>
      <Container className="container-chat" maxWidth="sm">
        <ReactWebChat directLine={directLine} userID="9caba56d-38a5-4232-9597-a45e5dce3799" />
      </Container>
    </Container>
  );
}

export default App;
