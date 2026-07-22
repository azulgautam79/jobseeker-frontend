import { apiSlice } from "../api/apiSlice";


export const applicationSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Get all applications
        getApplications: builder.query({
            query: () => "/applications",
            providesTags: (result = []) => [
                "Applications",
                ...result.map(({ id }) => ({ type: "Applications", id })),
            ],
        }),

        // 👤 Get application by ID
        getApplicationById: builder.query({
            query: (id) => `/applications/${id}`,
            providesTags: (result = []) => [
                "Applications",
                ...result.map(({ id }) => ({ type: "Applications", id })),
            ],
        }),

        // 👤 Get applicants for a job
        getApplicationByJobId: builder.query({
            query: (jobId) => `/applications/job/${jobId}`,
            providesTags: ["Applications"],
        }),

        // 👤 Get applications of a user
        getUserApplications: builder.query({
            query: () => `/applications/me`,
            providesTags: (result = []) => [
                "Applications",
                ...result.map(({ id }) => ({ type: "Applications", id })),
            ],
        }),

        applyToJob: builder.mutation({
            query: ({ jobId }) => ({
                url: `/applications/${jobId}`,
                method: "POST",
            }),
            invalidatesTags: ["Job", "Analytics", "Applications"],
        }),

        // ✏️ Update application status
        updateApplicationStatus: builder.mutation({
            query: ({ id, status  }) => ({
                url: `/applications/${id}/status`,
                method: "PATCH",
                body: { status  },
            }),
            invalidatesTags: ["Applications", "Analytics"],
        }),


    })
})

export const {
    useGetApplicationsQuery,
    useGetApplicationByIdQuery,
    useGetApplicationByJobIdQuery,
    useGetUserApplicationsQuery,
    useApplyToJobMutation,
    useUpdateApplicationStatusMutation
} = applicationSlice;