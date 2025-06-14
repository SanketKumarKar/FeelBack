# FeelBack Emotion Processing Engine

Real-time sentiment analysis and emotion processing service for the FeelBack platform.

## Features

- Real-time emotion analysis from text input
- Emotion history tracking
- Redis-based caching for performance
- TensorFlow.js-powered emotion classification
- RESTful API with Swagger documentation

## Prerequisites

- Node.js >= 18.0.0
- Redis >= 6.0.0
- TensorFlow.js model files in `./models/emotion_model/`

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. Build the service:
   ```bash
   npm run build
   ```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

## API Endpoints

### POST /emotions/analyze
Analyze emotion from text input.

Request:
```json
{
  "text": "I'm feeling really happy today!"
}
```

Response:
```json
{
  "emotion": "joy",
  "confidence": 0.92,
  "timestamp": 1621234567890
}
```

### GET /emotions/history/:userId
Get emotion analysis history for a user.

Response:
```json
[
  {
    "emotion": "joy",
    "confidence": 0.92,
    "timestamp": 1621234567890
  },
  {
    "emotion": "sadness",
    "confidence": 0.85,
    "timestamp": 1621234567880
  }
]
```

## Testing

Run the test suite:
```bash
npm test
```

## Production Deployment

1. Build the service:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

## Monitoring

The service exposes metrics at `/metrics` for Prometheus integration.

## License

Private - All rights reserved 