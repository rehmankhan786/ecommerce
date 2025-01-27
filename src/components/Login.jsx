import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { backend, myContext } from "..";




const Login = () => {
  let {userData,setUserData,userLogged,setUserLogged} = useContext(myContext)
  const [formData, setFormData] = useState({
    // name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e.target);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevents page reload
      
      try {
        const res = await axios.post(`${backend}/api/user/login`, formData,{withCredentials:true});
        toast.success(res.data.msg)
        setUserData( res.data.user )
        setUserLogged(true)
        window.location.href="/"

      } catch (error) {
        // console.log()
        console.log(error)
        toast.error(error.response.data.msg)
        if (error.response) {
          // The server responded with a status code other than 2xx
          console.error(
            "Error Response:",
            error.response.status,
            error.response.data
          );
          // toast.error(error.response.data.msg);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error Request:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error:", error.message);
        }
      }
      
      // const data = await res.json();
      try {
      } catch (error) {
        // console.log(res);
      }
      // console.log(res)
      // return <Register/>
  };

  return (
    <div className="h-[80vh] ">

    
    <Form className="w-2/3 border p-2 ml-[50%] mt-20  -translate-x-[50%] flex flex-col gap-7 ">
      <h3 className="text-center font-bold">LOGIN</h3>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {/* <Form.Label className=''>Email address</Form.Label> */}
        <Form.Control
          type="email"
          name="email"
          className="w-[100%] border text-center h-8 rounded-l "
          value={formData.email}
          onChange={(e) => handleChange(e)}
          placeholder="Enter email"
        />
        <Form.Text className="text-muted">
          {/* We'll never share your email with anyone else. */}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        {/* <Form.Label>Password</Form.Label> */}
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
          className="w-[100%] border text-center  rounded-l h-8"
          placeholder="Password"
        />
      </Form.Group>

      <Button
        variant="primary"
        onClick={(e) => handleSubmit(e)}
        className="w-[100%] border text-center h-8 rounded-l bg-green-500 font-semibold text-white hover:bg-green-600  transition-all duration-300"
        type="submit"
      >
        Submit
      </Button>
      <div className=" text-center">
        not registered?{" "}
        <Link to={"/register"} className="font-bold text-blue-400 hover:text-blue-600  transition-all duration-300">
          Click here
        </Link>
      </div>
    </Form>
    <Toaster/>
    </div>
  );
};

export default Login;
