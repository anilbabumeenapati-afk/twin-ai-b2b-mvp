import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function assignRole(user, role = "employee") {
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, { email: user.email, role }, { merge: true });
}

export async function getRole(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().role : null;
}
