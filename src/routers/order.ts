import * as express from 'express';
import { di } from '../di';
import { resp } from '../utils/resp';
import { manager } from '../manager/manager';
import { pushMessage } from '../utils/line';
import { templateQuotation } from '../template/quotation';
import { setTimeToGMT } from '../utils/datetime';
import { getDistance } from '../utils/googlemap';

export const router = express.Router();

router.get('/', getOrder);
router.post('/', createOrder);
router.get('/update/:orderid/:status', updateOrderStatus);
router.get('/calculate/:from/:to', calculate);

async function sendOrderToDriver(order) {
  const db = di.get('db');
  const drivers = await db.collection('drivers').find({}).toArray();

  // console.log('order =====> ', order);
  // console.log('drivers ====> ', drivers);
  order.date = setTimeToGMT(order.date);
  drivers.forEach(async (driver) => {
    const message = await templateQuotation(order);

    // console.log('message ===> ', JSON.stringify(message));
    pushMessage(driver.user_id, message)
      .catch((err) => {
        console.log('err', err.originalError.response.data);
      });
  });
  return drivers.length;
}

export async function getOrder(req, res, next) {
  let response = undefined;
  try {
    let { userid, orderid } = req.params;
    let criteria = {
      'user_id': userid,
      'order_id': orderid,
    };
    let db = di.get('db');
    let collection = db.collection('orders');
    const data = await collection.find(criteria).sort().toArray();
    if (data) {
      response = resp(data);
    } else {
      throw new Error('DATA_NOT_FOUND');
    }
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function createOrder(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('orders');
    let order = await collection.insertOne(body);
    body['_id'] = order.insertedId;
    await sendOrderToDriver(body);
    response = resp({ result: 'success' }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function updateOrderStatus(req, res, next) {
  let response = undefined;
  try {
    let { orderid, status } = req.params;
    await manager.order.updateOrderStatus(orderid, status);
    response = resp({ result: 'success' }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function calculate(req, res, next) {
  let response = undefined;
  try {
    let { from, to } = req.params;
    const distance = await getDistance(from, to);
    const price = distance ? Math.ceil(75 + (12.5 * (distance.value / 1000)) + 150) : 0;
    response = resp({ result: { distance, price } }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}
