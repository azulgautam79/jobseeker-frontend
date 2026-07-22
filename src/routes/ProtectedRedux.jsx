import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRedux = ({ requiredRole }) => {
    const { user, initialized  } = useSelector((state) => state.auth);

    if (!initialized ) {
        return <div>Loading...</div>;
    }

    if (!user) return <Navigate to="/login" replace />;

    if (requiredRole && user.role !== requiredRole)
        return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRedux;
