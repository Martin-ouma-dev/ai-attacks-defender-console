Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Get-Command uvicorn -ErrorAction SilentlyContinue)) {
  Write-Error "uvicorn is not installed. Run: python -m pip install -r requirements.txt"
  exit 1
}
python -m uvicorn src.server.protection_api:app --host 127.0.0.1 --port 8001
