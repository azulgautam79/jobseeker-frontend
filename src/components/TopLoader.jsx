import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

function TopLoader() {
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        ref.current.continuousStart();
        ref.current.complete();
    }, [location]);

    return <LoadingBar
        color="#155af8"
        height={3}
        shadow={true}
        waitingTime={300}
        loaderSpeed={500}
        ref={ref}
    />;
}

export default TopLoader;
