// Validation functions
export const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
}

export const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return "Password must be atleast 8 characters.";
    if (!/(?=.*[a-z])/.test(password))
        return "Password must contain atleast one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
        return "Password must contain atleast one uppercase letter";
    if (!/(?=.*\d)/.test(password))
        return "Password must contain atleast one number";
    return "";
};

export const validateAvatar = (file) => {
    if (!file) return "";    // Avatar is optional

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
        return "Avatar must be a JPG, JPEG or PNG file"
    }

    const maxSize = 2 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return "Avatar must be less than 2MB"
    }

    return "";
}

export const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
];

export const ALLOWED_RESUME_TYPES = [
    // "image/jpeg",
    // "image/jpg",
    // "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

// export const getInitials = (name) => {
//     return name
//         .split(" ")
//         .map((word) => word.chatAt(0))
//         .join("")
//         .toUpperCase()
//         .slice(0, 2);
// }

export const getInitials = (name = "") => {
    if (typeof name !== "string") return "";

    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0)) // ✅ Typo fix: was `chatAt`
        .join("")
        .toUpperCase()
        .slice(0, 2);
};