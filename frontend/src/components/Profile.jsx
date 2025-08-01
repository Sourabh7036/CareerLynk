import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import ResumeBuilder from './ResumeBuilder'
import ResumeViewer from './ResumeViewer'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const commonJobSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
    "HTML", "CSS", "SQL", "MongoDB", "Express", "Angular", 
    "Vue", "TypeScript", "PHP", "Ruby", "Swift", "Kotlin", 
    "AWS", "Docker", "Kubernetes", "Git", "REST API", "GraphQL"
];

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
    const [viewResumeOpen, setViewResumeOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    // Function to handle resume viewing
    const handleViewResume = () => {
        if (!user?.profile?.resume) return;
        setViewResumeOpen(true);
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage 
                                src={user?.profile?.profilePhoto ? `${import.meta.env.VITE_API_URL}${user.profile.profilePhoto}` : "https://github.com/shadcn.png"} 
                                alt={user?.fullname} 
                            />
                            <AvatarFallback className="text-2xl">
                                {user?.fullname?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills?.length > 0 ? user.profile.skills.map((item, index) => (
                                <Badge key={index}>{item}</Badge>
                            )) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full items-center gap-1.5'>
                    <div className='flex items-center justify-between'>
                        <Label className="text-md font-bold">Resume</Label>
                        <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Upload/Parse Resume
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Resume Builder</DialogTitle>
                                    <DialogDescription>
                                        Upload your resume to automatically parse your information or build it from scratch
                                    </DialogDescription>
                                </DialogHeader>
                                <ResumeBuilder jobSkills={commonJobSkills} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    {user?.profile?.resume && (
                        <div className='mt-2 p-4 border rounded-lg'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <span className='text-blue-500'>{user.profile.resumeOriginalName}</span>
                                </div>
                                <Button 
                                    variant="ghost"
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={handleViewResume}
                                >
                                    View Resume
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
            {user?.profile?.resume && (
                <ResumeViewer 
                    isOpen={viewResumeOpen}
                    setIsOpen={setViewResumeOpen}
                    resumeUrl={user.profile.resume}
                    fileName={user.profile.resumeOriginalName}
                />
            )}
        </div>
    )
}

export default Profile