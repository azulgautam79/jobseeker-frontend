export const BASE_URL = import.meta.env.VITE_API_URL

export const API_PATHS = {
    AUTH: {
        REGISTER: '/auth/register',      // Signup
        LOGIN: '/auth/login',           // Authenticate user & return JWT token
        GET_PROFILE: '/auth/profile',   // Get logged-in user details
        UPDATE_PROFILE: '/user/profile',     // Update profile details
        DELETE_RESUME: '/user/resume',       // Delete resume details
    },
    DASHBOARD: {
        OVERVIEW: '/analytics/overview',
    },
    JOBS: {
        GET_ALL_JOBS: '/jobs',
        GET_JOB_By_ID: (id) => `/jobs/${id}`,
        POST_JOB: "/jobs",
        GET_JOBS_EMPLOYER: "/jobs/get-jobs-employer",
        GET_JOB_BY_ID: (id) => `/jobs/${id}`,
        UPDATE_JOB: (id) => `/jobs/${id}`,
        TOGGLE_CLOSE: (id) => `/jobs/${id}/toggle-close`,
        DELETE_JOB: (id) => `/jobs/${id}`,

        SAVE_JOB: (id) => `/saved-jobs/${id}`,
        UNSAVE_JOB: (id) => `/saved-jobs/${id}`,
        GET_SAVED_JOBS: "/saved-jobs/my"
    },

    APPLICATIONS: {
        APPLY_TO_JOB: (id) => `/applications/${id}`,
        GET_ALL_APPLICATIONS: (id) => `/applications/job/${id}`,
        UPDATE_STATUS: (id) => `/applications/${id}/status`
    },

    IMAGE: {
        UPLOAD_IMAGE: '/auth/upload_image',     // Upload profile picture
    }
}