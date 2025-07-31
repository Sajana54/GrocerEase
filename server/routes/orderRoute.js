import express from "express";
import authUser from '../middlewares/authUser.js';
import {getAllOrders, getUserOrders, placeOrderCOD, placeOrderKhalti} from '../controllers/OrderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/online', authUser, placeOrderKhalti)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)

export default orderRouter;