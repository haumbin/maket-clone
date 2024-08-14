const form = document.getElementById("login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  const accessToken = data.access_token; // 서버에서 반환되어 받은 액세스 토큰값을 변수에 담는다.

  window.localStorage.setItem("token", accessToken); // 로컬스토리지에 토큰이라는 이름으로 액세스토큰을 저장한다.
  //   window.sessionStorage.setItem("token", accessToken); // 세션스토리지에 토큰이라는 이름으로 액세스토큰을 저장한다.

  alert("로그인되었습니다.");

  //   if (res.status === 200) {
  //     alert("로그인에 성공했습니다.");
  //     console.log(res.status);
  //     window.location.pathname = "/";
  //   } else if (res.status === 401) {
  //     alert("id 혹은 password가 틀렸습니다.");
  //   }

  const infoDiv = document.querySelector("#info");
  infoDiv.innerText = "로그인되었습니다.";

  window.location.pathname = "/";

  //   const btn = document.createElement("button");
  //   btn.innerText = "상품 가져오기";
  //   btn.addEventListener("click", async () => {
  //     const res = await fetch("/items", {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   });

  //   infoDiv.appendChild(btn);
};

form.addEventListener("submit", handleSubmit);
