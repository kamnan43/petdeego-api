import * as express from 'express';
import { manager } from '../manager/manager';
import { pushMessage } from '../utils/line';
const { ObjectId } = require('mongodb');
import { paymentTemplate } from '../template/payment';

async function handlePostback(message, event) {
    const postbackData = event.postback.data.split('_');
    const action = postbackData[0];
    if (action === 'updateorderstatus') {
        let orderId = postbackData[1];
        let status = postbackData[2];
        await manager.order.updateOrderStatus(orderId, status);
        let order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
        let driver = await manager.driver.getDriverById(order.driver_id);
        await pushMessage(event.replyToken, paymentTemplate(order, driver));
        let user = await manager.user.getUser({ _id: ObjectId(order.user_id) });
        await pushMessage(user.line_id, { type: 'text', text: 'สัตว์เลี้ยงของคุณอยู่ระหว่างดำเนินการส่ง' });
    }
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