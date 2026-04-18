import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ADMIN_EMAIL } from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    // 🔐 Firebase login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 🔒 Admin check
    if (user.email !== ADMIN_EMAIL) {
      setError("Access denied");
      return;
    }

    navigate("/dashboard");

  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};
const handleForgotPassword = async () => {
  setSuccess("");
  setError("");
  if (!email) {
    setError("Enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
       setSuccess("Reset link sent to your email 📩");
  } catch (err) {
    console.error(err);
    setError("Failed to send reset email");
  }
};
  return (
    <div className="login-page">

      {/* LEFT */}
      <div className="login-left">
        <div className="overlay">
          <h1>Murugs Sarees</h1>
          <p>Luxury in every thread ✨</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card animate-card">

          <h2>Welcome Back</h2>
          <p className="subtitle">Admin Panel</p>

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email Address</label>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>

            {/* 👁️ TOGGLE */}
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          {/* BUTTON */}
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <span className="forgot"onClick={handleForgotPassword}>Forgot password?</span>

        </div>
      </div>
    </div>
  );
}

export default Login;