import { useState } from "react";
import { auth, googleProvider } from "../../shared/firebase/config";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { assignRole } from "../../shared/firebase/roles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google SSO
  const googleLogin = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await assignRole(user, "employee");
    alert("Google login success ✅");
  };

  // Email Login
  const emailLogin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome back ${user.email}`);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await assignRole(user, "employee"); // default role
        alert(`New user created: ${user.email}`);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={emailLogin}>Login / Register</button>
      <br />
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}
