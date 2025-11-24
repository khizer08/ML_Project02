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

python predict.py

# 4. come back to project folder (node dependencies)
npm i tsx --save-dev

# 5. ensure the env vars are loaded into this shell
$env:OPENWEATHER_API_KEY = (Get-Content .\server\.env | Where-Object { $_ -match '^OPENWEATHER_API_KEY=' } | ForEach-Object { $_ -replace '^OPENWEATHER_API_KEY=', '' }).Trim()
$env:HOST = "127.0.0.1"
$env:PORT = "5000"

# 6
cd .\server
npm run dev
