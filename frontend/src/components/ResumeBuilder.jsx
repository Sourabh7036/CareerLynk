import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { FileUp, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';

const ResumeBuilder = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'application/pdf' || 
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(selectedFile);
        } else {
            toast.error('Please upload a PDF or DOCX file');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        
        try {
            const updateResponse = await axios.put(`${USER_API_END_POINT}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (updateResponse.data.success) {
                dispatch(setUser(updateResponse.data.user));
                toast.success('Resume uploaded successfully');
                if (onUploadComplete) {
                    onUploadComplete();
                }
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast.error(error.response?.data?.message || 'Error uploading resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Resume</CardTitle>
                    <CardDescription>
                        Upload your resume in PDF or DOCX format
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleUpload}
                                disabled={!file || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FileUp className="mr-2 h-4 w-4" />
                                        Upload Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumeBuilder; 