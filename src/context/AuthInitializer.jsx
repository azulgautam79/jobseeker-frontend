import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useRefreshMutation } from "../store/slices/authApiSlice";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const [refresh] = useRefreshMutation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refresh().unwrap();

                if (res?.user && res?.accessToken) {
                    dispatch(setCredentials({
                        user: res.user,
                        accessToken: res.accessToken,
                    }));
                }
            } catch (err) {
                // IMPORTANT:
                // Do nothing here.
                // ProtectedRedux will handle unauthenticated state.
            }
        };

        initAuth();
    }, [dispatch, refresh]);

    return children;
};

export default AuthInitializer;
