import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// 파이어베이스 인증 모듈에서 getAuth 함수를 가져옴 해당함수는 앱의 인증기능을 초기화하고 인증관련 작업을 처리할 수 있는 객체를 반환함
const firebaseConfig = {
  apiKey: "AIzaSyDWJ3oRn_OXLhHe0EVo7RG0QfD3jOqb7qA",
  authDomain: "carrot-market-afc5c.firebaseapp.com",
  databaseURL:
    "https://carrot-market-afc5c-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "carrot-market-afc5c",
  storageBucket: "gs://carrot-market-afc5c.appspot.com",
  messagingSenderId: "993298189976",
  appId: "1:993298189976:web:40c33cc6d86417ff4c8aed",
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
