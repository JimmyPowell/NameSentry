export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  size: number;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubRateLimitResponse {
  resources: {
    core: RateLimitInfo;
    search: RateLimitInfo;
  };
  rate: RateLimitInfo;
}

export class GitHubApiClient {
  private baseUrl = 'https://api.github.com';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NameSentry-App',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async searchRepositories(query: string, options: {
    sort?: 'stars' | 'forks' | 'updated';
    order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      sort: options.sort || 'stars',
      order: options.order || 'desc',
      per_page: String(options.per_page || 10),
      page: String(options.page || 1),
    });

    return this.makeRequest<GitHubSearchResponse>(`/search/repositories?${params}`);
  }

  async getRateLimit(): Promise<GitHubRateLimitResponse> {
    return this.makeRequest<GitHubRateLimitResponse>('/rate_limit');
  }

  async searchExactRepoName(name: string): Promise<GitHubRepository[]> {
    const response = await this.searchRepositories(`"${name}" in:name`, {
      sort: 'stars',
      order: 'desc',
      per_page: 30,
    });
    
    return response.items.filter(repo => 
      repo.name.toLowerCase() === name.toLowerCase()
    );
  }
}