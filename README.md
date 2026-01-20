# Portfolio Application

A full-stack portfolio application with contact form, user authentication, and admin dashboard to manage inquiries.

## Features

✨ **Frontend**

- Responsive portfolio showcase
- Contact form with validation
- Smooth animations with Framer Motion
- Built with React, TypeScript, and Tailwind CSS
- Vite for fast development

✨ **Backend**

- Express.js REST API
- MongoDB database integration
- User authentication with JWT
- Contact message management
- Email notifications (Resend or Nodemailer)
- Admin endpoints for managing contacts

## Project Structure

```
.
├── src/                    # Frontend (React)
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── data/             # Static data
│   └── main.tsx          # Entry point
├── backend/              # Backend (Node.js/Express)
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & utilities
│   └── server.js        # Express server
├── docker-compose.yml    # Docker services configuration
└── package.json         # Frontend dependencies
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud database)
- **Docker & Docker Compose** (optional, for containerized deployment)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:5000
```

**Backend (backend/.env)**

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key

# Email Configuration (Nodemailer - Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Application
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key-change-this

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Dashboard URL
ADMIN_URL=http://localhost:5173/admin
```

## Running Locally

### Option 1: Without Docker

**Terminal 1 - Start MongoDB** (if local)

```bash
mongod
```

**Terminal 2 - Start Backend**

```bash
cd backend
npm install
npm start
```

**Terminal 3 - Start Frontend**

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Option 2: With Docker

```bash
docker-compose up --build
```

This will start:

- MongoDB on `localhost:27017`
- Backend on `localhost:5000`

Then in another terminal, start the frontend:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Contact Messages

- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/:id` - Get single message (admin only)
- `PUT /api/contact/:id/reply` - Reply to message (admin only)
- `DELETE /api/contact/:id` - Delete message (admin only)

### Health Check

- `GET /api/health` - Check API health status

## Database Setup

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

### Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or
sudo apt-get install mongodb    # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongod     # Linux

# Verify connection
mongosh
```

## Email Setup

### Option 1: Resend (Recommended)

1. Sign up at [Resend](https://resend.com)
2. Get API key from dashboard
3. Set `RESEND_API_KEY` in `backend/.env`

### Option 2: Gmail (SMTP)

1. Enable 2-Factor Authentication on Google Account
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Set `EMAIL_USER` and `EMAIL_PASSWORD` in `backend/.env`

## Deployment

### Deploy to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Full-stack portfolio"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
```

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables from `backend/.env`
6. Deploy

**Backend Environment Variables on Render:**

```
MONGODB_URI=your-mongodb-atlas-uri
RESEND_API_KEY=your-key
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
JWT_SECRET=your-secret
FRONTEND_URL=your-frontend-url
PORT=10000
NODE_ENV=production
```

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set environment variables:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```
6. Deploy

### Alternative: Deploy with Docker to Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-url
heroku config:set JWT_SECRET=your-secret
# ... set other variables

# Deploy
git push heroku main
```

## Development

### Frontend Development

```bash
npm run dev
```

Vite will start at `http://localhost:5173` with hot module reloading.

### Backend Development

```bash
cd backend
npm run dev
```

This starts the server with auto-reload using `--watch` flag.

### Build Frontend

```bash
npm run build
```

Generates optimized build in `dist/` directory.

## Testing

### Contact Form

1. Navigate to contact section
2. Fill form with test data
3. Submit
4. Check email for confirmation

### Admin Features

1. Login with admin account
2. View all contact messages
3. Mark as read/reply to messages
4. Check reply emails

## Troubleshooting

### Backend won't connect to MongoDB

- Verify MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- Ensure network access is enabled (if using Atlas)

### Email not sending

- Verify `RESEND_API_KEY` or Gmail credentials
- Check spam/trash folders
- Test with `curl`:
  ```bash
  curl -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test"}'
  ```

### CORS errors

- Verify `FRONTEND_URL` matches frontend URL in backend `.env`
- Check CORS configuration in `backend/server.js`

### Port already in use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
export PORT=5001
```

## Best Practices

1. **Never commit sensitive data** - Use `.env` files and `.gitignore`
2. **Keep JWT_SECRET secure** - Use strong, random string in production
3. **Validate all inputs** - Backend validates contact form data
4. **Use HTTPS in production** - Always enable SSL/TLS
5. **Rate limiting** - Consider adding rate limiting for public endpoints
6. **Database backups** - Regular backups for MongoDB

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:

- Create an issue on GitHub
- Check existing documentation
- Review API endpoints documentation

---

**Built with ❤️ using React, Node.js, and MongoDB**
