import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Search, MapPin, Briefcase, IndianRupee, X } from 'lucide-react';
import axios from 'axios';

const JobSearch = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useState({
        query: '',
        location: '',
        experience: '',
        jobType: '',
        salary: '',
        skills: [],
        sortBy: 'latest'
    });

    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'salary-high-to-low', label: 'Salary: High to Low' },
        { value: 'salary-low-to-high', label: 'Salary: Low to High' }
    ];

    const handleSearch = async () => {
        setLoading(true);
        try {
            const queryString = new URLSearchParams({
                ...searchParams,
                skills: searchParams.skills.join(',')
            }).toString();

            const response = await axios.get(`/api/v1/job/search?${queryString}`, {
                withCredentials: true,  // Include cookies in the request
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            // Check if response has the expected structure
            if (response.data && response.data.success && response.data.data) {
                onSearch(response.data.data);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Search failed:', error);
            onSearch({
                jobs: [],
                page: 1,
                totalPages: 1,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const addSkill = (e) => {
        e.preventDefault();
        if (skillInput && !searchParams.skills.includes(skillInput)) {
            setSearchParams(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSearchParams(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search jobs..."
                        className="pl-10"
                        value={searchParams.query}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                    />
                </div>

                {/* Location Input */}
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Location"
                        className="pl-10"
                        value={searchParams.location}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                    />
                </div>

                {/* Job Type Select */}
                <Select
                    value={searchParams.jobType}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, jobType: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobTypes.map(type => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Experience Level Select */}
                <Select
                    value={searchParams.experience}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, experience: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                        {experienceLevels.map(level => (
                            <SelectItem key={level} value={level.toLowerCase()}>
                                {level}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort By Select */}
                <Select
                    value={searchParams.sortBy}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, sortBy: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Skills Section */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        placeholder="Add skills..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                    />
                    <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {searchParams.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                            {skill}
                            <X
                                className="ml-2 h-4 w-4 cursor-pointer"
                                onClick={() => removeSkill(skill)}
                            />
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full md:w-auto"
                >
                    {loading ? 'Searching...' : 'Search Jobs'}
                </Button>
            </div>
        </div>
    );
};

export default JobSearch; 