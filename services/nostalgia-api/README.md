# FeelBack Nostalgia Generation API

AI-powered nostalgia content generation service for the FeelBack platform.

## Features

- AI-generated nostalgic text using OpenAI GPT-4
- AI-generated nostalgic images using Stability AI
- Content caching with Redis
- S3 storage for generated media
- RESTful API with Swagger documentation

## Prerequisites

- Node.js >= 18.0.0
- Redis >= 6.0.0
- AWS S3 bucket
- OpenAI API key
- Stability AI API key

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

The API will be available at `http://localhost:3001` with Swagger documentation at `http://localhost:3001/api`.

## API Endpoints

### POST /nostalgia/generate
Generate nostalgic content based on emotion and era.

Request:
```json
{
  "emotion": "joy",
  "era": "2000s",
  "style": "pop culture"
}
```

Response:
```json
{
  "text": "Remember the days of flip phones and MySpace? Those were simpler times...",
  "imageUrl": "https://your-s3-bucket.s3.amazonaws.com/nostalgia/1234567890-joy-2000s.png"
}
```

### GET /nostalgia/content
Get cached nostalgic content.

Query Parameters:
- emotion: string
- era: string
- style: string

Response:
```json
{
  "text": "Remember the days of flip phones and MySpace? Those were simpler times...",
  "imageUrl": "https://your-s3-bucket.s3.amazonaws.com/nostalgia/1234567890-joy-2000s.png"
}
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