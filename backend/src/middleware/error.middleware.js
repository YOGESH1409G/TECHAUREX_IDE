import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    err = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  return res
    .status(err.statusCode)
    .json(
      new ApiResponse(
        err.statusCode,
        null,
        err.message,
        err.errors
      )
    );
};

export default errorHandler;
