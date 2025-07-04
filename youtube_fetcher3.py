# youtube_fetcher.py
import json

def fetch_shorts():
    print("🔒 현재 YouTube API 호출은 비활성화되어 있습니다. videos.json만 수동으로 사용됩니다.")

    # (선택) 기본 영상 JSON 예시 생성
    example_videos = [
        {
            "video_id": "dQw4w9WgXcQ",
            "title": "비트코인 급등의 진실",
            "tags": ["#BTC", "#비트코인"],
            "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            "view_count": 123456
        },
        {
            "video_id": "3JZ_D3ELwOQ",
            "title": "이더리움과 ETF 루머",
            "tags": ["#ETH", "#ETF", "#이더리움"],
            "thumbnail": "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
            "view_count": 78901
        }
    ]

    with open('videos.json', 'w', encoding='utf-8') as f:
        json.dump(example_videos, f, ensure_ascii=False, indent=2)

    print("✅ 예시 videos.json 파일을 생성했습니다.")

if __name__ == '__main__':
    fetch_shorts()
