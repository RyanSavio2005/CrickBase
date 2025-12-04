# CrickBase Backend

Node.js and Express backend for the CrickBase cricket player database application.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/crickbase
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** 
- Generate a secure JWT_SECRET for production
- Use the provided PowerShell script: `.\generate-jwt-secret.ps1`
- Or use: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- Never commit your `.env` file to version control!

## Running the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on http://localhost:5000

## Prerequisites

- Node.js installed
- MongoDB running locally or MongoDB Atlas connection string

