# What is PlotPoints?

Plot Points is a unified movie, TV show, and book review site. This project was developed with the aim to help individuals share their thoughts and opinions on movies and shows they’ve seen or books they’ve read with their friends, family, and anyone else online. This will help individuals looking at the media ratings to have a better idea as to where they should choose to spend their time on certain content over another.

![Homepage](https://i.imgur.com/Mjcemty.png)

# Project Setup

The project is split into two directories, frontend and backend.

Anything React / UI related should is located in frontend. 

Anything backend, database or FastAPI related should go into backend.

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
DB_USER=(VAL HERE)
DB_PASS=(VAL HERE)
DB_DSN=(VAL HERE)
```

The keys can be found in the Discord in #environment-files or you can create your own account on https://www.themoviedb.org/ and generate your own API keys.

## Render Deployment:
The backend is deployed on Render. It will be set up to automatically deploy when changes are pushed to the main branch. 

The deployed backend (which points to the main branch) can be accessed at:
https://csc490project.onrender.com/

Since we are using the **free tier** of Render, the server typically takes on average 30 seconds (at most a minute) to wake up if it has been inactive for a while. Usually the server will spin down after 15 minutes of inactivity.

**Beta version** of the backend is also deployed at:
https://beta-csc490project.onrender.com/

This beta version will point to the beta version of the backend and will be used for testing prior to merging into main. Just like the main version, it will automatically deploy when changes are pushed to the current sprint's backend branch.
If you wish to change the branch that the beta version deploys from, contact Andrew. Currently, the beta deployment is using the 'sprint5-backend' branch.

# Frontend

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
