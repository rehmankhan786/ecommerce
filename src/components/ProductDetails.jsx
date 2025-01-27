import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backend, myContext } from "..";
import toast, { ToastBar, Toaster } from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  console.log(params.productId);
  const { userData, setUserData, guest } = useContext(myContext);
  const [product, setProduct] = useState({});

  const addToCart = async (e) => {
    try {
      const res = await axios.post(
        `${backend}/api/user/addtocart/${params.productId}`,
        {},
        { withCredentials: true }
      );
      // Access data directly from res
      toast.success(res.data.message);
      console.log(res);

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
    } catch (error) {
      console.error("error is ", error);
      // Check if error.response exists before accessing
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding to cart");
      }
    }
  };
  const addToWishlist = async () => {
    try {
      const res = await axios.post(
        `${backend}/api/user/addtowishlist/${params.productId}`,
        {}, // Empty body for the POST request
        { withCredentials: true } // Pass `withCredentials` in the config, not the body
      );
      console.log("Wishlist response:", res.data);
      // Handle success (e.g., show a success message or update UI)
      toast.success(res.data.message);
      // alert(res.data.message || "Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response || error);
      // Handle error (e.g., show an error message)
      toast.error(error.response?.data?.message);
      // alert(error.response?.data?.message || "Failed to add to wishlist.");
    }
  };

  const buyNow = () => {
    console.log("buying now");
  };

  useEffect(() => {
    const fetchproduct = async () => {
      const prod = await axios.get(
        `${backend}/api/product/${params.productId}`,
        {
          withCredentials: true,
        }
      );
      console.log(prod);
      setProduct(prod.data);
    };
    fetchproduct();
  }, []);
  const {
    productImage,
    productName,
    productCode,
    productDescription,
    productCategory,
    productRatings,
    productPrice,
    productQuantity,
    productSoldQuantity,
    productBuyers,
  } = product;
  return (
    <div className="p-6 max-w-4xl mx-auto border shadow-lg rounded-lg bg-white mt-12 relative">
      {/* Product Image */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={productImage}
          alt={productName}
          className="w-48 h-48 object-cover rounded-lg border"
        />
        {/* Product Details */}
        <div className="w-full">
          <h1 className="text-2xl font-semibold">{productName}</h1>
          <p className="text-gray-500 text-sm mt-2">Code: {productCode}</p>
          <p className="text-gray-600 mt-4">{productDescription}</p>
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">
              Category: {productCategory}
            </span>
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">
              Ratings: ⭐ {productRatings}
            </span>
          </div>
        </div>
      </div>

      {/* Price and Quantity */}
      <div className=" flex justify-between items-center mb-[50px]">
        <div>
          <p className="text-xl font-bold text-green-600">₹{productPrice}</p>
          <p className="text-gray-500">Available Quantity: {productQuantity}</p>
          <p className="text-gray-500">Sold Quantity: {productSoldQuantity}</p>
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <button
            onClick={(e) => buyNow(e)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 outline-none"
          >
            Buy Now
          </button>
          <button
            onClick={(e) => addToCart(e)}
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 active:bg-orange-700 sm:text-xs sm:px-4 sm:py-2 sm:w-24 md:px-6 md:py-3 md:w-32 lg:px-8 lg:py-4 lg:w-40 xl:px-10 xl:py-5 xl:w-48 focus:outline-none"
          >
            Add To Cart
          </button>
        </div>
      </div>
      <button
        onClick={(e) => addToWishlist(e)}
        className="bg-slate-50 text-black px-4 py-2 rounded-lg hover:bg-slate-100 absolute top-1 right-1 active:bg-slate-300 sm:text-xs sm:px-4 sm:py-2 sm:w-24 md:px-6 md:py-3 md:w-32 lg:px-8 lg:py-4 lg:w-40 xl:px-10 xl:py-5 xl:w-48 focus:outline-none"
      >
        +Add To Wishlist
      </button>

      {/* Buyers List */}
      {/* {productBuyers} */}
      {/* productBuyers */}
      {productBuyers?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Buyers</h2>
          <ul className="mt-2">
            {productBuyers.map((buyer, index) => (
              <li
                key={index}
                className="border rounded-md p-2 mt-2 bg-gray-50 flex justify-between"
              >
                <span>{buyer.name}</span>
                <span className="text-gray-500">{buyer.Id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default ProductDetails;
