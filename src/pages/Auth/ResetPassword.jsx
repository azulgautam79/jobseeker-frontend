import { AlertCircle, Eye, EyeOff, Loader, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/slices/authApiSlice";
import { validatePassword } from "../../utils/helper";
import toast from 'react-hot-toast'

const ResetPassword = () => {

    const emailRegister = localStorage.getItem("email");
    const otpRegister = localStorage.getItem('otp')

    const navigate = useNavigate();

    const email = emailRegister
    const otp = otpRegister

    const [resetPassword] = useResetPasswordMutation();

    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        otp: ''
    });

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        showPassword: false,
        success: false
    });

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
            newPassword: validatePassword(formData.newPassword)
        };

        // Remove empty errors
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        setFormState(prev => ({ ...prev, errors }))
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormState(prev => ({ ...prev, loading: true }))
        console.log(formData)

        try {
            //! RTK Query
            const data = await resetPassword({
                email: email,
                newPassword: formData.newPassword,
                otp: otp,
            }).unwrap();

            toast.success(data.message || "Email verified");
            localStorage.removeItem("email");
            localStorage.removeItem("otp");
            navigate("/login");

            // Handle successful registration
            setFormState((prev) => ({
                ...prev,
                loading: false,
                success: true,
                errors: {}
            }));

        } catch (err) {
            const message =
                err?.data?.message ||
                err?.error ||
                "Login failed. Please check your credentials";

            setFormState(prev => ({
                ...prev,
                loading: false,
                errors: { submit: message },
            }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">
                        Enter new password for your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type={formState.showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${formState.errors.newPassword ? "border-red-500" : "border-gray-300"
                                    } focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter your new password"
                            />

                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        showPassword: !prev.showPassword,
                                    }))
                                }
                            >
                                {formState.showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Password Error */}
                        {formState.errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {formState.errors.newPassword}
                            </p>
                        )}

                        {/* Submit Error */}
                        {formState.errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                                <p className="text-red-700 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {formState.errors.submit}
                                </p>
                            </div>
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
                            Already have an account?{" "}
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
export default ResetPassword