import './AppLoader.css';

function AppLoader() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
        }}>
            <div className="loader-ring ring-1"></div>
            <div className="loader-ring ring-2"></div>
            <div className="loader-ring ring-3"></div>
        </div>
    );
}

export default AppLoader;
