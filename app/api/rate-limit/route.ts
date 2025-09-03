import { NextResponse } from 'next/server';
import { GitHubApiClient } from '@/lib/github-api';

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const client = new GitHubApiClient(githubToken);
    const rateLimit = await client.getRateLimit();

    const now = Date.now();
    const resetTime = rateLimit.resources.search.reset * 1000;
    const timeUntilReset = Math.max(0, resetTime - now);

    return NextResponse.json({
      search: {
        limit: rateLimit.resources.search.limit,
        remaining: rateLimit.resources.search.remaining,
        reset: rateLimit.resources.search.reset,
        reset_time: new Date(resetTime).toISOString(),
        time_until_reset: timeUntilReset,
      },
      core: {
        limit: rateLimit.resources.core.limit,
        remaining: rateLimit.resources.core.remaining,
        reset: rateLimit.resources.core.reset,
      },
    });

  } catch (error) {
    console.error('Rate limit API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch rate limit information' },
      { status: 500 }
    );
  }
}