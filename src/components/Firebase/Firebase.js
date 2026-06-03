import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, getFirestore, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaIHzt2qZv8JxWkPsR-YxbaorCCbvZ7lg",
  authDomain: "olx-clone-59e41.firebaseapp.com",
  projectId: "olx-clone-59e41",
  storageBucket: "olx-clone-59e41.firebasestorage.app",
  messagingSenderId: "66385194987",
  appId: "1:66385194987:web:fc4346424b075302bb33ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const fireStore = getFirestore(app);

const fetchFromFirestore = async () => {
  try {
    const productsCollection = collection(fireStore, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const signupWithEmail = async (email, password) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const name = email.split("@")[0];
    await updateProfile(userCred.user, { displayName: name });
    return userCred.user;
  } catch (error) {
    throw error;
  }
};

const loginWithEmail = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (error) {
    throw error;
  }
};

const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(fireStore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "User",
        email: user.email,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(fireStore, 'products', productId));
  } catch (error) {
    throw error;
  }
};

export { auth, provider, fireStore, fetchFromFirestore, signupWithEmail, loginWithEmail, logoutUser, saveUserToFirestore, deleteProduct };