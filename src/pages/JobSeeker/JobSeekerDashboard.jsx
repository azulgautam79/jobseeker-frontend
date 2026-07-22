import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, Filter, Grid, List, X, LoaderCircle } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/useAuth'
import FilterContent from './components/FilterContent'
import SearchHeader from './components/SearchHeader'
import Navbar from '../../components/layout/Navbar'
import JobCard from '../../components/Cards/JobCard'
import { useSaveJobMutation, useUnSaveJobMutation } from '../../store/slices/savedJobSlice'
import { useApplyToJobMutation } from '../../store/slices/applicationSlice'
import { useGetJobsWithFiltersInfiniteQuery } from '../../store/slices/jobSlice'
import { slugify } from '../../utils/helper'

const JobSeekerDashboard = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [viewMode, setViewMode] = useState("grid")
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    // const [, setError] = useState(null);

    const [expandedSections, setExpandedSections] = useState({
        jobType: true,
        salary: true,
        categories: true,
    });

    const filters = {
        keyword: searchParams.get("keyword") ?? "",
        location: searchParams.get("location") ?? "",
        category: searchParams.get("category") ?? "",
        type: searchParams.get("type") ?? "",
        minSalary: searchParams.get("minSalary") ?? "",
        maxSalary: searchParams.get("maxSalary") ?? "",
    };

    // const page = Number(searchParams.get("page") ?? 1);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetJobsWithFiltersInfiniteQuery({
        ...filters,
        ...(user?._id && {
            userId: user._id,
        }),
    });

    const jobs = useMemo(() => {
        const map = new Map();

        data?.pages.forEach(page => {
            page.jobs.forEach(job => {
                map.set(job._id, job);
            });
        });

        return [...map.values()];
    }, [data]);

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        params.set("page", "1");

        setSearchParams(params);
    };

    const clearAllFilters = () => {
        setSearchParams({});
    };


    //! Infinite Scroll
    const observerRef = useRef(null);

    useEffect(() => {
        if (!observerRef.current) return;

        const observer =
            new IntersectionObserver(
                entries => {
                    if (
                        entries[0].isIntersecting &&
                        hasNextPage &&
                        !isFetchingNextPage
                    ) {
                        fetchNextPage();
                    }
                },
                {
                    rootMargin: "200px",
                },
            );

        observer.observe(
            observerRef.current,
        );

        return () =>
            observer.disconnect();
    }, [
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    ]);

    const [unsaveJob] = useUnSaveJobMutation();
    const [saveJob] = useSaveJobMutation();
    const [applyJob] = useApplyToJobMutation();

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    };

    const MobileFilterOverlay = () => (
        <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "" : "hidden"}`}>
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                    <button
                        className="hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setShowMobileFilters(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto h-full pb-20">
                    <FilterContent
                        toggleSection={toggleSection}
                        clearAllFilters={clearAllFilters}
                        expandedSections={expandedSections}
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                    />
                </div>
            </div>
        </div>
    );

    const toggleSaveJobs = async (
        jobId,
        isSaved,
    ) => {
        try {
            if (isSaved) {
                await unsaveJob(jobId).unwrap();

                setAllJobs(prev =>
                    prev.map(job =>
                        job._id === jobId
                            ? {
                                ...job,
                                isSaved: false,
                            }
                            : job,
                    ),
                );

                toast.success(
                    "Job removed successfully!",
                );
            } else {
                await saveJob(jobId).unwrap();

                setAllJobs(prev =>
                    prev.map(job =>
                        job._id === jobId
                            ? {
                                ...job,
                                isSaved: true,
                            }
                            : job,
                    ),
                );

                toast.success(
                    "Job saved successfully!",
                );
            }
        } catch (err) {
            toast.error(
                err?.data?.message ||
                "Something went wrong!",
            );
        }
    };

    const applyToJob = async (jobId) => {
        try {
            await applyJob({ jobId }).unwrap();
            toast.success("Applied to job successfully!");
        } catch (err) {
            toast.error(
                err?.data?.message || "Something went wrong!"
            );
        }
    };

    if (isLoading && jobs.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className='bg-linear-to-br from-blue-50 via-white to-purple-50'>
            <Navbar />

            <div className="min-h-screen mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">

                    {/* Search Header */}
                    <SearchHeader
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                    />

                    <div className="flex gap-6 lg:gap-8">
                        {/* Desktop sidebar filters */}
                        <div className="hidden lg:block w-80 shrink-0">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-20">
                                <h3 className="font-bold text-gray-900 text-xl mb-6">
                                    Filter Jobs
                                </h3>
                                <FilterContent
                                    toggleSection={toggleSection}
                                    clearAllFilters={clearAllFilters}
                                    expandedSections={expandedSections}
                                    filters={filters}
                                    handleFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Results Header */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
                                <div>
                                    <p className="text-gray-600 text-sm lg:text-base">
                                        Showing{" "}
                                        <span className="font-bold text-gray-900">
                                            {jobs.length}
                                        </span>{" "}
                                        jobs
                                    </p>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-4">
                                    {/* Mobile Filter Button */}
                                    <button
                                        className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowMobileFilters(true)}
                                    >
                                        <Filter className='w-4 h-4' />
                                        Filters
                                    </button>

                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                                                onClick={() => setViewMode("grid")}
                                            >
                                                <Grid className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                                                onClick={() => setViewMode("list")}
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Job Grid */}
                            {jobs.length === 0 ? (
                                <div className="text-center py-16 lg:py-20 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20">
                                    <div className="text-gray-400 mb-0">
                                        <Search className='w-16 h-16 mx-auto' />
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                                        No jobs found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your search criteria or filters.
                                    </p>
                                    <button
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                        onClick={clearAllFilters}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={
                                            viewMode === "grid"
                                                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                                                : "space-y-4 lg:space-y-6"
                                        }
                                    >
                                        {jobs.map((job) => (
                                            <JobCard
                                                key={job._id}
                                                job={job}
                                                onClick={() => navigate(`/job/${slugify(job.title)}/${job._id}`)}
                                                onToggleSave={() => toggleSaveJobs(job?._id, job?.isSaved)}
                                                onApply={() => applyToJob(job._id)}
                                            />
                                        ))}
                                    </div>
                                    <div
                                        ref={observerRef}
                                        className="h-32 flex items-center justify-center"
                                    >
                                        {isFetchingNextPage && (
                                            <LoaderCircle className="w-5 h-5 animate-spin text-blue-600" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* MObile Filter Overlay */}
                <MobileFilterOverlay />
            </div>
        </div>
    )
}
export default JobSeekerDashboard