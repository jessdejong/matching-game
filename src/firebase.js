// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8nCp0LfEopF4oROM8FK5jaPyf8x0z2zY",
  authDomain: "matching-game-with-firebase.firebaseapp.com",
  projectId: "matching-game-with-firebase",
  storageBucket: "matching-game-with-firebase.appspot.com",
  messagingSenderId: "820320672499",
  appId: "1:820320672499:web:8d206dc2e443a1f5f2b586",
  measurementId: "G-ZGDR68MBDS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

async function getLeaderboard(db) {
  const q = query(collection(db, "gameRuns"), orderBy("time"), orderBy("numMoves"));
  
  const querySnapshot = await getDocs(q);

  let result = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
    // console.log(doc.id, " => ", doc.data());
  });

  console.log(result);
  
  return result;

  // console.log("here");
  // const gameRuns = collection(db, "gameRuns");
  // const gameRunSnapshot = await getDocs(gameRuns);
  // const gameRunsList = gameRunSnapshot.docs.map((doc) => doc.data());
  // return gameRunsList;
}

async function addGameRun(db, gameRunObj) {
  console.log(gameRunObj);
  try {
    const docRef = await addDoc(collection(db, "gameRuns"), gameRunObj);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { db, getLeaderboard, addGameRun };
