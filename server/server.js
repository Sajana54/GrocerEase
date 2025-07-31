
/*
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express(); //created app using express package
const port = process.env.PORT ||4000;

await connectDB()
await connectCloudinary()

//allow multiple origins
const allowedOrigins = ['http://localhost:4000']

//middleware configurations 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));


//creating routes
app.get('/',(req, res) => res.send('API is working'));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, () =>{
    console.log('Server is running on http://localhost:'+port); //concatenation
} )
*/
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to DB and Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allow frontend origin (React)
const allowedOrigins = ['http://localhost:5173']; // frontend dev port

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // required for cookies/auth
};
// ✅ Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get('/', (_, res) => res.send('API is working'));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/khalti',paymentRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
