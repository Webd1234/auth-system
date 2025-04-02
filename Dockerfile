# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/auth-system-0.0.1-SNAPSHOT.jar app.jar  ✅ (Fixed)

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
