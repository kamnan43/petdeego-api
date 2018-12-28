import * as express from 'express';

async function handlePostback(message, event) {
    console.log('handlePostback', event);
}

async function handleEvent(event) {
    console.log('handleEvent', event);
    const message = event.message;
    switch (event.type) {
        case 'message':
            switch (message.type) {
                // case 'text':
                //     await handleText(message, event); break;
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
            break;
        case 'postback':
            await handlePostback(message, event); break;
        //     let data = event.postback.data;
        //     return replyText(event.replyToken, `Got postback: ${data}`);
        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}

function handleWebhook(req, res) {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
        res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(async (event) => {
        console.log('handleWebhook', event);
        // check verify webhook event
        if (event.source.userId !== 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
            await handleEvent(event);
        }
    }))
        .then(() => {
            res.end();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
}

export const router = express.Router();

router.post('/', handleWebhook);