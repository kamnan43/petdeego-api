import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';
import { manager } from '../manager/manager';

export const router = express.Router();

router.get('/', getCustomers);
router.get('/:userId', getCustomerByUserId);
router.post('/', createCustomer);
router.put('/:userId', updateCustomer);

export async function getCustomers(req, res, next) {
    let response = undefined;
    try {
      const data = await manager.customer.getCustomers();
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

export async function getCustomerByUserId(req, res, next) {
    let response = undefined;
    try {
    //   let { body } = req;
      let { userId } = req.params;
      let criteria = {
        'user_id': userId,
      };
      let db = di.get('db');
      let collection = db.collection('customers');
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

export async function createCustomer(req, res, next) {
    let response = undefined;
    try {
      let { body } = req;
      let db = di.get('db');
      let collection = db.collection('customers');
      body.registed_at = new Date();
      let dp = await collection.insertOne(body);
      response = resp({ id: dp.insertedId, user_id: body.user_id }, 200);
    } catch (err) {
      console.log('err', err);
      response = resp({ message: err.message }, 400);
    }
    next(response);
  }

export async function updateCustomer(req, res, next) {
    let response = undefined;
    try {
        let { body } = req;
        let userId = req.params.userId;
        await manager.customer.updateCustomerByLineUserId(userId,body);
        response = resp({ result: 'success' }, 200);
    } catch (err) {
        console.log('err', err);
        response = resp({ message: err.message }, 400);
    }
    next(response);
}
