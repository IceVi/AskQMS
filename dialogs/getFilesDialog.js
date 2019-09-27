// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints, MessageFactory } = require('botbuilder');
const { TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

const fs = require('fs');
const pdf = require('pdf-parse');

class GetFilesDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'getFilesDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.getFiles.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async getFiles(stepContext) {
        const chooseRoleDetails = stepContext.options;
        const files = chooseRoleDetails.files;

        for (let i = 0; i < files.length; i++) {
            let dataBuffer = fs.readFileSync('./files/' + files[i].localFileName);
            pdf(dataBuffer).then(function(data) {
                // number of pages
                // console.log(data.numpages);
                // number of rendered pages
                // console.log(data.numrender);
                // PDF info
                // console.log(data.info);
                // PDF metadata
                // console.log(data.metadata)
                // PDF.js version
                // check https://mozilla.github.io/pdf.js/getting_started/
                // console.log(data.version);
                // PDF text
                // console.log(data.text)
                let smallText = data.text.substring(1, 100);
                const messageText = `${ files[i].code } - ${ files[i].fileName }:\n ${ smallText }`;
                const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                stepContext.prompt(TEXT_PROMPT, { prompt: msg });
            });
        }
    }
}

module.exports.GetFilesDialog = GetFilesDialog;
