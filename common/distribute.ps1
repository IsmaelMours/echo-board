# This script will copy the Common module to all required
# services upon running npm run publish.
#
# Note! You should run 'npm run build' first to build the
# project and produce the 'build' folder.

$SERVICES = @("worker", "server")
$SOURCE = "build"
$ATTEMPTS = 5
$FOUND = $false

Write-Host "The Common module will be distributed to the following services:"
Write-Host ($SERVICES -join " ")

for ($i=1; $i -le $ATTEMPTS; $i++) {
    if (Test-Path $SOURCE -PathType Container) {
        $FOUND = $true
        break
    } else {
        Write-Host "Source folder not found (Attempt $($i)/$($ATTEMPTS))."
    }
    Start-Sleep -Seconds 2
}

if ($FOUND) {
    Write-Host "Source folder found, distributing it to the services..."
    foreach ($SERVICE in $SERVICES) {
        Write-Host "Service: $($SERVICE)"
        $DESTINATION = "..\$($SERVICE)\common"

        # Check if the destination directory exists, create it if not
        if (-not (Test-Path $DESTINATION -PathType Container)) {
            Write-Host "Creating common folder for service: $($SERVICE)"
            New-Item -ItemType Directory -Force -Path $DESTINATION
        }

        # Remove previous build directory if exists
        if (Test-Path "$($DESTINATION)\build" -PathType Container) {
            Write-Host "Removing previous build folder for service: $($SERVICE)"
            Remove-Item -Recurse -Force "$($DESTINATION)\build"
        }

        Write-Host "Copying source folder to service: $($SERVICE)"
        # Copy the package.json and build directory to the destination
        Copy-Item -Recurse -Force $SOURCE "$($DESTINATION)\build"
        Copy-Item -Force "package.json" "$($DESTINATION)\package.json"
    }
    Write-Host "Done"
} else {
    Write-Host "Source folder not found after $($ATTEMPTS) attempts."
}