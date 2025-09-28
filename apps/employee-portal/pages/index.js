import { useState } from "react";
import { db, auth } from "../../shared/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

export default function Home() {
  const [stress, setStress] = useState(5);
  const [userId, setUserId] = useState(null);

  const login = async () => {
    const { user } = await signInAnonymously(auth);
    setUserId(user.uid);
  };

  const submitStress = async () => {
    if (!userId) return alert("Please log in first");
    const ref = doc(db, "employees", userId);
    await setDoc(ref, {
      stressCheckIns: [{ timestamp: Date.now(), score: stress }]
    }, { merge: true });
    alert("Stress score saved ✅");
  };

  return (
    <div style={{ padding: 20 }}>
      {!userId ? (
        <button onClick={login}>Login</button>
      ) : (
        <>
          <h2>Daily Stress Check-In</h2>
          <input
            type="range"
            min="0"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
          />
          <span>{stress}</span>
          <br />
          <button onClick={submitStress}>Submit Stress</button>
        </>
      )}
    </div>
  );
}
