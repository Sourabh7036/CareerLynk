import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useSelector } from 'react-redux';

const JobRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get('/api/v1/job/recommendations', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setRecommendations(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch recommendations');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching recommendations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                {error}
            </div>
        );
    }

    if (!recommendations.length) {
        return (
            <div className="text-center text-gray-500 py-4">
                No recommendations available. Try updating your profile with more skills!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Recommended Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((job) => (
                    <div key={job._id} className="relative">
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">
                            {job.relevanceScore}% Match
                        </div>
                        <JobCard job={job} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobRecommendations; 