import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// 파이어베이스 인증 모듈에서 getAuth 함수를 가져옴 해당함수는 앱의 인증기능을 초기화하고 인증관련 작업을 처리할 수 있는 객체를 반환함
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};
// 해당 firebaseConfig는 노출되면 안된다. 이것을 가져가서 타인이 다른 앱을 만들어 서비스를 할 수 도 있다
// 즉 의도하지않은 앱을 배포하게 될 수 있다.
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
// 해당 app애플리캐이션에 인증 객체를 생성한다.
