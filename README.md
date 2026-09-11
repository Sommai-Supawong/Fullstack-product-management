# Fullstack Product Management

เว็บแอปพลิเคชัน Full Stack สำหรับจัดการสินค้า ราคา และจำนวนคงเหลือในคลัง ประกอบด้วยหน้า Home สำหรับดูภาพรวมและ Product Showcase และหน้า Manage Products สำหรับเพิ่ม แก้ไข ค้นหา กรอง และลบสินค้า

Frontend พัฒนาด้วย React และ Vite เชื่อมต่อ REST API ที่สร้างด้วย Node.js, Express และ Sequelize โดยจัดเก็บข้อมูลใน PostgreSQL หน้าตาใช้แนว Dark Theme, Liquid Glass, Glassmorphism และ Metallic UI ตามข้อกำหนดใน [DESIGN.md](./DESIGN.md)

## Features

- ดูรายการสินค้าและข้อมูล `id`, ชื่อ, ราคา และจำนวนคงเหลือจาก API
- เพิ่ม แก้ไข และลบสินค้า พร้อม validation ทั้ง frontend และ backend
- แสดงสถานะสินค้าอัตโนมัติ: In stock, Low stock และ Out of stock
- ค้นหาสินค้าจากชื่อหรือ ID และกรองตามสถานะ stock
- หน้า Home พร้อม Product Carousel, ปุ่มควบคุม, keyboard navigation, mouse drag และ touch swipe
- สรุป Total Products, Total Units, Low Stock และ Out of Stock จากข้อมูลจริง
- หน้า Manage Products แบบตารางบน desktop และ cards บน mobile
- Loading skeleton, empty state, error alert พร้อม retry และ success toast
- Custom delete confirmation dialog ที่รองรับ Escape, focus trap และ focus restoration
- Responsive navigation และ layout
- Motion, marquee และ section reveal พร้อมรองรับ `prefers-reduced-motion`
- End-to-end tests สำหรับ UI, responsive behavior และ CRUD กับ backend/database จริง

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4 และ DaisyUI 5
- Lucide React
- CSS animations และ Intersection Observer
- Playwright สำหรับ end-to-end tests

`d3-geo` และ `three` อยู่ใน frontend dependencies แต่ source ปัจจุบันไม่ได้ import มาใช้ใน UI

### Backend

- Node.js แบบ ES modules
- Express 5
- Sequelize 6
- CORS
- PostgreSQL driver (`pg` และ `pg-hstore`)

### Database and Infrastructure

- PostgreSQL 15 Alpine
- Docker Compose
- Named volume `pgdata` สำหรับเก็บข้อมูลฐานข้อมูล

## Project Structure

```text
Fullstack-product-management/
├── backend/
│   ├── db.js                    # Sequelize connection และ Product model
│   ├── index.js                 # Express server และ REST API
│   ├── docker-compose.yml       # PostgreSQL container
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/Navbar.jsx
│   │   │   ├── motion/Reveal.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCarousel.jsx
│   │   │   │   └── StockBadge.jsx
│   │   │   └── ui/Feedback.jsx
│   │   ├── lib/products.js      # API URL, fetch, price และ stock helpers
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── ManageProduct.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tests/
│   │   ├── redesign.spec.mjs
│   │   └── live-crud.spec.mjs
│   ├── .env
│   ├── playwright.config.mjs
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
├── DESIGN.md                    # Design system และ UI requirements
├── create-readme.md             # README task specification
└── README.md
```

โครงสร้างด้านบนไม่แสดง `node_modules`, `dist`, Playwright reports และไฟล์ generated อื่น ๆ

## Application Routes

| Route | Page | Description |
| --- | --- | --- |
| `/` | Home | Hero, Product Carousel, inventory overview และ CTA |
| `/manage-products` | ManageProduct | ฟอร์มและรายการสำหรับค้นหา กรอง เพิ่ม แก้ไข และลบสินค้า |

ลิงก์จาก Product Carousel ใช้ query string รูปแบบ `/manage-products?product=<id>` เพื่อ highlight สินค้าที่เลือกในหน้า Manage Products

## Product Model

| Field | Sequelize Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | Integer | Yes | Auto increment | Primary key ของสินค้า |
| `name` | String | Yes | — | ชื่อสินค้า |
| `price` | Float | Yes | — | ราคาสินค้า ต้องมีค่าอย่างน้อย `0` ผ่าน API |
| `quantity` | Integer | Yes | `0` | จำนวนสินค้า ต้องเป็นจำนวนเต็มอย่างน้อย `0` ผ่าน API |

Sequelize ใช้ timestamps ตามค่าเริ่มต้น จึงสร้าง `createdAt` และ `updatedAt` เพิ่มในตารางและ response ของ model

### Stock Status Rules

| Quantity | Status |
| ---: | --- |
| `0` | Out of stock |
| `1–5` | Low stock |
| `6+` | In stock |

## API Endpoints

Backend เปิดใช้งาน CORS และรับ JSON request body ผ่าน `express.json()`

| Method | Endpoint | Success | Description |
| --- | --- | ---: | --- |
| GET | `/` | 200 | ตรวจสอบ API และแสดง welcome message |
| GET | `/products` | 200 | ดึงสินค้าทั้งหมด เรียงตาม ID จากน้อยไปมาก |
| GET | `/products/:id` | 200 | ดึงสินค้าตาม ID; คืน 404 เมื่อไม่พบ |
| POST | `/products` | 201 | สร้างสินค้าใหม่จาก `name`, `price`, `quantity` |
| PUT | `/products/:id` | 200 | อัปเดตอย่างน้อยหนึ่ง field; คืน 404 เมื่อไม่พบ |
| DELETE | `/products/:id` | 204 | ลบสินค้าตาม ID; คืน 404 เมื่อไม่พบ |

### Example API Data

Request body สำหรับสร้างสินค้า:

```json
{
  "name": "Mechanical Keyboard",
  "price": 2590,
  "quantity": 10
}
```

ตัวอย่างสร้างสินค้าด้วย `curl`:

```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mechanical Keyboard","price":2590,"quantity":10}'
```

การสร้างสินค้าต้องส่งครบทั้งสาม field ส่วนการอัปเดตส่งเฉพาะ field ที่ต้องการเปลี่ยนได้ ชื่อจะถูก trim และต้องไม่ว่าง ราคาและจำนวนต้องไม่ติดลบ และจำนวนต้องเป็น integer

## Prerequisites

- Node.js และ npm
- Docker พร้อม Docker Compose สำหรับรัน PostgreSQL ตาม configuration ของโปรเจกต์ หรือ PostgreSQL ที่ตรงกับค่าการเชื่อมต่อใน `backend/db.js`

## Installation

ติดตั้ง dependencies แยกในแต่ละส่วน:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Frontend อ่าน API base URL จาก `VITE_API_URL` และต่อ path `/products` ภายใน `frontend/src/lib/products.js`

ไฟล์ `frontend/.env` ปัจจุบัน:

```env
VITE_API_URL="http://localhost:5000"
```

หาก backend รันที่ host หรือ port อื่น ให้แก้ค่านี้แล้ว restart Vite development server

การเชื่อมต่อ PostgreSQL ใน `backend/db.js` เป็นค่าคงที่ตาม Docker Compose ปัจจุบัน:

| Setting | Value |
| --- | --- |
| Host | `localhost` |
| Host port | `5433` |
| Database | `product_db` |
| Username | `dev_user` |
| Password | `dev_password` |

## Running the Application

### 1. Start PostgreSQL

```bash
cd backend
docker compose up -d
```

Container map PostgreSQL จาก port `5432` ภายใน container มาที่ `localhost:5433`

### 2. Start the Backend

เปิด terminal อีกหน้าหนึ่ง:

```bash
cd backend
npm start
```

API ทำงานที่ `http://localhost:5000` เมื่อเริ่มสำเร็จ backend จะเชื่อมต่อฐานข้อมูลและเรียก `sequelize.sync({ alter: true })`

### 3. Start the Frontend

เปิด terminal อีกหน้าหนึ่ง:

```bash
cd frontend
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal ซึ่งโดยปกติคือ `http://localhost:5173`

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | เปิด Vite development server |
| `npm run build` | สร้าง production bundle ใน `dist` |
| `npm run preview` | เปิด preview server จาก production build |
| `npm run lint` | ตรวจ JavaScript/JSX ด้วย ESLint |
| `npm run test:e2e` | รัน Playwright tests |

### Backend

| Command | Description |
| --- | --- |
| `npm start` | เปิด Express server ด้วย Node.js |
| `npm run dev` | เรียก `nodemon index.js`; package ปัจจุบันไม่ได้ประกาศ `nodemon` ใน dependencies |

Backend ยังไม่มี automated test script ที่ใช้งานได้ โดย `npm test` ปัจจุบันเป็น placeholder และจบด้วย exit code 1

## Testing

ตรวจ lint และ production build:

```bash
cd frontend
npm run lint
npm run build
```

ก่อนรัน Playwright ครั้งแรก ติดตั้ง Chromium ที่ Playwright รองรับ:

```bash
npx playwright install chromium
npm run test:e2e
```

`redesign.spec.mjs` mock API เพื่อทดสอบ Home, Carousel, validation, error/loading/empty states, responsive layout และ CRUD interaction แบบ deterministic ส่วน `live-crud.spec.mjs` จะทดสอบผ่าน Express/PostgreSQL จริงเมื่อกำหนด `LIVE_API_URL`

PowerShell:

```powershell
$env:LIVE_API_URL="http://localhost:5000"
npm run test:e2e
```

Bash:

```bash
LIVE_API_URL=http://localhost:5000 npm run test:e2e
```

ต้องเปิด PostgreSQL และ backend ก่อนรัน live CRUD tests หากไม่ได้กำหนด `LIVE_API_URL` ชุดทดสอบ live backend จะถูก skip

## Design and Accessibility

UI ใช้พื้นหลังหลัก `#0C0C0C`, transparent glass panels, metallic accents และ CSS motion โดยไม่เพิ่ม animation library การโต้ตอบที่สำคัญรองรับ keyboard, visible focus, semantic alert/status, mobile menu และ custom dialog ที่จัดการ focus

เมื่อระบบปฏิบัติการตั้งค่า Reduce Motion แอปจะปิด decorative animations, smooth transitions, marquee movement และ parallax ที่ไม่จำเป็น ขณะที่ Carousel และ CRUD controls ยังใช้งานได้ตามปกติ
