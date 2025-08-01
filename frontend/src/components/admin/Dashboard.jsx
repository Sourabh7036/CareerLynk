import React from 'react';
import Navbar from '../shared/Navbar';
import { Card } from '../ui/card';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, Building2, FileCheck } from 'lucide-react';

const Dashboard = () => {
    const { allAdminJobs = [] } = useSelector(store => store.job);
    const { companies = [] } = useSelector(store => store.company);
    const { applications = [] } = useSelector(store => store.application);

    // Calculate statistics with null checks
    const totalJobs = allAdminJobs?.length || 0;
    const totalCompanies = companies?.length || 0;
    const totalApplications = applications?.length || 0;
    const acceptedApplications = applications?.filter(app => app?.status?.toLowerCase() === 'accepted')?.length || 0;

    // Prepare data for charts with null checks
    const jobsByCompany = allAdminJobs.reduce((acc, job) => {
        const companyName = job?.company?.name || 'Unknown';
        acc[companyName] = (acc[companyName] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(jobsByCompany).map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        jobs: count
    }));

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-100 rounded-lg">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Jobs</p>
                                <h3 className="text-2xl font-bold">{totalJobs}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-green-100 rounded-lg">
                                <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Companies</p>
                                <h3 className="text-2xl font-bold">{totalCompanies}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-100 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Applications</p>
                                <h3 className="text-2xl font-bold">{totalApplications}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-yellow-100 rounded-lg">
                                <FileCheck className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Accepted</p>
                                <h3 className="text-2xl font-bold">{acceptedApplications}</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Jobs by Company Chart */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Jobs by Company</h2>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="jobs" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard; 