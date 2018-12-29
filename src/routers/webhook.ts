import * as express from 'express';
import { manager } from '../manager/manager';
import * as line from '../utils/line';
import { di } from '../di';
import { paymentTemplate } from '../template/payment';
import { pickUpTemplate } from '../template/pickup'
const { ObjectId } = require('mongodb');

export async function updateQuotationStatus(quotation_id, status) {
	try {
		let db = di.get('db');
		let collection = db.collection('quotations');

		let quotation = await collection.findOne({ _id: ObjectId(quotation_id) });
		if (quotation) {
			manager.quotation.updateQuotationStatus(quotation_id, status);
			const order = await manager.order.getOrderByCriteria({ _id: ObjectId(quotation.order_id) });
			if (status === 'accepted') {
				// update order
				order.driver_id = quotation.user_id;
				order.price = quotation.price;
				await manager.order.updateOrder(order._id, order);

				// send msg to selected driver
				await line.pushMessage(quotation.user_id, pickUpTemplate(order));

				// send msg to other driver
				const otherQt = await collection.find({
					order_id: quotation.order_id,
					_id: { $ne: ObjectId(quotation_id) },
				}).toArray();
				otherQt.forEach(element => {
					manager.quotation.updateQuotationStatus(element._id, 'rejected');
					line.pushMessage(element.user_id, {
						type: 'text',
						text: `รายการของคุณ [${order.customer.displayName}] ถูกยกเลิก เนื่องจากลูกค้าเลือกเรียกรถคนอื่นแล้ว`,
					});
				});
			} else {
				line.pushMessage(quotation.user_id, {
					type: 'text',
					text: `รายการของคุณ [${order.customer.displayName}] ถูกยกเลิก เนื่องจากลูกค้าปฏิเสธข้อเสนอของคุณ`,
				});
			}
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function handlePostback(message, event) {
	console.log('handlePostback', event);
	const postbackData = event.postback.data.split('_');
	const action = postbackData[0];
	const data = postbackData[1];
	console.log('postbackData ===>', postbackData);
	if (action === 'PICKUP') {
		let orderId = data;
		await manager.order.updateOrderStatus(orderId, 'pickedup');
		let order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
		let driver = await manager.driver.getDriverByUserId(order.driver_id);
		if (order.owner === 1) {
			await line.pushMessage(order.customer.userId, { type: 'text', text: 'คนขับของคุณมาถึงจุดนัดหมายแล้ว' });
		} else {
			await line.pushMessage(order.customer.userId, { type: 'text', text: 'สัตว์เลี้ยงของคุณอยู่ระหว่างดำเนินการส่ง' });
		}
		if (order.payment === line) {
			await line.pushMessage(order.customer.userId, paymentTemplate(order, driver));
		}
	} else if (action === 'NOTBUY') {
		updateQuotationStatus(data, 'rejected');
		await line.replyMessage(event.replyToken, { type: 'text', text: 'แจ้งปฏิเสธคนขับแล้ว กรุณารอราคาจากคนขับคนอื่นๆ' });
	} else if (action === 'BUY') {
		updateQuotationStatus(data, 'accepted');
		await line.replyMessage(event.replyToken, { type: 'text', text: 'ยืนยันนัดหมายแล้ว ขอบคุณค่ะ' });
	}
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