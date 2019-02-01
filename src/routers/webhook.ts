import * as express from 'express';
import * as rp from 'request-promise';
import { config } from '../config';
import { manager } from '../manager/manager';
import * as line from '../utils/line';
// import { di } from '../di';
import { paymentTemplate } from '../template/payment';
import { driverInfoTemplate } from '../template/driverInfo';
import { pickUpTemplate } from '../template/pickup';
import { templateQuotation } from '../template/quotation';
import { confirmEndTemplate } from '../template/confirmEnd';
// import { setTimeToGMT } from '../utils/datetime';

const { ObjectId } = require('mongodb');

async function reservePayment(order, driver): Promise<any> {
	return new Promise((resolve, reject) => {
		let { price, _id } = order
		let url = `${config.linepay.api}/v2/payments/request`;

		let payload = {
			productName: 'PetdeeGo Fee',
			productImageUrl: driver.image,
			amount: price,
			orderId: _id,
			currency: 'THB',
			confirmUrl: `${config.apiUrl}/payment/confirm`,
			langCd: 'th',
			confirmUrlType: 'SERVER',
		};
		rp({
			method: 'POST',
			uri: url,
			body: payload,
			headers: line.getXLineHeader(),
			json: true,
		})
			.then(function (response) {
				console.log('response', JSON.stringify(response));
				if (response && response.returnCode === '0000' && response.info) {
					resolve(response);
				} else {
					reject(new Error('Reserve payment failed'));
				}
			})
			.catch(function (err) {
				console.log('payment err', err);
				reject(err);
			});
	});
}

// export async function updateQuotationStatus(quotation_id, status) {
// 	try {
// 		let db = di.get('db');
// 		let collection = db.collection('quotations');

// 		let quotation = await collection.findOne({ _id: ObjectId(quotation_id) });
// 		if (quotation) {
// 			manager.quotation.updateQuotationStatus(quotation_id, status);
// 			const order = await manager.order.getOrderByCriteria({ _id: ObjectId(quotation.order_id) });
// 			if (status === 'accepted') {
// 				// update order
// 				order.driver_id = quotation.user_id;
// 				order.price = quotation.price;
// 				await manager.order.updateOrder(order._id, order);

// 				// send msg to selected driver
// 				await line.pushMessage(quotation.user_id, {
// 					type: 'text',
// 					text: `ลูกค้า [${order.customer.displayName}] ได้เลือกข้อเสนอของคุณ`,
// 				})
// 				order.date = setTimeToGMT(order.date);
// 				const msg = await pickUpTemplate(order);
// 				console.log('pickUpTemplate', msg);
// 				await line.pushMessage(quotation.user_id, msg);

// 				// send msg to other driver
// 				const otherQt = await collection.find({
// 					order_id: quotation.order_id,
// 					_id: { $ne: ObjectId(quotation_id) },
// 				}).toArray();
// 				otherQt.forEach(element => {
// 					manager.quotation.updateQuotationStatus(element._id, 'rejected');
// 					line.pushMessage(element.user_id, {
// 						type: 'text',
// 						text: `รายการของคุณ [${order.customer.displayName}] ถูกยกเลิก เนื่องจากลูกค้าเลือกเรียกรถคนอื่นแล้ว`,
// 					});
// 				});
// 			} else {
// 				line.pushMessage(quotation.user_id, {
// 					type: 'text',
// 					text: `รายการของคุณ [${order.customer.displayName}] ถูกยกเลิก เนื่องจากลูกค้าปฏิเสธข้อเสนอของคุณ`,
// 				});
// 			}
// 		}
// 	} catch (err) {
// 		console.log('err', err);
// 	}
// }

async function driverAcceptJob(order_id, driver_id, replyToken) {
	try {
		const order = await manager.order.getOrderByCriteria({ _id: ObjectId(order_id) });
		const driver = await manager.driver.getDriverById(driver_id);

		if (order.status === 'ACCEPTED' || order.status === 'STARTED') {
			if (driver_id === order.driver_id) {
				line.replyMessage(replyToken, {
					type: 'text',
					text: `ขออภัย รายการของคุณ [${order.customer.displayName}] คุณกดรับงานไปแล้ว`,
				});
			} else {
				line.replyMessage(replyToken, {
					type: 'text',
					text: `ขออภัย รายการของคุณ [${order.customer.displayName}] มีผู้รับงานแล้ว`,
				});
			}
		} else if (order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ [${order.customer.displayName}] ลูกค้าขอยกเลิกแล้ว`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ [${order.customer.displayName}] การเดินทางสิ้นสุดแล้ว`,
			});
		} else if (!order.driver_id && order.status === 'CREATED') {
			order.driver_id = driver_id;
			order.status = 'ACCEPTED';
			// order.date = setTimeToGMT(order.date);
			await manager.order.updateOrder(order._id, order);

			// send driver info to customer
			const msg = await driverInfoTemplate(order, driver);
			await line.pushMessage(order.customer.userId, msg);

			// send msg to selected driver
			const orderInfo = await pickUpTemplate(order);
			await line.replyMessage(replyToken, orderInfo)

			// send msg to other driver
			const otherDrivers = await manager.driver.getDriversByOrderCriteria(order, {
				_id: { $ne: ObjectId(driver_id) },
				// user_id: 'Uaf01b90203e594b4b43a69290acf68d7'
			});

			otherDrivers.forEach(otherDriver => {
				line.pushMessage(otherDriver.user_id, {
					type: 'text',
					text: `รายการของคุณ [${order.customer.displayName}] มีผู้รับงานแล้ว`,
				});
			});
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function customerRejectDriver(order_id, driver_id, replyToken) {
	try {
		const order = await manager.order.getOrderByCriteria({ _id: ObjectId(order_id) });

		if (order.status === 'CREATED' || order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
			});
		} else if (order.driver_id && order.status === 'ACCEPTED') {
			const driver = await manager.driver.getDriverById(driver_id);
			await line.pushMessage(driver.user_id, {
				type: 'text',
				text: `รายการของคุณ [${order.customer.displayName}] ลูกค้าขอยกเลิกรายการของคุณ`,
			});

			order.driver_id = '';
			order.status = 'CREATED';
			await manager.order.updateOrder(order._id, order);

			await line.replyMessage(replyToken, {
				type: 'text',
				text: `แจ้งยกเลิกคนขับ [${driver.name}] แล้ว เราจะหาคนขับคนอื่นให้ค่ะ กรุณารอสักครู่`,
			})

			// send msg to other driver
			const otherDrivers = await manager.driver.getDriversByOrderCriteria(order, {
				_id: { $ne: ObjectId(driver_id) },
				// user_id: 'Uaf01b90203e594b4b43a69290acf68d7'
			});

			otherDrivers.forEach(async otherDriver => {
				const message = await templateQuotation(order, otherDriver);
				line.pushMessage(otherDriver.user_id,
					[
						{
							type: 'text',
							text: `รายการของคุณ [${order.customer.displayName}] ขอปฏิเสธคนขับก่อนหน้านี้`,
						},
						message
					]
				);
			});
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function customerCancelOrder(orderId, replyToken) {
	try {
		const order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
		if (order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
			});
		} else if (order.driver_id) {
			await manager.order.updateOrderStatus(orderId, 'CANCELED');
			const driver = await manager.driver.getDriverById(order.driver_id);
			line.pushMessage(driver.user_id,
				{
					type: 'text',
					text: `รายการของคุณ [${order.customer.displayName}] ลูกค้าขอยกเลิก`,
				},
			);

			await line.replyMessage(replyToken, {
				type: 'text',
				text: `แจ้งยกเลิกออร์เดอร์เรียบร้อยแล้ว เราหวังว่าจะมีโอกาสให้บริการในครั้งถัดไป ขอบคุณค่ะ`,
			})
		} else {
			await manager.order.updateOrderStatus(orderId, 'CANCELED');
			const drivers = await manager.driver.getDriversByOrderCriteria(order);
			drivers.forEach(async driver => {
				line.pushMessage(driver.user_id,
					{
						type: 'text',
						text: `รายการของคุณ [${order.customer.displayName}] ลูกค้าขอยกเลิก`,
					},
				);
			});
			await line.replyMessage(replyToken, {
				type: 'text',
				text: `แจ้งยกเลิกออร์เดอร์เรียบร้อยแล้ว เราหวังว่าจะมีโอกาสให้บริการในครั้งถัดไป ขอบคุณค่ะ`,
			})
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function driverIsGoing(order_id, replyToken) {
	try {
		const order = await manager.order.getOrderByCriteria({ _id: ObjectId(order_id) });
		if (order.status === 'CREATED' || order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
			});
		} else if (order.status === 'STARTED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางเริ่มต้นแล้ว`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
			});
		} else if (order.driver_id) {
			line.pushMessage(order.customer.userId, {
				type: 'text',
				text: `คนขับกำลังเดินทางไปรับคุณ`,
			});
			line.replyMessage(replyToken, {
				type: 'text',
				text: `แจ้งลูกค้าแล้ว ว่าคุณกำลังเดินทางไปรับ`,
			})
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function driverIsArrived(orderId, replyToken) {
	try {
		const order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
		if (order.status === 'CREATED' || order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
			});
		} else if (order.status === 'STARTED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางเริ่มต้นแล้ว`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
			});
		} if (order.driver_id) {
			line.pushMessage(order.customer.userId, {
				type: 'text',
				text: `คนขับของคุณมาถึงแล้ว`,
			});
			line.replyMessage(replyToken, {
				type: 'text',
				text: `แจ้งลูกค้าแล้ว ว่าคุณมาถึง`,
			})
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function driverIsPickedup(orderId, replyToken) {
	let order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
	let driver = await manager.driver.getDriverByUserId(order.driver_id);
	if (order.status === 'CREATED' || order.status === 'CANCELED') {
		line.replyMessage(replyToken, {
			type: 'text',
			text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
		});
	} else if (order.status === 'STARTED') {
		line.replyMessage(replyToken, {
			type: 'text',
			text: `ขออภัย รายการของคุณ การเดินทางเริ่มต้นขึ้นแล้ว`,
		});
	} else if (order.status === 'FINISHED') {
		line.replyMessage(replyToken, {
			type: 'text',
			text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
		});
	} else {
		await manager.order.updateOrderStatus(orderId, 'STARTED');
		if (!order.owner) {
			await line.pushMessage(order.customer.userId, { type: 'text', text: 'สัตว์เลี้ยงของคุณอยู่ระหว่างการเดินทาง' });
		} else {
			await line.pushMessage(order.customer.userId, { type: 'text', text: 'การเดินทางของคุณเริ่มต้นขึ้นแล้ว' });
		}
		if (order.payment === 'line') {
			try {
				const paymentRes = await reservePayment(order, driver);
				const paymentUrl = paymentRes.info.paymentUrl.web;
				// update payment transaction
				order.transactionId = paymentRes.info.transactionId + '';
				await manager.order.updateOrder(orderId, order);
				const msg = paymentTemplate(order, driver, paymentUrl);
				console.log('Payment msg', msg);
				await line.pushMessage(order.customer.userId, msg);
			} catch (err) {
				console.log('reservePayment error', err);
			}
		}
		// order.date = setTimeToGMT(order.date);
		await line.replyMessage(replyToken, confirmEndTemplate(order));
	}
}

async function driverIsFinished(orderId, replyToken) {
	try {
		let order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
		if (order.status === 'CREATED' || order.status === 'CANCELED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ถูกยกเลิกแล้ว`,
			});
		} else if (order.status === 'ACCEPTED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ ยังไม่ได้เริ่มต้นเดินทาง`,
			});
		} else if (order.status === 'FINISHED') {
			line.replyMessage(replyToken, {
				type: 'text',
				text: `ขออภัย รายการของคุณ การเดินทางสิ้นสุดแล้ว`,
			});
		} else {
			await manager.order.updateOrderStatus(orderId, 'FINISHED');
			let order = await manager.order.getOrderByCriteria({ _id: ObjectId(orderId) });
			if (order.owner) {
				await line.pushMessage(order.customer.userId, { type: 'text', text: 'การเดินทางของคุณ เสร็จสมบูรณ์แล้ว ขอบคุณที่ใช้บริการของเราค่ะ' });
			} else {
				await line.pushMessage(order.customer.userId, { type: 'text', text: 'สัตว์เลี้ยงของคุณส่งถึงจุดหมายแล้ว ขอบคุณที่ใช้้บริการของเราค่ะ' });
			}
			line.replyMessage(replyToken, {
				type: 'text',
				text: `การเดินทางของคุณ เสร็จสมบูรณ์แล้ว เราขอขอบคุณจากใจ ที่มาร่วมให้บริการกับเรา`,
			})
		}
	} catch (err) {
		console.log('err', err);
	}
}

async function handlePostback(message, event) {
	const postbackData = event.postback.data.split('_');
	const action = postbackData[0];
	const data = postbackData[1];
	const extra = postbackData[2];
	console.log('postbackData ===>', postbackData);
	if (action === 'ACCEPT') {
		driverAcceptJob(data, extra, event.replyToken);
	} else if (action === 'REJECT') {
		customerRejectDriver(data, extra, event.replyToken);
	} else if (action === 'CANCEL') {
		customerCancelOrder(data, event.replyToken);
	} else if (action === 'GOING') {
		driverIsGoing(data, event.replyToken);
	} else if (action === 'ARRIVED') {
		driverIsArrived(data, event.replyToken);
	} else if (action === 'PICKUP') {
		driverIsPickedup(data, event.replyToken);
	} else if (action === 'DROPOFF') {
		driverIsFinished(data, event.replyToken);
	}
}

async function handleEvent(event) {
	// console.log('handleEvent', event);
	const message = event.message;
	switch (event.type) {
		// case 'message':
		// 	switch (message.type) {
		// 		// case 'text':
		// 		//     await handleText(message, event); break;
		// 		default:
		// 			throw new Error(`Unknown message: ${JSON.stringify(message)}`);
		// 	}
		// 	break;
		case 'postback':
			await handlePostback(message, event); break;
		default:
		// throw new Error(`Unknown event: ${JSON.stringify(event)}`);
	}
}

function handleWebhook(req, res) {
	// req.body.events should be an array of events
	if (!Array.isArray(req.body.events)) {
		res.status(500).end();
	}
	// handle events separately
	Promise.all(req.body.events.map(async (event) => {
		// console.log('handleWebhook', event);
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