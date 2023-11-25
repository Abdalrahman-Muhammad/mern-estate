import express from "express";
import { verfiyToken } from "../utils/verfiyToken.js";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";

const router = express.Router();
router.post("/create", verfiyToken, createListing);
router.delete("/delete/:id", verfiyToken, deleteListing);
router.post("/update/:id", verfiyToken, updateListing);
router.get("/get/:id", verfiyToken, getListing);
router.get("/get", getListings);
export default router;
