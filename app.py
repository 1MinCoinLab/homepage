import os
import subprocess
import sys
import time
from flask import Flask, render_template, jsonify
import json
import requests

app = Flask(__name__)

def update_videos_json_and_wait():
    # youtube_fetcher.py 실행
    subprocess.run([sys.executable, 'youtube_fetcher.py'])
    # 최대 10초(0.5초 간격) 동안 videos.json이 비어있지 않을 때까지 대기
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

def load_videos():
    if not os.path.exists('videos.json'):
        return []
    try:
        with open('videos.json', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

@app.route('/')
def index():
    update_videos_json_and_wait()
    videos = load_videos()
    return render_template('index.html', videos=videos)

@app.route('/api/videos')
def api_videos():
    update_videos_json_and_wait()
    return jsonify(load_videos())

@app.route('/robots.txt') ## 로봇 접근을하게 합니다. 
def robots_txt():
    return app.send_static_file('robots.txt')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

handle = '@1분코인연구소'
url = f'https://www.youtube.com/{handle}'
resp = requests.get(url, allow_redirects=True)
print(resp.url)

API_KEY = 'AIzaSyC_e8oQen1d3QXBEH-q29EaaWirF997wKA'
CHANNEL_ID = 'UCdhQfBQJYAZ3CGqEj0BGksQ'
MAX_RESULTS = 4

def fetch_shorts():
    url = (
        f'https://www.googleapis.com/youtube/v3/search'
        f'?key={API_KEY}'
        f'&channelId={CHANNEL_ID}'
        f'&part=snippet'
        f'&maxResults={MAX_RESULTS}'
        f'&order=date'
        f'&type=video'
    )
    resp = requests.get(url)
    print("API 응답 상태코드:", resp.status_code)
    print("API 응답 내용:", resp.text)
    data = resp.json()
    videos = []
    for item in data.get('items', []):
        video_id = item['id']['videoId']
        title = item['snippet']['title']
        thumbnail = item['snippet']['thumbnails']['high']['url']
        videos.append({
            'video_id': video_id,
            'title': title,
            'thumbnail': thumbnail
        })
    with open('videos.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    fetch_shorts() 
