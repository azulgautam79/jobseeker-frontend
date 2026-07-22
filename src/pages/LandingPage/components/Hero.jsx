import { motion } from "framer-motion"
import { Search, ArrowRight, Users, Building2, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Hero = () => {

    const MotionDiv = motion.div
    const MotionH1 = motion.h1
    const MotionP = motion.p
    const MotionButton = motion.button

    const isAuthenticated = true;
    const user = { fullName: "Lemon", role: "EMPLOYER" }

    const navigate = useNavigate();

    const stats = [
        { icon: Users, label: "Active Users", value: "2.4M+" },
        { icon: Building2, label: "Companies", value: "50K+" },
        { icon: TrendingUp, label: "Jobs Posted", value: "150K+" },
    ]

    return (
        <section className="pt-24 pb-16 bg-white min-h-screen flex items-center">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <MotionH1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-0 leading-tight pt-10"
                    >
                        Find Your Dream Job or
                        <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                            Perfect Hire
                        </span>
                    </MotionH1>

                    {/* Sub Heading */}
                    <MotionP
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Connect talented professionals with innovative companies.
                        Your next career move or perfect candidate is just one click away.
                    </MotionP>

                    {/* CTA Buttons */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                    >
                        <MotionButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            onClick={() => navigate("/find-jobs")}
                        >
                            <Search className="w-5 h-5" />
                            <span className="">Find Jobs</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </MotionButton>

                        <MotionButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                            onClick={() => {
                                navigate(
                                    isAuthenticated && user?.role === "EMPLOYER"
                                        ? "/employer-dashboard" : "/login"
                                )
                            }}
                        >
                            Post a Job
                        </MotionButton>
                    </MotionDiv>

                    {/* Stats */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
                    >
                        {stats?.map((stat, index) => (
                            <MotionDiv
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                                className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-linear-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-2">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </MotionDiv>
                        ))}
                    </MotionDiv>
                </div>
            </div>

            {/* Subtiel background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30" />
                <div className="absolute top-1/2 left-1/2 trasform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-20 " />
            </div>

        </section>
    )
}
export default Hero