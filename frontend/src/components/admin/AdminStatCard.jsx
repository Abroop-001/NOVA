import React from "react";

const AdminStatCard = ({ title, value, icon: Icon, badge, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
          {value}
        </h3>
        {badge && (
          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          colorMap[color] || colorMap.blue
        }`}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};

export default AdminStatCard;

