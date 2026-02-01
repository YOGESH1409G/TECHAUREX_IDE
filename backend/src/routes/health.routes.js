import express from 'express';
import {ApiResponse} from '../utils/ApiResponse.js'

const router = express.Router();

// http://localhost:4000/api/v1/health
router.get('/' ,(req,res)=>{
    const response = new ApiResponse(200, { uptime: process.uptime() }, "Server is healthy 🚀");
    return res.status(200).json(response);
});

export default router;