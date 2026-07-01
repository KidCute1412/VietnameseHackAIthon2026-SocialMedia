# HypeRoom App

Hướng dẫn chạy project local cho phần `app`, gồm frontend React/Vite và backend FastAPI.

## Cấu trúc

- `client/`: frontend React + Vite, chạy mặc định tại `http://localhost:5173`.
- `server/`: backend FastAPI, nên chạy tại `http://localhost:3000` để khớp với proxy trong `client/vite.config.js`.

## Yêu cầu

- Node.js và npm
- Python 3.10+ và pip
- Docker và Docker Compose

## Chạy nhanh từ thư mục gốc repo

```bash
./start.sh
```

Trên Linux, `./start.bat` cũng sẽ tự động chuyển sang `start.sh`.

## Chạy database local

Mở terminal thứ nhất từ thư mục gốc repo:

```bash
docker compose -f app/docker-compose.yaml up -d postgres
```

## Chạy backend

Tạo hoặc cập nhật `app/server/.env`:

```bash
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/mydb

VNSOCIAL_USERNAME=your_username
VNSOCIAL_PASSWORD=your_password

# Optional: nếu đã có token thì server sẽ dùng token này và không gọi login API.
VNSOCIAL_TOKEN=
VNSOCIAL_LOGIN_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/login
VNSOCIAL_PROJECTS_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/projects
VNSOCIAL_HOT_POSTS_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts
VNSOCIAL_TIMEOUT_SECONDS=10
```

Mở terminal tiếp theo:

```bash
cd app/server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

Kiểm tra backend:

```bash
curl http://localhost:3000/openapi.json
```

Lấy danh sách VNPT vnSocial projects:

```bash
curl http://localhost:3000/api/v1/vnsocial/projects
```

Lấy bài viết nổi bật từ VNPT vnSocial:

```bash
curl -X POST http://localhost:3000/api/v1/vnsocial/hot-posts \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "65012f5e621e0ce1de8876f2",
    "source": "baochi",
    "start_time": 1756314000000,
    "end_time": 1756918799999
  }'
```

Backend sẽ gửi body JSON này đến endpoint VNPT `projects/hot-posts` kèm
`x-access-token` lấy từ `VNSOCIAL_TOKEN` hoặc từ login API, rồi trả về nguyên
JSON response của VNPT.

## Chạy frontend

Mở terminal thứ hai:

```bash
cd app/client
npm install
npm run dev
```

Mở trình duyệt tại:

```text
http://localhost:5173
```

Frontend đang proxy các request `/api/*` sang `http://localhost:3000` theo cấu hình Vite, vì vậy nên khởi động backend trước khi test các luồng có gọi API.

## Build production

```bash
cd app/client
npm run build
```

Xem bản build local:

```bash
npm run preview
```

## Lỗi thường gặp

- Nếu `vite: not found`, chạy lại `npm install` trong `app/client`.
- Nếu frontend gọi API bị lỗi, kiểm tra backend có đang chạy ở port `3000` không.
- Nếu port `3000`, `5173` hoặc `5432` đã bị chiếm, tắt process đang dùng port đó hoặc đổi port tương ứng trong lệnh chạy và `client/vite.config.js`.
