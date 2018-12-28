import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';
import { manager } from '../manager/manager';
import * as line from '../utils/line';

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

export async function saveQuotation(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('quotations');
    body.created_at = new Date();
    body.status = 'quoted';
    let dp = await collection.insertOne(body);
    response = resp({ id: dp.insertedId }, 200);
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
