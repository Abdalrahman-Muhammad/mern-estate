import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verfiyToken } from "../utils/verfiyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verfiyToken, updateUser);
router.delete("/delete/:id", verfiyToken, deleteUser);
router.get("/listings/:id", verfiyToken, getUserListings);
router.get("/:id", verfiyToken, getUser);

export default router;
