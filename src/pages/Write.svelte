<script>
  import { getDatabase, ref, push } from "firebase/database";
  // 파이어베이스 데이터베이스에서 데이터베이스를 가져오는 기능 전송하는 기능
  //특정 경로를 가리키는 참조(reference)를 생성하는 기능을 가져온다.
  import Nav from "../components/Nav.svelte";
  import {
    getStorage,
    ref as refImage,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";

  // getStorage: 파이어 베이스의 저장소의 인스턴스를 가져오는 기능
  //  ref as refImage: 해당 경로를 참조할 수 있게하는 기능인데 데이터베이스와 이름이 겹쳐서 refImage 이름으로 스토리지의 ref를 지칭함
  // uploadBytes: ref에 참조된 경로로 파일을 업로드하는 기능
  // getDownloadURL: 저장소에 있는 파일을 다운로드할 수 있는 url을 가져오는 기능

  let title;
  let price;
  let description;
  let place;
  let files; // 이미지를 담는 변수

  const storage = getStorage(); // 저장소를 가져와서 변수에 담음
  const db = getDatabase(); // 데이터베이스의 정보를 가져와서 db라는 변수에 담는다.

  function writeUserData(imgUrl) {
    // url정보를 받아와서
    push(ref(db, "items/"), {
      //데이터베이스의 items라는 이름의 테이블 경로에 제목 가격 내용 장소 작성시간 이미지를 전송한다.
      title: title,
      price: price,
      description: description,
      place, // place:place와 같이 보낼 값과 변수명이 일치하면 js에서는 생략해서 적을 수 있다.
      insertAt: new Date().getTime(),
      imgUrl, // 그 값을 데이터베이스에 올린다.
    });
    alert("글쓰기가 완료되었습니다.");
    window.location.hash = "/"; //  데이터베이스에 데이터 전송 완료 즉 글쓰기 완료후 홈페이지로 이동
  }

  // 'file' comes from the Blob or File API
  // uploadBytes(storageRef, file).then((snapshot) => {
  //   console.log("Uploaded a blob or file!");
  // });

  // $: if (files) console.log("변경된 files에 담긴 값:&%&%&%&%&%>>>", files);
  //Svelte 문법 files에 변화가 있을 때마다 동작함
  // $: if (files) console.log(files[0]);

  const uploadFile = async () => {
    const file = files[0]; // 이미지의 정보들을 담은 파일을 변수에 담고
    const name = file.name; // 이미지파일의 이름 부분을 변수에 담고
    const imgRef = refImage(storage, name); // 이미지파일의 이름으로 경로를 만들어 저장소에 저장할꺼라 선언
    await uploadBytes(imgRef, file); //이미지파일 이름 경로에 이미지파일을 저장시킨다.
    const url = await getDownloadURL(imgRef); // 업로드 된 해당 파일을 다운로드 가능한 url을 받아 변수에 담고
    console.log("응답", url); // url값이 잘 들어왔는지 확인한다.
    return url; // 그 url을 반환한다.
  };

  const handleSubmit = async () => {
    // 전송 버튼이 눌리면
    const url = await uploadFile(); // 이미지파일을 저장소에 먼저 올리고 그 이미지를 다운할  url을 받아온 뒤
    writeUserData(url); // 그 url정보를 가지고 데이터베이스에 저장하는 함수를 동작시킴
  };
</script>

<!-- <button on:click={() => writeUserData("abc", "me", "abc@abc.com")} -->
<!-- <button on:click={() => console.log(title, description, place, price)}
  >테스트</button
> -->
<!-- document.querySelector("button").addEventListener("click", writeUserData);
  해당  형식으로 동작을 만들 던 것을 더 간단히 만들 수 있다. -->

<form id="write-form" on:submit|preventDefault={handleSubmit}>
  <!-- 해당 영역에서 submit 이벤트 발생시 리다이렉션을 막고 함수를 동작시킨다. -->
  <!-- event.preventDefault();와 같은 기능을 함 -->

  <div>
    <label for="image">이미지</label>
    <input type="file" bind:files id="image" name="image" />
  </div>
  <div>
    <label for="title">제목</label>
    <input type="text" id="title" name="title" bind:value={title} />
  </div>
  <div>
    <label for="price">가격</label>
    <input type="number" id="price" name="price" bind:value={price} />
  </div>
  <div>
    <label for="description">설명</label>
    <input
      type="text"
      id="description"
      name="description"
      bind:value={description}
    />
  </div>
  <div>
    <label for="place">장소</label>
    <input type="text" id="place" name="place" bind:value={place} />
  </div>
  <div>
    <button class="write-button" type="submit">글쓰기 완료!</button>
  </div>
</form>

<Nav location="write" />

<style>
  .write-button {
    background-color: gainsboro;
    margin: 10px;
    border-radius: 10px;
    padding: 5px 12px 5px 12px;
    color: white;
    cursor: pointer;
    border: solid 1px black;
  }
</style>
