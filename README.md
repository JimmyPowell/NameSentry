# NameSentry

A modern web application to check if your project name is available on GitHub. Built with Next.js and optimized for Cloudflare Pages deployment.

## Features

- 🔍 **Exact Name Search**: Search for exact repository name matches on GitHub
- ⚡ **Real-time Results**: Get instant feedback on name availability
- 📊 **API Rate Limiting**: Built-in rate limit monitoring and display
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🚀 **Optimized for CF Pages**: Fully optimized for Cloudflare Pages deployment

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/JimmyPowell/NameSentry.git
cd namesentry
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your GitHub token:

```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

### 3. Get GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic)
3. Select scope: `public_repo` (read access to public repositories)
4. Copy the token to your `.env.local` file

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Deployment on Cloudflare Pages

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project and connect your GitHub repository
4. Set build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Add environment variable:
   - **Variable name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub personal access token

### Method 2: Direct Upload

```bash
npm run build
npx wrangler pages publish out --project-name namesentry
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Production URL | No |

## API Endpoints

- `GET /api/search?q={name}` - Search for repositories
- `GET /api/rate-limit` - Get current rate limit status

## Rate Limits

- **GitHub API**: 10 requests per minute for search
- **Client-side**: 30 requests per hour limit
- Real-time rate limit monitoring in UI

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: GitHub REST API
- **Deployment**: Cloudflare Pages
- **TypeScript**: Full type safety

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```

## Project Structure

```
namesentry/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/             # Utilities & API clients
├── public/          # Static assets
└── types/           # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
