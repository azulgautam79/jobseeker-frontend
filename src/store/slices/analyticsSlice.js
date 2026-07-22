import { apiSlice } from "../api/apiSlice";

export const analyticsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 👥 Get all jobs
        getAnalytics: builder.query({
            query: () => "/analytics/overview",
            // providesTags: (result = []) => [
            //     "Analytics",
            //     ...result?.map(({ id }) => ({ type: "Analytics", id })),
            // ],
            providesTags: ['Analytics']
        }),
    })
})

export const {
    useGetAnalyticsQuery,
} = analyticsSlice;