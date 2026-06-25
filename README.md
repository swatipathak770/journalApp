# 📔 Journal Application

A full-stack Journal Management Application built with **Java Spring Boot** and **React** that allows users to securely create, manage, and organize journal entries with JWT authentication and Google OAuth2 login.

The project follows a production-style architecture including secure authentication, REST API development, responsive UI design, caching, and cloud deployment.

## 🌐 Live Demo

- **Frontend**: https://journal-app-eight-umber.vercel.app/ (Vercel)
- **Backend API**: https://journalapp-qq4d.onrender.com/journal (Render)
- **API Documentation**: https://journalapp-qq4d.onrender.com/journal/swagger-ui.html

## 🚀 Key Features

**Authentication & Security**
- User Registration & Login
- JWT Token-Based Authentication
- Google OAuth2 Integration
- Password Encryption using BCrypt
- Protected Routes & Endpoints

**Journal Management**
- Create, Read, Update, Delete (CRUD) Journal Entries
- View All User Journals
- Favorite/Unfavorite Entries


**User Profile & Analytics**
- Profile Dashboard
- Journal Statistics (Total entries, favorites, weekly count)
- Sentiment Analysis Integration
- Weekly Entry Tracking

**Additional Features**
- Weekly Email Summaries with Sentiment Analysis
- Responsive & Mobile-Friendly UI
- Dark Mode Support
- State Management using React Context API
- Redis Caching for Performance
- API Documentation with Swagger/OpenAPI

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Language** | Java 17, JavaScript |
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **State Management** | React Context API, Framer Motion |
| **Backend** | Spring Boot 3, Spring Security |
| **Authentication** | JWT, BCrypt, Google OAuth2 |
| **Database** | MongoDB Atlas |
| **Caching** | Redis |
| **Email Service** | Java Mail Sender |
| **API Documentation** | Swagger/OpenAPI |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Version Control** | Git, GitHub |

## 🏗️ Project Architecture / Workflow

```
User Registration/Login
        │
        ▼
Authentication (JWT/OAuth2)
        │
        ▼
Dashboard & Profile Display
        │
        ▼
Journal Management (CRUD)
        │
        ▼
Sentiment Analysis
        │
        ▼
Weekly Email Summary
        │
        ▼
Data Stored in MongoDB
```

## 📁 Project Structure

```
journalApp/
│
├── frontend/                                    # React Application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/                           # State Management
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/                          # API Service Calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── src/                                        # Spring Boot Backend
│   ├── main
│   │   ├── java/net/engineeringdigest/journalApp/
│   │   │   ├── cache/                         # Redis Caching
│   │   │   ├── config/                        # Spring Configuration
│   │   │   ├── controller/                    # REST API Endpoints
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── entity/                        # Database Entities
│   │   │   ├── enums/
│   │   │   ├── filter/                        # JWT Filter
│   │   │   ├── model/
│   │   │   ├── repository/                    # MongoDB Repositories
│   │   │   ├── scheduler/                     # Scheduled Tasks
│   │   │   ├── service/                       # Business Logic
│   │   │   ├── utils/
│   │   │   └── JournalApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── .github/
│   └── workflows/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js & npm
- MongoDB Atlas account
- Google OAuth2 credentials
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/journal-app.git
cd journal-app
```

### 2️⃣ Backend Setup

**Configure Environment Variables:**

Create `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=YOUR_MONGODB_URI
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD
spring.security.oauth2.client.registration.google.clientid=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.clientsecret=YOUR_GOOGLE_CLIENT_SECRET
jwt.secret=YOUR_JWT_SECRET
```

**Run Backend:**
```bash
./mvnw spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 4️⃣ Access Application
- Open browser and navigate to: `http://localhost:5173`
- Backend API available at: `http://localhost:8080`
- Swagger API Docs: `http://localhost:8080/swagger-ui.html`

## 📚 API Documentation

API endpoints are documented using **Swagger/OpenAPI**. Access the documentation at:

**Local**: `http://localhost:8080/swagger-ui.html`
**Production**: `https://journalapp-qq4d.onrender.com/journal/swagger-ui.html`

### Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/journal/public/create-user` | User Registration |
| POST | `/journal/public/login` | User Login |
| GET | `/journal/users/profile` | Get User Profile |
| POST | `/journal/journal` | Create Journal Entry |
| GET | `/journal/journal` | Get All User Journals |
| GET | `/journal/journal/id/{id}` | Get Single Journal |
| PUT | `/journal/journal/id/{id}` | Update Journal Entry |
| DELETE | `/journal/journal/id/{id}` | Delete Journal Entry |
| PATCH | `/journal/journal/id/{id}/favorite` | Toggle Favorite Status |

## 🔄 Key Workflows

### Authentication Flow
```
User Registration/Login
        │
        ▼
Spring Security Validates Credentials
        │
        ▼
Password Encrypted with BCrypt
        │
        ▼
JWT Token Generated
        │
        ▼
Token Stored in localStorage
        │
        ▼
Axios Attaches Token to Requests
        │
        ▼
JwtFilter Validates Token on Backend
        │
        ▼
Protected APIs Accessed
```

### Google OAuth2 Flow
```
Google Login Button Click
        │
        ▼
Redirect to Google Auth
        │
        ▼
User Authenticates
        │
        ▼
Backend Receives Email & User Data
        │
        ▼
User Created or Fetched from DB
        │
        ▼
JWT Token Generated
        │
        ▼
User Logged In
```

### Journal Management Workflow
```
1. Create Journal
   POST /journal/journal
   ↓
   Journal linked to authenticated user
   ↓
   Stored in MongoDB with timestamp

2. View Journals
   GET /journal/journal
   ↓
   Returns only user's journals
   ↓
   Dashboard displays entries with metadata

3. Edit Journal
   GET /journal/journal/id/{id}
   ↓
   PUT /journal/journal/id/{id}
   ↓
   Ownership verification
   ↓
   Journal updated in database

4. Delete Journal
   DELETE /journal/journal/id/{id}
   ↓
   Journal removed from database

5. Sentiment Analysis & Email
   Scheduler runs (weekly)
   ↓
   Analyzes last 7 days' entries
   ↓
   Identifies dominant sentiment
   ↓
   Sends email summary to user
```

## 🎯 Skills Demonstrated

- Full-stack Web Development
- REST API Design & Implementation
- Authentication & Security (JWT, OAuth2, BCrypt)
- Database Design & MongoDB Integration
- State Management (React Context API)
- Email Services & Scheduled Tasks
- Responsive UI & UX Design
- API Documentation (Swagger/OpenAPI)
- Cloud Deployment (Vercel, Render)
- Caching Strategies (Redis)

## 🗂️ Database Collections

**MongoDB Collections:**
- `users` - User account information (email, password hash, OAuth data)
- `journal_entries` - Journal entry data (content, sentiment, timestamp, user reference)
- `config_journal_app` - Application configuration settings

## 🔮 Future Improvements

- Advanced Analytics Dashboard
- Real-time Notifications using WebSockets
- AI-based Journal Insights
- Mobile App (React Native)


## 🎓 Key Learnings

Through this project, I gained hands-on experience in:
- **Full-Stack Web Development**: Building scalable applications with Spring Boot and React
- **Secure Authentication**: Implementing JWT and OAuth2 for user security
- **REST API Design**: Creating well-documented, RESTful APIs with Swagger
- **Database Design**: Designing efficient MongoDB schemas for NoSQL databases
- **Frontend State Management**: Managing complex state with React Context API
- **Email Integration**: Implementing scheduled email summaries with Java Mail
- **Caching Strategies**: Optimizing performance with Redis caching
- **Cloud Deployment**: Deploying applications on Vercel (Frontend) and Render (Backend)
- **Production-Level Debugging**: Troubleshooting and monitoring live applications
- **API Documentation**: Creating comprehensive API documentation with Swagger/OpenAPI


## 🔗 Useful Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Authentication Guide](https://jwt.io)
- [Google OAuth2 Setup](https://developers.google.com/identity/protocols/oauth2)

## 👤 Author

**Swati Pathak** 

📧 Email: [pathakswati276.com]  
🔗 GitHub: [https://github.com/yourusername](https://github.com/swatipathak770)  
💼 LinkedIn: [https://www.linkedin.com/in/yourprofile](https://www.linkedin.com/in/swati-pathak-061218282/)

## 🚀 Live Application

- **Frontend**: https://journal-app-eight-umber.vercel.app/
- **Backend API**: https://journalapp-qq4d.onrender.com/journal

---


Built with ❤️ using Java Spring Boot, React, MongoDB Atlas, and modern web technologies.
