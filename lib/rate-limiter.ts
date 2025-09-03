export interface UsageRecord {
  timestamp: number;
  endpoint: string;
  remaining: number;
}

export class RateLimiter {
  private static readonly STORAGE_KEY = 'namesentry_api_usage';
  private static readonly MAX_REQUESTS_PER_HOUR = 30;
  private static readonly HOUR_IN_MS = 60 * 60 * 1000;

  static recordUsage(endpoint: string, remaining: number): void {
    if (typeof window === 'undefined') return;
    
    const usage = this.getUsageHistory();
    const now = Date.now();
    
    usage.push({
      timestamp: now,
      endpoint,
      remaining,
    });

    this.cleanOldRecords(usage);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
  }

  static getUsageHistory(): UsageRecord[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static canMakeRequest(): boolean {
    const usage = this.getUsageHistory();
    const now = Date.now();
    const recentRequests = usage.filter(
      record => now - record.timestamp < this.HOUR_IN_MS
    );
    
    return recentRequests.length < this.MAX_REQUESTS_PER_HOUR;
  }

  static getRemainingRequests(): number {
    const usage = this.getUsageHistory();
    const now = Date.now();
    const recentRequests = usage.filter(
      record => now - record.timestamp < this.HOUR_IN_MS
    );
    
    return Math.max(0, this.MAX_REQUESTS_PER_HOUR - recentRequests.length);
  }

  static getNextResetTime(): Date {
    const usage = this.getUsageHistory();
    if (usage.length === 0) return new Date();
    
    const oldestInCurrentHour = usage.find(
      record => Date.now() - record.timestamp < this.HOUR_IN_MS
    );
    
    if (!oldestInCurrentHour) return new Date();
    
    return new Date(oldestInCurrentHour.timestamp + this.HOUR_IN_MS);
  }

  private static cleanOldRecords(usage: UsageRecord[]): void {
    const now = Date.now();
    const cutoff = now - this.HOUR_IN_MS;
    
    for (let i = usage.length - 1; i >= 0; i--) {
      if (usage[i].timestamp < cutoff) {
        usage.splice(i, 1);
      }
    }
  }
}