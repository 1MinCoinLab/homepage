# ping_wakeup.py

import threading
import requests
import time

# 10분마다 서버에 ping 보내는 함수
def periodic_ping():
    while True:
        try:
            print("[PING] 서버에 주기적으로 요청을 보냅니다...")
            requests.get('https://onemincoinlab.onrender.com/')  # 배포 시엔 도메인으로 변경
        except Exception as e:
            print("[PING 오류]", e)
        time.sleep(600)  # 600초 = 10분

# 스레드를 시작하는 함수
def start_ping_thread():
    ping_thread = threading.Thread(target=periodic_ping, daemon=True)
    ping_thread.start()
