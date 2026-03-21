# HW App – Frontend

## About

The **Health is Wealth  (HW) App Frontend** is a React application that allows users to track fitness progress, browse exercises, and interact with workout plans.

It connects to a **Django REST API backend** and uses **JWT authentication** to manage secure user sessions.

---
## Live Deployment

- **Frontend (Netlify):** https://healthwealthapp.netlify.app/
- **Backend API (Railway):** https://hw-app-backend-production.up.railway.app/

---
## Tech Stack

- React
- Vite
- React Router
- Axios
- JWT Authentication
- Netlify (deployment)

---

## Features
## Features

- JWT authentication
- Profile management (height tracking and weight logs)
- Exercise library with instructions and demo videos (admin seeded)
- Workout templates and plans (admin seeded)
- Calendar-based workout logging
- User authentication (sign up / sign in)
- Dashboard with nested routing

---
```bash
src
│
├── components
│   │
│   ├── Calendar
        ├── Calendar.jsx
        ├── Profile.css
│   │   └── Profile.jsx
│   │
│   ├── ExerciseLibrary
│   │   ├── ExerciseLibrary.jsx
│   │   └── ExerciseDetail.jsx
│   │
│   ├── Dashboard
│   │   └── Dashboard.jsx
│   │
│   └── Landing
│       └── Landing.jsx
│
├── contexts
│   └── UserContext.jsx
│
├── services
│   ├── apiConfig.js
│   ├── authService.js
│   ├── profileServices.js
│   └── exerciseService.js
│
└── App.jsx

```
## Calendar Workout Log

The app includes a **calendar-based workout log** that allows users to view and track workouts scheduled on specific dates.

Workout plans generate **dated workouts** that appear in the user's calendar. Each workout contains exercises derived from predefined workout templates.

### What Users Can Do

- View workouts scheduled for specific calendar days
- Open a workout to see exercises and instructions
- Log completion of workouts
- Track workout history over time

### How It Works

The workout system separates **planning** from **execution**:

- **Workout Templates**  
  Define the structure of a workout (exercises, order, and configuration).

- **Workout Plans**  
  Schedule workouts across a time period using templates.

- **Calendar Workouts**  
  Represent actual workouts assigned to specific calendar dates.

When a workout plan is generated, the backend creates dated workout entries that appear in the calendar. These entries represent **real workout sessions** that users can complete and track.

Each workout entry includes:

- Workout date
- List of exercises
- Instructions for each exercise

This structure allows users to plan workouts ahead of time while maintaining a clear log of completed training sessions.

## Authentication Flow

The application uses **JWT (JSON Web Tokens)** for authentication. After a user signs in or registers, the backend issues an access token that the frontend stores locally and attaches to API requests.

### Sign Up / Sign In

1. User submits credentials on the **Sign Up** or **Sign In** page.
2. The frontend sends a request to the backend:

POST `/users/register/`  
POST `/users/login/`

3. The backend responds with authentication tokens and user information.
4. The frontend stores the **access token** in `localStorage`.

---

### Authenticated Requests

All API requests use an Axios instance configured in `apiConfig.js`.

If a token exists, the request interceptor attaches it to the request header: Authorization: Bearer <token>

This allows the backend to authenticate the user and return protected resources.

---

### Session Verification

When the application loads, `UserContext` checks whether a token exists.

If a token is present, the frontend calls:

GET `/users/token/refresh/`

The backend returns a refreshed access token and user information, allowing the app to restore the user session without requiring the user to sign in again.

---

### Sign Out

Signing out removes the stored token from `localStorage`, which prevents further authenticated API requests.

Once the token is removed, protected routes become inaccessible and the user is redirected to the public landing page.

## Post-MVP Features

Future improvements planned for the application include:

- **Workout Completion Tracking**
  - Allow users to mark workouts as completed and track completion streaks.

- **Setting Goals**
  - Allow users to defined their workout goals.

- **Exercise Search and Filtering**
  - Filter exercises by muscle group, equipment, or exercise type.

- **Progress Analytics**
  - Charts for weight trends and workout frequency over time

- **Custom Workout Plans**
  - Users can build personalized workout plans instead of only using admin-seeded plans.
  - 
- **Meal Tracking & Recipes**
  - Allow users to track calories, macros and meals.
  - Allow users to store recipes

- **Workout Notes**
  - Add notes to workouts or exercises (e.g., weights used, difficulty, comments).

- **Exercise Favorites**
  - Save frequently used exercises for quick access.

- **Mobile UI Improvements**
  - Improve layout and usability on smaller screens.

- **Calendar Enhancements**
  - Drag-and-drop workout scheduling.

- **Social Features**
  - Share workouts or progress with friends.



