#Fix: 안정적인 YouTube fetcher 코드 반영 

import requests
import json
import re
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

VIDEOS_JSON = 'videos.json'

# .env 또는 Render 환경변수 로드
load_dotenv()

API_KEY = os.getenv("API_KEY", "").strip("'\"")
CHANNEL_ID = os.getenv("CHANNEL_ID", "").strip("'\"")

MAX_RESULTS = 50

YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'

if not API_KEY or not CHANNEL_ID:
    print("❌ API_KEY 또는 CHANNEL_ID가 환경변수에 없습니다.")
    exit(1)

# ✅ 1. 파일 존재 여부 + 수정 시간 체크
def should_update_videos():
    if not os.path.exists(VIDEOS_JSON):
        return True  # 파일이 없으면 반드시 업데이트

    modified_time = os.path.getmtime(VIDEOS_JSON)
    last_modified = datetime.fromtimestamp(modified_time)
    now = datetime.now()

    # ✅ 2. 파일이 12시간 이상 오래됐으면 업데이트
    return now - last_modified > timedelta(hours=12)


def fetch_shorts():
    try:
        # 1. 최신 영상 리스트 가져오기
        search_url = (
            f'{YOUTUBE_SEARCH_URL}?key={API_KEY}'
            f'&channelId={CHANNEL_ID}'
            f'&part=snippet'
            f'&maxResults={MAX_RESULTS}'
            f'&order=date&type=video'
        )
        resp = requests.get(search_url)
        resp.raise_for_status()
        data = resp.json()
        items = data.get('items', [])
        video_ids = [item['id']['videoId'] for item in items if 'videoId' in item['id']]

        # 2. 각 영상의 조회수 가져오기
        view_counts = {}
        if video_ids:
            ids_str = ','.join(video_ids)
            v_url = f'{YOUTUBE_VIDEOS_URL}?key={API_KEY}&id={ids_str}&part=statistics'
            v_resp = requests.get(v_url)
            v_resp.raise_for_status()
            v_data = v_resp.json()
            for v in v_data.get('items', []):
                vc = v.get('statistics', {}).get('viewCount')
                view_counts[v['id']] = int(vc) if vc is not None else 0

        # 3. 영상 정보 구성
        videos = []
        for item in items:
            if 'videoId' not in item['id']:
                continue
            video_id = item['id']['videoId']
            title = item['snippet']['title']
            thumbnail = item['snippet']['thumbnails']['high']['url']
            tags = re.findall(r'#\w+', title)
            clean_title = re.sub(r'#\w+', '', title).strip()
            videos.append({
                'video_id': video_id,
                'title': clean_title,
                'tags': tags,
                'thumbnail': thumbnail,
                'view_count': view_counts.get(video_id, 0)
            })

        # 4. 조회수 기준 정렬
        videos.sort(key=lambda x: x['view_count'], reverse=True)

        # 5. 저장
        with open('videos.json', 'w', encoding='utf-8') as f:
            json.dump(videos, f, ensure_ascii=False, indent=2)

        print(f"✅ {len(videos)}개 영상 저장 완료")

    except Exception as e:
        print("❌ 유튜브 API 호출 중 오류:", e)


if __name__ == '__main__':
    if should_update_videos():
        fetch_shorts()
    else:
        modified_time = os.path.getmtime(VIDEOS_JSON)
        last_modified = datetime.fromtimestamp(modified_time).strftime("%Y-%m-%d %H:%M:%S")
        print(f"⏳ videos.json은 최근에 업데이트되어 API 호출을 생략합니다. (마지막 수정: {last_modified})")
