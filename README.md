# Hotel Booking Application

A full-stack hotel booking application with Django REST API backend and React frontend.

## Project Structure

```
HOTEL/
├── backend/                 # Django REST API
│   ├── api/                 # Django app
│   ├── hotel_booking/       # Django project settings
│   ├── templates/           # Frontend build output
│   ├── manage.py
│   ├── requirement.txt
│   ├── Procfile            # Render deployment config
│   ├── render.yaml         # Render Blueprint
│   └── .env.example        # Environment variables template
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.js         # API configuration
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Local Development

### Backend Setup
```
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```
bash
cd frontend
npm install
npm run dev
```

## Deployment to Render

### Prerequisites
1. Create a [Render account](https://render.com)
2. Install Render CLI: `brew install render-cli` (Mac) or download from Render website

### Option 1: Using Render Blueprint (Recommended)

1. Update `backend/render.yaml` with your specific values:
   - Replace `your-app-name` with your desired app name
   - The database configuration will be created automatically

2. Deploy using Render CLI:
```
bash
render blueprint render.yaml
```

### Option 2: Manual Deployment

1. **Create a PostgreSQL Database**
   - Go to Render Dashboard
   - Create a new PostgreSQL database
   - Note the connection string

2. **Create a Web Service**
   - Create a new Web Service
   - Connect your GitHub repository
   - Settings:
     - Build Command: `pip install -r requirement.txt && cd .. && cd frontend && npm install && npm run build && cd ../backend && mkdir -p templates && cp -r ../frontend/dist/* templates/`
     - Start Command: `gunicorn hotel_booking.wsgi`
     - Environment: Python 3

3. **Set Environment Variables**
   Add these in Render Dashboard:
   - `DJANGO_SECRET_KEY`: Generate a secure key
   - `DEBUG`: `False`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ALLOWED_HOSTS`: Your Render domain (e.g., `hotel-booking-abc.onrender.com`)
   - `CORS_ALLOWED_ORIGINS`: Your Render domain with https

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

### After Deployment

1. Create a superuser:
   - Go to Render Dashboard > Your Web Service > Shell
   - Run: `python manage.py createsuperuser`

2. Access your deployed application:
   - Backend API: `https://your-app-name.onrender.com/api/`
   - Admin: `https://your-app-name.onrender.com/admin/`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DJANGO_SECRET_KEY` | Secret key for Django | Yes |
| `DEBUG` | Set to `False` for production | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hosts | Yes |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | Yes |

## API Endpoints

- `POST /api/register/` - User registration
- `POST /api/login/` - User login (returns JWT token)
- `GET /api/hotels/` - List all hotels
- `POST /api/bookings/` - Create a booking (requires authentication)
- `GET /api/bookings/` - List user's bookings (requires authentication)

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework, Simple JWT, PostgreSQL
- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Deployment**: Render
