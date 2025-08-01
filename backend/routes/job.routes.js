import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAllJobs, getJobById, postJob, getAdminJobs, searchJobs } from '../controllers/job.controller.js';

const router = express.Router();

// Public routes
router.get('/get', getAllJobs);
router.get('/get/:id', getJobById);

// Protected routes
router.post('/post', isAuthenticated, postJob);
router.get('/admin', isAuthenticated, getAdminJobs);
router.get('/search', isAuthenticated, searchJobs);

export default router; 