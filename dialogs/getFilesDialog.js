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

        for (let i = 0; i < files.length; i++) {
            const messageText = `${ files[i].code } - [${ files[i].fileName }](${ files[i].link })`;
            const msg = MessageFactory.text(messageText, messageText);
            stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
    }
}

module.exports.GetFilesDialog = GetFilesDialog;
