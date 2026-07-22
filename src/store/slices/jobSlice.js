import { apiSlice } from "../api/apiSlice";

export const jobSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 👥 Get all jobs
        getAllJobs: builder.query({
            query: () => "/jobs",
            providesTags: (result = []) => [
                "Job",
                ...result.map(({ id }) => ({ type: "Job", id })),
            ],
        }),

        // 👥 Get all jobs
        // getJobsWithFilters: builder.query({
        //     query: (filters) => ({
        //         url: "/jobs",
        //         params: filters,
        //     }),
        //     providesTags: ["Job"],
        // }),

        getJobsWithFilters: builder.infiniteQuery({
            infiniteQueryOptions: {
                initialPageParam: 1,

                getNextPageParam: (
                    lastPage,
                    allPages,
                    lastPageParam
                ) =>
                    lastPage.pagination.hasNextPage
                        ? lastPageParam + 1
                        : undefined,
            },

            query({ pageParam, queryArg }) {
                return {
                    url: "/jobs",
                    params: {
                        ...queryArg,
                        page: pageParam,
                        limit: 10,
                    },
                };
            },

            providesTags: ["Job"],
        }),

        // 👤 Get job by ID
        // getJobById: builder.query(
        //     {
        //         query: (id) => `/jobs/${id}`,
        //         providesTags: ["Job"]
        //     }),

        getJobById: builder.query({
            query: ({ jobId, userId }) => ({
                url: `/jobs/${jobId}`,
                params: { userId }, // will generate ?userId=xyz
            }),
            providesTags: ["Job"],
        }),

        getJobsEmployer: builder.query({
            query: () => "/jobs/get-jobs-employer",
            providesTags: ["Job"]
        }),

        createJob: builder.mutation({
            query: (data) => ({
                url: "/jobs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Job", "Analytics"],
        }),

        // ✏️ Update job
        updateJob: builder.mutation({
            query: ({ id, data }) => {
                // console.log("Updating job...");
                // console.log("ID:", id);
                // console.log("Data:", data);

                return {
                    url: `/jobs/${id}`,
                    method: "PATCH",
                    body: data,
                }
            },
            invalidatesTags: ["Job", "Analytics"],
        }),

        // ✏️ Update job
        closeJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}/toggle-close`,
                method: "PATCH",
            }),
            invalidatesTags: ["Job", "Analytics"],
        }),

        // 🗑 Delete Job
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Job", "Analytics"],
        }),
    })
})

export const {
    useGetAllJobsQuery,
    useGetJobsWithFiltersInfiniteQuery,
    useGetJobByIdQuery,
    useGetJobsEmployerQuery,
    useCreateJobMutation,
    useDeleteJobMutation,
    useUpdateJobMutation,
    useCloseJobMutation
} = jobSlice;

// console.log(
//     jobSlice.endpoints
// );