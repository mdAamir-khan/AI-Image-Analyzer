# ImageReco - Full-Stack AI Image Analysis Web Application

**ImageReco** is a full-stack computer vision and inventory inspection web application built with **React**, **Tailwind CSS**, **Spring Boot**, **Maven**, **Spring Data JPA**, and **MySQL**. It integrates **OpenRouter Multimodal Vision AI** to detect all visible physical objects in any uploaded or camera-captured image, assesses their quality and physical condition, and provides exact item quantities.

---

## 🌟 Key Features

1. **Dual Input Methods**:
   - **Upload & Drag-and-Drop**: Supports JPEG, PNG, and WebP images up to 20MB. Includes clipboard paste (`Ctrl+V`) support and quick demo presets.
   - **Live Camera Capture**: Real-time webcam viewfinder, camera flip (front/environment), snapshot shutter animation, and high-resolution base64 capture.
2. **AI Multimodal Vision Engine**:
   - Integrated with **OpenRouter Vision AI** (e.g. `google/gemini-2.0-flash-001`, `meta-llama/llama-3.2-11b-vision-instruct`, etc.).
   - Secure server-side processing: API keys are safeguarded in backend environment variables with optional in-app UI override for convenient testing.
3. **Structured Physical Object Cataloging**:
   - **Prominently displays the total number of detected physical objects first** as required.
   - For every detected object, details:
     - **Name**: Concise, standardized title.
     - **Description**: In-depth description of visual features, color, material, and spatial placement.
     - **Quality / Condition**: Objective state assessment (*Pristine/Brand New, Excellent, Good, Fair/Minor Wear, Worn/Damaged*).
     - **Quantity**: Exact count of visible units.
     - **Category & Confidence**: Classification and certainty metrics.
4. **Rich Dual-View Experience**:
   - **Visual Cards View**: Detailed glassmorphic cards with color-coded condition badges.
   - **Structured Table View**: Clean tabular inventory sheet with instant search, category filtering, and JSON export.
5. **Database Persistence & History**:
   - Every analysis and image is stored in **MySQL** via **Spring Data JPA / Hibernate**.
   - Slide-over **History Drawer** to search, review, and load previous scans with thumbnails and metrics.
6. **Graceful Error Handling & Validation**:
   - File format and payload size validation.
   - Automated AI JSON parsing and repair (handles markdown code blocks and calculates missing totals).
   - Clear feedback for missing API keys or connectivity issues.

---

## 🏗 Architecture & Tech Stack

```
ImageReco/
├── backend/                   # Spring Boot 3.3.4 (Java 21, Maven)
│   ├── src/main/java/com/imagereco/
│   │   ├── config/            # CORS, RestTemplate configuration
│   │   ├── controller/        # AnalysisController, ConfigController
│   │   ├── dto/               # Request, Response, and OpenRouter DTOs
│   │   ├── entity/            # AnalysisRecord, DetectedObjectEntity
│   │   ├── exception/         # GlobalExceptionHandler, OpenRouterException
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   └── service/           # OpenRouterVisionService, ImageAnalysisService, StorageService
│   ├── src/main/resources/
│   │   └── application.yml    # MySQL (default) & H2 (fallback) profiles
│   └── pom.xml
│
├── frontend/                  # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Navbar, ImageUploader, CameraCapture, Dashboard, Cards, History
│   │   ├── services/          # api.js (Axios/Fetch client)
│   │   ├── App.jsx            # State management & view routing
│   │   └── index.css          # Glassmorphism & cyber styling
│   ├── vite.config.js         # Reverse proxy to backend (:8080)
│   └── tailwind.config.js
│
├── .env.example               # Environment variables template
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21+** (`java -version`)
- **Apache Maven 3.9+** (`mvn -version`)
- **Node.js 18+** & **npm** (`node -v`)
- **MySQL 8.0+** (or use fallback `h2` profile)
- **OpenRouter API Key** (obtain free/paid from [openrouter.ai/keys](https://openrouter.ai/keys))

---

### Step 1: Configure Environment Variables

Create your environment configuration or export the variables:

#### On Windows (PowerShell):
```powershell
# OpenRouter API Key
$env:OPENROUTER_API_KEY="sk-or-v1-your_openrouter_api_key_here"

# MySQL Database Credentials
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="imagereco_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

#### On Linux / macOS (Bash):
```bash
export OPENROUTER_API_KEY="sk-or-v1-your_openrouter_api_key_here"
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="imagereco_db"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
```

> **Note on MySQL:** The backend will automatically create the database `imagereco_db` and tables (`analysis_records`, `detected_objects`) on startup via `createDatabaseIfNotExist=true` and Hibernate DDL update.
>
> **Note on H2 Fallback:** If you want to run without MySQL, simply start the backend with the H2 profile:  
> `-Dspring.profiles.active=h2`

---

### Step 2: Start the Spring Boot Backend

Navigate to the `backend` directory and run:

```bash
cd backend
mvn spring-boot:run
```

Or run with H2 profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

The backend server will start on **`http://localhost:8080`**.

---

### Step 3: Start the React Frontend

Open a new terminal window, navigate to `frontend`, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

Open your browser to `http://localhost:5173`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analysis/upload` | Upload an image file (`multipart/form-data`) |
| `POST` | `/api/analysis/capture` | Submit a camera-captured base64 image (`application/json`) |
| `GET` | `/api/analysis/history` | List all historical analysis records ordered by date |
| `GET` | `/api/analysis/{id}` | Get full analysis details for a specific record |
| `DELETE` | `/api/analysis/{id}` | Delete an analysis record and its stored image |
| `GET` | `/api/analysis/image/{file}` | Serve stored image thumbnail |
| `GET` | `/api/config/status` | Check API key status, model, and active profile |
| `GET` | `/api/health` | Health check endpoint |

---

## 🔒 Security Best Practices
- **API Key Confidentiality**: The OpenRouter API key is never exposed to public frontend code bundles; all AI requests are proxied and secured by Spring Boot.
- **Path Traversal Protection**: Uploaded image filenames are sanitized and stored with randomly generated UUIDs.
- **Payload Limits**: Max file upload size is strictly limited to 20MB.
