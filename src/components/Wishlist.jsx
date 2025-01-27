import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { backend, myContext } from "..";
import { Link, useParams } from "react-router-dom";

const Wishlist = () => {
  // console.log(props)

  const { userData } = useContext(myContext);
  const [products, setProducts] = useState([]);

  //   const[product,setproduct] = useState([]);
  const [items, setItems] = useState([]); // Local state to manage wishlist
  //   console.log(items);

  useEffect(() => {
    // const params = useParams
    // console.log(userData.wishlist);
    const wishlist = userData.wishlist;
    // console.log(wishlist)
    // let wishlistIds = Object.values(wishlist);

    // console.log("hello");
    if (wishlist.length !== 0) {
      const productIds = wishlist.map((item) => item._id);
      const findProduct = async () => {
        const productsResponse = await axios.post(
          `${backend}/api/product/`,
          { productIds },
          { withCredentials: true }
        );
        // const product = await axios.get(``);
        console.log(Object.values(productsResponse.data));
        // setItems(userData?.wishlist || []);

        setItems(Object.values(productsResponse.data));
      };
      findProduct();
    } else {
      setItems([]);
    }
    // console.log(wishIds)
    // wishlistIds = Object.values(wishlistIds)
    // console.log(productIds);
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      console.log(productId);
      // Make an API call to remove the item from the wishlist
      const res = await axios.post(
        `${backend}/api/user/removefromwishlist/${productId}`,
        {},
        { withCredentials: true }
      );
      // console.log(res)
      if (res.status === 200) {
        // Update the local state to reflect the removal
        setItems((prevItems) =>
          prevItems.filter((item) => item._id !== productId)
        );
      } else {
        console.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 p-4 pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Wishlist</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-48 w-full object-cover  text-center"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-700 text-center">
                  {item.productName}
                </h2>
                <p className="text-gray-500 mt-1 text-center">
                  Price: ${item.productPrice}
                </p>
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="mt-3 w-full text-sm text-white bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">
            Your wishlist is empty. Start adding items!
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
