import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        searchLocation:"",
        allAppliedJobs:[],
        searchedQuery:"",
        filters: {
            jobType: "",
            experience: "",
            salary: [0, 100],
            skills: []
        }
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setSearchLocation:(state,action) => {
            state.searchLocation = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setFilters:(state,action) => {
            state.filters = { ...state.filters, ...action.payload };
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText,
    setSearchLocation,
    setAllAppliedJobs,
    setSearchedQuery,
    setFilters
} = jobSlice.actions;

export default jobSlice.reducer;