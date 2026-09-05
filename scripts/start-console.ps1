Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path -LiteralPath "node_modules")) {
  npm install
}
npm run dev
