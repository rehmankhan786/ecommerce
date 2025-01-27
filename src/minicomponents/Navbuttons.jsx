import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { myContext } from "..";
// import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

const CartItems = ({ value }) => {
  const { userData } = useContext(myContext);
  let {  idx } = value;
  // let {cart} = userData
  // console.log(value)
  // console.log(cart.length)
  if (idx === 2) {
    return (
      <div className=" absolute top-1 -right-3 bg-red-600 h-4 w-4 justify-center align-middle items-center flex rounded-full text-white animate-ping">
        {userData?.cart?.length||0}
        {/* {console.log(userData.cart?)} */}
      </div>
    );
  }
};

const Navbuttons = () => {
    let [displayStatus,setdisplay]=useState("hidden");

  // const { userData } = useContext(myContext);
  return (
    <div className="flex flex-col items-center w-8/12 sm:w-fit top-2 sm:top-0 sm:flex-row sm:gap-4 h-full relative rounded-md lg:gap-4 md:gap-6 lg:h-full z-10 sm:bg-transparent  gap-8 min-lg:relative max-lg:pt-0  ">
      {["home", "products", "cart"].map((item, idx) => {
        return (
          <div
            key={idx}
            className="flex items-center justify-center text-center h-10 relative z-20 w-full hover:border-b-[2px] max-sm:border-b-[2px] max-sm:border-b-transparent sm:w-fit max-sm:hover:border-b-slate-200 sm:border-none duration-500 transition-all"
          >
            <Link to={`/${item}`}>
              {item.toUpperCase()} <CartItems value={{ itemCount: 1, idx }} />{" "}
            </Link>{" "}
          </div>
        );
      })}
      <Link to={"/user"} onMouseEnter={(e)=>{setdisplay("block") }} onMouseOut={(e)=>{setdisplay("hidden")}} className="relative hover: ">
        <FaUserCircle size={35} className="pt-1" />
      </Link>
      {/* <span className="absolute -bottom-4 bg-black right-16 text-white " style={{display:displayStatus}}>
        {" "}
        {userData.username}{" "}
      </span> */}
    </div>
  );
};

export default Navbuttons;
