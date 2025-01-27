import { useContext, useEffect } from "react";
import "./index.css";
import "./App.css";
import { backend, myContext } from ".";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MainPage from "./components/MainPage.jsx";
import Cart from "./components/Cart.jsx";
// import ProductDetails from "./components/ProductDetails";
import UserProfile from "./components/UserProfile.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Footer from "./components/Footer.jsx";
import Products from "./components/Products.jsx";
import Notfound from "./components/NotFound.jsx";
// import productDetails from "./components/ProductDetails";
import ProductDetails from "./components/ProductDetails.jsx";
import Wishlist from "./components/Wishlist.jsx";
import MyOrders from "./components/MyOrders.jsx";
import axios from "axios";
import EditProfile from "./components/UpdateProfile.jsx";
import AdminDashboard from "./components/Admin/Dashboard.jsx";
import { Toast } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

function App() {
  // const navigate = useNavigate();
  // const { userData } = useContext(myContext);
  // console.log(userData);

  const { userData, setUserData } = useContext(myContext);
  let mywishlist = userData.wishlist;
  // console.log(mywishlist);
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

 
  return (


    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="h-16"></div>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/home" element={<MainPage />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route
            path="/product/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="/user" element={<UserProfile />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/mywishlist" element={<Wishlist />}></Route>
          <Route path="/myorders" element={<MyOrders />}></Route>
          <Route path="/updateprofile" element={<EditProfile />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="*" element={<Notfound />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
