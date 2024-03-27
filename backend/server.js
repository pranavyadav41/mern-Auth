import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js'
import adminRoutes from './routes/adminRoute.js'
import * as path from 'path';

const __filename=fileURLToPath(import.meta.url);
const __dirname =dirname(__filename);


connectDB();

const port =5000;

const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/images',express.static(path.resolve(__dirname,'public/images')))


app.use('/api/users',userRoutes);
app.use('/api/admin',adminRoutes)


app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>console.log(`Server started on port ${port}`));