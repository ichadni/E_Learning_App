import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFiles = multer({
  storage,
}).single("file");