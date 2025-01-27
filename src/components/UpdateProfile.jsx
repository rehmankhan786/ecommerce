import React, { useContext, useEffect, useState } from "react";
import { backend, myContext } from "..";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const EditProfile = () => {
  const { userData, setUserData } = useContext(myContext);
  const [formData, setFormData] = useState({
    email: "",
    country: "",
    contact: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    setFormData({
      email: userData.email || "",
      username: userData.username || "",
      country: userData.country || "",
      contact: userData.contact || "",
    });
    // console.log(userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backend}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully!");
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    else if(passwordData.newPassword==="" || passwordData.confirmPassword===""||passwordData.oldPassword===""){
        toast.error("All fields are mandatory ")
return;
    }else{

    }
    try {
      const response = await axios.put(
        `${backend}/api/user/changepassword`,
        { passwordData, email: userData.email },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-6 flex-wrap mb-8">
      {/* Edit Profile Section */}
      <div className="w-full md:w-1/2 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
        {/* Form Section */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          {/* Country Dropdown */}
          <div>
            <label className="block font-semibold text-gray-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">
                Select Country
              </option>
              {[
                "United States",
                "India",
                "United Kingdom",
                "Canada",
                "Australia",
                "Germany",
                "France",
                "Japan",
                "China",
                "Brazil",
              ].map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          {/* Contact */}
          <div>
            <label className="block font-semibold text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Change Password
        </h2>
        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label className="block font-semibold text-gray-700">
              Old Password
            </label>
            <input
              type={showPassword.oldPassword ? "text" : "password"}
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-2/3 transform -translate-y-1/2"
              onClick={() => togglePasswordVisibility("oldPassword")}
            >
              {showPassword.oldPassword ? "👁️" : "😶"}
            </button>
          </div>
          {/* New Password */}
          <div className="relative">
            <label className="block font-semibold text-gray-700">
              New Password
            </label>
            <input
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 top-2/3"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPassword.newPassword ? "👁️" : "😶"}
            </button>
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2  top-2/3"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPassword.confirmPassword ? "👁️" : "😶"}
            </button>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Fixed Profile Preview Section */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Profile Preview
        </h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span>{" "}
            {userData.name || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span>{" "}
            {formData.email || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Contact:</span>{" "}
            {formData.contact || "N/A"}
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default EditProfile;
