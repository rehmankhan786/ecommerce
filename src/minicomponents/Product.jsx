import React from "react";
import { Link } from "react-router-dom";

const Product = ({ value: { productName, productImage, productPrice, _id } }) => {
  let productId = _id;
  return (
    <div className="w-11/12 sm:w-3/12 lg:w-3/12,border-red-400 mt-6 border rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 p-3 hover:shadow-2xl">
      <Link to={`/product/${productId}`} className="block h-full">
        <img
          src={productImage}
          alt="productImage"
          className="w-full h-56 object-cover hover:opacity-80 transition-opacity duration-300"
        />
        <div className="p-4 space-y-2">
          <h5 className="text-lg font-semibold text-center text-gray-800">{productName}</h5>
          <h5 className="text-md font-medium text-center text-orange-600">{productPrice}</h5>
        </div>
      </Link>
    </div>
  );
};

export default Product;
