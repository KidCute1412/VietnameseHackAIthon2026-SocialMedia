# HypeRoom App

Huong dan chay project local cho phan `app`, gom frontend React/Vite va backend FastAPI.

## Cau truc

- `client/`: frontend React + Vite, chay mac dinh tai `http://localhost:5173`.
- `server/`: backend FastAPI, nen chay tai `http://localhost:3000` de khop voi proxy trong `client/vite.config.js`.

## Yeu cau

- Node.js va npm
- Python 3.10+ va pip

## Chay backend

Tao hoac cap nhat `app/server/.env`:

```bash
VNSOCIAL_USERNAME=your_username
VNSOCIAL_PASSWORD=your_password

# Optional: neu da co token thi server se dung token nay va khong goi login API.
VNSOCIAL_TOKEN=
VNSOCIAL_LOGIN_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/login
VNSOCIAL_PROJECTS_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/projects
VNSOCIAL_HOT_POSTS_URL=https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts
VNSOCIAL_TIMEOUT_SECONDS=10
```

Mo terminal thu nhat:

```bash
cd app/server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

Kiem tra backend:

```bash
curl http://localhost:3000/
```

Neu thanh cong, server se tra ve JSON:

```json
{"message":"Hello World"}
```

Lay danh sach VNPT vnSocial projects:

```bash
curl http://localhost:3000/api/vnsocial/projects
```

Lay bai viet noi bat tu VNPT vnSocial:

```bash
curl -X POST http://localhost:3000/api/vnsocial/hot-posts \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "65012f5e621e0ce1de8876f2",
    "source": "baochi",
    "start_time": 1756314000000,
    "end_time": 1756918799999
  }'
```

Backend se gui body JSON nay den endpoint VNPT `projects/hot-posts` kem
`x-access-token` lay tu `VNSOCIAL_TOKEN` hoac tu login API, roi tra ve nguyen
JSON response cua VNPT.

## Chay frontend

Mo terminal thu hai:

```bash
cd app/client
npm install
npm run dev
```

Mo trinh duyet tai:

```text
http://localhost:5173
```

Frontend dang proxy cac request `/api/*` sang `http://localhost:3000` theo cau hinh Vite, vi vay nen khoi dong backend truoc khi test cac luong co goi API.

## Build production

```bash
cd app/client
npm run build
```

Xem ban build local:

```bash
npm run preview
```

## Loi thuong gap

- Neu `vite: not found`, chay lai `npm install` trong `app/client`.
- Neu frontend goi API bi loi, kiem tra backend co dang chay o port `3000` khong.
- Neu port `3000` hoac `5173` da bi chiem, tat process dang dung port do hoac doi port tuong ung trong lenh chay va `client/vite.config.js`.
