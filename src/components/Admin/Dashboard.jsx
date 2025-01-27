import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../..";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import UserCards from "./UserList";
import Dashboard from "./Adminmetrices";
import AdminProducts from "./Products";
import AdminCategories from "./Category";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { userData, setUserData } = useContext(myContext);
  const navigate = useNavigate();
//   const location = useLocation();
  const tabs = ["Dashboard", "Users", "Settings", "Reports", "Products","Category"];

useEffect(()=>{

    if(userData.isAdmin!==1){
        navigate("/")
    }
},[])


  if (userData.isAdmin !== 1) {
    toast.error("You are not admin");
    // Location("/")
    return (
        <>
        {/* {navigate("/")} */}
        <Toaster />
      </>
    );
  } else {
    return (
      <div className="flex h-screen bg-gray-100 w-full">
        {/* Left Sidebar */}
        <div className="w-3/12 bg-blue-700 text-white flex flex-col p-4 h-full z-2 fixed">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <nav className="space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === tab
                    ? "bg-blue-500 font-bold shadow-md"
                    : "hover:bg-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex-wrap p-6 absolute w-9/12 right-0 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{activeTab}</h2>

          {/* Conditional Tab Content */}
          <div className="bg-white p-6 shadow rounded-lg">
            {activeTab === "Dashboard" && (
              <Dashboard/>
            )}
            {activeTab === "Users" && (
              <UserCards/>
            )}
            {activeTab === "Settings" && (
              <p>Configure your application settings here.</p>
            )}
            {activeTab === "Category" && (
              <AdminCategories/>
            )}
            {activeTab === "Products" && (
              <AdminProducts/>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
