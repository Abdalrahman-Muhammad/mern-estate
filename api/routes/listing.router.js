import express from "express";
import { verfiyToken } from "../utils/verfiyToken.js";
import { createListing } from "../controllers/listing.controller.js";

const router = express.Router();
router.post("/create", verfiyToken, createListing);
export default router;
