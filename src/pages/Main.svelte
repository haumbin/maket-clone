<script>
  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import { getDatabase, ref, onValue } from "firebase/database";
  /*
  onValue는 Firebase Realtime Database에서 특정 경로의 데이터를 지속적으로 모니터링하고,
  데이터가 변경될 때마다 자동으로 콜백 함수를 호출하는 리스너(listener) 역할
  이를 통해, 실시간으로 데이터가 변경될 때마다 업데이트된 데이터를 받아올 수 있는 기능을 구현.**/

  let hour = new Date().getHours(); // date 객체에서 현재 시간단위를 가져옴
  let min = new Date().getMinutes(); // date 객체에서 현재 분단위를 가져옴

  $: items = []; //  반응형 변수 선언 해당 값이 변경되면 자동으로 화면에서도 변함 렌더링?

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
  const itemsRef = ref(db, "items/"); // 데이터 베이스의 items 경로를 참조하는 변수

  onMount(() =>
    //화면이 보여질 때마다 출력이 될 수 있도록한다.
    // svelte에서 js파일은 처음 화면이 뜰 때만 한번만 동작하게 되는데
    // 매번 화면에 접근할 때마다 동작하게 하고 싶다면 onMount를 사용하면된다.

    onValue(itemsRef, (snapshot) => {
      // onValue는   Realtime Database의  itemsRef 즉 item 경로의 테이블 값 즉 데이터들의 상태가 갱신될 때마다 반복해서 실행되는 함수
      // snapshot 은 itemRef 즉 items 테이블 경로에 저장되어 있는 테이블 값들 즉 데이터의 상태가 저장되어진 객체
      const data = snapshot.val();
      // items경로의 테이블에 들어있는 모든 값을 변수 data에 담는다
      // console.log(data);
      // console.log(JSON.stringify(data, null, 2));
      items = Object.values(data).reverse();
      //Object.values(data) : data에 든 items테이블에 든 값들을 배열로 변환한다.
      //reverse() : 그 값들을 최근에 입력한게 첫번째에오고 가장 처음 작성한게 마지막으로 가게 정렬한다.
      /*
      data 객체가 { item1: 'value1', item2: 'value2', item3: 'value3' } 같은 형태일 때
       Object.values(data)는 ['value1', 'value2', 'value3']와 같은 배열을 반환합니다**/
      // 이렇게 해당 경로에 변경이 있을 때 빈 배열 items에 해당 값들을 넣게된다.

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
    <!-- 스벨트에서 사용하는 each문
   Svelte의 {#each} 문은 JavaScript의 forEach와 HTML 요소를 추가하는 기능이 결합된 구조적인 문법 -->
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
  <!-- 해당 값들을 하나씩 html 영역을 생성하면서 item 배열의 값들을 뿌려준다. -->
  <a class="write-btn" href="#/write">+ 글쓰기</a>
  <!--특정 태그로 이동시켜주는 대표적인 태그-->
</main>

<Nav location="home" />

<div class="media-info-msg">화면 사이즈를 줄여주세요.</div>

<style>
  .info-bar__time {
    color: blue;
  }
</style>
