<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  // getAuth 인증 객체 생성
  //signInWithPopup 팝업창을 사용하여 사용인증에 사용 (소셜미디어 등)
  //GoogleAuthProvider 구글 로그인 인증에 사용
  import { user$ } from "../store";

  const provider = new GoogleAuthProvider(); // 해당 기능의 인스턴스를 생성한다.
  const auth = getAuth();

  const loginWithGoogle = async () => {
    // 구글을 통한 로그인을 하는 함수
    try {
      // 시도한다.
      const result = await signInWithPopup(auth, provider);
      // `signInWithPopup` 메서드를 사용하여 Google 로그인 팝업을 띄우고 로그인 결과를 가져옵니다.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // 자격 증명 권한을 얻는다.
      const token = credential.accessToken;
      // 해당권한에서 액세스 토큰을 받아 토큰에 담는다.
      const user = result.user;
      // 결과값의 사용자 정보를 변수에 담는다.
      user$.set(user);
      // 상태관리 객체에 사용자 정보를 저장한다.
      localStorage.setItem("token", token);
      // 액세스토큰을 로컬스토리지에 토큰이라는 이름으로 저장한다.
      // console.log("토큰과 유저 값 출력:><><><><><<", token, user);
      // 토큰과 사용자 정보를 콘솔에 출력한다.
    } catch (error) {
      // 해당 과정에서 에러가 발생하면 콘솔에 에러메시지를 남긴다.
      console.error("구글 로그인 중 에러가 발생 : ", error);
    }
  };
</script>

<!-- <form id="login-form" action="/login" method="post">
  <div>로그인하기</div>
  <div>
    <label for="id">아이디</label>
    <input type="text" id="id" name="id" required />
  </div>
  <div>
    <label for="password">패스워드</label>
    <input type="password" id="password" name="password" required />
  </div>
  <div>
    <button type="submit">로그인</button>
  </div>
  <div id="info"></div>
  
</form> -->

<div>
  {#if $user$}
    <!-- user$의 값이 있으면 -->
    <div>{$user$.displayName} 로그인 됨</div>
    <!-- 화면에 출력한다. -->
  {/if}
  <div>로그인하기</div>

  <button class="login-btn" on:click={loginWithGoogle}>
    <img
      class="google-img"
      src="data:image/png;base64,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"
      alt=""
    />
    <div>Google로 시작하기</div>
  </button>
</div>

<style>
  .login-btn {
    width: 200px;
    height: 50px;
    border: 1px solid gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
  }
  .google-img {
    width: 20px;
  }
</style>
