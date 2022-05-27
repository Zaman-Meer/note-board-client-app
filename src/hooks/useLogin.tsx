import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useLogin = () => useContext(AuthContext);

export default useLogin;
