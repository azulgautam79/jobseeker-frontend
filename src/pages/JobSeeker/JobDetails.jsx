import {
    MapPin,
    DollarSign,
    Building2,
    Clock,
    Users,
    ArrowLeft
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import moment from 'moment'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'
import { useGetJobByIdQuery } from '../../store/slices/jobSlice'
import { useApplyToJobMutation } from '../../store/slices/applicationSlice'
import { useEffect } from 'react'
import { Helmet } from "react-helmet-async";
import { slugify } from '../../utils/helper'

const JobDetails = () => {

    const { slug, jobId } = useParams();

    const { user } = useAuth();

    const navigate = useNavigate();

    const { data: jobDetails, refetch } = useGetJobByIdQuery(
        { jobId, userId: user?._id || "" },
        { skip: !jobId }
    );

    useEffect(() => {
        if (jobDetails?.title) {
            document.title = `${jobDetails.title} | JobSeeker`;
        }

        return () => {
            document.title = "JobSeeker";
        };
    }, [jobDetails]);

    useEffect(() => {
        if (!jobDetails) return;

        const correctSlug = slugify(jobDetails?.title);

        if (slug !== correctSlug) {
            navigate(
                `/job/${correctSlug}/${jobDetails._id}`,
                { replace: true }
            );
        }
    }, [jobDetails, slug, navigate]);

    const [applyJob] = useApplyToJobMutation()

    const applyToJob = async () => {
        if (!jobId) return

        try {
            await applyJob({
                jobId,
            }).unwrap();
            refetch();
            toast.success("Applied to job successfully!")
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong! Try again later")
        }
    }

    <Helmet>
        <title>{jobDetails?.title} | JobSeeker</title>

        <meta
            name="description"
            content={jobDetails?.description?.slice(0, 160)}
        />

        <meta
            property="og:title"
            content={jobDetails?.title}
        />

        <meta
            property="og:description"
            content={jobDetails?.description?.slice(0, 200)}
        />

        <meta
            property="og:image"
            content={jobDetails?.company?.companyLogo}
        />

        <meta
            property="og:type"
            content="website"
        />

        <meta
            property="og:url"
            content={`https://jobseeker.lemongautam.com.np/jobs/${jobId}`}
        />
    </Helmet>

    return (
        <div className="bg-linear-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="container mx-auto pt-24">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <button
                            className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl "
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                {/* Main Content card */}
                {jobDetails && (
                    <div className="bg-white p-6 rounded-lg">
                        {/* Hero section with cleanb ackground */}
                        <div className="relative px-0 pb-8 border-b border-gray-100">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    {jobDetails?.company?.companyLogo ? (
                                        <img
                                            src={jobDetails?.company?.companyLogo}
                                            alt="Company Logo"
                                            className="h-20 w-20 object-cover rounded-2xl border-4 border-white/20 shadow-lg"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                                            <Building2 className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <h1 className="text-lg lg:text-xl font-semibold mb-2 leading-tight text-gray-900">
                                            {jobDetails?.title}
                                        </h1>

                                        <div className="flex items-center space-x-4 text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className='h-4 w-4' />
                                                <span className="text-sm font-medium">
                                                    {jobDetails.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {jobDetails?.applicationStatus ? (
                                        <StatusBadge status={jobDetails?.applicationStatus} />
                                    ) : (
                                        <button
                                            className="bg-linear-to-r from-blue-50 to-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
                                            onClick={applyToJob}
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-2 bg-blue-50 text-sm text-blue-700 font-semibold rounded-full border borde-rblue-200">
                                        {jobDetails?.category}
                                    </span>
                                    <span className="px-4 py-2 text-sm bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-200">
                                        {jobDetails?.type}
                                    </span>
                                    <div className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {jobDetails?.createdAt ? moment(jobDetails.createdAt).format("Do MMM YYYY") : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-0 pb-8 space-y-8">
                            {/* Salary section */}
                            <div className="relative overflow-hidden bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-16 translate-x-10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl">
                                                <DollarSign className='h-6 w-6 text-white' />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                                    Compensation
                                                </h3>
                                                <div className="text-lg font-bold text-gray-900">
                                                    {jobDetails?.salaryMin} - {jobDetails?.salaryMax}
                                                    <span className="text-lg text-gray-600 font-normal ml-1">
                                                        per year
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                            <Users className="h-4 w-4" />
                                            <span>Competitive</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements (Skills + Experience) */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-600 rounded-full"></div>
                                    <span className="text-lg">What We're Looking For</span>
                                </h3>

                                <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 space-y-4">

                                    {/* Experience */}
                                    <div className="text-gray-800">
                                        <span className="font-semibold">Experience Required:</span>{" "}
                                        <span className="text-purple-700 font-medium">
                                            {jobDetails?.experienceRequired}+ years
                                        </span>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <p className="font-semibold text-gray-800 mb-3">Required Skills:</p>

                                        <div className="flex flex-wrap gap-2">
                                            {jobDetails?.skills?.length > 0 ? (
                                                jobDetails?.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 border border-purple-200"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No skills specified</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* JOb Description */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                                    <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                    <span className="text-lg">About This Role</span>
                                </h3>
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {jobDetails?.description}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}
export default JobDetails