import React, { useContext, useEffect } from "react";
import { backend, myContext } from "..";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { userData, setUserData, guest } = useContext(myContext);
  let mywishlist = userData.wishlist;
  // console.log(mywishlist)
  useEffect(() => {
    const renderData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user/profile`, {
          withCredentials: true, // Include credentials (cookies)
        });
        setUserData(res.data); // Set the user data on success
      } catch (err) {
        console.error("Error fetching user data:", err);
        //   setError(err.response?.data?.message || "Failed to fetch user data"); // Handle error message
      }
    };

    renderData();
  }, []);

  const LogOut = async (e) => {
    const res = await axios.get(`${backend}/api/user/logout`, {
      withCredentials: true,
    });
    // console.log(res.data);
    toast.success(res.data.message);
    setUserData(guest);
  };
  const { email, country, contact, cart, purchaseHistory, wishlist, isAdmin } =
    userData;
  if (userData.username !== "Guest") {
    return (
      <div className="relative">
        <Link
          to="/admin"
          className="text-center border px-4 py-2 bg-blue-500 text-white rounded-md shadow-md relative top-3 left-1/2 -translate-x-1/2 transform-gpu hover:bg-blue-600 transition-all"
        >
          {isAdmin === 0
            ? ""
            : isAdmin === 1
            ? "Go to Admin"
            : "super Admin dashboard"}
        </Link>
        <div className="p-6 max-w-3xl mx-auto border shadow-md rounded-lg bg-white mt-8 mb-12">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex justify-center items-center text-2xl font-semibold text-gray-700">
              {email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{email}</h1>
              {/* <p className="text-gray-600">{isAdmin ? "Admin" : "User"}</p> */}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Country:</span> {country}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span> {contact}
            </p>
            {/* <p className="text-gray-700">
            <span className="font-semibold">Block Status:</span>{" "}
            {blockStatus ? "Blocked" : "Active"}
          </p> */}
          </div>

          {/* User Statistics */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <Link to={"/cart"}>
              <div className="bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">{cart.length}</h2>
                <p className="text-gray-500">Cart Items</p>
              </div>
            </Link>
            <Link to={"/myOrders"}>
              <div className="bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">
                  {purchaseHistory.length}
                </h2>
                <p className="text-gray-500">Purchases</p>
              </div>
            </Link>
            <Link to={"/mywishlist"} state={{ mywishlist }}>
              <div className="bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">{wishlist.length}</h2>
                <p className="text-gray-500">Wishlist Items</p>
              </div>
            </Link>
          </div>

          {/* User Actions */}
          <div className="mt-8 space-y-4">
            <Link to={"/updateprofile"}>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </Link>
            <button
              onClick={(e) => LogOut(e)}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // return <div>UserProfile</div>
    // locate('/');
    return <Navigate to={"/login"} />;
  }
};

export default UserProfile;
