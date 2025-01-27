import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

export const backend = 'http://localhost:4000'
export const myContext = createContext({ authorization: false });
const AppWrapper = () => {
  const guest={username:"Guest",cartlength:0}
  const [userData, setUserData] = useState(guest);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <myContext.Provider value={{userData,setUserData,userLogged,setUserLogged,guest,isLoading,setIsLoading}}>
      <App />
    </myContext.Provider>
  );
};

root.render(<AppWrapper />);
// module.exports = myContext