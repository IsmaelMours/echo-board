#!/bin/bash 
 
 # This script will copy the Common module to all required 
 # services upon running npm run publish. 
 # 
 # Note! You should run 'npm run build' first to build the 
 # project and produce the 'dist' folder. 
 # 
 # The Common module contains code that can be shared by other 
 # services like the Job Service class. 
 # 
 # There are multiple ways to share reuable code across projects/ 
 # services like creating and npm package and publishing it for 
 # use with other projects/services or having your dockerfiles in 
 
 # your parent directory to include the Common module with a relative 
 # path if you don't want to publish it to a repository. 
 # 
 # The approach we're taking here is to copy the Common module into 
 # each service instead. Then when that service builds, it will have 
 # a copy of the Common module. The reason for this approach is that 
 # we're not creating a private npm repository and we don't want to 
 # move the Dockerfiles of the services to the parent directory which 
 # would then require more changes across the codebase. This approach 
 # adds the least disruption to code when not publishing the module as 
 # a package, which would be the best solution. 
 
 # -List required services 
 SERVICES=("worker" "server") 
 # -Check every 2 seconds if build folder exists in Common module 
 # for about 5 times 
 SOURCE="build" 
 ATTEMPTS=5 
 FOUND=false 
 
 echo "The Common module will be distributed to the following services:"; 
 printf "%s " "${SERVICES[@]}" 
 echo 
 for ((i=1; i<=$ATTEMPTS; i++)) 
 do 
     if [ -d "$SOURCE" ]; then 
         FOUND=true 
         break 
     else 
         echo "Source folder not found (Attempt $i/$ATTEMPTS)." 
     fi 
     sleep 2 
 done 
 
 # Copy Files/Folders that aren't included in the 'build' folder upon compilation, 
 # into the build folder 
 # -Images not include; copy to build 
 echo "Copying " 
 # cp -r src/services/mail-service/images "$SOURCE/services/mail-service/images" 
 
 # Copy 'dist' folder to services 
 if [ "$FOUND" = true ]; then 
     echo "Source folder found, distributing it to the services..." 
     for SERVICE in "${SERVICES[@]}" 
     do 
         echo "Service: $SERVICE" 
         DESTINATION="../$SERVICE/common" 
         # Check if the destination directory exists, create it if not 
         if [ ! -d "$DESTINATION" ]; then 
             echo "Creating common folder for service: $SERVICE" 
             mkdir -p "$DESTINATION" 
         fi 
         # Remove previous build directory if exists 
         if [ -d "$DESTINATION/build" ]; then 
             echo "Removing previous build folder for service: $SERVICE" 
             rm -rf "$DESTINATION/build" 
         fi 
         echo "Copying source folder to service: $SERVICE" 
         # Copy the package.json and build directory to the destination 
         cp -r "$SOURCE" "$DESTINATION/build" 
         cp -rf "package.json" "$DESTINATION/package.json" 
     done 
     echo "Done"; 
 else 
     echo "Source folder not found after $ATTEMPTS attempts." 
 fi