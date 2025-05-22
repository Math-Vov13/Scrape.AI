# Scrape.AI Frontend

This is the frontend application for Scrape.AI, an intelligent web scraping platform built with Vue.js and Vite.

## Features

- Modern Vue 3 composition API
- Interactive chat interface with Mistral AI integration
- Authentication system (login/register)
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd front
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment variables example file:
   ```bash
   cp .env.example .env
   ```
5. Edit the `.env` file and add your Mistral AI API key

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
/src
  /assets        - Static assets
  /components    - Vue components
  /router        - Vue Router configuration
  App.vue        - Root component
  main.js        - Entry point
  style.css      - Global styles
```

## Environment Variables

- `VITE_MISTRAL_API_KEY` - Your Mistral AI API key
- `VITE_USE_PROXY` - Set to "true" to use the proxy server for API calls
- `VITE_API_BASE_URL` - Backend API base URL
