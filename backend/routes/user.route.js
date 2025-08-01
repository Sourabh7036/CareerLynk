import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { uploadProfilePhoto, uploadResume } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

console.log('Uploads directory path:', uploadsDir);

const router = express.Router();

router.post("/register", uploadProfilePhoto.single("profilePhoto"), register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", isAuthenticated, uploadResume.single("resume"), updateProfile);

// Add route to serve files with authentication
router.get('/files/*', isAuthenticated, (req, res) => {
    try {
        const requestedFile = req.params[0];
        console.log('Requested file:', requestedFile);
        
        const filePath = path.resolve(uploadsDir, requestedFile);
        console.log('Resolved file path:', filePath);
        
        // Security check to prevent directory traversal
        if (!filePath.startsWith(uploadsDir)) {
            console.error('Security: Attempted path traversal:', filePath);
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Set appropriate content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.pdf' 
            ? 'application/pdf' 
            : ext === '.docx' 
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        
        console.log('Serving file:', filePath);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({
            success: false,
            message: 'Error serving file'
        });
    }
});

export default router;

