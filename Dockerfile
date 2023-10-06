# Use the official image as a parent image
FROM postgres:latest

# Set environment variables (these are used by the PostgreSQL init scripts)
# Replace these with your desired username, password, and database name
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb

# Expose the PostgreSQL port
EXPOSE 5432

# Note: The default CMD of the postgres:latest image starts up the database
