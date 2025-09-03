'use client';

import { useState, useEffect } from 'react';
import { SimpleAnalytics } from '@/lib/analytics';
import { SearchForm } from '@/components/search-form';
import { SearchResults } from '@/components/search-results';
import { GitHubRepository } from '@/lib/github-api';

interface SearchResponse {
  query: string;
  results: GitHubRepository[];
  total_count: number;
  rate_limit: {
    remaining: number;
    limit: number;
    reset: number;
  };
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SimpleAnalytics.recordVisit();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data: SearchResponse = await response.json();
      setSearchResults(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      
      {error && (
        <div className="w-full max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {searchResults && (
        <SearchResults
          query={searchResults.query}
          results={searchResults.results}
          totalCount={searchResults.total_count}
        />
      )}


      <footer className="text-center text-sm text-muted-foreground pt-12 pb-4">
        <div className="space-y-2">
          <p>
            NameSentry helps developers check project name availability on GitHub
          </p>
          <p>
            Built with Next.js and deployed on Cloudflare Pages
          </p>
        </div>
      </footer>
    </div>
  );
}