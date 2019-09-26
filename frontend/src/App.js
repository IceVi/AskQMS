import React from "react";
import { DirectLine } from "botframework-directlinejs";
import ChatBot from 'react-simple-chatbot';
import { Container, Typography } from "@material-ui/core";
import "./App.css";
import { ReactComponent as Logo } from './logo.svg';

function App() {
  const directLine = new DirectLine({
    token: "nhSXCzZ_vd0.dJYInKtoLnpr2Bntxzyvq7zw6cINLQ04ZfEdadH-gVM"
  });
  return (
    <Container>
      <div className="header">
        <Logo className="logo"/>
      </div>
      <Container fixed className="container">
        <Typography variant="h4" align="center" m="50px">
          Ask QMS
        </Typography>
        <Container className="container-chat" align="center">
        <ChatBot
    steps={[
      {
        id: '1',
        message: 'Hi! My name is PARKER, I will help you searching for information  within the CI QMS. Choose a theme:',
        trigger: '2',
      },
      {
        id: '2',
        options: [
          { value: 1, label: 'Roles', trigger: '4' },
          { value: 2, label: 'Product Creation Process', trigger: '9' },
          { value: 3, label: 'Quality and Standardization', trigger: '5' },
        ],
      },
      {
        id: '3',
        message: 'Your choice is Product Creation Process',
        trigger: '2',
      },
      {
        id: '4',
        message: 'You choose Roles.',
        trigger: '6'
      },
      {
        id: '5',
        message: 'Your choice is Quality and Standardization',
        trigger: '2'
      },
      {
        id: '6',
        options: [
          { value: 1, label: 'All Employers QMS', trigger: '2' },
          { value: 2, label: 'Test Engineer/Verification Engineer', trigger: '7' },
          { value: 3, label: 'Technical Writer', trigger: '2' },
        ]
      },
      {
        id: '7',
        options: [
          { value: 1, label: 'Responsibilities', trigger: '8' },
          { value: 2, label: 'Procedures for the role', trigger: '8' },
          { value: 3, label: 'Docs review and approval', trigger: '8' },
        ],
        user: true
      },
      {
        id: '8',
        message: 'Thats it for now :)',
        end: true
      },
      {
        id: '9',
        message: 'So, choose your role to help me finding the info you need:',
        user: true,
        options: [
          { value: 1, label: 'Clinical', trigger: '8' },
          { value: 2, label: 'Marketing', trigger: '8' },
          { value: 3, label: 'Verification and Validation', trigger: '8' },
          { value: 4, label: 'Product Release', trigger: '8' },
          { value: 5, label: 'Safety and Security', trigger: '8' },
          { value: 6, label: 'Quality and Regularity', trigger: '8' },
        ]
      },
      {
        id: '10',
        message: 'So, choose your role to help me finding the info you need:',
        options: [
          { value: 1, label: 'Documentation', trigger: '11' },
          { value: 2, label: 'Quality', trigger: '8' },
          { value: 3, label: 'Regulatory', trigger: '8' }
        ]
      },
      {
        id: '11',
        message: 'You choose Documentation. What you need to know about it?',
        options: [
          { value: 1, label: 'Review and authorization in LiveLink', trigger: '8' },
          { value: 2, label: 'Good documentation Practices', trigger: '8' },
          { value: 3, label: 'Roles for creation, review and approval', trigger: '12' },
          { value: 4, label: 'Templates', trigger: '8' },
          { value: 5, label: 'Other', trigger: '8' }
        ]
      },
      {
        id: '12',
        message: 'The work instruction [0730-02-W1] mandatory roles for document creation, review and approval contains all the information about the topic. Search for specific content? Tell me what :)',
        user: true,
        options: [
          { value: 1, label: 'Traceability', trigger: 8 }
        ]
      }
    ]}
  />
        </Container>
      </Container>
    </Container>
  );
}

export default App;
