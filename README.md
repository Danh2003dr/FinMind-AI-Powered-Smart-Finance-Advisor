# FinMind — AI-Powered Smart Finance Advisor

Monorepo gồm **Frontend (React/TypeScript)** và **Backend (NestJS/TypeORM)**. Ứng dụng có luồng **quét hoá đơn (OCR) → xác nhận → tạo giao dịch** và **AI Advisor** để hỗ trợ gợi ý tài chính.

## Demo

> GIF demo: thêm file `docs/demo.gif` (quay luồng: Login → Dashboard → Transactions → Scan OCR → Lưu giao dịch).
>
> Nếu chưa có GIF, bạn có thể bỏ dòng dưới hoặc thay bằng ảnh/GIF khác.

<!-- eslint-disable-next-line -->
<!-- markdownlint-disable-next-line -->
![FinMind demo](docs/demo.gif)

**Live Demo:** https://<your-live-demo-link>

## Tóm tắt sản phẩm

- **Auth & Profile:** Đăng ký/Đăng nhập (JWT), cập nhật hồ sơ.
- **Tài chính:** Dashboard/summary, danh mục, giao dịch (list/create/update/delete + lọc), ngân sách, mục tiêu tiết kiệm, notifications.
- **Receipt Scanner (OCR):** OCR ảnh hoá đơn bằng client-side pipeline (tiền xử lý ảnh + xoay nhiều góc + Tesseract) + heuristics VN → người dùng xác nhận → gọi API để lưu giao dịch.
- **AI Advisor:** Chat với AI (Gemini) thông qua endpoint backend.

## Tech Stack

- **Client:** React 19, TypeScript, Vite, React Router, React Query, Axios, Tailwind, Tesseract.js (OCR).
- **Server:** NestJS, TypeORM, SQLite (mặc định) / MSSQL (tuỳ chọn), JWT + Passport, class-validator/class-transformer.
- **AI:** Gemini API (server-side).
- **DevOps:** Docker (build/run), GitHub Actions CI/CD.

## Kiến trúc hệ thống

```mermaid
flowchart LR
  U[Người dùng] --> W[React App (client)]
  W -->|HTTP + Bearer JWT| A[NestJS API (server)]

  W -->|Ảnh hoá đơn| OCR[OCR Pipeline (client)]
  OCR -->|Text + heuristics| W
  W -->|POST /ocr/receipts/parse (text)| A

  A -->|TypeORM| DB[(SQLite / MSSQL)]
  A -->|Tuỳ chọn Mongo| M[(MongoDB)]
  A -->|Gemini prompt| AI[AI Advisor Service]
  AI --> G[Gemini API]

  A --> W
```

## Cấu trúc dự án

```
├── client/            # Frontend — Vite + React + TypeScript
├── server/            # Backend — NestJS
├── scripts/           # Script test OCR
├── .github/workflows/ # CI/CD
├── docker-compose.yml # (tuỳ chọn) chạy kèm DB
└── README.md
```

## Getting Started

### 1) Chạy local (SQLite mặc định)

**Bước 1 — server**

```powershell
cd "D:\FinMind AI-Powered Smart Finance Advisor\server"
copy .env.example .env
npm ci
npm run start:dev
```

- API: `http://localhost:3000`

**Bước 2 — client**

```powershell
cd "D:\FinMind AI-Powered Smart Finance Advisor\client"
npm ci
npm run dev
```

- Web (dev): `http://localhost:5174`

### 2) Chạy bằng Docker (tuỳ chọn)

```powershell
cp .env.example .env
docker compose up --build
```

- Web (nginx): `http://localhost:8080`
- API: `http://localhost:3000`

Lưu ý: `server/src/config/database.module.ts` quyết định DB dựa trên `DB_DRIVER` (`sqlite` mặc định). `docker-compose.yml` hiện dùng environment kiểu placeholder cho chuỗi kết nối; nếu muốn dùng MSSQL cần set thêm `DB_DRIVER=mssql` + `SQLSERVER_*` đúng theo `.env`.

## Biến môi trường

- Server: `server/.env.example` (copy thành `server/.env`)
- Root (docker compose): `.env.example` → `.env`

Gợi ý nhanh:
- `SKIP_DB=false` → dùng SQLite file (`data/finmind.sqlite`)
- AI Advisor cần `GEMINI_API_KEY`
- JWT cần `JWT_SECRET`

## API Overview (nhóm endpoint chính)

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PATCH /auth/profile`
- `GET /categories`
- `GET /accounts`, `GET /budgets`, `GET /saving-goals`, `GET /notifications`
- `GET /dashboard/summary`
- `GET/POST/PATCH/DELETE /transactions`
- `POST /ocr/receipts/parse` (parse text từ OCR)
- `POST /ai/advisor/chat` (chat)

## CI/CD

### CI — `.github/workflows/ci.yml`
- Build **client** (`npm run build`)
- Build + Test **server** (`npm run build` + `npm test`)
- Build Docker images (không push) để bắt lỗi build sớm.

### CD — `.github/workflows/cd-docker.yml`
- Khi push tag `v*` (hoặc chạy thủ công), workflow sẽ build & **push images lên GHCR**:
  - `ghcr.io/<owner>/<repo>-client:<tag>`
  - `ghcr.io/<owner>/<repo>-server:<tag>`

## OCR Test nhanh

```powershell
# Ví dụ: chạy script test OCR text → parse
./scripts/test-ocr-curl.ps1
```

## Gợi ý nâng cấp (ít nhưng chất)

- Đính kèm GIF demo `docs/demo.gif`
- Thêm Live Demo link thật
- Bổ sung smoke test (Playwright) để đảm bảo luồng Login → Dashboard → Scan OCR → Save transaction chạy ổn định sau mỗi release
