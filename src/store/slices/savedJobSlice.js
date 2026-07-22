import { apiSlice } from "../api/apiSlice";


export const savedJobsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 👥 Get all user saved jobs
        getUserSavedJobs: builder.query({
            query: () => "/saved-jobs/my",
            providesTags: ["SavedJobs"],
        }),

        //Save a job
        saveJob: builder.mutation({
            query: (jobId) => ({
                url: `/saved-jobs/${jobId}`,
                method: "POST",
            }),
            invalidatesTags: ["SavedJobs", "Job"],
        }),

        // Unsave a job
        unSaveJob: builder.mutation({
            query: (jobId) => ({
                url: `/saved-jobs/${jobId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavedJobs", "Job"],
        }),

    })
})

export const {
    useGetUserSavedJobsQuery,
    useSaveJobMutation,
    useUnSaveJobMutation
} = savedJobsSlice;