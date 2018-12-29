import * as express from 'express';
import * as rp from 'request-promise';
import { config } from '../config';
import { di } from '../di';
const { ObjectId } = require('mongodb');
import * as line from '../utils/line';

// function reservePayment(req, res) {
//     console.log('reservePayment');
//     let { amount, orderId } = req.query;
//     let url = `${config.linepay.api}/v2/payments/request`;

//     let payload = {
//         productName: 'PetdeeGo Fee',
//         amount,
//         orderId,
//         currency: 'THB',
//         confirmUrl: `${config.apiUrl}/payment/confirm`,
//         langCd: 'th',
//         confirmUrlType: 'SERVER',
//     };
//     rp({
//         method: 'POST',
//         uri: url,
//         body: payload,
//         headers: getXLineHeader(),
//         json: true,
//     })
//         .then(function (response) {
//             console.log('response', JSON.stringify(response));
//             if (response && response.returnCode === '0000' && response.info) {
//                 const data = req.body;
//                 const transactionId = response.info.transactionId;
//                 data.transactionId = transactionId;
//                 updateOrderInfo(orderId, data);
//             }
//             res.send(response);
//         })
//         .catch(function (err) {
//             console.log('payment err', err);
//             res.status(400).send(err);
//         });
// };

async function confirmPayment(req, res) {
    let { transactionId, orderId } = req.query;
    let url = `${config.linepay.api}/v2/payments/${transactionId}/confirm`;
    const orderInfo = await getOrderInfo(orderId);
    let body = {
        amount: orderInfo.price,
        currency: 'THB',
    };
    return rp({
        method: 'POST',
        uri: url,
        body: body,
        headers: line.getXLineHeader(),
        json: true,
    })
        .then(response => {
            console.log('response', JSON.stringify(response));
            line.pushMessage(orderInfo.customer.userId, { type: 'text', text: 'ได้รับชำระเงินเรียบร้อยแล้ว ขอบคุณที่ใช้บริการค่ะ' });
            line.pushMessage(orderInfo.driver_id, { type: 'text', text: 'ลูกค้าชำระเงินเรียบร้อยแล้ว' });
            orderInfo.status = 'paid';
            updateOrderInfo(orderId, orderInfo);

            if (response && response.returnCode === '0000' && response.info) {
                orderInfo.status = 'settled';
                updateOrderInfo(orderId, orderInfo);
            }
            res.send(response);
        })
        .catch(function (err) {
            console.log('payment err', err);
            res.status(400).send(err);
        });
};

async function getOrderInfo(orderId): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let criteria = { _id: ObjectId(orderId) };
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
            await db.collection('orders').updateOne({ _id: ObjectId(orderId) }, { $set: body });
            resolve();
        } catch (err) {
            console.log('err', err);
            reject(err);
        }
    });
}

export const router = express.Router();

// router.get('/reserve', reservePayment);
router.get('/confirm', confirmPayment);