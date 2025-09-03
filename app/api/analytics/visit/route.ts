import { NextRequest, NextResponse } from 'next/server';

// 简单的内存统计（重启会清零）
let totalVisits = 0;
let dailyVisits = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const today = new Date().toISOString().split('T')[0];
    
    // 增加总访问次数
    totalVisits++;
    
    // 增加今日访问次数
    const todayCount = dailyVisits.get(today) || 0;
    dailyVisits.set(today, todayCount + 1);
    
    // 清理旧数据（保留最近7天）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    for (const [date] of dailyVisits) {
      if (new Date(date) < sevenDaysAgo) {
        dailyVisits.delete(date);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      recorded: true 
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  
  return NextResponse.json({
    total_visits: totalVisits,
    today_visits: dailyVisits.get(today) || 0,
    recent_days: Object.fromEntries(dailyVisits),
  });
}