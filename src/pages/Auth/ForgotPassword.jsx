import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper";
import { useForgotPasswordMutation } from "../../store/slices/authApiSlice";
import { Loader, Mail } from "lucide-react";
import toast from 'react-hot-toast'

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [forgotPassword] = useForgotPasswordMutation();

    const [formData, setFormData] = useState({
        email: '',
    });

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        success: false
    })

    // Handle Input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formState.errors[name]) {
            setFormState(prev => ({
                ...prev,
                errors: { ...prev.errors, [name]: '' }
            }))
        }
    }

    const validateForm = () => {
        const errors = {
            email: validateEmail(formData.email),
        };

        // Remove empty errors
        Object.keys(errors).forEach((key) => {
            if (!errors[key]) delete errors[key];
        });

        setFormState((prev) => ({ ...prev, errors }))
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormState((prev) => ({ ...prev, loading: true }))

        try {
            //! RTK Query
            const data = await forgotPassword({ email: formData.email }).unwrap();
            toast.success(data.message || "Check your email for password reset OTP");
            localStorage.setItem('email', formData.email)
            navigate('/verify_otp')
            // Handle successful registration
            setFormState((prev) => ({
                ...prev,
                loading: false,
                success: true,
                errors: {}
            }));

        } catch (err) {
            console.error("Forgot password error:", err);

            // Handle array or string errors from backend
            const message =
                Array.isArray(err?.data?.message)
                    ? err.data.message[0]
                    : err?.data?.message || "Request failed. Please try again.";

            setFormState((prev) => ({
                ...prev,
                loading: false,
                errors: { submit: message },
            }));

            toast.error(message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                    <p className="text-gray-600">Enter your email to receive Otp</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {formState.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        type="submit"
                        disabled={formState.loading}
                    >
                        {formState.loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span className="">Signing In...</span>
                            </>
                        ) : (
                            <span>Submit</span>
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-600">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    )
}
export default ForgotPassword