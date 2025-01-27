import React, { useState, useEffect, useContext } from "react";
import { backend, myContext } from "../..";
import axios from "axios";

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [disableTouch, setDisableTouch] = useState(false); // Disables toggle temporarily
  const { userData } = useContext(myContext);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backend}/api/admin/users`, {
          withCredentials: true,
        });
        const data = response.data.users;
        const updatedData = data.filter((item) => item._id !== userData._id);
        setUsers(updatedData);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlockStatus = async (id) => {
    if (disableTouch) return; // Prevent multiple clicks

    setDisableTouch(true); // Disable further clicks temporarily
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id
          ? {
              ...user,
              blockStatus: user.blockStatus === false ? true : false,
            }
          : user
      )
    );

    try {
      const response = await axios.put(`${backend}/api/admin/user/${id}`,{},{withCredentials:true});
      if (response.data.success) {
        setDisableTouch(false); // Re-enable after successful response
      }
    } catch (error) {
      console.log("Error toggling block status:", error);
      setDisableTouch(false); // Re-enable in case of an error
    }
  };

  // Filter users based on the search term (by email)
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-[70vh]">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2> */}

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          className="p-2 w-full border rounded"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className={`w-10/12 mx-auto rounded-lg p-6 border hover:shadow-lg transition-shadow ${
              user.blockStatus === true ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-white">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-white">
              <span className="font-semibold">Contact:</span> {user.contact}
            </p>
            <p className="text-white">
              <span className="font-semibold">Country:</span> {user.country}
            </p>
            <div
              className={`mt-4 w-14 h-7 bg-gray-300 rounded-full flex items-center cursor-pointer ${
                disableTouch ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => toggleBlockStatus(user._id)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  user.blockStatus === true ? "translate-x-0" : "translate-x-7"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
