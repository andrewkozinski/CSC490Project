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
```

The keys can be found in the Discord in #environment-files or you can create your own account on https://www.themoviedb.org/ and generate your own API keys.

## Render Deployment:
The backend is deployed on Render. It will be set up to automatically deploy when changes are pushed to the main branch. 

The deployed backend can be accessed at:
https://csc490project.onrender.com/

Since we are using the **free tier** of Render, the server may take a **few seconds** (at most a minute) to wake up if it has been inactive for a while. Usually the server will spin down after 15 minutes of inactivity.

**Beta version** of the backend is also deployed at:
https://beta-csc490project.onrender.com/

This beta version will point to the beta version of the backend and will be used for testing prior to merging into main. Just like the main version, it will automatically deploy when changes are pushed to the current sprint's backend branch.
If you wish to change the branch that the beta version deploys from, contact Andrew. Currently, the beta deployment is using the 'sprint1-backend' branch.