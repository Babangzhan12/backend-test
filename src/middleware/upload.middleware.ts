import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

interface CustomRequest extends Request {
  file?: Express.Multer.File;
}

const storage = multer.memoryStorage();

const uploadDocuments = multer({
  storage,
  fileFilter: (req: CustomRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',       // PDF
      'application/vnd.ms-excel',    // Excel (XLS)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // Excel (XLSX)
      'application/vnd.ms-powerpoint',  // PowerPoint (PPT)
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint (PPTX)
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF, Excel, and PowerPoint files are allowed for this route'));
    }
    cb(null, true);
  },
});

const uploadImage = multer({
  storage,
  fileFilter: (req: CustomRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files (JPG, PNG, JPEG) are allowed for this route'));
    }
    cb(null, true);
  },
});


export const upload = { uploadDocuments, uploadImage };
