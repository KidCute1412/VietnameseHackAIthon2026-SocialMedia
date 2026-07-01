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
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/mydb
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8000

JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
AUTH_COOKIE_NAME=hyperoom_jwt
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
OTP_EXPIRE_MINUTES=15
OTP_CLEANUP_INTERVAL_MINUTES=1

# SMTP email settings
SMTP_ENABLED=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@example.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=no-reply@hyperoom.vn
SMTP_FROM_NAME=HypeRoom
SMTP_USE_TLS=true
SMTP_USE_SSL=false
SMTP_TIMEOUT_SECONDS=10

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

Đăng ký và đăng nhập bằng JWT HTTP-only cookie:

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@hyperoom.vn","password":"secret123"}'

curl -i -c /tmp/hyperoom.cookies -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@hyperoom.vn","password":"secret123"}'

curl -b /tmp/hyperoom.cookies http://localhost:3000/api/v1/verifications
```

Các auth API cũng có alias dưới `/api/v1/auth/*`, ví dụ
`http://localhost:3000/api/v1/auth/register`, để dùng được khi frontend đặt
API base URL là `http://localhost:3000/api/v1`.

Quên mật khẩu dùng OTP hết hạn sau 15 phút. OTP được lưu ở bảng `otp_codes`.
Nếu `SMTP_ENABLED=true`, backend gửi OTP qua SMTP theo cấu hình email phía trên.
Nếu chưa bật SMTP, backend log OTP ra console để tiện chạy prototype local.
APScheduler xóa OTP hết hạn mỗi 1 phút theo `OTP_CLEANUP_INTERVAL_MINUTES`.

Lấy danh sách VNPT vnSocial projects:

```bash
curl -b /tmp/hyperoom.cookies http://localhost:3000/api/v1/vnsocial/projects
```

Lấy bài viết nổi bật từ VNPT vnSocial:

```bash
curl -b /tmp/hyperoom.cookies -X POST http://localhost:3000/api/v1/vnsocial/hot-posts \
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

Frontend đang proxy các request `/api/*` và `/auth/*` sang `http://localhost:3000` theo cấu hình Vite, vì vậy nên khởi động backend trước khi test các luồng có gọi API. Nếu muốn gọi trực tiếp backend thay vì proxy, đặt `VITE_API_BASE_URL=http://localhost:3000` và giữ `credentials: "include"` trong request.

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
