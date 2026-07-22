import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../store/slices/authSlice";
import { useLogoutMutation } from "../store/slices/authApiSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const [logoutApi] = useLogoutMutation();

    const { user, isAuthenticated, initialized } = useSelector(
        (state) => state.auth
    );

    const updateUser = (updatedUserData) => {
        dispatch(updateUserAction(updatedUserData));
    };

    const logout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            dispatch(clearCredentials());
            window.location.href = "/";
        }
    };

    return {
        user,
        logout,
        isAuthenticated
    };

};
