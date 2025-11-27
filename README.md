# Keep Notes - Full Stack Notes Taking Application

A modern, full-stack notes-taking application built with Next.js frontend and FastAPI backend, featuring user authentication, CRUD operations, and beautiful UI with animations.


![Notes App Screenshot](/img/signup.jpeg)

...

![Notes App Screenshot](/img/signin.jpeg)

...

## Project Overview

Keep Notes is a production-ready notes application that demonstrates best practices in full-stack development with:

- **Frontend:** Next.js 14 with TypeScript, Tailwind CSS, Framer Motion animations, and Zustand state management
- **Backend:** FastAPI with JWT authentication and SQLAlchemy ORM
- **Database:** MySQL for persistent data storage
- **Containerization:** Docker and Docker Compose for easy local development and deployment

## Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PyJWT** - JWT token handling
- **Passlib + Bcrypt** - Secure password hashing
- **Pydantic** - Data validation

### Database
- **MySQL 8.0** - Relational database

## Features

### Authentication
- User registration with email and password
- Secure JWT-based authentication
- Session persistence using Zustand
- Protected routes and API endpoints

### Notes Management
- **Create** - Add new notes with title and content
- **Read** - View all notes in a beautiful card grid
- **Update** - Edit existing notes with modal interface
- **Delete** - Remove notes with confirmation dialog

### User Experience
- Responsive design for mobile and desktop
- Smooth animations with Framer Motion
- Real-time note list updates
- Loading states and error handling
- Time-based greeting (Good Morning/Afternoon/Evening)
- Note metadata display (creation date, last update)

### Code Optimization
- Code splitting with dynamic imports
- Reusable components for maintainability
- Zustand for efficient state management
- API client with interceptors for JWT token handling
- Server-side rendering for better performance

### SEO
- Meta tags with Open Graph data
- Dynamic page titles and descriptions
- Semantic HTML structure

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page (redirect)
│   ├── auth/
│   │   ├── signin/page.tsx      # Sign in page
│   │   └── signup/page.tsx      # Sign up page
│   ├── notes/
│   │   └── page.tsx             # Notes list page
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── Header.tsx               # Navigation header
│   ├── NoteCard.tsx             # Note display card
│   └── NoteModal.tsx            # Create/edit note modal
├── lib/
│   ├── api.ts                   # API client configuration
│   └── store.ts                 # Zustand state management
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py              # Application entry point
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Authentication utilities
│   │   ├── database.py          # Database configuration
│   │   ├── config.py            # Application settings
│   │   └── routes/
│   │       ├── auth.py          # Auth endpoints
│   │       └── notes.py         # Notes endpoints
│   └── requirements.txt         # Python dependencies
├── Dockerfile                    # Frontend Docker image
├── Dockerfile.backend            # Backend Docker image
├── Dockerfile.frontend           # Frontend Docker image (alternative)
├── docker-compose.yml            # Docker Compose configuration
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Docker and Docker Compose (recommended)
- Or: Node.js 18+, Python 3.11+, MySQL 8.0

### Option 1: Docker Compose (Recommended)

1. **Clone or download the project**
```bash
cd notes-app
```

2. **Start the application**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

4. **Stop the application**
```bash
docker-compose down
```

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database configuration
```

5. **Run database migrations (tables created automatically)**
```bash
cd ..
python -m uvicorn backend.app.main:app --reload --port 8000
```

#### Frontend Setup

1. **In a new terminal, navigate to project root**
```bash
npm install
```

2. **Create environment file**
```bash
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
- Open http://localhost:3000 in your browser

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user (requires token)

### Notes
- `GET /notes` - Get all user notes (requires token)
- `GET /notes/{note_id}` - Get specific note (requires token)
- `POST /notes` - Create new note (requires token)
- `PUT /notes/{note_id}` - Update note (requires token)
- `DELETE /notes/{note_id}` - Delete note (requires token)

## Design Decisions

### Frontend Architecture
1. **Next.js + App Router** - Modern React framework with built-in optimizations
2. **Zustand State Management** - Lightweight and efficient state management with persistence
3. **Tailwind CSS** - Utility-first approach for rapid UI development
4. **Framer Motion** - Hardware-accelerated animations for smooth UX
5. **Axios with Interceptors** - Automatic JWT token injection for authenticated requests

### Backend Architecture
1. **FastAPI** - High performance async Python framework
2. **SQLAlchemy ORM** - Database abstraction layer for type-safe queries
3. **JWT Authentication** - Stateless authentication suitable for scalability
4. **Dependency Injection** - FastAPI's DI system for cleaner code

### Database Design
1. **User Table** - Stores user information with UUID primary key
2. **Notes Table** - Stores notes with foreign key relationship to users
3. **Indexing** - Email indexed for faster lookups, user_id indexed for note queries
4. **Timestamps** - Automatic timestamps for audit trail

### Security
1. **Password Hashing** - Bcrypt for secure password storage
2. **JWT Tokens** - Secure token-based authentication
3. **CORS** - Configured for frontend-backend communication
4. **Input Validation** - Pydantic schemas validate all inputs
5. **Authorization** - Users can only access their own notes

## Performance Optimizations

### Frontend
- **Code Splitting** - Dynamic imports for route-based splitting
- **Component Memoization** - Prevent unnecessary re-renders
- **Image Optimization** - Next.js Image component
- **Bundle Optimization** - Tree shaking and minification

### Backend
- **Connection Pooling** - SQLAlchemy connection pooling
- **Database Indexing** - Indexes on frequently queried columns
- **Response Caching** - HTTP cache headers
- **Async Operations** - FastAPI async support

### Database
- **Query Optimization** - Indexed queries for fast lookups
- **Lazy Loading** - Prevent N+1 query problems

## Deployment

### Production Docker Build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production
Set these in `.env` before deployment:
- `DATABASE_URL` - Production database connection string
- `SECRET_KEY` - Strong secret key for JWT signing
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## Testing

### Manual Testing Workflow

1. **Sign Up**
   - Navigate to http://localhost:3000/auth/signup
   - Enter username, email, and password
   - Confirm registration

2. **Sign In**
   - Navigate to http://localhost:3000/auth/signin
   - Enter email and password
   - Verify redirect to notes page

3. **Create Note**
   - Click "Create Note" or "+" button
   - Enter title and content
   - Click "Save"

4. **Edit Note**
   - Click on a note card
   - Modify content
   - Click "Save"

5. **Delete Note**
   - Click trash icon on note card
   - Confirm deletion



## Troubleshooting

### Backend Connection Issues
- Ensure MySQL is running: `docker-compose ps`
- Check database credentials in `.env`
- View logs: `docker-compose logs backend`

### Frontend API Errors
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and local storage

### Database Issues
- Reset database: `docker-compose down -v` then `docker-compose up -d`
- Check MySQL logs: `docker-compose logs db`

### Port Conflicts
- Change ports in `docker-compose.yml`
- Or: Kill existing processes using ports 3000, 8000, 3306

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write reusable components

### Git Commit Messages
Format: `type: description`
- `feat: add user authentication`
- `fix: resolve note deletion bug`
- `docs: update README`
- `refactor: optimize database queries`
- `style: format code with Prettier`

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions:
1. Check this README for common solutions
2. Review API documentation at http://localhost:8000/docs
3. Check application logs with `docker-compose logs`

---

**Built with Next.js, FastAPI, and MySQL** - A modern full-stack notes application.
