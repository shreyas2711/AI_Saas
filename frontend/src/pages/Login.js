import { useState } from "react";
import { useAuth } from "../AuthProvider";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const auth = useAuth();
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      auth.loginAction(input);
      return;
    }
    alert("please provide a valid input");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div style={{
        backgroundImage: 'url("https://img.freepik.com/premium-vector/abstract-plexus-technology-futuristic-network-connecting-lines-vector-illustration-background_551880-264.jpg")',
        height: '100vh',
        backgroundSize: 'cover', // Ensures the image covers the full viewport
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex', // Flexbox for centering the form
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form onSubmit={handleSubmitEvent} style={{
          background: 'rgba(255, 255, 255, 0.8)', // Adding a slight white overlay for readability
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="form_control">
            <label htmlFor="user-email">Email:</label>
            <input
              type="email"
              id="user-email"
              name="email"
              placeholder="example@yahoo.com"
              aria-describedby="user-email"
              aria-invalid="false"
              onChange={handleInput}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
          <div className="form_control">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
          <button className="btn-submit" style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3448c5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
