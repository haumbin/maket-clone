<script>
  import Login from "./pages/Login.svelte";
  import Main from "./pages/Main.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import Signup from "./pages/Signup.svelte";
  import Write from "./pages/Write.svelte";
  import Router from "svelte-spa-router";
  //해당 패키지에서 라우터 기능? 컴포넌트? 를 가져온다.
  import "./css/style.css";
  import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
  } from "firebase/auth";
  // 파이어베이스 인증 영역에서 구글인증제공자를 가져온다

  import { user$ } from "./store";
  import { onMount } from "svelte";
  import Loading from "./pages/Loading.svelte";
  import Mypage from "./pages/Mypage.svelte";
  // const provider = new GoogleAuthProvider(); // 해당 기능의 인스턴스를 생성한다.
  // provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  // 사용자가 애플리케이션에 제공하는 제공범위를 설정합니다.
  // 애플리케이션이 사용자의 연락처 정보를 읽기만 하고 수정하거나 삭제할 수는 없다는 것

  // let login = false; // 로그인이 되어 있지 않은 상태로 기본 정의

  let isLoading = true;

  const auth = getAuth();
  // 인증 객체를 생성해서 담음

  const checkLogin = async () => {
    console.log("렌더링!");

    const token = localStorage.getItem("token");
    // 로컬 스토리지의 토큰을 가져온다.
    if (!token) return (isLoading = false);
    // 만약 가져올 토큰이 없으면 로그인 창을 띄울 수 있게 값을 변경 후 종료
    const credential = GoogleAuthProvider.credential(null, token);
    // 구글 인증 자격증을 가지고 온 토큰을 이용해서 생성한다.
    const result = await signInWithCredential(auth, credential);
    // 인증 객체에 인증 자격증을 통해 인증 후 결과 값을 받는다.
    const user = result.user;
    // 결과 값을 변수에 담고
    user$.set(user);
    // 해당 변수를 저장소에 저장한다.
    isLoading = false;
  };

  const routes = {
    "/": Main,
    "/signup": Signup,
    "/write": Write,
    "/my": Mypage,
    "*": NotFound,
  };

  onMount(() => checkLogin());
  // 해당 화면이 실행 될 때마다 동작하게 한다.
</script>

{#if isLoading}
  <!-- 토큰이 있으면 기본 적으로 로딩화면을 띄우고 -->
  <Loading />
{:else if !$user$}
  <!-- 토큰이 없고 저장소의 user$ 라는 writable 값이 없다면 로그인창 -->
  <Login />
  <!-- Login.svelte 파일을 보여주고 -->
{:else}
  <!--저장소의 값이 있다면  라우터를 보여준다? 즉 서비스를 이용할 수 있게한다 -->
  <Router {routes} />
{/if}
<!-- 해당 변수 안에 경로로 라우팅을 설정한다. -->
<!-- 라우팅(Routing)은 웹 애플리케이션이나 웹 사이트에서 사용자가
  요청하는 URL에 따라 적절한 콘텐츠를 반환하는 과정 -->
<!-- 즉 url 요청에 따라 svelte 파일을 반환하게 된다. -->
