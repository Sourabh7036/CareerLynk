import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, Building2, IndianRupee, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    {job.company?.logo ? (
                        <img 
                            src={job.company.logo} 
                            alt={job.company.name} 
                            className="w-12 h-12 rounded-full mr-4"
                        />
                    ) : (
                        <Building2 className="w-12 h-12 text-gray-400 mr-4" />
                    )}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company?.name}</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {job.jobType}
                </span>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    <span>₹{job.salary.toLocaleString()} per annum</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{job.experienceLevel}</span>
                </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {job.requirements?.slice(0, 3).map((req, index) => (
                        <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                            {req}
                        </span>
                    ))}
                    {job.requirements?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{job.requirements.length - 3}
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
            </div>

            <div className="mt-4">
                <Link to={`/description/${job._id}`}>
                    <Button className="w-full">View Details</Button>
                </Link>
            </div>
        </div>
    );
};

export default JobCard; 