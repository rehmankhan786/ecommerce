import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

const SearchBox = () => {
  const [searchboxvalue, setsearchbox] = useState("");
  const handleType = (e) => {
    e.preventDefault();
    setsearchbox(e.target.value);
  };

  return (
    <div className="search w-[33vw] h-[90%] mt-px border flex flex-row rounded-full">
      <div className="w-[90%]  outline-none">
        <input
          type="text"
          name=""
        style={{backgroundColor:"transparent"}} placeholder="Search Product Here"  value={searchboxvalue}
          onChange={(e) => handleType(e)}
          className="w-full h-full outline-none pl-4"
          id=""
        />
      </div>
        <button>

        <CiSearch size={30} style={{color:"grey", backgroundColor:"transparent"}} />
        </button>
    </div>
  );
};

export default SearchBox;
