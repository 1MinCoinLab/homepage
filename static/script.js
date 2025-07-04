resultEl.innerText = '해당 코인을 찾을 수 없습니다.';
});
}

async function loadCoinPrices() {
        const coins = ['BTC', 'ETH', 'FANC'];
        const coins = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'DOT', 'AVAX', 'MATIC', 'LINK'];
    
for (const coin of coins) {
            let priceText = '';
    
            // 1. 빗썸 KRW
try {
const res = await fetch(`https://api.bithumb.com/public/ticker/${coin}_KRW`);
const data = await res.json();
if (data.status === '0000') {
                    document.getElementById(`price-${coin.toLowerCase()}`).innerText =
                        parseInt(data.data.closing_price).toLocaleString();
                    priceText += `빗썸: ${parseInt(data.data.closing_price).toLocaleString()}원 `;
                }
            } catch (e) {}
    
            // 2. 바이낸스 USDT
            try {
                const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`);
                const data = await res.json();
                const usdt = parseFloat(data.price);
                if (!isNaN(usdt)) {
                    priceText += `| 바이낸스: ${usdt.toLocaleString()} USDT `;
}
            } catch (e) {
                document.getElementById(`price-${coin.toLowerCase()}`).innerText = '불러오기 실패';
            }
            } catch (e) {}
    
            // 3. OKX USDT
            try {
                const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${coin}-USDT`);
                const okx = await res.json();
                const okxPrice = parseFloat(okx.data?.[0]?.last);
                if (!isNaN(okxPrice)) {
                    priceText += `| OKX: ${okxPrice.toLocaleString()} USDT`;
                }
            } catch (e) {}
    
            // 출력
            const el = document.getElementById(`price-${coin.toLowerCase()}`);
            el.innerText = priceText || '데이터 없음';
}
}
    

window.onload = loadCoinPrices;


</script>
