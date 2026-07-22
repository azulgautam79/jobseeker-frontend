import { useState, useEffect } from "react"
import { Building2, Mail, Edit3 } from "lucide-react"
import { useAuth } from "../../context/useAuth"
import toast from "react-hot-toast"

import DashboardLayout from "../../components/layout/DashboardLayout"
import EditProfileDetails from "./EditProfileDetails"
import { useUpdateProfileMutation } from "../../store/slices/userSlice"
import { useFileUpload } from "../../utils/imageUpload"

const EmployeeProfilePage = () => {

    const { user } = useAuth();

    const { uploadFile } = useFileUpload();

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
        avatarPublicId: user?.avatarPublicId || "",
        companyName: user?.companyName || "",
        companyDescription: user?.companyDescription || "",
        companyLogo: user?.companyLogo || "",
        companyLogoPublicId: user?.companyLogoPublicId || "",
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                avatar: user.avatar || "",
                avatarPublicId: user.avatarPublicId || "",
                companyName: user.companyName || "",
                companyDescription: user.companyDescription || "",
                companyLogo: user.companyLogo || "",
                companyLogoPublicId: user.companyLogoPublicId || "",
            });
        }
    }, [user]);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(profileData);
    const [uploading, setUploading] = useState({ avatar: false, logo: false })
    const [saving, setSaving] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    };

    const handleImageUpload = async (file, type) => {
        setUploading((prev) => ({ ...prev, [type]: true }))

        try {
            const result = await uploadFile(type === "avatar" ? "avatar" : "companyLogo", file);

            if (type === "avatar") {
                setFormData(prev => ({ ...prev, avatar: result.url, avatarPublicId: result.publicId }));
            } else {
                setFormData(prev => ({ ...prev, companyLogo: result.url, companyLogoPublicId: result.publicId }));
            }
        } catch (error) {
            console.error("Image upload failed:", error);

            toast.error("Upload failed");
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        if (type === "avatar") {
            setFormData(prev => ({ ...prev, avatar: previewUrl }));
        } else {
            setFormData(prev => ({ ...prev, companyLogo: previewUrl }));
        }

        handleImageUpload(file, type);
    };

    const [updateProfile] = useUpdateProfileMutation();

    const handleSave = async () => {
        setSaving(true);

        try {
            await updateProfile(formData).unwrap();

            toast.success("Profile Details updated successfully!");
            setProfileData({ ...formData });
            setEditMode(false);
        } catch (error) {
            toast.error(error?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({ ...profileData })
        setEditMode(false);
    }

    useEffect(() => {
        setFormData(profileData);
    }, [profileData]);


    if (editMode) {
        return (
            <EditProfileDetails
                formData={formData}
                handleImageChange={handleImageChange}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                saving={saving}
                uploading={uploading}
            />
        )
    }

    return (
        <DashboardLayout activeMenu='company-profile'>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
                            <h1 className="text-xl font-medium text-white">
                                Employer Profile
                            </h1>
                            <button
                                className="bg-white/10 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                // onClick={() => setEditMode(true)}
                                onClick={() => {
                                    setFormData(profileData);
                                    setEditMode(true);
                                }}
                            >
                                <Edit3 className="h-4 w-4" />
                                <span className="">Edit Profile</span>
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Personal Information
                                    </h2>

                                    {/* Avatar and Name */}
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={profileData.avatar}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {profileData.name}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <Mail className="w-4 h-4 mr-2" />
                                                <span>{profileData.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Company Information
                                    </h2>

                                    {/* Company Logo and Name */}
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={profileData.companyLogo}
                                            alt="Company Logo"
                                            className="w-20 h-20 rounded-lg object-cover border-4 border-blue-50"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {profileData.companyName}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <Building2 className="w-4 h-4 mr-2" />
                                                <span>Company</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Description */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                                    About Company
                                </h2>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                                    {profileData.companyDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
export default EmployeeProfilePage