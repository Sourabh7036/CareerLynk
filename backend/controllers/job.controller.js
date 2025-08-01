import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const searchJobs = async (req, res) => {
    try {
        const {
            query,
            location,
            jobType,
            experience,
            minSalary,
            maxSalary,
            skills,
            page = 1,
            limit = 10
        } = req.query;

        const searchQuery = {};

        // Text search across title and description
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Location filter
        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' };
        }

        // Experience level filter
        if (experience) {
            searchQuery.experienceLevel = experience;
        }

        // Job type filter
        if (jobType) {
            searchQuery.jobType = jobType;
        }

        // Salary range filter
        if (minSalary || maxSalary) {
            searchQuery.salary = {};
            if (minSalary) searchQuery.salary.$gte = Number(minSalary);
            if (maxSalary) searchQuery.salary.$lte = Number(maxSalary);
        }

        // Skills filter
        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            if (skillsArray.length > 0) {
                searchQuery.requirements = {
                    $in: skillsArray.map(skill => new RegExp(skill, 'i'))
                };
            }
        }

        // Pagination
        const skip = (page - 1) * limit;

        // First get the populated jobs
        const jobs = await Job.find(searchQuery)
            .populate('company')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        // Then filter by company name if query exists
        const filteredJobs = query
            ? jobs.filter(job => 
                job.company && 
                job.company.name && 
                job.company.name.toLowerCase().includes(query.toLowerCase())
              )
            : jobs;

        // Get total count for pagination
        const total = await Job.countDocuments(searchQuery);

        return res.status(200).json({
            success: true,
            jobs: filteredJobs,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching jobs',
            error: error.message
        });
    }
};
