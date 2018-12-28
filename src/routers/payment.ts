import * as express from 'express';
import * as rp from 'request-promise';
import { config } from '../config';
import { di } from '../di';
import { getXLineHeader } from '../utils/line';

function reservePayment(req, res) {
    console.log('reservePayment');
    let { amount, orderId } = req.query;
    let url = `${config.linepay.api}/v2/payments/request`;

    let payload = {
        productName: 'PetdeeGo Fee',
        amount,
        orderId,
        currency: 'THB',
        confirmUrl: `${config.apiUrl}/payment/confirm`,
        langCd: 'th',
        confirmUrlType: 'SERVER',
    };
    rp({
        method: 'POST',
        uri: url,
        body: payload,
        headers: getXLineHeader(),
        json: true,
    })
        .then(function (response) {
            console.log('response', JSON.stringify(response));
            if (response && response.returnCode === '0000' && response.info) {
                const data = req.body;
                const transactionId = response.info.transactionId;
                data.transactionId = transactionId;
                updateOrderInfo(orderId, data);
            }
            res.send(response);
        })
        .catch(function (err) {
            console.log('payment err', err);
            res.status(400).send(err);
        });
};

async function confirmPayment(req, res) {
    let { transactionId, orderId } = req.query;
    let url = `${config.linepay.api}/v2/payments/${transactionId}/confirm`;
    let data;
    const orderInfo = await getOrderInfo(orderId);

    data = orderInfo;
    let body = {
        amount: data.amount,
        currency: 'THB',
    };
    let headers = {
        'X-LINE-ChannelId': config.linepay.channelId,
        'X-LINE-ChannelSecret': config.linepay.channelSecret,
        'Content-Type': 'application/json',
    };
    return rp({
        method: 'POST',
        uri: url,
        body: body,
        headers,
        json: true,
    })
        .then(function (response) {
            console.log('response', JSON.stringify(response));
            if (response && response.returnCode === '0000' && response.info) {
                data.status = 'paid';
                updateOrderInfo(orderId, data);

            }
            res.send(response);
        })
        .catch(function (err) {
            console.log('payment err', err);
            res.status(400).send(err);
        });
};

async function getOrderInfo(orderId) {
    return new Promise(async (resolve, reject) => {
        try {
            let criteria = { order_id: orderId };
            let db = di.get('db');
            const data = await db.collection('orders').findOne(criteria);
            if (data) {
                resolve(data);
            } else {
                reject(new Error('DATA_NOT_FOUND'));
            }
        } catch (err) {
            console.log('err', err);
            reject(err);
        }
    });
}

async function updateOrderInfo(orderId, body) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = di.get('db');
            await db.collection('orders').updateOne({ _id: orderId }, { $set: body });
            resolve();
        } catch (err) {
            console.log('err', err);
            reject(err);
        }
    });
}

export const router = express.Router();

router.get('/reserve', reservePayment);
router.post('/confirm', reservePayment);