// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints, MessageFactory } = require('botbuilder');
const { TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class ChooseRoleDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'chooseRoleDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.roleStep.bind(this),
                this.originStep.bind(this)
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

        chooseRoleDetails.role = stepContext.result.toLowerCase();
        if (chooseRoleDetails.role == 'all employers') {
            const messageText = 'All Employers selected';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        } 
        else if(chooseRoleDetails.role == 'test engineer') {
            const messageText = 'Test Engineer selected';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        else if(chooseRoleDetails.role == 'technical writer') {
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
}

module.exports.ChooseRoleDialog = ChooseRoleDialog;
