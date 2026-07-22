import {
    useAvatarUploadMutation,
    useResumeUploadMutation,
    useCompanyLogoUploadMutation,
} from "../store/slices/authApiSlice";

export const useFileUpload = () => {
    const [avatarUpload] = useAvatarUploadMutation();

    const [resumeUpload] = useResumeUploadMutation();

    const [companyLogoUpload] = useCompanyLogoUploadMutation();

    const uploadFile = async (type, file) => {
        const formData = new FormData();

        formData.append("file", file);

        switch (type) {
            case "avatar":
                return await avatarUpload(formData).unwrap();

            case "resume":
                return await resumeUpload(formData).unwrap();

            case "companyLogo":
                return await companyLogoUpload(formData).unwrap();

            default:
                throw new Error("Invalid upload type");
        }
    };

    return { uploadFile };
};