# Use standard slim Python image

FROM python:3.10-slim

# Set working directory

WORKDIR /app

# Copy dependency list and install

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files into the container

COPY . .

# Set default entrypoint for the CLI

ENTRYPOINT ["python", "cli.py"]

# Default CMD (can be overridden by the user)

CMD ["--query", "Where is train 12932?", "--lang", "en"]