export class SimpleAnalytics {
  private static readonly STORAGE_KEY = 'namesentry_visits';
  
  static recordVisit() {
    if (typeof window === 'undefined') return;
    
    const visits = this.getVisitCount();
    const newCount = visits + 1;
    
    localStorage.setItem(this.STORAGE_KEY, newCount.toString());
    
    // 发送到服务端统计
    this.sendVisitToServer();
  }
  
  static getVisitCount(): number {
    if (typeof window === 'undefined') return 0;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }
  
  private static async sendVisitToServer() {
    try {
      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
    } catch (error) {
      console.error('Failed to record visit:', error);
    }
  }
}