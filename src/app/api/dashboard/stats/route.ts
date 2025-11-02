import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Require admin authentication
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    // Get all basic counts
    const [totalAttendants, totalBackdrops, totalSubmissions] = await Promise.all([
      prisma.attendant.count(),
      prisma.backdrop.count(),
      prisma.submission.count()
    ])

    // Get submissions from last 30 days for time series
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const submissionsLast30Days = await prisma.submission.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group submissions by day
    const submissionsByDay: Record<string, number> = {}
    submissionsLast30Days.forEach(sub => {
      const date = new Date(sub.createdAt).toISOString().split('T')[0]
      submissionsByDay[date] = (submissionsByDay[date] || 0) + 1
    })

    // Get last 30 days dates
    const dates = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    // Create time series data
    const timeSeriesData = dates.map(date => ({
      date,
      submissions: submissionsByDay[date] || 0
    }))

    // Get submissions from previous 30 days for comparison
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    
    const previousPeriodSubmissions = await prisma.submission.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    })

    const currentPeriodSubmissions = submissionsLast30Days.length
    const submissionsChange = previousPeriodSubmissions > 0
      ? ((currentPeriodSubmissions - previousPeriodSubmissions) / previousPeriodSubmissions * 100).toFixed(1)
      : currentPeriodSubmissions > 0 ? '100.0' : '0.0'

    // Get backdrop distribution
    const backdropSubmissions = await prisma.backdrop.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    const backdropDistribution = backdropSubmissions
      .filter(b => b._count.submissions > 0)
      .sort((a, b) => b._count.submissions - a._count.submissions)
      .slice(0, 10)
      .map(b => ({
        name: b.name,
        value: b._count.submissions
      }))

    // Get attendant activity
    const attendantActivity = await prisma.attendant.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    const attendantActivityData = attendantActivity
      .sort((a, b) => b._count.submissions - a._count.submissions)
      .slice(0, 5)
      .map(a => ({
        name: a.name,
        submissions: a._count.submissions
      }))

    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentSubmissions = await prisma.submission.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get submissions from previous 7 days for comparison
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    
    const previousWeekSubmissions = await prisma.submission.count({
      where: {
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    })

    const recentSubmissionsChange = previousWeekSubmissions > 0
      ? ((recentSubmissions - previousWeekSubmissions) / previousWeekSubmissions * 100).toFixed(1)
      : recentSubmissions > 0 ? '100.0' : '0.0'

    return NextResponse.json({
      totals: {
        attendants: totalAttendants,
        backdrops: totalBackdrops,
        submissions: totalSubmissions,
        recentSubmissions,
        recentSubmissionsChange: parseFloat(recentSubmissionsChange)
      },
      timeSeries: timeSeriesData,
      backdropDistribution,
      attendantActivity: attendantActivityData,
      submissionsChange: parseFloat(submissionsChange)
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
