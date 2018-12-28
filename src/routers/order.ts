import * as express from 'express';
import { di } from '../di';
import { resp } from '../utils/resp';
import { manager } from '../manager/manager';
import { pushMessage } from '../utils/line';

export const router = express.Router();

router.get('/', getOrder);
router.post('/', createOrder);
router.post('/update', updateOrderStatus);

export async function createOrderMessage(order, driver) {
  return {
    type: 'text',
    text: 'got new order'
  };
}
async function sendOrderToDriver(order) {
  const db = di.get('db');
  const option = {
    pet_type: {
      $in: [order.pet_type],
    },
  };
const drivers = await db.collection('drivers').find(option).toArray();
drivers.forEach(async (driver) => {
  const message = await createOrderMessage(order, driver);
  pushMessage(driver.line_user_id, message)
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
    let { body } = req;
    await manager.order.updateOrderStatus(body.order_id, body.status);
    response = resp({ result: 'success' }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}
