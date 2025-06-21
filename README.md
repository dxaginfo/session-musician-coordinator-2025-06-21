# Session Musician Coordinator

A comprehensive web application that streamlines the process of matching session musicians with recording needs, managing scheduling, and handling payments.

## 🎵 Project Overview

The Session Musician Coordinator aims to solve common pain points in the music industry by creating an efficient marketplace for session work while providing robust tools for project management. This platform bridges the gap between talented musicians and studios/producers looking for specific instrumental skills.

### Key Features

- **User Profiles**: Detailed profiles for musicians and clients with portfolio capabilities
- **Musician Discovery**: Advanced search and matching based on instrument, genre, and location
- **Booking System**: Intuitive scheduling with calendar integration and availability management
- **Project Management**: Collaboration tools for sharing reference tracks and project specifications
- **Payment Processing**: Secure payment handling with multiple rate options
- **Feedback System**: Build reputation through ratings and reviews
- **File Sharing**: Share and comment on audio files and sheet music

## 🚀 Technology Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material-UI component library
- Web Audio API for audio processing
- FullCalendar for scheduling
- Responsive design for all devices

### Backend
- Node.js with Express
- MongoDB database with Mongoose ODM
- Redis for caching and session management
- Elasticsearch for search functionality
- JWT authentication
- Socket.io for real-time messaging

### DevOps
- Docker containerization
- AWS deployment (EC2, S3, CloudFront)
- CI/CD with GitHub Actions
- Monitoring with Sentry

## 📋 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Redis
- Elasticsearch
- AWS account (for production deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dxaginfo/session-musician-coordinator-2025-06-21.git
   cd session-musician-coordinator-2025-06-21
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start
   ```

4. **Set up MongoDB**
   - Ensure MongoDB is running locally or configure connection to MongoDB Atlas

5. **Set up Redis and Elasticsearch**
   - Follow official documentation for installation

### Docker Setup

```bash
docker-compose up -d
```

## 🏗️ Project Structure

```
session-musician-coordinator/
├── backend/                # Node.js Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── app.js              # Express app setup
│
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store and slices
│   │   ├── services/       # API service calls
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main App component
│
├── docker/                 # Docker configuration
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## 📚 API Documentation

API documentation is available via Swagger UI at `/api-docs` when running the server.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Production Deployment
This application is designed to be deployed on AWS with the following components:
- Frontend: S3 + CloudFront
- Backend: EC2 or ECS
- Database: MongoDB Atlas
- Cache: ElastiCache (Redis)
- Search: Elasticsearch Service

Detailed deployment instructions are available in the [deployment guide](./docs/deployment.md).

## 🔒 Security

This application implements several security measures:
- JWT token authentication
- Bcrypt password hashing
- HTTPS enforcement
- Content Security Policy
- Rate limiting
- Input validation
- XSS protection

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/dxaginfo/session-musician-coordinator-2025-06-21](https://github.com/dxaginfo/session-musician-coordinator-2025-06-21)