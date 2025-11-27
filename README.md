# 1. activate environment for python 
python -m venv .venv #only one time
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1

# 2. requirment of project
pip install --upgrade pip
pip install joblib numpy pandas scikit-learn


# 3. go to server/ml_models train dataset
python train_logistic_regression.py
python train_linear_regression.py

# 4. come back to project folder (node dependencies)
npm i
npm i tsx --save-dev

# 5. ensure the env vars are loaded into this shell
cd server

$env:OPENWEATHER_API_KEY = (Get-Content .\.env | Where-Object { $_ -match '^OPENWEATHER_API_KEY=' } | ForEach-Object { $_ -replace '^OPENWEATHER_API_KEY=', '' }).Trim()
$env:HOST = "127.0.0.1"
$env:PORT = "5000"


# 6. run backend
npm run dev
