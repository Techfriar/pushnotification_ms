import firebaseAdmin from "firebase-admin";
import SendPushNotificationRequest from "../requests/sendPushNotificationRequest.js";

export default class PushNotificationController {
  /**
   * Handles sending a push notification to multiple devices using Firebase Cloud Messaging (FCM).
   *
   * This method performs the following steps:
   * 1. **Validation**: Validates the request body using the `SendPushNotificationRequest` schema to ensure the required fields are present and correctly formatted.
   * 2. **Firebase Initialization**:
   *    - Checks if the Firebase Admin SDK has already been initialized.
   *    - If not initialized, it either uses a provided service account object from the validated data to initialize the SDK or falls back to a default service account file located at "src/config/serviceAccount.json".
   * 3. **Notification Payload**: Constructs the notification message payload including:
   *    - `title`: The title of the notification.
   *    - `body`: The body of the notification.
   *    - `tokens`: An array of FCM registration tokens indicating the devices to which the notification should be sent.
   * 4. **Sending Notification**: Sends the notification using the Firebase Admin SDK's `sendEachForMulticast` method, which supports sending a message to multiple tokens.
   * 5. **Response Handling**:
   *    - If the notification is sent successfully, responds with a status of 200 and a success message along with the response data from Firebase.
   *    - If the notification fails to send, responds with a status of 200 and a failure message along with the response data from Firebase.
   * 6. **Error Handling**: Catches any errors that occur during validation, initialization, or sending, and responds with a status of 422 and an error message.
   *
   * @param {Object} req - The HTTP request object containing the notification data in the body.
   * @param {Object} res - The HTTP response object used to send the response back to the client.
   *
   * @returns {Promise<void>} A promise that resolves when the response has been sent.
   */
  async sendNotification(req, res) {
    try {
      // Validate request data using SendPushNotificationRequest schema
      const validatedData = await SendPushNotificationRequest.validate(
        req.body
      );

      // Initialize Firebase Admin SDK if not already initialized
      if (!firebaseAdmin.apps.length) {
        // Initialize Firebase Admin SDK with default service account file
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(
            "src/config/serviceAccount.json"
          ),
        });
      }

      // Define the notification message payload
      const message = {
        notification: {
          title: validatedData.title, // Notification title
          body: validatedData.body, // Notification body
        },
        tokens: validatedData.fcm_tokens, // List of FCM tokens to send notification to
      };

      // Send the notification using Firebase Admin SDK
      const response = await firebaseAdmin
        .messaging()
        .sendEachForMulticast(message);

      // Check if the notification was sent successfully
      if (response.responses[0].success) {
        // Return success response
        res.status(200).json({
          status: true,
          message: "Push notification sent successfully",
          data: response,
        });
      } else {
        // Return failure response
        res.status(200).json({
          status: false,
          message: "Failed to send push notification",
          data: response,
        });
      }
    } catch (error) {
      // Handle errors and return error response
      return res.status(422).json({
        status: false,
        message: "Failed to send push notification.",
        errors: error,
      });
    }
  }
}
