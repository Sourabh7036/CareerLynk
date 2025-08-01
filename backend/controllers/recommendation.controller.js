import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";

export const getJobRecommendations = async (req, res) => {
    try {
        const userId = req.id;
        console.log('Getting recommendations for user:', userId);

        // Get user profile with skills
        const user = await User.findById(userId);
        if (!user || !user.profile) {
            console.log('User profile not found for ID:', userId);
            return res.status(400).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Get user's skills and create a query
        const userSkills = user.profile.skills || [];
        console.log('User skills:', userSkills);
        
        // Get user's previous applications
        const previousApplications = await Application.find({ applicant: userId })
            .select('job')
            .populate({
                path: 'job',
                select: 'requirements location jobType experienceLevel'
            });

        console.log('Previous applications count:', previousApplications.length);

        // Extract preferences from previous applications
        const preferredLocations = new Set();
        const preferredJobTypes = new Set();
        const preferredExperienceLevels = new Set();

        previousApplications.forEach(app => {
            if (app.job) {
                preferredLocations.add(app.job.location);
                preferredJobTypes.add(app.job.jobType);
                preferredExperienceLevels.add(app.job.experienceLevel);
            }
        });

        console.log('Extracted preferences:', {
            locations: Array.from(preferredLocations),
            jobTypes: Array.from(preferredJobTypes),
            experienceLevels: Array.from(preferredExperienceLevels)
        });

        // Build recommendation query
        const recommendationQuery = {
            $or: [
                // Skills match
                { requirements: { $in: userSkills } },
                // Location preference
                { location: { $in: Array.from(preferredLocations) } },
                // Job type preference
                { jobType: { $in: Array.from(preferredJobTypes) } },
                // Experience level range
                { 
                    experienceLevel: { 
                        $in: Array.from(preferredExperienceLevels),
                        $gte: Math.max(0, Math.min(...Array.from(preferredExperienceLevels)) - 1),
                        $lte: Math.max(...Array.from(preferredExperienceLevels)) + 1
                    } 
                }
            ],
            // Exclude jobs user has already applied to
            _id: { 
                $nin: previousApplications.map(app => app.job?._id).filter(Boolean)
            }
        };

        console.log('Recommendation query:', JSON.stringify(recommendationQuery, null, 2));

        // Get recommendations with scoring
        const recommendations = await Job.find(recommendationQuery)
            .populate('company')
            .limit(10)
            .lean();

        console.log('Found recommendations count:', recommendations.length);

        // Calculate relevance score for each job
        const scoredRecommendations = recommendations.map(job => {
            let score = 0;
            
            // Skills match score (0-5)
            const matchingSkills = job.requirements.filter(skill => 
                userSkills.some(userSkill => 
                    userSkill.toLowerCase() === skill.toLowerCase()
                )
            );
            score += (matchingSkills.length / Math.max(job.requirements.length, 1)) * 5;

            // Location match score (0-3)
            if (preferredLocations.has(job.location)) {
                score += 3;
            }

            // Job type match score (0-2)
            if (preferredJobTypes.has(job.jobType)) {
                score += 2;
            }

            // Experience level match score (0-2)
            if (preferredExperienceLevels.has(job.experienceLevel)) {
                score += 2;
            }

            return {
                ...job,
                relevanceScore: Math.round(score * 10) / 10
            };
        });

        // Sort by relevance score
        scoredRecommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

        console.log('Final recommendations with scores:', 
            scoredRecommendations.map(r => ({
                id: r._id,
                title: r.title,
                score: r.relevanceScore
            }))
        );

        return res.status(200).json({
            success: true,
            data: scoredRecommendations
        });

    } catch (error) {
        console.error('Error getting job recommendations:', error);
        return res.status(500).json({
            success: false,
            message: "Error getting job recommendations",
            error: error.message
        });
    }
}; 