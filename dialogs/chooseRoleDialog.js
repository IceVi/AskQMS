// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('./dialogs/teds.pdf');


class ChooseRoleDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'chooseRoleDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.roleStep.bind(this),
                this.originStep.bind(this),
                this.finalStep.bind(this)
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

    /**
     * If an origin city has not been provided, prompt for one.
     */
    async originStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        chooseRoleDetails.role = stepContext.result;
        if (chooseRoleDetails.role == 'All Employers') {

                pdf(dataBuffer).then(function(data) {
 
                    // number of pages
                    // console.log(data.numpages);
                    // number of rendered pages
                    // console.log(data.numrender);
                    // PDF info
                    // console.log(data.info);
                    // PDF metadata
                    // console.log(data.metadata); 
                    // PDF.js version
                    // check https://mozilla.github.io/pdf.js/getting_started/
                    // console.log(data.version);
                    // PDF text
                    // console.log(data.text); 
                    const messageText = `All Employers selected. Heres some info from the PDF Teds about All Employers${data.text}` ;
                    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                });

        } 
        else if(chooseRoleDetails.role == 'Test Engineer') {
            const messageText = 'Test Engineer selected';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        else if(chooseRoleDetails.role == 'Technical Writer') {
            const messageText = 'Tech writer selected';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        else {
            const messageText = 'Role not recognized. Please, try again';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const chooseRoleDetails = stepContext.options;
            return await stepContext.endDialog(chooseRoleDetails);
        }
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.ChooseRoleDialog = ChooseRoleDialog;
