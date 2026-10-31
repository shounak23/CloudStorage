import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0].message;
    console.log(message);
    return next(new ApiError(400, message));
  }
  next();
};
