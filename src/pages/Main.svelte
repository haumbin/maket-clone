<script>
  import { onMount } from "svelte";
  import Footer from "../components/Footer.svelte";
  import { getDatabase, ref, onValue } from "firebase/database";

  let hour = new Date().getHours(); // date 객체에서 현재 시간단위를 가져옴
  let min = new Date().getMinutes(); // date 객체에서 현재 분단위를 가져옴
  

  $: items = []; // 해당 값이 변경되면 자동으로 화면에서도 변함 렌더링?

  const calcTime = (timestamp) => {
    //한국시간 UTC+9시간 (세계시간 기준으로)

    const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; // 현재 시각의 타임스탬프를 가져옵니다.
    const time = new Date(curTime - timestamp); // 현재 시각에서 입력받은 타임스탬프를 빼서 경과된 시간을 계산합니다.
    const hour = time.getHours(); // 경과된 시간에서 시간을 추출합니다.
    const minute = time.getMinutes(); // 경과된 시간에서 분을 추출합니다.
    const second = time.getSeconds(); // 경과된 시간에서 초를 추출합니다.

    if (hour > 0)
      return `${hour}시간 전`; // 경과 시간이 1시간 이상일 경우 "시간 전"으로 표시합니다.
    else if (minute > 0)
      return `${minute}분 전`; // 경과 시간이 1분 이상 1시간 미만일 경우 "분 전"으로 표시합니다.
    else if (second >= 0)
      return `${second}초 전`; // 경과 시간이 1초 이상 1분 미만일 경우 "초 전"으로 표시합니다.
    else return "방금 전";
  };

  const db = getDatabase();
  const itemsRef = ref(db, "items/");

  onMount(() =>
    //화면이 보여질 때마다 출력이 될 수 있도록한다.
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      // console.log(JSON.stringify(data, null, 2));
      items = Object.values(data).reverse();
      console.log("items 배열에 든 값 _+_+_+_+__+_+_>>>>", items);
    })
  );
</script>

<header>
  <div class="info-bar">
    <div class="info-bar__time">{hour}:{min}</div>
    <div class="info-bar__icons">
      <img src="assets/chart-bar.svg" alt="chart-bar" />
      <img src="assets/wifi.svg" alt="wifi" />
      <img src="assets/battery.svg" alt="battery" />
    </div>
  </div>
  <div class="menu-bar">
    <div class="menu-bar__location">
      <div>역삼1동</div>
      <div class="menu-bar__location-icon">
        <img src="assets/arrow.svg" alt="arrow" />
      </div>
    </div>
    <div class="menu-bar__icons">
      <img src="assets/search.svg" alt="search" />
      <img src="assets/menu.svg" alt="menu" />
      <img src="assets/bell.svg" alt="bell" />
    </div>
  </div>
</header>
<main>
  {#each items as item}
    <div class="item-list">
      <div class="item-list__img">
        <img src={item.imgUrl} alt={item.title} />
      </div>
      <div class="item-list__info">
        <div class="item-list__info-title">{item.title}</div>
        <div class="item-list__info-meta">
          {item.place}
          {calcTime(item.insertAt)}
        </div>
        <div class="item-list__info-price">{item.price}</div>
        <div class="item-list__info-description">{item.description}</div>
      </div>
    </div>
  {/each}
  <a class="write-btn" href="#/write">+ 글쓰기</a>
  <!--특정 태그로 이동시켜주는 대표적인 태그-->
</main>

<Footer location="home" />

<div class="media-info-msg">화면 사이즈를 줄여주세요.</div>

<style>
  .info-bar__time {
    color: blue;
  }
</style>
