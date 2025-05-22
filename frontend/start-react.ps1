Write-Host "Starting Myanmar Earthquake Alert System frontend..." -ForegroundColor Green

# Set the OpenSSL legacy provider option
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Start the React application
npm start
