const fetch = require('node-fetch');

// You can find your project ID in your Dialogflow agent settings
const projectId = 'small-talk-phhmjo'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCodeList = ['en-US', 'th-TH'];

const dialogflow = require('dialogflow');

const config = {
    credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const {
    FACEBOOK_ACCESS_TOKEN
} = process.env;

const sendTextMessage = (userId, text) => {
    return fetch(
        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                messaging_type: 'RESPONSE',
                recipient: {
                    id: userId,
                },
                message: {
                    text,
                },
            }),
        }
    );
}

module.exports = (event) => {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: (message.length > 1 && message[0].match(/[A-Za-z]/i)) ? languageCodeList[0] : languageCodeList[1],
            },
        },
    };

    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            return sendTextMessage(userId, result.fulfillmentText);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}