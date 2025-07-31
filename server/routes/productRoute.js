import express from 'express';
import {upload} from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

 productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
 productRouter.get('/list', productList)
 productRouter.get('/id', productById)
 productRouter.post('/stock', authSeller, changeStock)
 productRouter.put("/update",authSeller, updateProduct);
 productRouter.delete("/delete",authSeller ,deleteProduct);
 export default productRouter;