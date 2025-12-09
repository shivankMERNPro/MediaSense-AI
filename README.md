# mediaMind - AI-Powered Media Library

An intelligent media management system that automatically analyzes uploaded files (images, videos, documents) using AI to generate descriptions, tags, topics, and enable semantic search.


## Project Demonstration Video
You can watch the demonstration here: [Project demonstration video](https://drive.google.com/file/d/1uCzoy2kHNrGKEZxi0KOw8IouqF33Y0tW/view?usp=sharing)

## Features

### Core Functionality
- **File Upload**: Upload images, videos, and documents with drag & drop support
- **AI Analysis**: Automatic generation of:
  - Short descriptions
  - Relevant tags
  - Topics/themes
  - Semantic embeddings for search
- **Intelligent Search**: Natural language semantic search across all media
- **Library Browsing**: Filter by type, tags, topics with beautiful UI
- **File Details**: View full metadata, AI-generated content, and download files

### Technical Stack

**Backend:**
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Multer for file uploads
- JWT authentication
- OpenAI API for AI processing

**Frontend:**
- React + Vite
- Redux Toolkit Query
- Material-UI
- Tailwind CSS
- Responsive design

**AI Workflow:**
- OpenAI GPT-4o for descriptions
- OpenAI GPT-4o-mini for tags/topics
- OpenAI text-embedding-3-small for semantic search



## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance
- OpenAI API key


### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file inside backend folder:
```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=mediamind
MONGO_MAX_POOL_SIZE=10
MONGO_MIN_POOL_SIZE=1

CORS_ORIGIN=http://localhost:5173

JWT_SECRET=dev-fallback-secret
JWT_ACCESS_SECRET=super-access-secret
JWT_REFRESH_SECRET=super-refresh-secret

OPENAI_API_KEY=your-openai-api-key

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:5173/oauth/callback
```

4. Start backend:
```bash
npm run dev
```

### AI Workflow Setup

1. Navigate to ai-workflow directory:
```bash
cd ai-workflow
```

2. Install dependencies:
```bash
npm install
```

3. Add OpenAI API key to backend `.env`:
```env
OPENAI_API_KEY=your-openai-api-key
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENCRYPTION_KEY=super-secure-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/oauth/callback
```

4. Start frontend:
```bash
npm run dev
```

## API Endpoints

### Auth Endpoints

- `POST /api/v1/auth/register` – Create a local account (returns user + tokens)
- `POST /api/v1/auth/login` – Email/password login
- `POST /api/v1/auth/refresh` – Issue a new access + refresh token pair
- `POST /api/v1/auth/oauth/google` – Exchange Google ID token for MediaMind session
- `POST /api/v1/auth/oauth/github` – Exchange GitHub OAuth code for MediaMind session

### Media Endpoints (require a valid access token)

- `POST /api/v1/media/upload` - Upload a file
- `GET /api/v1/media` - Get all media with filters
- `GET /api/v1/media/search?query=...` - Semantic search
- `GET /api/v1/media/:id` - Get media by ID
- `PUT /api/v1/media/:id` - Update media metadata
- `DELETE /api/v1/media/:id` - Delete media

### Query Parameters

- `query` - Search text
- `type` - Filter by type (image/video/document)
- `tags` - Filter by tags (comma-separated)
- `topics` - Filter by topics (comma-separated)
- `page` - Page number
- `limit` - Items per page

## Usage

1. **Authenticate**: Use email/password or the Google/GitHub OAuth buttons on the login screen
2. **Upload Files**: Navigate to the Upload page and drag & drop or select files
3. **View Library**: Go to Dashboard to see all uploaded media
4. **Search**: Use natural language queries like "sunset photos" or "training documents"
5. **Filter**: Combine file-type, tags, and topics filters (server-side pagination supported)
6. **View Details**: Click on any media item to see full details, AI description, tags, and topics

## File Processing Flow

1. File uploaded → Status: `uploading`
2. File saved → Status: `analyzing`
3. AI processes file:
   - Generates description
   - Extracts tags
   - Identifies topics
   - Creates embedding vector
4. Metadata saved → Status: `ready`

## Project Structure

```
mediaMind/
├── backend/          # Express API server
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utilities
│   └── uploads/         # File storage
├── frontend/        # React application
│   └── src/
│       ├── components/  # UI components
│       ├── containers/  # Page containers
│       ├── features/    # Redux slices & APIs
│       └── routes/      # Routing
└── ai-workflow/     # AI processing service
    └── processMedia.ts  # AI analysis logic
```

## Notes

- Files are stored locally in `backend/uploads/`
- AI processing happens asynchronously after upload
- Semantic search uses cosine similarity on embeddings
- Auth supports local credentials, Google OAuth (ID token), and GitHub OAuth (code exchange)
- Axios client with request/response interceptors attaches tokens and logs users out on 401s (`frontend/src/utils/httpClient.js`)
- All routes require JWT authentication; the frontend automatically refreshes tokens when they expire

## Development

The project uses:
- TypeScript for type safety
- ESLint + Prettier for code quality
- Husky for git hooks
- RTK Query for API state management

## License

ISC
