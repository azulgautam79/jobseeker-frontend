import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard';
import JobDetails from './pages/JobSeeker/JobDetails';
import SavedJobs from './pages/JobSeeker/SavedJobs';
import UserProfile from './pages/JobSeeker/UserProfile';
import ProtectedRoute from './routes/ProtectedRoute';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ManageJobs from './pages/Employer/ManageJobs';
import EmployeeProfilePage from './pages/Employer/EmployeeProfilePage';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import LandingPage from './pages/LandingPage/LandingPage';
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRedux from "./routes/ProtectedRedux";

const AppRoutes = () => {
    const loadingBarRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        loadingBarRef.current?.continuousStart();
        loadingBarRef.current?.complete();
    }, [location]);

    return (
        <>
            <LoadingBar
                color="#155af8"
                height={3}
                ref={loadingBarRef}
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify_email" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/verify_otp" element={<VerifyOtp />} />
                <Route path="/reset_password" element={<ResetPassword />} />

                <Route path="/find-jobs" element={<JobSeekerDashboard />} />
                <Route path="/job/:slug/:jobId" element={<JobDetails />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/profile" element={<UserProfile />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRedux requiredRole="EMPLOYER" />}>
                    <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                    <Route path="/post-job" element={<JobPostingForm />} />
                    <Route path="/manage-jobs" element={<ManageJobs />} />
                    <Route path="/applicants" element={<ApplicationViewer />} />
                    <Route path="/company-profile" element={<EmployeeProfilePage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
