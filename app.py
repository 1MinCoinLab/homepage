import os
import sys
import subprocess
import time
import json
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
from visit_counter import get_today_count
from ping_wakeup import start_ping_thread

# 로컬 개발 시 .env 파일 로딩
load_dotenv()

app = Flask(__name__)

# 환경변수에서 API 키와 채널 ID 불러오기
API_KEY = os.getenv('API_KEY')
CHANNEL_ID = os.getenv('CHANNEL_ID')
MAX_RESULTS = 50

# 영상 정보 업데이트 함수 (외부 Python 파일 실행)
def update_videos_json_and_wait():
    try:
        subprocess.run([sys.executable, 'youtube_fetcher.py'], check=True)
    except Exception as e:
        print("youtube_fetcher 실행 중 오류:", e)

    # 최대 10초간 videos.json 업데이트 대기
    for _ in range(20):
        if os.path.exists('videos.json'):
            try:
                with open('videos.json', encoding='utf-8') as f:
                    data = f.read().strip()
                    if data and data != '[]':
                        return
            except Exception:
                pass
        time.sleep(0.5)

# 영상 정보 로딩
def load_videos():
    try:
        if not os.path.exists('videos.json'):
            return []
        with open('videos.json', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("videos.json 로딩 중 오류:", e)
        return []

'''# 메인 페이지
@app.route('/')
def index():
    update_videos_json_and_wait()
    videos = load_videos()
    return render_template('index.html', videos=videos)
'''

#방문자 카운트.
@app.route('/')
def index():
    update_videos_json_and_wait()
    videos = load_videos()
    today_visits = get_today_count()  # 방문자 수 카운트
    return render_template('index.html', videos=videos, today_visits=today_visits)

# API 엔드포인트
@app.route('/api/videos')
def api_videos():
    update_videos_json_and_wait()
    return jsonify(load_videos())

# robots.txt 서빙
@app.route('/robots.txt')
def robots_txt():
    return app.send_static_file('robots.txt')

# sitemap.xml 서빙
@app.route('/sitemap.xml')
def sitemap_xml():
    return app.send_static_file('sitemap.xml')


# 앱 실행
if __name__ == '__main__':
    start_ping_thread()  # ping 스레드 시작
    app.run(host='0.0.0.0', port=5001, debug=True)
