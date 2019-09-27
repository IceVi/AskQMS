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
                this.searchWordsStep.bind(this),
                this.getFilesStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async searchWordsStep(stepContext) {
        const messageText = 'Please enter the words or sentence you are looking for:';
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
    }

    async getFilesStep(stepContext) {
        const chooseRoleDetails = stepContext.options;
        const files = chooseRoleDetails.files;
        const words = stepContext.result;

        if (words) {
            for (let i = 0; i < files.length; i++) {
                let dataBuffer = fs.readFileSync(`./files/${files[i].localFileName}`);

                pdf(dataBuffer).then(function(data) {
 
                    // // number of pages
                    // console.log(data.numpages);
                    // // number of rendered pages
                    // console.log(data.numrender);
                    // // PDF info
                    // console.log(data.info);
                    // // PDF metadata
                    // console.log(data.metadata); 
                    // // PDF.js version
                    // // check https://mozilla.github.io/pdf.js/getting_started/
                    // console.log(data.version);
                    // PDF text
                    
                    const pdfContent = data.text;
                    
                    if(pdfContent.includes(words)) {
                        let index = pdfContent.indexOf(words);
                        let initial = 0;
                        let end = 200;
                        if (index - 100 > 0) {
                            initial = index - 100;
                        }
                        if (index + 100 < data.text.length) {
                            end = index + 100;
                        }
                        let smallText = data.text.substring(initial, end);

                        let re = new RegExp(words, 'g');
                        const result = smallText.replace(re, '**'+words+'**');

                        let messageText = `${ files[i].code } - [${ files[i].fileName }](${ files[i].link }) \n\n [...]${ result }[...]`;
                        let msg = MessageFactory.text(messageText, messageText);
                        stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                    }
                });
            }
        }
    }
}

module.exports.GetFilesDialog = GetFilesDialog;
