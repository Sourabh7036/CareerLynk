import multer from "multer";

// Use memory storage (suitable for further processing/parsing)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
    cb(null, true);
  },
});

export const uploadResume = upload.single("resume");
export const uploadProfilePhoto = upload.single("profilePhoto");
