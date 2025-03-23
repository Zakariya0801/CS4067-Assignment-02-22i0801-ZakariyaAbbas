# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port that the Flask app runs on (default Flask port is 5000)
EXPOSE 6000

# Define the command to run the application
CMD ["python", "app.py"]
