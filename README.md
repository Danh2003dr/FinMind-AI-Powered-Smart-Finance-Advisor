# FinMind — Smart Finance Advisor

Monorepo: React + TypeScript (client), NestJS (server), tuỳ chọn Python (ai-engine), cơ sở dữ liệu SQL Server và MongoDB qua Docker.

## Cấu trúc

```
├── client/           # Frontend — Vite + React + TypeScript
├── server/           # Backend — NestJS
├── ai-engine/        # (Tuỳ chọn) script Python huấn luyện / inference
├── docker-compose.yml
└── README.md
```

## Yêu cầu

- Node.js 20+
- Docker Desktop (để chạy SQL Server, MongoDB và build container API/Web)
- Python 3.11+ (chỉ khi dùng `ai-engine`)

## Chạy nhanh (chỉ cơ sở dữ liệu)

```powershell
cd "D:\FinMind AI-Powered Smart Finance Advisor"
docker compose up -d sqlserver mongodb
```

- SQL Server: `localhost:1433` — user `sa`, mật khẩu mặc định trong compose: `YourStrong@Passw0rd` (nên đặt `MSSQL_SA_PASSWORD` trong file `.env` theo `.env.example`).
- MongoDB: `mongodb://localhost:27017`

Sau đó chạy API và giao diện trên máy:

```powershell
cd server; npm run start:dev
```

```powershell
cd client; npm run dev
```

- API: `http://localhost:3000`
- Web (dev): `http://localhost:5173`

## Một lệnh: DB + API + Web (Docker)

```powershell
docker compose up --build
```

- API: `http://localhost:3000`
- Web (nginx): `http://localhost:8080`

**Lưu ý:** Service `api` hiện chỉ chạy ứng dụng Nest mặc định. Chuỗi `DATABASE_URL` / `MONGODB_URI` trong `docker-compose.yml` là placeholder — cần gắn TypeORM/Mongoose và tạo database `finmind` trên SQL Server khi bạn triển khai persistence thật.

## AI Engine (Python)

```powershell
cd ai-engine
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Biến môi trường

Xem `.env.example`. Với Docker, tạo `.env` ở thư mục gốc và khai báo `MSSQL_SA_PASSWORD` nếu đổi mật khẩu `sa`.
