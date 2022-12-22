import firebase from "firebase";
const API_BASE_URL = "http://localhost:1200";
const app = firebase.initializeApp({
   apiKey: process.env.API_KEY,
   databaseURL: process.env.DATABASE_URL,
   authDomain: process.env.AUTH_DOMAIN,
});

const rtdb = firebase.database();
console.log(process.env.API_KEY);

export { rtdb };