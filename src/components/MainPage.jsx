import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { data, Link, Navigate, useNavigate } from "react-router-dom";
import { myContext } from "..";
import toast from "react-hot-toast";
import { gsap } from "gsap";

const backend = "http://localhost:4000";
const MainPage = () => {
  const navigate = useNavigate();
  // const [data, setData] = useState(["empty:"]); // State to store fetched data
  // fetchData()
  const [data, setData] = useState([]); // State to store fetched data
  const { userData, setUserData, guest } = useContext(myContext);

  useEffect(() => {
    gsap.from(".hero-text", { opacity: 0, y: -50, duration: 1, delay: 0.5 });
    gsap.from(".hero-btn", { opacity: 0, scale: 0, duration: 1, delay: 1 });
    gsap.from(".product-card", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      delay: 1.5,
    });

    // Fetch data inside useEffect

    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend}/api/product/`);
        // const randomImages = await axios.get(
        //   "https://unsplash.com/s/photos/random"
        // );
        // let jsondata = randomImages.json();
        // console.log(jsondata);
        setData(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const renderData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user/profile`, {
          withCredentials: true,
        });
        // console.log(res);
        if (res.data) {
          // toast.success(res.response.data.msg)
          // console.log(res)
          setUserData(res.data);
        } else {
          setUserData(guest);
        }
      } catch (error) {
        setUserData(guest);
      }

      //   console.log(userData);
    };
    renderData();

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // console.log(data); // Log the fetched data
  return (
    <div className="w-[100vw]  h-[100vh] z-10 ">
      <div className="font-sans">
        <section
          id="home"
          className="h-[100vh] bg-gradient-to-r from-blue-400 to-blue-600 flex justify-center items-center text-center"
        >
          <div className="hero-content text-white">
            <h2 className="text-4xl md:text-6xl font-bold hero-text -mt-10">
              Welcome to Our Store
            </h2>
            <p className="text-lg mt-4">
              Find the best products for your needs!
            </p>
            <button
              onClick={(e) => (window.location.href = "/products")}
              className="hero-btn bg-white text-blue-600 px-6 py-3 mt-6 rounded shadow-lg hover:bg-blue-100 duration-100 transition-colors"
            >
              <Link to={"/products"}>Shop Now</Link>
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section
          id="products"
          className="py-16 bg-gray-100 min-h-[50vh] text-center"
        >
          <h3 className="text-3xl font-bold mb-10">Our Products</h3>
          <div className="container mx-6 grid sm:grid-cols-2 md:grid-cols-3 gap-8 z-1-">
            {/* Product Cards */}
            <div className="product-card bg-white p-4 shadow rounded">
              <img
                src="https://via.placeholder.com/200"
                alt="Product 1"
                className="w-full h-48 object-cover mb-4"
              />
              <h4 className="text-xl font-semibold">Product 1</h4>
              <p className="text-gray-700">$50</p>
            </div>
            <div className="product-card bg-white p-4 shadow rounded">
              <img
                src="https://via.placeholder.com/200"
                alt="Product 2"
                className="w-full h-48 object-cover mb-4"
              />
              <h4 className="text-xl font-semibold">Product 2</h4>
              <p className="text-gray-700">$75</p>
            </div>
            <div className="product-card bg-white p-4 shadow rounded">
              <img
                src="https://via.placeholder.com/200"
                alt="Product 3"
                className="w-full h-48 object-cover mb-4"
              />
              <h4 className="text-xl font-semibold">Product 3</h4>
              <p className="text-gray-700">$100</p>
            </div>
          </div>
        </section>

        {/* Footer */}
      </div>
    </div>
  );
};

// exports.module = {backend}
export default MainPage;
