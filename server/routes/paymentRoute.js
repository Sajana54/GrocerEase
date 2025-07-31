import express from 'express'
import { paymentInit, paymentVerification } from '../controllers/paymentController.js';
const paymentRouter=express.Router();

paymentRouter.post('/initiate',paymentInit);
paymentRouter.post('/verify',paymentVerification);

export default paymentRouter;