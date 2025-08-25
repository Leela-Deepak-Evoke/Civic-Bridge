import React, { useEffect, useState } from 'react'
import HeaderLayout from '../../layouts/HeaderLayout/HeaderLayout';
import FooterLayout from '../../layouts/FooterLayout/FooterLayout';
import ConcernCard from '../../components/ConcernCard/ConcernCard';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import ChatLayout from '../../layouts/ChatLayout/ChatLayout';
import StatusDashboard from '../../components/StatusDashboard/StatusDashboard';
import AdminCard from '../../components/AdminCard/AdminCard';
import './MainPage.css'
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import useWindowSize from '../../hooks/useWindowSize'
import axiosInstance from '../../api/axiosInstance';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';

const MainPage = () => {
    const { width } = useWindowSize();

    const parsedData = localStorage.getItem('UserData');
    const [name, setname] = useState('');
    const [role, setrole] = useState('');
    const [concerns, setConcerns] = useState([]);
    const [checkersData, setCheckersData] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { id, idToken } = JSON.parse(parsedData);
    const authHeaders = { Authorization: `Bearer ${idToken}` };

    const fetchAllData = async () => {
        try {
            // user
            const { data: userData } = await axiosInstance.get(`/users/${id}`, { headers: authHeaders });
            setname(userData.name);
            setrole(userData.role);

            // concerns
            const { data: concernsData } = await axiosInstance.get("/issues", { headers: authHeaders });
            setConcerns(concernsData.data);

            // checkers
            const querySnapshot = await getDocs(collection(db, "CheckersData"));
            setCheckersData(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            // carousel images
            const docRef = doc(db, "CauroselLinks", "Links");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const imgs = Object.entries(data)
                    .filter(([key, val]) => key !== "id" && typeof val === "string")
                    .map(([_, val]) => val);
                setImages(imgs);
            }
        } catch (err) {
            console.error("Error fetching all data:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [parsedData]);

    // ✅ When new concern is added, refresh everything
    const handleConcernAdded = async () => {
        await fetchAllData();
    };

    // ✅ filter logic
    const filteredConcerns = concerns.filter((c) => {
        const cityMatch = selectedCity ? c.location === selectedCity : true;
        const statusMatch = selectedStatus ? c.status === selectedStatus : true;
        const searchMatch = searchQuery
            ? (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        return cityMatch && statusMatch && searchMatch;
    });


    // Define breakpoints
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    const formatText = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    return (
        <div className="page-container">
            <HeaderLayout
                selectedCity={selectedCity}
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
                onSearch={setSearchQuery}
                onConcernAdded={handleConcernAdded}
            />

            <div className="marquee-container">
                <span className="marquee-text">
                    🤝 CivicBridge – Empowering citizens and bridging the gap between people and government.
                </span>
            </div>

            <div className="mainContent">
                {/* Tablet & Desktop → Show Profile Card */}
                {(isTablet || isDesktop) && (
                    <div className="profileCard">
                        <ProfileCard username={formatText(name)} role={formatText(role)} onSelectLocation={setSelectedCity} concerns={concerns} />
                        <StatusDashboard concerns={concerns} />
                        <FooterLayout />
                    </div>
                )}

                {/* Concern Cards (Always visible) */}
                <div className="concernCards">
                    {filteredConcerns.length === 0 ? (
                        <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
                            🚫 No issues found. Try selecting a different city, filter, or search with appropriate keywords.
                        </div>
                    ) : (
                        filteredConcerns.map((issue, index) => (
                            <ConcernCard key={index} data={issue} isMyConcern={false} />
                        ))
                    )}
                </div>

                {/* Desktop only → Show ChatLayout & Admin Cards */}
                {isDesktop && (
                    <div className="checkersCards">
                        <ChatLayout />
                        {checkersData.map((checker, index) => (
                            <AdminCard
                                key={index}
                                logo={checker.logo}
                                name={checker.name}
                                headline={checker.headline}
                                description={checker.description}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ImageCarousel images={images} interval={4000} />
        </div>
    )
}


export default MainPage;

