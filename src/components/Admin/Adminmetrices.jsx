import React from "react";
import { FaChartLine, FaMoneyBillWave, FaShoppingCart, FaUsers } from "react-icons/fa";


const Dashboard = () => {
    const metrics = [
      { title: "Total Users", value: "1,234", icon: FaUsers, iconBg: "bg-green-100" },
      { title: "Total Orders", value: "567", icon: FaShoppingCart, iconBg: "bg-yellow-100" },
      { title: "Total Revenue", value: "$12,345", icon: FaMoneyBillWave, iconBg: "bg-red-100" },
      { title: "Growth Rate", value: "8.7%", icon: FaChartLine, iconBg: "bg-purple-100" },
    ];
  
    return (
      <div className="min-h-fit bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        <AdminMetrics metrics={metrics} />
      </div>
    );
  };



const AdminMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{metric.title}</h3>
            <p className="text-3xl font-bold text-blue-600">{metric.value}</p>
          </div>
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${
              metric.iconBg || "bg-blue-100"
            }`}
          >
            <metric.icon className="text-2xl text-blue-600" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
