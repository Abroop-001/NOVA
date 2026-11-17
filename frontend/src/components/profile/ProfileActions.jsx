import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, MapPin, Heart, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileActions = ({ onLogout }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logoutUser();
    }
  };

  const menuItems = [
    {
      title: "My Orders",
      description: "Track current deliveries & review past purchases",
      path: "/orders",
      icon: Package,
    },
    {
      title: "My Bag",
      description: "Manage items saved in your current cart",
      path: "/cart",
      icon: ShoppingBag,
    },
    {
      title: "Wishlist",
      description: "Explore footwear silhouettes you have saved",
      path: "/wishlist",
      icon: Heart,
    },
    {
      title: "Delivery Addresses",
      description: "Manage your saved shipping locations",
      path: "/addresses",
      icon: MapPin,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold tracking-tight text-[#171717] uppercase">
          Quick Actions
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Access your saved details and orders
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.path}
              className="group flex items-center justify-between p-4 rounded-xl border border-[#EAEAEA] bg-white hover:border-[#171717] transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#777777] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-[#999999] group-hover:text-[#171717] group-hover:translate-x-0.5 transition"
              />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex items-center justify-between p-4 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2]/50 hover:bg-[#FEE2E2] text-[#B91C1C] transition-all cursor-pointer mt-2"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#FECACA] flex items-center justify-center text-[#B91C1C]">
              <LogOut size={18} />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Log Out
              </h3>
              <p className="text-[11px] text-[#DC2626] mt-0.5">
                Safely sign out of your NOVA account
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#DC2626]" />
        </button>
      </div>
    </div>
  );
};

export default ProfileActions;

