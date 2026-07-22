
import {
    AlertCircle,
    Loader
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { useResendVerificationOtpMutation, useVerifyEmailMutation } from '../../store/slices/authApiSlice';

const VerifyEmail = () => {

    const [verifyEmail] = useVerifyEmailMutation();

    const [resendOtp] = useResendVerificationOtpMutation();

    const navigate = useNavigate();

    const emailRegister = localStorage.getItem("email");

    const email = emailRegister

    const [otpValues, setOtpValues] = useState(Array(6).fill(""));
    const inputRefs = useRef([]);

    const [loading, setLoading] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [timer, setTimer] = useState(0);

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        success: false
    })

    /* ---------------- OTP HANDLING ---------------- */

    const handleInputChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updated = [...otpValues];
        updated[index] = value;
        setOtpValues(updated);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyUp = (e, index) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const otp = otpValues.join("");

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(paste)) return; // only allow 6 digits

        const split = paste.split("");
        setOtpValues(split);

        // Focus the last input
        inputRefs.current[5]?.focus();
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Enter 6 digit OTP");
            return;
        }

        try {
            setLoading(true);

            const data = await verifyEmail({
                otp,
                email
            }).unwrap();

            toast.success(data.message || "Email verified");
            localStorage.removeItem("email");
            navigate("/login");

            setFormState((prev) => ({
                ...prev,
                loading: false,
                success: true,
                errors: {}
            }));

        } catch (err) {
            console.error(err);

            const message =
                Array.isArray(err?.data?.message)
                    ? err.data.message[0]
                    : err?.data?.message || "Invalid OTP";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- RESEND ---------------- */

    const handleResend = async () => {
        try {
            setLoading(true);

            const data = await resendOtp({
                email,
            }).unwrap();

            toast.success(data.message || "OTP resent");

            setOtpValues(Array(6).fill(""));
            inputRefs.current[0]?.focus();

            setIsButtonVisible(false);
            setTimer(120);
        } catch (err) {
            console.error(err);

            const message =
                Array.isArray(err?.data?.message)
                    ? err.data.message[0]
                    : err?.data?.message ||
                    (err?.status === 429
                        ? "Too many requests. Please wait before retrying."
                        : "Failed to resend OTP");

            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    };

    /* ---------------- TIMER ---------------- */

    useEffect(() => {
        if (!timer) return;

        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (timer === 0) setIsButtonVisible(true);
    }, [timer]);

    const formatTime = (s) =>
        `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">

                <h2 className="text-xl font-bold text-center mb-4">
                    Verify Email
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Enter 6 digit OTP</span>

                        {isButtonVisible ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-sm text-blue-600"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {formatTime(timer)}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-center gap-2">
                        {otpValues.map((v, i) => (
                            <input
                                ref={(el) => (inputRefs.current[i] = el)}
                                value={otpValues[i]}
                                onChange={(e) => handleInputChange(e.target.value, i)}
                                onKeyUp={(e) => handleKeyUp(e, i)}
                                onPaste={handlePaste} // <-- important
                                maxLength={1}
                                className="w-10 h-10 border rounded text-center font-bold"
                            />
                        ))}
                        {/* {otpValues.map((v, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                value={v}
                                onChange={(e) => handleInputChange(e.target.value, i)}
                                onKeyUp={(e) => handleKeyUp(e, i)}
                                className="w-10 h-10 border rounded text-center font-bold"
                                maxLength={1}
                            />
                        ))} */}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <Loader className="mx-auto animate-spin" />
                        ) : (
                            "Verify"
                        )}
                    </button>

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default VerifyEmail