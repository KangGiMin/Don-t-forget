import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export async function getFirebaseIdToken() {
  let user = auth.currentUser;
  if (!user) {
    user = await new Promise((resolve, reject) => {
      let unsubscribe = () => {};
      unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          unsubscribe();
          resolve(currentUser);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  }

  if (!user) throw new Error("Sign-in is required to call this API.");
  return user.getIdToken();
}

export async function getFirebaseAuthHeaders(headers = {}) {
  const idToken = await getFirebaseIdToken();
  return { ...headers, Authorization: `Bearer ${idToken}` };
}


