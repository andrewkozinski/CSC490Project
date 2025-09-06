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
