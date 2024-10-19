import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  console.log("baseUrl:",baseUrl);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  console.log("isAuthenticated", isAuthenticated);

  const loginAction = async (data) => {
    console.log("data:", data);
    try {
      const response = await axios.post(`${baseUrl}/api/user/signin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true // Ensure cookies are sent with the request
      });

      const res = response.data;
      console.log("res:", res);

      if (res) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        setIsAuthenticated(true);
        navigate("/lab/removeObjects");
        return;
      }

      console.log("isauth", isAuthenticated);
      throw new Error(res.message);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
