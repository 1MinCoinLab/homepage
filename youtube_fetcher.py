import requests
import json
import re

#API_KEY = 
#CHANNEL_ID = 
MAX_RESULTS = 50  # 20~50까지 가능

YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'

def fetch_shorts():
    # 1. 영상 리스트 가져오기
    url = (
        f'{YOUTUBE_SEARCH_URL}'
        f'?key={API_KEY}'
        f'&channelId={CHANNEL_ID}'
        f'&part=snippet'
        f'&maxResults={MAX_RESULTS}'
        f'&order=date'
        f'&type=video'
    )
    resp = requests.get(url)
    data = resp.json()
    items = data.get('items', [])
    video_ids = [item['id']['videoId'] for item in items]

    # 2. 각 영상의 조회수 가져오기
    view_counts = {}
    if video_ids:
        ids_str = ','.join(video_ids)
        v_url = f'{YOUTUBE_VIDEOS_URL}?key={API_KEY}&id={ids_str}&part=statistics'
        v_resp = requests.get(v_url)
        v_data = v_resp.json()
        for v in v_data.get('items', []):
            view_counts[v['id']] = int(v['statistics'].get('viewCount', 0))

    videos = []
    for item in items:
        video_id = item['id']['videoId']
        title = item['snippet']['title']
        thumbnail = item['snippet']['thumbnails']['high']['url']
        tags = re.findall(r'#\\w+', title)
        clean_title = re.sub(r'#\\w+', '', title).strip()
        videos.append({
            'video_id': video_id,
            'title': clean_title,
            'tags': tags,
            'thumbnail': thumbnail,
            'view_count': view_counts.get(video_id, 0)
        })
    # 조회수 내림차순 정렬
    videos.sort(key=lambda x: x['view_count'], reverse=True)
    with open('videos.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    fetch_shorts()
