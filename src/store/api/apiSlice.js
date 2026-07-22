import { BASE_URL } from "../../utils/apiPaths";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().auth.accessToken;
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401 && args.url !== "/auth/refresh") {
        // try refresh
        const refreshResult = await baseQuery(
            { url: "/auth/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            api.dispatch(
                setCredentials({
                    user: refreshResult.data.user,
                    accessToken: refreshResult.data.accessToken,
                })
            );

            // retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(clearCredentials());
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Auth",
        "Job",
        "User",
        "Analytics",
        "Applications",
        "SavedJobs"
    ],
    endpoints: () => ({}),
});
