// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints, MessageFactory } = require('botbuilder');
const { TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { GetFilesDialog } = require('./getFilesDialog');

const GET_FILES_DIALOG = 'getFilesDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

const fs = require('fs');
function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch(err) {
            return cb && cb(err);
        }
    })
};

class ChooseRoleDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'chooseRoleDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new GetFilesDialog(GET_FILES_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.roleStep.bind(this),
                this.roleFilesStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * Message to wait for role
     */
    async roleStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        if (!chooseRoleDetails.role) {
            const messageText = 'So, choose your role to help me finding the info you need:';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(chooseRoleDetails.role);
    }

    async roleFilesStep(stepContext) {
        const chooseRoleDetails = stepContext.options;
        
        try {
            jsonReader('./cognitiveModels/filesList.json', (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }
    
                chooseRoleDetails.role = stepContext.result.toLowerCase();
                if (chooseRoleDetails.role == 'all' || chooseRoleDetails.role == 'all employers') {
                    files = files.byRoles.allEmployers;
                } 
                else if(chooseRoleDetails.role == 'tester' || chooseRoleDetails.role == 'test engineer') {
                    files = files.byRoles.testEngineer;
                }
                else if(chooseRoleDetails.role == 'writer' || chooseRoleDetails.role == 'technical writer') {
                    files = files.byRoles.technicalWriter;
                }
                else {
                    const messageText = 'Role not recognized. Please, try again';
                    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                }
    
                chooseRoleDetails.files = files;
            });

            return stepContext.beginDialog('getFilesDialog', chooseRoleDetails);
        } catch (err) {
            return err;
        }
    }
}

module.exports.ChooseRoleDialog = ChooseRoleDialog;
