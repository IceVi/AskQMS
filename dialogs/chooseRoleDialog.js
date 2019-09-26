// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class ChooseRoleDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'chooseRoleDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.destinationStep.bind(this),
                this.originStep.bind(this),
                this.travelDateStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async destinationStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        if (!chooseRoleDetails.destination) {
            const messageText = 'Cara... cara... pra onde voce quer ir, cara?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(chooseRoleDetails.destination);
    }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    async originStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        chooseRoleDetails.destination = stepContext.result;
        if (!chooseRoleDetails.origin) {
            const messageText = 'Ma daonde voce ta saindo, cara?';
            const msg = MessageFactory.text(messageText, 'Ma daonde voce ta saindo, cara?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(chooseRoleDetails.origin);
    }

    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    async travelDateStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        // Capture the results of the previous step
        chooseRoleDetails.origin = stepContext.result;
        if (!chooseRoleDetails.travelDate || this.isAmbiguous(chooseRoleDetails.travelDate)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: chooseRoleDetails.travelDate });
        }
        return await stepContext.next(chooseRoleDetails.travelDate);
    }

    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {
        const chooseRoleDetails = stepContext.options;

        // Capture the results of the previous step
        chooseRoleDetails.travelDate = stepContext.result;
        const messageText = `Please confirm, I have you traveling to: ${ chooseRoleDetails.destination } from: ${ chooseRoleDetails.origin } on: ${ chooseRoleDetails.travelDate }. Is this correct?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
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
