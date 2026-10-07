# CrickBase

CrickBase is a MERN stack cricket database application built to manage cricket players, teams, and player profiles in a clean and user-friendly interface. It supports authentication, player management, team prediction, and profile views for a complete cricket management experience.

## Features

- Player database management
  - Add, edit, delete, and view cricket players
  - Store player details such as name, role, batting style, bowling style, age, and profile image
- User authentication
  - Register and login functionality
  - User-specific profile access
- Team prediction
  - Generate or evaluate cricket teams based on available player data
- Responsive UI
  - Built with React and Bootstrap
  - Dark mode support
- Dashboard-style browsing
  - Player listing and detail pages
  - Search and profile-oriented views

## Tech Stack

### Frontend
- React.js
- React Router
- Bootstrap
- Chart.js / react-chartjs-2
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Multer for image uploads
- CORS and dotenv

## Project Structure

```bash
CrickBase/
├── App/
│   ├── backend/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── uploads/
│   │   ├── .env
│   │   ├── generate-jwt-secret.ps1
│   │   ├── package.json
│   │   ├── README.md
│   │   └── server.js
│   └── frontend/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── package-lock.json
├── LICENSE
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas database
- npm or yarn installed

## Backend Setup

1. Go to the backend folder:

```bash
cd App/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `App/backend` with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/crickbase
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

4. Start the backend server:

```bash
npm start
```

For development mode with auto-reload:

```bash
npm run dev
```

The backend will run on:

```bash
http://localhost:5000
```

## Frontend Setup

1. Go to the frontend folder:

```bash
cd App/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

The frontend will run on:

```bash
http://localhost:3000
```

## API Overview

The backend exposes routes under the `/api` namespace, including:

- `/api/auth` - registration and login
- `/api/players` - player CRUD operations
- `/api/predict` - team prediction logic

## Usage

- Register a new user or log in
- Add players to the database
- View player profiles and statistics
- Update or delete player records as needed
- Use the team predictor for decision support

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome. If you'd like to improve the project, feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## Contact

For questions or suggestions, feel free to reach out through the repository owner or issue tracker.

---

Built with the MERN stack for cricket data management and player insights.
