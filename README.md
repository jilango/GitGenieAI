# GitGenie AI

AI-powered issue grooming and release notes generation tool.

## Phase 1: IssueGroomer MVP

This initial phase focuses on the issue grooming workflow with manual JSON input for testing.

### Features
- Manual JSON issue input
- OpenAI-powered issue improvement
- Side-by-side comparison view
- Manual editing capability
- Accept/Reject/Regenerate workflow

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

3. Configure OpenAI API Key:
- Open the app in your browser
- Enter your OpenAI API key in the configuration section
- The key will be stored in localStorage

### Project Structure

```
GitGenie_AI/
├── frontend/       # React + Vite + TypeScript
├── backend/        # Express + TypeScript
└── package.json    # Root workspace config
```

### Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, TypeScript, OpenAI SDK
- **Development**: Local development with CORS enabled

### Security Features

- **No API Key Storage**: Keys kept in memory only, never persisted to localStorage or disk

- **Input Validation**: Length limits, type checking, malicious content detection
- **Content Sanitization**: Automatic redaction of passwords, API keys, emails
- **Prompt Injection Protection**: Multi-layer detection and prevention
- **Content Moderation**: OpenAI Moderation API integration
- **Rate Limiting**: 10 req/min, 100 req/hour per user
- **Output Validation**: Semantic similarity checks, length enforcement
- **Comprehensive Logging**: Full audit trail for security events

📖 **Documentation:**
- [SECURITY_AND_GUARDRAILS.md](./SECURITY_AND_GUARDRAILS.md) - Security features
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common errors and solutions

