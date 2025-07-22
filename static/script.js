// 코인 시세 로딩
document.addEventListener('DOMContentLoaded', () => {
  loadCoinPrices();
});

// 영상 모달 열기
function openModal(videoId) {
  const modal = document.getElementById('modal');
  const player = document.getElementById('ytplayer');
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.classList.add('active');
  modal.scrollIntoView({ behavior: 'smooth' });
}

// 영상 모달 닫기
function closeModal() {
  const modal = document.getElementById('modal');
  const player = document.getElementById('ytplayer');
  player.src = "";
  modal.classList.remove('active');
}

// 코인 가격 로딩 함수
async function loadCoinPrices() {
  const coins = ['BTC','ETH','XRP','SOL','ADA','DOGE','DOT','AVAX','MATIC','LINK'];

  for (const coin of coins) {
    const cl = coin.toLowerCase();

    // 빗썸
    try {
      const res = await fetch(`https://api.bithumb.com/public/ticker/${coin}_KRW`);
      const data = await res.json();
      if (data?.status === '0000') {
        document.getElementById(`bithumb-${cl}`).innerText = parseInt(data.data.closing_price).toLocaleString();
      } else {
        document.getElementById(`bithumb-${cl}`).innerText = '-';
      }
    } catch {
      document.getElementById(`bithumb-${cl}`).innerText = 'ERR';
    }

    // 바이낸스
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`);
      const data = await res.json();
      document.getElementById(`binance-${cl}`).innerText = parseFloat(data.price).toFixed(2);
    } catch {
      document.getElementById(`binance-${cl}`).innerText = 'ERR';
    }

    // OKX
    try {
      const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${coin}-USDT`);
      const data = await res.json();
      const price = parseFloat(data?.data?.[0]?.last);
      document.getElementById(`okx-${cl}`).innerText = isNaN(price) ? '-' : price.toFixed(2);
    } catch {
      document.getElementById(`okx-${cl}`).innerText = 'ERR';
    }
  }
}
