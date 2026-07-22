import { useEffect, useState } from "react"
import { Save, X, Trash2 } from 'lucide-react'
import { useAuth } from "../../context/useAuth"
import toast from "react-hot-toast"
import Navbar from "../../components/layout/Navbar"
import { Link } from "react-router-dom"
import { useDeleteResumeMutation, useUpdateProfileMutation } from "../../store/slices/userSlice"
import { useFileUpload } from "../../utils/imageUpload"
import SelectField from "../../components/Input/SelectField"
import MultiSelectField from '../../components/Input/MultiSelectField'
import { CATEGORIES, SKILLS } from "../../utils/data"
import { ALLOWED_RESUME_TYPES, MAX_RESUME_SIZE } from "../../utils/helper"

const UserProfile = () => {

    const DEFAULT_AVATAR = "/avatar-placeholder.png"

    const { user, updateUser } = useAuth();

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        preferredCategory: user?.preferredCategory || "",
        preferredLocation: user?.preferredLocation || "",
        experience: user?.experience || "",
        skills: user?.skills || [],

        avatar: user?.avatar || null,
        avatarPublicId: user?.avatarPublicId || null,

        resume: user?.resume || null,
        resumePublicId: user?.resumePublicId || "",
    });

    const [formData, setFormData] = useState(profileData);
    const [uploading, setUploading] = useState({ avatar: false, resume: false })
    const [saving, setSaving] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const { uploadFile } = useFileUpload();

    //! Avatar Upload
    const handleAvatarUpload = async (file) => {
        setUploading((prev) => ({
            ...prev,
            avatar: true,
        }));

        try {
            const res = await uploadFile("avatar", file);

            setFormData((prev) => ({
                ...prev,
                avatar: res.url,
                avatarPublicId: res.publicId,
            }));

            toast.success("Avatar uploaded successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Avatar upload failed");
            throw error;
        } finally {
            setUploading((prev) => ({
                ...prev,
                avatar: false,
            }));
        }
    };

    //! Avatar Change
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed");
            e.target.value = "";
            return;
        }

        const oldAvatar = formData.avatar;
        const preview = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            avatar: preview,
        }));

        try {
            await handleAvatarUpload(file);
        } catch {
            setFormData((prev) => ({
                ...prev,
                avatar: oldAvatar,
            }));
        } finally {
            URL.revokeObjectURL(preview);
            e.target.value = "";
        }
    };

    //! Resume Upload
    const handleResumeUpload = async (file) => {
        setUploading((prev) => ({
            ...prev,
            resume: true,
        }));

        try {
            const res = await uploadFile("resume", file);

            setFormData((prev) => ({
                ...prev,
                resume: res.url,
                resumePublicId: res.publicId,
            }));

            toast.success("Resume uploaded successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Resume upload failed");
            throw error;
        } finally {
            setUploading((prev) => ({
                ...prev,
                resume: false,
            }));
        }
    };

    //! Resume Change
    const handleResumeChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
            toast.error(
                "Only PDF, DOC and DOCX files are allowed"
            );

            e.target.value = "";
            return;
        }

        if (file.size > MAX_RESUME_SIZE) {
            toast.error(
                "File size must be less than 5MB"
            );

            e.target.value = "";
            return;
        }

        try {
            await handleResumeUpload(file);
        } finally {
            e.target.value = "";
        }
    };

    //! Handle Resume Drop
    const handleResumeDrop = async (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0];

        if (!file) return;

        await handleResumeUpload(file);
    };

    //! Handle Delete Resume
    const [deleteResume] = useDeleteResumeMutation()
    const handleDeleteResume = async () => {
        try {
            await deleteResume().unwrap();

            toast.success("Resume deleted successfully");

            setProfileData(prev => ({
                ...prev,
                resume: "",
                resumePublicId: "",
            }));

            setFormData(prev => ({
                ...prev,
                resume: "",
                resumePublicId: "",
            }));
        } catch (error) {
            toast.error(
                error?.data?.message ||
                "Failed to delete resume"
            );
        }
    };

    const [updateProfile] = useUpdateProfileMutation();

    const handleSave = async () => {
        setSaving(true);

        try {
            const res = await updateProfile(formData).unwrap();
            setProfileData(formData);
            updateUser?.({
                ...user,
                ...formData,
            });

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    const handleCancel = () => {
        setFormData(profileData);
    };

    const removeAvatar = () => {
        setFormData(prev => ({
            ...prev,
            avatar: "",
            avatarPublicId: "",
        }));
    };

    useEffect(() => {
        if (!user) return;

        const data = {
            name: user.name || "",
            email: user.email || "",
            preferredCategory: user.preferredCategory || "",
            preferredLocation: user.preferredLocation || "",
            experience: user.experience || "",
            skills: user.skills || [],
            avatar: user.avatar || "",
            avatarPublicId: user.avatarPublicId || "",
            resume: user.resume || "",
            resumePublicId: user.resumePublicId || "",
        };

        setProfileData(data);
        setFormData(data);
    }, [user]);

    const avatarFileName = formData?.avatar
        ? decodeURIComponent(formData.avatar.split("/").pop().split("?")[0])
        : "";

    console.log(formData)

    return (
        <div className="bg-linear-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16 lg:m-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
                            <h1 className="text-sl font-medium text-white">Profile</h1>
                        </div>

                        <div className="p-8">
                            <div className="space-y-6">

                                {/* //! Avatar Upload */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={formData?.avatar || DEFAULT_AVATAR}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                                        />

                                        {formData?.avatar && (
                                            <button
                                                type="button"
                                                onClick={removeAvatar}
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center hover:bg-red-600"
                                            >
                                                ✕
                                            </button>
                                        )}

                                        {uploading?.avatar && (
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/jpeg,image/jpg,image/png"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <p className="mt-2 mb-1 text-xs text-gray-500">
                                            Allowed formats: .jpeg, .jpg, .png, .pdf
                                        </p>

                                        <label
                                            htmlFor="avatar-upload"
                                            className="inline-flex cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                        >
                                            Choose Image
                                        </label>

                                        <p className="mt-2 text-sm text-gray-500">
                                            {avatarFileName || "No image selected"}
                                        </p>
                                    </div>
                                </div>

                                {/* Name Input */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email Read only */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>

                                    {/* Preferred Category */}
                                    <SelectField
                                        label="Preferred Category"
                                        id="preferredCategory"
                                        value={formData.preferredCategory}
                                        onChange={(e) => handleInputChange("preferredCategory", e.target.value)}
                                        options={CATEGORIES}
                                        placeholder="Select a category"
                                    />

                                    {/* Skills */}
                                    <MultiSelectField
                                        label="Skills"
                                        id="skills"
                                        value={formData.skills}
                                        onChange={(value) => handleInputChange("skills", value)}
                                        options={SKILLS}
                                        placeholder="Select skills..."
                                    />

                                    {/* Experience */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                        <input
                                            type="number"
                                            value={formData.experience}
                                            onChange={(e) => handleInputChange("experience", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            placeholder="e.g. 1, 2"
                                        />
                                    </div>

                                    {/* Preferred Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                                        <input
                                            type="text"
                                            value={formData.preferredLocation}
                                            onChange={(e) => handleInputChange("preferredLocation", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            placeholder="e.g. Kathmandu"
                                        />
                                    </div>
                                </div>
                                {formData.resume ? (
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={formData.resume}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View Resume
                                        </a>

                                        <span className="text-sm text-gray-500">
                                            {formData.resume.split("/").pop()}
                                        </span>

                                        <button type="button" onClick={handleDeleteResume}>
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onDrop={handleResumeDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeChange}
                                            className="hidden"
                                            id="resumeUpload"
                                        />

                                        <label htmlFor="resumeUpload" className="cursor-pointer text-blue-600">
                                            Click or Drag & Drop Resume (Max 2MB)
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                                <Link
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    onClick={handleCancel}
                                    to="/find-jobs"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </Link>
                                <button
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    onClick={handleSave}
                                    disabled={saving || uploading.avatar || uploading.resume}
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                                        </div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserProfile