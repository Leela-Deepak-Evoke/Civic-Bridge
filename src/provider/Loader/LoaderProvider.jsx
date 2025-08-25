import { useEffect, useState } from "react";
import { loaderService } from "../../services/loaderService";
import AppLoader from "../../components/AppLoader/AppLoader";

function LoaderProvider({ children }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = loaderService.subscribe(setLoading);
        return () => unsubscribe();
    }, []);

    return (
        <>
            {loading && <AppLoader />}
            {children}
        </>
    );
}

export default LoaderProvider;
