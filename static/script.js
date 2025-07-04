<script>
    // 영상 필터링
    function filterVideos() {
        var input = document.getElementById('searchInput').value.toLowerCase();
        var videos = document.querySelectorAll('.video');
        videos.forEach(function(v) {
            var title = v.getAttribute('data-title').toLowerCase();
            v.style.display = title.includes(input) ? '' : 'none';
        });
    }
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
        const symbol = coin + 'USDT';
        const resultEl = document.getElementById('funb-result');

        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                resultEl.innerText = `${coin} 현재 가격: ${parseFloat(data.price).toFixed(4)} USDT`;
            })
            .catch(() => {
                resultEl.innerText = '해당 코인을 찾을 수 없습니다.';
            });
    }

    async function loadCoinPrices() {
        const coins = ['BTC','ETH','XRP','SOL','ADA','DOGE','DOT','AVAX','MATIC','LINK'];
    
        for (const coin of coins) {
            const cl = coin.toLowerCase();
    
            // 빗썸
            try {
                const res = await fetch(`https://api.bithumb.com/public/ticker/${coin}_KRW`);
                const data = await res.json();
                if (data.status === '0000') {
                    document.getElementById(`bithumb-${cl}`).innerText =
                        parseInt(data.data.closing_price).toLocaleString();
                }
            } catch { document.getElementById(`bithumb-${cl}`).innerText = '-'; }
    
            // 바이낸스
            try {
                const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`);
                const data = await res.json();
                document.getElementById(`binance-${cl}`).innerText =
                    parseFloat(data.price).toFixed(2);
            } catch { document.getElementById(`binance-${cl}`).innerText = '-'; }
    
            // OKX
            try {
                const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${coin}-USDT`);
                const data = await res.json();
                document.getElementById(`okx-${cl}`).innerText =
                    parseFloat(data.data?.[0]?.last).toFixed(2);
            } catch { document.getElementById(`okx-${cl}`).innerText = '-'; }
        }
    }
    
    window.onload = loadCoinPrices;



</script>
