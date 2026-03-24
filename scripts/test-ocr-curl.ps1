$ErrorActionPreference = 'Stop'
$loginBody = '{"email":"e2e_20260325031931@test.local","password":"testpass12"}'
$r = Invoke-RestMethod -Uri 'http://localhost:3000/auth/login' -Method POST `
  -ContentType 'application/json' -Body $loginBody
$token = $r.accessToken
$jsonPath = Join-Path $PSScriptRoot 'ocr-body.json'
curl.exe -s -H "Authorization: Bearer $token" -H "Content-Type: application/json" `
  --data-binary "@$jsonPath" http://localhost:3000/ocr/receipts/parse
