import { auth } from "../firebase_init";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage({ onLogin }) {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    console.log("Firebase ID Token:", token);
    onLogin(token);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>Login to LeetCode Spaced Repetition</h2>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
}
