# FastAPI Setup

### 1. Open PowerShell or Command Prompt.

### 2. Run the following command to install uv:

`powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`

Or if you use winget:

`winget install --id Astral.UV`

### 3. Verify installation:

`uv --version`

### 4. Create a virtual environment using uv:

`uv venv`

### 5. Activate the virtual environment:

`.\.venv\Scripts\activate`

### 6. Install Dependencies

`uv pip install -r requirements.txt`

### 7. Run:

`uvicorn main:app --reload`

# Lighthouse Setup

### 1. Verify Node.js

`node -v`
`npm -v`

### 2. Install Dependencies

` npm install`

### 3. Run:

`node src/index.js https://neelkanthkaushik.com`
