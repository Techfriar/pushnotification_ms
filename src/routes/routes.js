import express from "express";
import PushNotificationController from "../controllers/pushNotificationController.js";

/**
 * Configures and registers routes for the Express application.
 *
 * This function sets up a router to handle API requests and registers it with the Express application.
 *
 * */
const configureRoutes = (app) => {
  const router = express.Router();
  const pushNotification = new PushNotificationController();

  // Send Push Notifications
  router.route("/send").post(pushNotification.sendNotification);

  // Register routers
  app.use("/api", router);
};

export default configureRoutes;
