import React from 'react';
import { Card } from './ui/card';
import { Users, Briefcase, Building2, Award } from 'lucide-react';

const stats = [
    {
        icon: Users,
        number: "100K+",
        label: "Active Users",
        description: "Job seekers trust us"
    },
    {
        icon: Briefcase,
        number: "50K+",
        label: "Jobs Posted",
        description: "New opportunities daily"
    },
    {
        icon: Building2,
        number: "10K+",
        label: "Companies",
        description: "Top employers hiring"
    },
    {
        icon: Award,
        number: "95%",
        label: "Success Rate",
        description: "Placement success"
    }
];

const Stats = () => {
    return (
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join our growing community of job seekers and employers
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-primary">{stat.number}</h3>
                                    <p className="font-semibold">{stat.label}</p>
                                    <p className="text-sm text-gray-600">{stat.description}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Stats; 