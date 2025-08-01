import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, searchJobs } from "../controllers/job.controller.js";
import { getJobRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/search").get(isAuthenticated, searchJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/recommendations").get(isAuthenticated, getJobRecommendations);

export default router;

