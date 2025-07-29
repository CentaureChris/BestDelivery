import React, { useState } from "react";
import { login, setAuthToken } from "../api/";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/LoginPage.module.css"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(email, password);
      setAuthToken(token);
      localStorage.setItem("token", token);
      setLoading(false);
      navigate("/"); 
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>
        <input className={styles.input} type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)}/>
        <input className={styles.input} type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)}/>
          {error && ( 
            <div className={styles.error}> 
              {error}
            </div>
        )}

        <button
          type="submit" disabled={loading} >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;