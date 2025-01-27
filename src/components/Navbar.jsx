import React, { useState } from "react";
import SearchBox from "../minicomponents/SearchBox";
import { Link } from "react-router-dom";
import Navbuttons from "../minicomponents/Navbuttons";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className=" max-sm:absolute relative top-0 left-0  ">
      <div className="w-full h-16 flex flex-row justify-between px-4 pr-0 sm:pr-4 bg-yellow-50  fixed top-0 left-0 z-20 items-center">
        {/* Logo */}

        <div className="logo font-[Inconsolata] relative items-center text-orange-600 text-2xl md:text-4xl font-extrabold w-fit ">
          <Link to="/">MYECOM</Link>
        </div>

        {/* Search Box */}
        <div className="hidden lg:block md:block w-fit  mx-4">
          <SearchBox />
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="sm:hidden absolute right-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl z-30 absolute -top-3 outline-none  right-1"
          >
            {isMobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Navbuttons for Desktop and Mobile */}
        <div
          className={`${
            isMobileMenuOpen ? " w-5/12 justify-center sm:w-fit absolute -top-3 sm:relative right-0 sm:h-full flex h-[100vh] bg-white sm:bg-transparent  z-20 pt-10 sm:pt-0" : " hidden sm:inline-block w-[400px] h-full"
          }   -top-1 `}
        >
          <Navbuttons />
          {/* <div className="  flex flex-row  relative border border-red-500  justify-end right-0" > */}
        {/* </div> */}
        </div>
      </div>

      {/* Additional margin to push content below the fixed navbar */}
      {/* <div className="pt-16"></div> */}
    </div>
  );
};

export default Navbar;
