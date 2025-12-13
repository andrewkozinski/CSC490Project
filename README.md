# What is Plot Points?

Plot Points is a unified movie, TV show, and book review site. This project was developed with the aim to help individuals share their thoughts and opinions on movies and shows they’ve seen or books they’ve read with their friends, family, and anyone else online. This will help individuals looking at the media ratings to have a better idea as to where they should choose to spend their time on certain content over another.

![Homepage](https://i.imgur.com/wHWTPQC.png)

# Project Setup

The project is split into two directories, frontend and backend.

Anything Frontend & UI related should is located in frontend. 

Anything backend, database or FastAPI related is located in backend.

# Setting up the backend

This project uses FastAPI for the backend. To set up the backend, follow these steps:

1. In a terminal, navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (this is optional, but probably better):
   ```bash
   python -m venv venv
   ```
Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On Mac or Linux:
     ```bash
     source venv/bin/activate
     ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
4. To Actually Start the Local FastAPI server:
```bash
  uvicorn main:app --reload
```

5. The FastAPI server should now be running at these URLs:
    - API Root (should just show a json response of hello world): `http://127.0.0.1:8000/`
    - API Docs (fancy API documentation): `http://127.0.0.1:8000/docs`

## .env File:
Make sure to create a `.env` file in the `backend` directory with the following content:
```
TMDB_API_KEY=your_tmdb_api_key_here
TMBD_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
SECRET_KEY=your_secret_key_val_here
DB_USER=(VAL HERE)
DB_PASS=(VAL HERE)
DB_DSN=(VAL HERE)
OCI_USER=(VAL HERE)
OCI_FINGERPRINT=(VAL HERE)
OCI_TENANCY=(VAL HERE)
OCI_REGION=(VAL HERE)
OCI_PRIVATE_KEY=(VAL HERE)
OCI_BUCKET_NAME=(VAL HERE)
OCI_NAMESPACE=(VAL HERE)
```

To get your own The Movie Database API keys, visit https://www.themoviedb.org/ to generate your own keys.

## Render Deployment:
The backend is deployed on Render. It will be set up to automatically deploy when changes are pushed to the main branch. 

The deployed backend (which points to the main branch) can be accessed at:
https://csc490project.onrender.com/

Since we are using the **free tier** of Render, the server typically takes on average 30 seconds (at most a minute) to wake up if it has been inactive for a while. Usually, the server will spin down after 15 minutes of inactivity.

**Beta version** of the backend is also deployed at:
https://beta-csc490project.onrender.com/

This beta version refers to an in-development branch of the backend and is used for testing purposes before being merged into the main branch. Just like the main version, it will automatically deploy when changes are pushed to the current sprint's backend branch. Currently, the beta deployment is using the 'sprint5-backend' branch.

# Setting up the frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First run this in your terminal:
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

The frontend is hosted on Vercel. 

## .env File:
Make sure to create a `.env` file in the `frontend` directory with the following content:
```
API_URL=https://beta-csc490project.onrender.com/
NEXTAUTH_SECRET=(YOUR_VAL_HERE)
```
