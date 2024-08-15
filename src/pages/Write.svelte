<script>
  import { getDatabase, ref, push } from "firebase/database";
  import Footer from "../components/Footer.svelte";
  import {
    getStorage,
    ref as refImage,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";

  let title;
  let price;
  let description;
  let place;
  let files;

  const storage = getStorage();
  const db = getDatabase();

  function writeUserData(imgUrl) {
    push(ref(db, "items/"), {
      title: title,
      price: price,
      description: description,
      place,
      insertAt: new Date().getTime(),
      imgUrl,
    });
    alert("글쓰기가 완료되었습니다.");
    window.location.hash = "/";
  }

  // 'file' comes from the Blob or File API
  // uploadBytes(storageRef, file).then((snapshot) => {
  //   console.log("Uploaded a blob or file!");
  // });

  // $: if (files) console.log("변경된 files에 담긴 값:&%&%&%&%&%>>>", files);
  //Svelte 문법 files에 변화가 있을 때마다 동작함
  // $: if (files) console.log(files[0]);

  const uploadFile = async () => {
    const file = files[0];
    const name = file.name;
    const imgRef = refImage(storage, name);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    console.log("응답", url);
    return url;
  };

  const handleSubmit = async () => {
    const url = await uploadFile();
    writeUserData(url);
  };
</script>

<!-- <button on:click={() => writeUserData("abc", "me", "abc@abc.com")} -->
<!-- <button on:click={() => console.log(title, description, place, price)}
  >테스트</button
> -->
<!-- document.querySelector("button").addEventListener("click", writeUserData);
  해당  형식으로 동작을 만들 던 것을 더 간단히 만들 수 있다. -->

<form id="write-form" on:submit|preventDefault={handleSubmit}>
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

<Footer location="write" />

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
