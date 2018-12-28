import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';
import { manager } from '../manager/manager';
import * as line from '../utils/line';
const { ObjectId } = require('mongodb');
import { pushMessage } from '../utils/line';
import { confirmQuotation } from '../template/confirmQuotation';

export const router = express.Router();

router.get('/:userid/:orderid', getQuotation);
router.get('/list', getQuotationList);
router.post('/', saveQuotation);
router.post('/update', updateQuotationStatus);

export async function getQuotation(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let { userid, orderid } = req.params;
    let criteria = {
      'user_id': userid,
      'order_id': orderid,
    };
    let db = di.get('db');
    let collection = db.collection('quotations');
    const data = await collection.findOne(criteria);
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

export async function getQuotationList(req, res, next) {
  let response = undefined;
  try {
    let { query } = req;
    let criteria = query;
    let db = di.get('db');
    let collection = db.collection('quotations');
    const data = await collection.find(criteria).toArray();
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

async function sendQuotationToUser(quoId) {
  const db = di.get('db');
  let quotation = await manager.quotation.getQuotationByCriteria({ _id: ObjectId(quoId)});

  console.log('quotation ====> ', quotation);
  let order = await manager.order.getOrderByCriteria({ _id: ObjectId(quotation.order_id)});
  console.log('order =====> ', order);
  let driver = await manager.driver.getDriverById(quotation.user_id);
  console.log('driver =====> ', driver);
  let lineUserId = order.customer.userId;
  console.log('order =====> ', order);
  console.log('line user Id ====> ', lineUserId);
  let message = await confirmQuotation(order, driver, quotation);
  pushMessage(lineUserId, message)
  .catch((err) => {
    console.log('err', err.originalError.response.data);
  });
  console.log('message ===> ', JSON.stringify(message));
}

export async function saveQuotation(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('quotations');
    body.created_at = new Date();
    body.status = 'quoted';
    let quo = await collection.insertOne(body);
    sendQuotationToUser(quo.insertedId);
    response = resp({ id: quo.insertedId }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function updateQuotationStatus(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('quotations');

    let data = await collection.find({ user_id: body.user_id, order_id: body.order_id }).sort().toArray();
    if (data.length > 0) {
      manager.quotation.updateQuotationStatus(data[0]._id, body.status);
      if (body.status === 'accepted') {
        let order = await manager.order.getOrderByCriteria(body.order_id);
        order.driver_id = data.user_id;
        order.price = data.price;
        await manager.order.updateOrder(order._id, order);
        data = await collection.find({ order_id: body.order_id }).sort().toArray();
        data.forEach(element => {
          if (element.user_id !== body.user_id) {
            manager.quotation.updateQuotationStatus(element._id, 'rejected');
            // Todo: push reject (element.user_id, 'rejected')
            line.pushMessage(element.user_id, '');
          } else {
            // Todo: push accept (element.user_id, 'accepted')
            line.pushMessage(element.user_id, '');
          }
        });
      } else {
        // Todo: push reject (data[0].user_id)
        line.pushMessage(data[0].user_id, '');
      }
    }
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}
