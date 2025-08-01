import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Pagination } from './ui/pagination';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    const { searchedQuery, searchLocation, filters } = useSelector(state => state.job);
    const user = useSelector(state => state.auth.user);

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const defaultFilters = {
                jobType: "",
                experience: "",
                salary: [0, 100],
                skills: []
            };

            const currentFilters = filters || defaultFilters;

            const queryParams = new URLSearchParams({
                page,
                keyword: searchedQuery || '',
                location: searchLocation || '',
                jobType: currentFilters.jobType || '',
                experience: currentFilters.experience || '',
                minSalary: currentFilters.salary?.[0] ?? 0,
                maxSalary: currentFilters.salary?.[1] ?? 100,
                skills: currentFilters.skills?.join(',') || ''
            });

            const response = await axios.get(`${JOB_API_END_POINT}/get?${queryParams}`, {
                withCredentials: true
            });

            console.log('API Response:', response.data);

            if (response.data.success) {
                console.log('Setting jobs:', response.data.jobs);
                console.log('Jobs length:', response.data.jobs?.length);
                setJobs(response.data.jobs || []);
                setPagination({
                    currentPage: page || 1,
                    totalPages: Math.ceil((response.data.jobs?.length || 0) / 10) || 1,
                    total: response.data.jobs?.length || 0
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1); // Reset to first page when filters change
    }, [searchedQuery, searchLocation, filters]);

    const handlePageChange = (page) => {
        fetchJobs(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="md:w-1/4">
                        <JobFilters />
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {loading ? 'Loading...' : `${pagination.total} Jobs Found`}
                            </h2>
                            {searchedQuery && (
                                <p className="text-gray-600 mt-2">
                                    Search results for "{searchedQuery}"
                                    {searchLocation && ` in ${searchLocation}`}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-500 mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6">
                                    {jobs.map((job) => (
                                        <JobCard key={job._id} job={job} />
                                    ))}
                                </div>

                                {jobs.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        No jobs found. Try adjusting your search criteria.
                                    </div>
                                )}

                                {pagination.totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <Pagination
                                            currentPage={pagination.currentPage}
                                            totalPages={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;