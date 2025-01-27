import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Product from "../minicomponents/Product";
import { Link } from "react-router-dom";
import { backend, myContext } from "..";

const Products = () => {
;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const { isLoading, setIsLoading } = useContext(myContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setIsLoading(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backend}/api/product?page=${page}`
        );
        setTotalPages(response.data.maxPage);
        setProducts(response.data.filteredProducts); // Update state with fetched data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // In case of error, stop loading
      }
    };
    fetchData();
  }, [page]);

  const BeforeLoading = () => {
    return (
      <div className="flex border flex-row">
        <div className="w-[30vw] mt-3  border-[20px] h-64 animate-pulse">
          <div className="h-[70%] bg-gray-300 rounded"></div>
          <div className="h-[30px] bg-gray-300 mt-2 rounded"></div>
          <div className="h-[30px] bg-gray-300 mt-2 rounded"></div>
        </div>
      </div>
    );
  };

  const AfterLoading = () => {
    return (
      <>
        <div className="w-[100vw] flex flex-row gap-3 flex-wrap justify-around h-[90vh] overflow-y-scroll pb-24">
          {products.map((item, index) => (
            <Product key={index} value={item} />
          ))}
        </div>

        <div className="flex flex-row gap-5 mb-12 justify-center fixed bottom-0  h-[30px] w-full">
          <Link
            to={"/products"}
            className="text-center hover:font-bold transition-all duration-150"
            onClick={() =>
              setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))
            }
          >
            Prev
          </Link>
          <Link
            to={"/products"}
            className="text-center hover:font-bold transition-all duration-150"
            onClick={() =>
              page < totalPages ? setPage(page + 1) : setPage(totalPages)
            }
          >
            Next
          </Link>
          <Link
            to={"/products"}
            className="text-center hover:font-bold transition-all duration-150 w-7"
            onClick={() => setPage(2)}
          >
            2
          </Link>
        </div>
      </>
    );
  };

  const dummyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (isLoading) {
    // console.log(isLoading);
    return (
      <div className="flex flex-row h-[80vh] overflow-hidden flex-wrap mt-12 gap-5 justify-around w-full">
        {dummyArray.map((item) => (
          <BeforeLoading key={item} />
        ))}
      </div>
    );
  } else {
    // console.log(isLoading);
    return <div className="flex flex-col">{<AfterLoading />}</div>;
  }
};

export default Products;
