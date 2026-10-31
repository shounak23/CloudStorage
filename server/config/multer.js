import multer, { memoryStorage } from "multer"; // ← different import
import { ApiError } from "../utils/apiError.js";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const storage = memoryStorage(); // ← no multer. prefix

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "File type not allowed"), false);
  }
};

const fileSizeMB = Number(process.env.FILES_SIZE_CLOUD_MB) || 5;

export const uploadMulter = new multer({
  // ← new keyword
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeMB * 1024 * 1024,
  },
});
