document.addEventListener('DOMContentLoaded', () => {
  loadCoinPrices();
  setupVideoSearch();
});

// ✅ script.js 내부에 아래 함수 추가
function submitGuestbook() {
  const name = document.getElementById('guest-name').value.trim();
  const message = document.getElementById('guest-message').value.trim();
  if (!name || !message) return;

  const entry = {
    name,
    message,
    time: new Date().toLocaleString()
  };

  let entries = JSON.parse(localStorage.getItem('guestbook') || '[]');
  entries.unshift(entry);
  localStorage.setItem('guestbook', JSON.stringify(entries));

  renderGuestbook();

  document.getElementById('guest-name').value = '';
  document.getElementById('guest-message').value = '';
}

function renderGuestbook() {
  const entries = JSON.parse(localStorage.getItem('guestbook') || '[]');
  const list = document.getElementById('guestbook-list');
  list.innerHTML = entries.slice(0, 5).map(e => `
    <div style="margin-top:10px; font-size:0.9rem; border-top:1px solid #eee; padding-top:8px;">
      <strong>${e.name}</strong> <span style="color:#888; font-size:0.8rem;">(${e.time})</span><br>
      ${e.message}
    </div>
  `).join('');
}

// ✅ 페이지 로딩 시 방명록 출력
document.addEventListener('DOMContentLoaded', renderGuestbook);

function openModal(videoId) {
  document.getElementById('ytplayer').src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  document.getElementById('modal').classList.add('active');
  document.getElementById('modal').scrollIntoView({ behavior: 'smooth' });
}

function closeModal() {
  document.getElementById('ytplayer').src = '';
  document.getElementById('modal').classList.remove('active');
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

function setupVideoSearch() {
  const input = document.getElementById('video-search');
  const button = document.getElementById('video-search-btn');
  const resultBox = document.getElementById('video-search-results');
  const allVideos = Array.from(document.querySelectorAll('.video'));

  function filterAndShowResults() {
    const keyword = input.value.trim().toLowerCase();
    resultBox.innerHTML = '';
    if (!keyword) return;

    const matches = allVideos.filter(v => {
      const title = v.querySelector('.video-title')?.textContent.toLowerCase() || '';
      return title.includes(keyword);
    });

    matches.forEach(video => {
      const videoId = video.getAttribute('data-video-id');
      const thumbnail = video.querySelector('img')?.src || '';
      const title = video.querySelector('.video-title')?.textContent || '';

      const thumb = document.createElement('img');
      thumb.src = thumbnail;
      thumb.alt = title;
      thumb.style.width = '120px';
      thumb.style.margin = '6px';
      thumb.style.cursor = 'pointer';
      thumb.title = title;
      thumb.onclick = () => openModal(videoId);
      resultBox.appendChild(thumb);
    });
  }

  if (button) button.addEventListener('click', filterAndShowResults);
}
