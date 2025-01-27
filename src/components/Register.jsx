import axios from "axios";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { backend, myContext } from "..";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  // const location = useLocation();
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    country: "",
    contact: "",
    // cpassword: "",
  });
  // const {setUserData} = useContext(myContext)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e.target);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const uploadData = {};

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    const { password, cpassword } = formData;

    if (password === cpassword) {
      // console.log("Form Data Submitted:", formData);

      try {
        const res = await axios.post(`${backend}/api/user/register`, formData);
        // console.log(res.data);
        // setUserData();
        toast.success(res.data.msg)
        navigation("/login");
        return res.data;
      } catch (error) {
        console.log(error.response.data.msg);
        if (error.response) {
          // The server responded with a status code other than 2xx
          console.error(
            "Error Response:",
            error.response.status,
            error.response.data
          );
          toast.error(error.response.data.msg);
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
    } else {
      toast.success("Password are not same");
      // toast.error(res.data.msg);
      // alert("password must be same");
    }
  };
  return (
    <div>
      <Form className="w-2/3 border p-2 ml-[50%] mt-10 -translate-x-[50%] flex flex-col gap-4 ">
        <h3 className="text-center font-bold">Register here</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {/* <Form.Label className=''>Email address</Form.Label> */}
          <Form.Control
            type="email"
            name="email"
            className="w-[100%] focus:outline-slate-200 border text-center h-8 rounded-l "
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
            className="w-[100%] focus:outline-slate-200 border text-center  rounded-l h-8"
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicconfirmPassword">
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control
            type="password"
            name="cpassword"
            value={formData.cpassword}
            onChange={(e) => handleChange(e)}
            className="w-[100%] focus:outline-slate-200 border text-center  rounded-l h-8"
            placeholder="confirm Password"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Control
            type="text"
            name="username"
            className="w-[100%] focus:outline-slate-200 border text-center  rounded-l h-8"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCountry">
          <Form.Select
            name="country"
            className="w-[100%] focus:outline-slate-200 border outline-none outline-1 text-center rounded-l h-8"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Country
            </option>
            <option value="United States">United States</option>
            <option value="India" selected>
              India
            </option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="Brazil">Brazil</option>
            <option value="South Africa">South Africa</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicContact">
          <Form.Control
            type="text"
            name="contact"
            className="w-[100%] focus:outline-slate-200 border text-center  rounded-l h-8"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
          />
        </Form.Group>

        <Button
          variant="primary"
          onClick={(e) => handleSubmit(e)}
          className="w-[100%] focus:outline-slate-200 border text-center h-8 rounded bg-green-400 font-extrabold text-white"
          type="submit"
        >
          Submit
        </Button>
        <div className=" text-center">
          Already a User?{" "}
          <Link to={"/login"} className="font-bold text-blue-400">
            Click here
          </Link>
        </div>
      </Form>
      <div>
        <Toaster />
      </div>
    </div>
  );
};

export default Register;
