# GitGenie AI

AI-powered tool for issue grooming and release notes generation using OpenAI GPT models.

## ✨ Features

### 🔧 Issue Groomer
- **AI-Powered Enhancement**: Transform raw issues into well-structured, professional documentation
- **Side-by-Side Comparison**: View original vs. AI-improved versions
- **Manual Editing**: Fine-tune AI suggestions with inline editing
- **Flexible Workflow**: Accept, reject, or regenerate improvements

### 📝 Release Notes Generator
- **Automated Generation**: Create professional release notes from PRs and issues
- **Smart Categorization**: AI organizes changes into Features, Bug Fixes, Security, Performance, and Maintenance
- **Inline Editing**: Modify generated notes with real-time editing
- **Multiple Export Formats**: Export as Markdown, HTML, or JSON

### 🤖 AI Model Selection
- **5 OpenAI Models**: Choose between GPT-4 Turbo and GPT-3.5 Turbo variants
- **Cost vs Quality**: Balance between performance and cost based on your needs
- **Persistent Selection**: Your model preference is saved across sessions

### 🔒 Security & Guardrails
- **Memory-Only API Keys**: Never stored on disk or in localStorage
- **Rate Limiting**: 10 requests/min, 100 requests/hour per user
- **Input Validation**: Length limits, content sanitization, malicious pattern detection
- **Prompt Injection Protection**: Multi-layer security against AI manipulation
- **Content Moderation**: OpenAI Moderation API integration
- **Output Validation**: Semantic similarity checks and length enforcement

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This runs both:
   - Backend API: `http://localhost:3001`
   - Frontend: `http://localhost:5173`

3. **Configure OpenAI API Key:**
   - Open `http://localhost:5173` in your browser
   - Click "Configure API Key" in the top-right corner
   - Enter your OpenAI API key
   - Select your preferred AI model (GPT-4 Turbo recommended)

4. **Start using:**
   - **Issue Groomer**: Paste issue JSON → Click "Improve with AI"
   - **Release Notes**: Paste PR/issue data → Click "Generate Release Notes"

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)
- Axios (API client)

**Backend:**
- Node.js + Express
- TypeScript
- OpenAI SDK
- Rate limiting & validation

## 📁 Project Structure

```
GitGenie_AI/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── types/        # TypeScript types
│   └── package.json
└── package.json          # Monorepo config
```

## 🎨 Available Models

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| GPT-4 Turbo (Recommended) | Medium | High | Complex issues, detailed release notes |
| GPT-4 Turbo (1106) | Medium | High | Stable, high-quality output |
| GPT-4 Turbo (0125) | Medium | High | Latest improvements |
| GPT-3.5 Turbo (1106) | Fast | Low | Quick improvements, drafts |
| GPT-3.5 Turbo (0125) | Fast | Low | Latest GPT-3.5, budget-friendly |

## 📝 Example Usage

### Issue Groomer
```json
{
  "title": "Button not working",
  "body": "The submit button doesn't work when I click it",
  "labels": ["bug"]
}
```
→ AI transforms into a professional, actionable issue with context, steps to reproduce, and expected behavior.

### Release Notes Generator
```json
{
  "repository": "org/repo",
  "dateRange": { "from": "2024-01-01", "to": "2024-01-31" },
  "branch": "main",
  "pullRequests": [...]
}
```
→ AI generates categorized release notes with customer-friendly descriptions.
