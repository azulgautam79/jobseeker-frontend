import { Bookmark, Building, Building2, Calendar, MapPin, Star } from "lucide-react"
import moment from 'moment'
import { useAuth } from "../../context/useAuth"
import StatusBadge from "../StatusBadge"

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {

    const { user } = useAuth();

    const formatSalary = (min) => {
        const formatNumber = (num) => {
            if (num >= 1000) return `₹${(num / 1000).toFixed(0)}k`;
            return `₹${num}`
        };
        return `${formatNumber(min)}/m`
    };

    return (
        <div
            className={`bg-white rounded-2xl p-6 transition-all duration-300
    ${job.isRecommended
                    ? "border-2 border-blue-500"
                    : "border border-gray-200"
                }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    {job?.company?.companyLogo ? (
                        <img
                            src={job?.company?.companyLogo}
                            alt="Company Logo"
                            className="w-14 h-14 object-cover rounded-2xl border-4 border-white/20 shadow-lg"
                        />
                    ) : (
                        <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                    )}

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                            {job?.title}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                            <Building className="w-3.5 h-3.5" />
                            {job?.company?.companyName}
                        </p>
                        {job?.isRecommended && (
                            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold leading-none text-blue-700">
                                <Star className="h-3.5 w-3.5 shrink-0 fill-current" />
                                <span className="leading-none">
                                    {Math.round(job.recommendationScore * 100)}% Match
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {user &&
                    (
                        <button
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSave();
                            }}
                        >
                            {/* <Bookmark className={`w-5 h-5 hover:text-blue-600 ${job?.isSaved || saved ? "text-blue-600" : "text-gray-400"}`} /> */}

                            {job?.isSaved || saved ? (
                                // Filled Bookmark
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`w-5 h-5 transition-all duration-200 ${job?.isSaved || saved
                                            ? "text-blue-600 scale-110"
                                            : "text-gray-400 hover:text-blue-600"
                                        }`}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    />
                                </svg>
                            ) : (
                                // Outline Bookmark
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-all duration-200"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                    />
                                </svg>
                            )}


                        </button>
                    )}
            </div>

            <div className="mb-5">
                <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {job?.location}
                    </span>
                    <span
                        className={`px-3 py-1 rounded-full font-medium ${job?.type === "Full-Time" ? "bg-green-100 text-green-800"
                            : job?.type === "Part-Time"
                                ? "bg-yellow-100 text-yellow-800"
                                : job?.type === "Contract"
                                    ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}

                    >
                        {job?.type}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        {job?.category}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {job?.createdAt
                            ? moment(job.createdAt).format("Do MMM YYYY")
                            : "N/A"
                        }
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-blue-600 font-semibold text-lg">
                    {formatSalary(job?.salaryMin, job?.salaryMax)}
                </div>
                {!saved && (
                    <>
                        {job?.applicationStatus ? (
                            <StatusBadge status={job?.applicationStatus} />
                        ) : (
                            !hideApply && (
                                <button
                                    className="bg-linear-to-r from-blue-50 to-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onApply();
                                    }}
                                >
                                    Apply Now
                                </button>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
export default JobCard