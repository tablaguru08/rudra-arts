import express from "express";
import {
  createCodOrder,
  listAdminOrders,
  trackOrder,
  updateAdminOrderStatus,
} from "../controllers/ordersController.js";
import { noStore } from "../middleware/cacheControl.js";

const router = express.Router();

router.post("/cod", noStore, createCodOrder);
router.get("/track/:trackingCode", noStore, trackOrder);
router.get("/admin", noStore, listAdminOrders);
router.patch("/admin/:id/status", noStore, updateAdminOrderStatus);

export default router;
