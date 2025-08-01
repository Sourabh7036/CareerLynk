import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, MapPin, BriefcaseIcon } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery, setSearchLocation } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        dispatch(setSearchLocation(location));
        navigate("/browse");
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }

    return (
        <div className="bg-gradient-to-b from-primary/10 to-background pt-20 pb-32">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="space-y-2">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                            Over 50,000 jobs available
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Find Your Dream Job With <span className="text-primary">JobPortal</span>
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Connect with top companies and opportunities that match your skills and aspirations.
                        Your next career move starts here.
                    </p>

                    <div className="bg-background rounded-lg shadow-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="relative md:col-span-5">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    className="pl-10"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <div className="relative md:col-span-4">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Location"
                                    className="pl-10"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <Button 
                                onClick={searchJobHandler} 
                                className="md:col-span-3 h-full"
                            >
                                <BriefcaseIcon className="h-5 w-5 mr-2" />
                                Find Jobs
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center text-sm text-muted-foreground">
                            <span>Popular:</span>
                            {['Remote', 'Full-Time', 'Part-Time', 'Developer', 'Designer'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setQuery(tag);
                                        searchJobHandler();
                                    }}
                                    className="hover:text-primary transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection