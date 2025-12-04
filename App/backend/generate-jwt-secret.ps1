# PowerShell script to generate a secure JWT secret
# Run this script: .\generate-jwt-secret.ps1

$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "Generated JWT Secret:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host ""
Write-Host "Add this to your .env file:" -ForegroundColor Cyan
Write-Host "JWT_SECRET=$secret" -ForegroundColor White

