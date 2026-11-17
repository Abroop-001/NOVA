import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileActions from "../../components/profile/ProfileActions";
import { getProfile, updateProfile } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

const MyProfile = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await getProfile();
        if (res?.success && res.user) {
          setUser(res.user);
          try {
            localStorage.setItem("user", JSON.stringify(res.user));
          } catch {}
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || "Failed to load profile.");
        try {
          const cached = localStorage.getItem("user");
          if (cached) setUser(JSON.parse(cached));
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleUpdateUser = async (updatedData) => {
    const res = await updateProfile({
      username: updatedData.username,
      phone: updatedData.phone,
    });
    if (res?.success && res.user) {
      setUser(res.user);
      try {
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch {}
    }
    return res;
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-28 bg-[#FAF9F6] border border-[#EAEAEA] rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-80 bg-[#FAF9F6] border border-[#EAEAEA] rounded-2xl" />
              <div className="lg:col-span-5 h-80 bg-[#FAF9F6] border border-[#EAEAEA] rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            <ProfileHeader
              name={user?.username || "NOVA Member"}
              email={user?.email || "member@nova.com"}
            />

            {fetchError && !user && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {fetchError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 sm:mt-12 items-start">
              <div className="lg:col-span-7 bg-[#FAF9F6]/40 border border-[#EAEAEA] rounded-2xl p-6 sm:p-8">
                <ProfileForm user={user} onUpdateUser={handleUpdateUser} />
              </div>

              <div className="lg:col-span-5 bg-[#FAF9F6]/40 border border-[#EAEAEA] rounded-2xl p-6 sm:p-8">
                <ProfileActions onLogout={handleLogout} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyProfile;
