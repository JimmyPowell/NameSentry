'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, AlertCircle } from 'lucide-react';

interface RateLimitInfo {
  search: {
    limit: number;
    remaining: number;
    reset: number;
    reset_time: string;
    time_until_reset: number;
  };
  core: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export function RateLimitDisplay() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRateLimit = async () => {
    try {
      setError(null);
      const response = await fetch('/api/rate-limit');
      
      if (!response.ok) {
        throw new Error('Failed to fetch rate limit information');
      }
      
      const data = await response.json();
      setRateLimitInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateLimit();
    
    const interval = setInterval(fetchRateLimit, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeUntilReset = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getUsageColor = (remaining: number, limit: number) => {
    const percentage = (remaining / limit) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUsageBadge = (remaining: number, limit: number) => {
    const percentage = (remaining / limit) * 100;
    if (percentage > 50) return 'secondary';
    if (percentage > 20) return 'outline';
    return 'destructive';
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            API Status Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!rateLimitInfo) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          GitHub API Status
        </CardTitle>
        <CardDescription>
          Current rate limits and usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Search API</span>
            <Badge 
              variant={getUsageBadge(rateLimitInfo.search.remaining, rateLimitInfo.search.limit)}
            >
              {rateLimitInfo.search.remaining}/{rateLimitInfo.search.limit}
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(rateLimitInfo.search.remaining / rateLimitInfo.search.limit) * 100}%`
              }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span 
              className={getUsageColor(rateLimitInfo.search.remaining, rateLimitInfo.search.limit)}
            >
              {rateLimitInfo.search.remaining} requests remaining
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                Resets in {formatTimeUntilReset(rateLimitInfo.search.time_until_reset)}
              </span>
            </div>
          </div>
        </div>

        {rateLimitInfo.search.remaining < 5 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Low API quota remaining
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Consider waiting until the rate limit resets before making more searches.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Core API: {rateLimitInfo.core.remaining.toLocaleString()}/{rateLimitInfo.core.limit.toLocaleString()} remaining
        </div>
      </CardContent>
    </Card>
  );
}