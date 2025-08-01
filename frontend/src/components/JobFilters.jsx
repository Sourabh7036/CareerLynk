import React from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/redux/jobSlice';

const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5+ years'];
const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS'];

const defaultFilters = {
    jobType: "-",
    experience: "-",
    salary: [0, 100],
    skills: []
};

const JobFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.job?.filters) || defaultFilters;

    const handleFilterChange = (type, value) => {
        // Convert "-" back to empty string for the API
        const apiValue = value === "-" ? "" : value;
        dispatch(setFilters({ [type]: apiValue }));
    };

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="space-y-4">
                    {/* Job Type Filter */}
                    <div className="space-y-2">
                        <Label>Job Type</Label>
                        <Select 
                            value={filters.jobType || "-"} 
                            onValueChange={(value) => handleFilterChange('jobType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-">All Types</SelectItem>
                                {jobTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Experience Level Filter */}
                    <div className="space-y-2">
                        <Label>Experience Level</Label>
                        <Select 
                            value={filters.experience || "-"} 
                            onValueChange={(value) => handleFilterChange('experience', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-">Any Experience</SelectItem>
                                {experienceLevels.map(level => (
                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Salary Range Filter */}
                    <div className="space-y-2">
                        <Label>Salary Range (LPA)</Label>
                        <div className="pt-2">
                            <Slider
                                value={filters.salary || [0, 100]}
                                onValueChange={(value) => handleFilterChange('salary', value)}
                                min={0}
                                max={100}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>₹{(filters.salary && filters.salary[0]) || 0} LPA</span>
                                <span>₹{(filters.salary && filters.salary[1]) || 100} LPA</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills Filter */}
                    <div className="space-y-2">
                        <Label>Required Skills</Label>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {commonSkills.map(skill => (
                                <button
                                    key={skill}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        filters.skills?.includes(skill)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    onClick={() => {
                                        const newSkills = filters.skills?.includes(skill)
                                            ? filters.skills.filter(s => s !== skill)
                                            : [...(filters.skills || []), skill];
                                        handleFilterChange('skills', newSkills);
                                    }}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default JobFilters; 