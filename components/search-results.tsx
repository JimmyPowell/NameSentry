'use client';

import { GitHubRepository } from '@/lib/github-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, GitFork, ExternalLink, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  results: GitHubRepository[];
  totalCount: number;
}

export function SearchResults({ query, results, totalCount }: SearchResultsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (totalCount === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Name Available!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-700 mb-4">
            No repositories found with the exact name <strong>"{query}"</strong>
          </p>
          <p className="text-sm text-green-600">
            This project name appears to be available on GitHub.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-orange-800">Name Already Taken</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-orange-700">
            Found <strong>{totalCount}</strong> repositories with the exact name <strong>"{query}"</strong>
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results.map((repo) => (
          <Card key={repo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 flex items-center gap-2"
                    >
                      {repo.full_name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{repo.owner.login}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(repo.created_at)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {repo.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {repo.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{formatNumber(repo.stargazers_count)} stars</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  <span>{formatNumber(repo.forks_count)} forks</span>
                </div>
                {repo.language && (
                  <Badge variant="secondary" className="text-xs">
                    {repo.language}
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {formatDate(repo.updated_at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}