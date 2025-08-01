import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Building2, MapPin, Calendar, IndianRupee, Users, Briefcase, Clock } from 'lucide-react'
import { Card } from './ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import ResumeBuilder from './ResumeBuilder'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isIntiallyApplied)
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false)

    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
            
            if(res.data.success) {
                setIsApplied(true)
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const handleApplyClick = () => {
        if (isApplied) return;
        setResumeDialogOpen(true);
    };

    const handleResumeUpload = () => {
        setResumeDialogOpen(false);
        applyJobHandler();
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if(res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    return (
        <div className='max-w-7xl mx-auto my-10 px-4 space-y-6'>
            {/* Header Section */}
            <Card>
                <div className='p-6 flex flex-col md:flex-row justify-between items-start gap-4'>
                    <div className='flex items-start gap-4'>
                        <div className='bg-gray-100 p-4 rounded-lg'>
                            <Building2 className="w-12 h-12 text-gray-600" />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>{singleJob?.title}</h1>
                            <p className='text-gray-600 mt-1'>{singleJob?.company?.name || "Company Name"}</p>
                            <div className='flex flex-wrap items-center gap-2 mt-4'>
                                <Badge variant="secondary" className='flex items-center gap-1'>
                                    <MapPin className="w-4 h-4" />
                                    {singleJob?.location}
                                </Badge>
                                <Badge variant="secondary" className='flex items-center gap-1'>
                                    <IndianRupee className="w-4 h-4" />
                                    {singleJob?.salary} LPA
                                </Badge>
                                <Badge variant="secondary" className='flex items-center gap-1'>
                                    <Users className="w-4 h-4" />
                                    {singleJob?.postion} Positions
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={handleApplyClick}
                                disabled={isApplied}
                                size="lg"
                                className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Upload Resume for {singleJob?.title}</DialogTitle>
                                <DialogDescription>
                                    Upload your resume to apply for this position
                                </DialogDescription>
                            </DialogHeader>
                            <ResumeBuilder onUploadComplete={handleResumeUpload} />
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>

            {/* Job Details Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='md:col-span-2'>
                    <Card className="p-6">
                        <h2 className='text-xl font-semibold mb-4'>Job Description</h2>
                        <p className='text-gray-700 whitespace-pre-line mb-6'>{singleJob?.description}</p>

                        <h2 className='text-xl font-semibold mb-4'>Requirements & Skills</h2>
                        <div className='flex flex-wrap gap-2 mb-6'>
                            {singleJob?.requirements?.map((req, index) => (
                                <Badge key={index} variant="outline" className='text-sm'>
                                    {req}
                                </Badge>
                            ))}
                        </div>

                        <h2 className='text-xl font-semibold mb-4'>Responsibilities</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2'>
                            {singleJob?.responsibilities?.map((resp, index) => (
                                <li key={index}>{resp}</li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Job Overview Section */}
                <div>
                    <Card className="p-6">
                        <h2 className='text-xl font-semibold mb-4'>Job Overview</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <Briefcase className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className='text-sm text-gray-600'>Experience</p>
                                    <p className='font-medium'>{singleJob?.experience} years</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Users className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className='text-sm text-gray-600'>Total Applicants</p>
                                    <p className='font-medium'>{singleJob?.applications?.length || 0}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Clock className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className='text-sm text-gray-600'>Job Type</p>
                                    <p className='font-medium'>{singleJob?.jobType}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className='text-sm text-gray-600'>Posted</p>
                                    <p className='font-medium'>
                                        {singleJob?.createdAt ? formatDistanceToNow(new Date(singleJob.createdAt), { addSuffix: true }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default JobDescription