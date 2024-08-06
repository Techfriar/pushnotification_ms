import Joi from "joi";
import cleanErrorMessage from "../utils/cleanErrorMessage.js";

/**
 * Add validation rules for the request
 */
const schema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  fcm_tokens: Joi.array().items(Joi.string()).required(),
  data: Joi.object().pattern(Joi.string(), Joi.string())
});

export default class SendPushNotificationRequest {
  static async validate(request) {
    const { error, value } = schema.validate(request, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.context.key] = cleanErrorMessage(err.message);
      });

      throw validationErrors;
    }
    return value;
  }
}
