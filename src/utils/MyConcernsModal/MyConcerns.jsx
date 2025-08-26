import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AppLoader from '../../components/AppLoader/AppLoader';
import ConcernCard from '../../components/ConcernCard/ConcernCard';
import AppPopUpModal from "../AppPopUpModal/AppPopUpModal";
import AppSnackbar from "../../utils/AppSnackbar/AppSnackbar";

const MyConcerns = ({ heading, isOpen, onClose }) => {
  const [myConcerns, setMyConcerns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appsnackbar, setAppSnackbar] = useState(null);

  const showSnackbar = (msg, type) => {
    setAppSnackbar({ msg, type });
  };

  useEffect(() => {
    if (!isOpen) return;

    const storedData = localStorage.getItem("UserData");
    if (!storedData) return;

    let parsedData;
    try {
      parsedData = JSON.parse(storedData);
    } catch (e) {
      console.error("Invalid UserData in localStorage", e);
      return;
    }

    const { id, idToken } = parsedData || {};
    if (!id || !idToken) return;

    const authHeaders = { Authorization: `Bearer ${idToken}` };

    const fetchMyConcerns = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `issues/user?userId=${id}`,
          { headers: authHeaders }
        );
        setMyConcerns(data.data || []);
      } catch (error) {
        const message =
          error.response?.data?.message || // backend error message
          error.message ||                 // axios message (e.g., "Request failed with status code 401")
          "Something went wrong";          // fallback
        showSnackbar(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyConcerns();
  }, [isOpen]);

  return (
    <AppPopUpModal heading={heading} isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <AppLoader />
      ) : myConcerns.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>🚫 No concerns found.</p>
      ) : (
        <div className="concerns-grid">
          {myConcerns.map((c) => (
            <ConcernCard key={c._id} data={c} isMyConcern={true} />
          ))}
        </div>
      )}
      {appsnackbar && (
        <AppSnackbar
          message={appsnackbar.msg}
          type={appsnackbar.type}
          onClose={() => setAppSnackbar(null)}
        />
      )}
    </AppPopUpModal>

  );
};

export default MyConcerns;
