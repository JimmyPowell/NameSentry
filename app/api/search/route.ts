import { NextRequest, NextResponse } from 'next/server';
import { GitHubApiClient } from '@/lib/github-api';
import { z } from 'zod';

export const runtime = 'edge';

const searchSchema = z.object({
  q: z.string().min(1).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const result = searchSchema.safeParse({ q: query });
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid query parameter' },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const client = new GitHubApiClient(githubToken);
    
    const [searchResults, rateLimit] = await Promise.all([
      client.searchExactRepoName(result.data.q),
      client.getRateLimit(),
    ]);

    return NextResponse.json({
      query: result.data.q,
      results: searchResults,
      total_count: searchResults.length,
      rate_limit: {
        remaining: rateLimit.resources.search.remaining,
        limit: rateLimit.resources.search.limit,
        reset: rateLimit.resources.search.reset,
      },
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof Error && error.message.includes('403')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}