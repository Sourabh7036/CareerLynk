import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { BACKEND_URL, USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';

const ResumeViewer = ({ isOpen, setIsOpen, resumeUrl, fileName }) => {
    const isDocx = fileName?.toLowerCase().endsWith('.docx');
    const [pdfBlob, setPdfBlob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Construct the full URL for local file
   const BACKEND_BASE_URL = 'http://localhost:8000'; // base url without api path

   const fullUrl = resumeUrl.startsWith('http')
    ? resumeUrl
    : `${BACKEND_BASE_URL}/${resumeUrl.replace(/^\/?uploads/, 'uploads')}`;




    // Fetch the file with credentials when the dialog opens
    React.useEffect(() => {
        if (!isOpen || !resumeUrl) return;
        
        if (isDocx) {
            setPdfBlob(null);
            return;
        }

        const fetchPdf = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(fullUrl, {
                    responseType: 'blob',
                    withCredentials: true
                });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                setPdfBlob(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setError('Failed to load the PDF file. Please try downloading instead.');
                toast.error('Failed to load the PDF file');
            } finally {
                setLoading(false);
            }
        };
        fetchPdf();

        // Cleanup
        return () => {
            if (pdfBlob) {
                URL.revokeObjectURL(pdfBlob);
                setPdfBlob(null);
            }
        };
    }, [isOpen, fullUrl, isDocx, resumeUrl]);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get(fullUrl, {
                responseType: 'blob',
                withCredentials: true
            });
            const blob = new Blob([response.data], { 
                type: isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'resume' + (isDocx ? '.docx' : '.pdf'));
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download the file');
        } finally {
            setLoading(false);
        }
    };

    if (!resumeUrl) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <DialogTitle>{fileName || 'Resume'}</DialogTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleDownload}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </>
                                )}
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(fullUrl, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                            </Button>
                        </div>
                    </div>
                    <DialogDescription>
                        View or download the resume file
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 h-[70vh] border rounded-lg overflow-hidden">
                    {isDocx ? (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                            <div className="text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">
                                    DOCX preview is not available.
                                    <br />
                                    Please use the download or open button above to view the file.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                            <div className="text-center text-red-500">
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : pdfBlob ? (
                        <iframe
                            src={pdfBlob}
                            title="Resume Viewer"
                            className="w-full h-full"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResumeViewer; 