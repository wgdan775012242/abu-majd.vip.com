import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQgw0DI-CHdaMUBOWrAEC7F--DrlpVNBE",
  authDomain: "abu-majd-vip.firebaseapp.com",
  projectId: "abu-majd-vip",
  storageBucket: "abu-majd-vip.firebasestorage.app",
  messagingSenderId: "1036169106035",
  appId: "1:1036169106035:web:60e2464a01add8eb859006",
  measurementId: "G-MLZ1JC7CDH"
};

// تهيئة تطبيق فايربيس
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحديد المجموعات (جداول قاعدة البيانات)
const jobsCollection = collection(db, "jobs");
const marketCollection = collection(db, "marketAds");

export { db, jobsCollection, marketCollection };
