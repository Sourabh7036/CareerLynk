import React from 'react';
import { Card } from './ui/card';
import { Search, Building2, FileCheck, TrendingUp, Users, Shield } from 'lucide-react';

const features = [
    {
        icon: Search,
        title: "Smart Job Search",
        description: "Advanced search algorithms to help you find the perfect job match based on your skills and preferences."
    },
    {
        icon: Building2,
        title: "Top Companies",
        description: "Connect with leading companies across various industries looking for talent like you."
    },
    {
        icon: FileCheck,
        title: "Easy Apply",
        description: "One-click application process with resume parsing and profile matching technology."
    },
    {
        icon: TrendingUp,
        title: "Career Growth",
        description: "Access career development resources, salary insights, and industry trends."
    },
    {
        icon: Users,
        title: "Professional Network",
        description: "Build your professional network and connect with industry experts."
    },
    {
        icon: Shield,
        title: "Verified Jobs",
        description: "All job postings are verified to ensure legitimacy and protect job seekers."
    }
];

const Features = () => {
    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose JobPortal</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the features that make us the leading platform for job seekers and employers
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600">{feature.description}</p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Features; 