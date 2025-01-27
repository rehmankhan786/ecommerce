import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="w-3/12 mt-3 border h-64 animate-pulse">
      {/* Skeleton for image */}
      <div className="h-[70%] bg-gray-300 rounded"></div>
      
      {/* Skeleton for product name */}
      <div className="h-[30px] bg-gray-300 rounded mt-2"></div>
      
      {/* Skeleton for product price */}
      <div className="h-[30px] bg-gray-300 rounded mt-2"></div>
    </div>
  );
};

export default ProductSkeleton;
