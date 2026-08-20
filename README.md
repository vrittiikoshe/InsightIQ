# InsightIQ

### AI-Powered Enterprise Document Intelligence & Business Analytics Platform

insightIQ is an AI-powered document intelligence platform that allows users to upload business documents, automatically extract and analyze their content, generate AI-powered summaries and insights, and ask questions about their documents using Retrieval-Augmented Generation (RAG).

The platform is designed to transform unstructured documents into meaningful and actionable information.

---

## ✨ Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 📄 Upload PDF, DOCX and TXT documents
- ☁️ Cloud-based document storage using Cloudinary
- 📝 Automatic text extraction
- 🤖 AI-powered document analysis
- 📊 Executive summaries and business insights
- 🏷️ Automatic document categorization
- 🔎 Keyword extraction
- 💡 AI-generated recommendations
- 💬 Ask questions about uploaded documents
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic document search
- 📦 ChromaDB vector storage
- 📈 Dashboard statistics
- 🗑️ Document deletion
- 👤 User-specific document management
- 🌐 React-based frontend
- 🚀 Backend and frontend deployment using Render

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- shadcn/ui

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication

## AI & RAG

- Google Gemini API
- Gemini 2.5 Flash
- Gemini Embeddings
- LangChain
- ChromaDB

## Database

- PostgreSQL

## File Storage

- Cloudinary
- django-cloudinary-storage

## Deployment

- Render

---

# 🏗️ System Architecture

The overall system follows this architecture:

```text
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  Vite + Tailwind CSS │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django Backend     │
                    │    Django REST       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
       │ PostgreSQL  │  │ Cloudinary  │  │ Gemini API   │
       │  Database   │  │ File Store  │  │ AI Analysis  │
       └─────────────┘  └─────────────┘  └──────┬───────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │   RAG Pipeline   │
                                      │ LangChain +      │
                                      │ ChromaDB         │
                                      └──────────────────┘
````

---

# 📂 Project Structure

```text
insightIQ/
│
├── ai_engine/
│   │
│   ├── rag/
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   ├── retriever.py
│   │   └── vector_store.py
│   │
│   ├── client.py
│   └── document_processor.py
│
├── accounts/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── documents/
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   ├── utils.py
│   ├── views.py
│   └── urls.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── manage.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/insightIQ.git
```

Move into the project directory:

```bash
cd insightIQ
```

---

## 2. Create a Virtual Environment

### macOS / Linux

```bash
python -m venv venv
```

Activate the environment:

```bash
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root directory.

```env
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=your_postgresql_database_url

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Environment Variables Description

| Variable                | Description                        |
| ----------------------- | ---------------------------------- |
| `SECRET_KEY`            | Django secret key                  |
| `DEBUG`                 | Django debug mode                  |
| `DATABASE_URL`          | PostgreSQL database connection URL |
| `GEMINI_API_KEY`        | Google Gemini API key              |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret              |

> **Important:** Never commit your `.env` file or API keys to GitHub.

---

# 🗄️ Database Setup

insightIQ uses PostgreSQL as its primary database.

After configuring the database, create migrations:

```bash
python manage.py makemigrations
```

Apply migrations:

```bash
python manage.py migrate
```

---

# 👤 Create Admin User

To create a Django superuser:

```bash
python manage.py createsuperuser
```

Follow the terminal instructions to set:

* Username
* Email
* Password

---

# ▶️ Run the Backend

Start the Django development server:

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

---

# 🌐 Frontend Setup

Move to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

---

# 🔑 API Endpoints

## Authentication

### Register

```http
POST /api/accounts/register/
```

### Login

```http
POST /api/accounts/login/
```

### User Profile

```http
GET /api/accounts/profile/
```

---

# 📄 Document APIs

### Upload Document

```http
POST /api/documents/upload/
```

Supported formats:

```text
PDF
DOCX
TXT
```

### List Documents

```http
GET /api/documents/
```

### Get Document Details

```http
GET /api/documents/<id>/
```

### Delete Document

```http
DELETE /api/documents/delete/<id>/
```

### Dashboard Statistics

```http
GET /api/documents/stats/
```

---

# 🤖 AI / RAG API

### Ask a Question

```http
POST /api/rag/chat/
```

This endpoint allows users to ask questions based on the content of their uploaded documents.

The system retrieves relevant document chunks and uses Gemini to generate the answer.

---

# 🧠 AI Document Processing Pipeline

When a user uploads a document, insightIQ processes it through the following pipeline:

```text
Document Upload
       ↓
Cloudinary Storage
       ↓
Text Extraction
       ↓
AI Document Analysis
       ↓
Text Chunking
       ↓
Embedding Generation
       ↓
ChromaDB Vector Storage
```

The AI analysis generates:

* Summary
* Category
* Keywords
* Business Insights
* Recommendations

---

# 🔎 RAG Pipeline

The document question-answering system follows a Retrieval-Augmented Generation architecture.

```text
User Question
       ↓
Question Embedding
       ↓
Semantic Search
       ↓
ChromaDB
       ↓
Relevant Document Chunks
       ↓
Context Construction
       ↓
Gemini
       ↓
AI Generated Answer
```

This allows the AI to answer questions using the actual content of the uploaded document instead of relying only on general model knowledge.

---

# 📄 Supported Documents

insightIQ currently supports:

```text
.pdf
.docx
.txt
```

### PDF

Text is extracted using:

```text
PyMuPDF
```

### DOCX

Text and table content are extracted using:

```text
python-docx
```

### TXT

Text files are read using Python's file handling functionality.

---

# ☁️ Cloudinary File Storage

insightIQ uses Cloudinary for document storage.

```text
User
  ↓
Upload Document
  ↓
Django Backend
  ↓
Cloudinary
  ↓
Stored Document URL
```

Cloudinary is used so that uploaded documents are not dependent on the local filesystem of the deployed backend.

This is particularly important for cloud deployment environments where local files may not provide persistent storage.

---

# 🗃️ Vector Storage

ChromaDB is used as the vector database for the RAG system.

Documents are divided into smaller chunks.

Each chunk is converted into an embedding and stored in ChromaDB.

```text
Document
   ↓
Chunks
   ↓
Embeddings
   ↓
ChromaDB
```

When the user asks a question:

```text
Question
   ↓
Question Embedding
   ↓
Similarity Search
   ↓
Relevant Chunks
```

The retrieved chunks are then provided as context to Gemini.

---

# 🔐 Authentication

The backend uses Django REST Framework with JWT authentication.

Authentication flow:

```text
User
 ↓
Register
 ↓
Login
 ↓
JWT Access Token
 ↓
Authenticated API Requests
```

Protected endpoints require a valid JWT access token.

---

# 📊 Dashboard

The dashboard provides information about the user's documents, including:

* Total documents
* Completed documents
* Processing documents
* Failed documents
* Monthly document uploads

The dashboard communicates with the backend through REST APIs.

---

# 🗑️ Document Management

Users can:

* Upload documents
* View uploaded documents
* Open document details
* Search documents
* Delete documents
* View AI-generated analysis

Documents are associated with the authenticated user, ensuring users can access their own documents.

---

# 🚀 Deployment

The application is being deployed using Render.

## Current Deployment Status

| Component              | Status             |
| ---------------------- | ------------------ |
| Frontend               | ✅ Deployed         |
| Backend                | ✅ Deployed         |
| PostgreSQL             | ✅ Configured       |
| Cloudinary Storage     | ✅ Configured       |
| JWT Authentication     | ✅ Working          |
| Dashboard APIs         | ✅ Working          |
| Document Management    | ✅ Working          |
| Document Preview       | ✅ Implemented      |
| Document Upload        | 🔧 Being finalized |
| AI Document Processing | 🔧 In Progress     |
| RAG Question Answering | 🔧 In Progress     |

The production deployment and AI/RAG integration are currently being finalized.

---

# 🧪 Local Development

For local development, run the backend and frontend separately.

### Terminal 1 — Backend

```bash
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

---

# 📦 Requirements

The backend dependencies are maintained in:

```text
requirements.txt
```

Major dependencies include:

```text
Django
Django REST Framework
PostgreSQL
psycopg2-binary
Google Gemini
LangChain
ChromaDB
PyMuPDF
python-docx
Cloudinary
django-cloudinary-storage
Gunicorn
```

---

# 🔮 Future Enhancements

Planned improvements include:

* Google OAuth authentication
* GitHub OAuth authentication
* Advanced business analytics
* Interactive charts and visualizations
* Document comparison
* Multi-document conversations
* Improved semantic search
* Background document processing
* AI-generated business dashboards
* Role-based access control
* Improved document preview
* More advanced AI-generated business insights

---

# 🎯 Project Goal

The goal of insightIQ is to transform unstructured business documents into actionable information using AI.

Instead of manually reading large documents, users can upload their files and interact with their content through AI.

```text
Upload
   ↓
Analyze
   ↓
Search
   ↓
Ask
   ↓
Understand
   ↓
Act
```

insightIQ aims to make document analysis faster, more accessible, and more useful for business decision-making.

---

# 👩‍💻 Author

**Vritti Koshe**

B.Tech – Mathematics & Computing
MITS Gwalior

---

# 📌 Project Status

🚧 **Currently Under Active Development**

The core authentication, document management, dashboard, PostgreSQL database, cloud storage, REST API infrastructure, and frontend have been implemented.

Production deployment, AI-powered document processing, and RAG-based question answering are currently being finalized.

---

## ⭐ If you find this project useful

Feel free to explore the project, provide feedback, and contribute to its development.

**insightIQ — Upload → Analyze → Search → Ask → Understand → Act**

---



