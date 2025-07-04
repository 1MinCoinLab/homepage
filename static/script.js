document.addEventListener('DOMContentLoaded', () => {
  loadCoinPrices();
});

function openModal(videoId) {
  document.getElementById('ytplayer').src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('ytplayer').src = '';
  document.getElementById('modal').classList.remove('active');
}
function searchFunb() {
  const coin = document.getElementById('funb-search').value.trim().toUpperCase();
  const resultEl = document.getElementById('funb-result');

  fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`)
    .then(res => res.json())
    .then(data => {
      resultEl.innerText = `${coin} 현재 가격: ${parseFloat(data.price).toFixed(4)} USDT`;
    })
    .catch(() => {
      resultEl.innerText = '해당 코인을 찾을 수 없습니다.';
    });
}
async function searchFunb() {
  const coin = document.getElementById('funb-search').value.trim().toUpperCase();
  const resultEl = document.getElementById('funb-result');

  try {
    const res = await fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${coin}USDT&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      const fundingRate = parseFloat(data[0].fundingRate) * 100;
      const time = new Date(data[0].fundingTime).toLocaleString();
      resultEl.innerText = `${coin} 펀딩비율: ${fundingRate.toFixed(4)}% (기준시각: ${time})`;
    } else {
      resultEl.innerText = '펀딩비 데이터를 찾을 수 없습니다.';
    }
  } catch {
    resultEl.innerText = '조회 중 오류가 발생했습니다.';
  }
} 

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
