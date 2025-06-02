# SuperEdit

A Python application that uses Google's Generative AI to analyze videos and generate summaries and quizzes.

## Setup

1. Install Poetry (if not already installed):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
poetry install
```

3. Create a `.env` file in the project root and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

## Usage

1. Activate the Poetry environment:
```bash
poetry shell
```

2. Run the application:
```bash
python main.py
```

Make sure to replace the `video_path` in `main.py` with the path to your video file.

## Features

- Video analysis using Google's Generative AI
- Automatic summary generation
- Quiz creation with answer key
- Secure API key management using environment variables

## Requirements

- Python 3.11 or higher
- Poetry for dependency management
- Google API key with access to Generative AI services 