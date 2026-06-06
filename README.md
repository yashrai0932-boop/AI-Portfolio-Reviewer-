# 🚀 ProtfoliQ – AI-Powered Portfolio Intelligence Platform

![ProtfoliQ Banner](https://via.placeholder.com/1200x400?text=ProtfoliQ+-+AI+Portfolio+Reviewer)

**ProtfoliQ** is an AI-powered portfolio reviewer that audits GitHub repositories and project presentation quality, helping students and freshers transform their projects into industry-grade portfolios. It simulates a recruiter's perspective, analyzes code quality, and detects missing skills to give you actionable feedback.

---

## 📸 Screenshots

Here is a glimpse of the ProtfoliQ platform in action:

**Dashboard & Real-Time Progress**
![Dashboard & Progress](https://via.placeholder.com/800x400?text=Dashboard+%26+Real-Time+Progress)

**Detailed Recruiter Report**
![Recruiter Report](https://via.placeholder.com/800x400?text=Detailed+Report+%26+Architecture+Tree)

---

## 🛠 Architecture Explanation

ProtfoliQ is built with a modern, decoupled architecture:

- **Frontend**: Built with **Next.js 14**, React, and Tailwind CSS. It uses dynamic Server-Side Rendering (SSR) and Client-Side state management to provide real-time updates and a beautiful, glowing UI.
- **Backend**: Built with **Django REST Framework (DRF)**. It handles API requests, database modeling, and coordinates the complex analysis pipeline.
- **AI Engine**: Powered by the **NVIDIA NIM API**, utilizing advanced models (like deepseek-r1 and meta/llama3) to run specialized AI agents. These agents handle code review, security scanning, documentation analysis, and file tree mapping.
- **Integration**: Communicates with the **GitHub API** to fetch repositories, code files, and commit histories on behalf of the user via OAuth.

---

## ⚙️ Environment Variables

To run the application locally, you will need to configure environment variables for both the backend and frontend.

### Backend (`Backend/.env`)
Create a `.env` file in the `Backend/` directory:
```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True

# NVIDIA NIM API (For AI Engine)
NVIDIA_NIM_API_KEY=your-nvidia-nim-api-key

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (`portfoliq/.env.local`)
Create a `.env.local` file in the `portfoliq/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Setup Instructions & Installation Guide

### Prerequisites
- Python 3.9+
- Node.js 18+
- A GitHub OAuth Application (to get Client ID & Secret)
- An NVIDIA NIM API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yashrai0932-boop/AI-Portfolio-Reviewer-.git
cd AI-Portfolio-Reviewer-
```

### 2. Backend Setup
```bash
cd Backend

# Create a virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run database migrations
python3 manage.py migrate

# Start the Django development server
python3 manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd portfoliq

# Install npm dependencies
npm install

# Start the Next.js development server
npm run dev
```

---

## 💡 Usage Examples

Once both servers are running:
1. Open `http://localhost:3000` in your browser.
2. Click **Login with GitHub** to authenticate.
3. Navigate to the **Analyze** tab and paste your GitHub Profile URL (or a specific repository URL).
4. Watch the real-time AI progress log as the backend scans your code, architecture, and security.
5. View your detailed report, check your recruiter score, and explore the AI-generated architecture tree!

---

## 📖 API Documentation

The backend provides several REST endpoints for the frontend to consume:

- `POST /api/auth/github/` - Handles the GitHub OAuth callback and issues JWT tokens.
- `GET /api/auth/user/` - Retrieves the authenticated user's profile.
- `POST /api/analysis/analyze/` - Initiates a new AI portfolio analysis (returns a task/report ID).
- `GET /api/analysis/status/<id>/` - Polls the real-time progress (`current_step`) of an ongoing analysis.
- `GET /api/analysis/reports/` - Lists all past reports for the authenticated user.
- `GET /api/analysis/reports/<id>/` - Fetches the full, detailed JSON report including repository breakdowns and roasts.

---

## 🤝 Contributing Guidelines

We welcome contributions from the community! If you'd like to help improve ProtfoliQ:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code follows standard linting rules and doesn't break the AI pipeline. See `CONTRIBUTING.md` for more detailed instructions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
