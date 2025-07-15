import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Assuming `fullName` is sent in body
    let fullName = req.body.fullName || req.body.firstName ||"user";
    // Remove spaces and special characters for filename safety
    fullName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    cb(null, `${fullName}-${timestamp}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"), false);
  }
};

export const imageUpload = multer({
  storage,
  limits:{fileSize:40*1024*1024},
  imageFilter
})

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter
});

export default upload;
