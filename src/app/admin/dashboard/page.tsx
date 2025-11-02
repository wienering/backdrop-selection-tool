'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import DashboardSidebar from '@/components/DashboardSidebar'
import Head from 'next/head'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface DashboardStats {
  totals: {
    attendants: number
    backdrops: number
    submissions: number
    recentSubmissions: number
    recentSubmissionsChange: number
  }
  timeSeries: Array<{ date: string; submissions: number }>
  backdropDistribution: Array<{ name: string; value: number }>
  attendantActivity: Array<{ name: string; submissions: number }>
  submissionsChange: number
}

const COLORS = ['#F5A623', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        if (data.authenticated) {
          fetchStats()
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
      setIsLoading(false)
    }
  }

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1f] flex items-center justify-center">
        <AdminNav />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F5A623] mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a1f] flex items-center justify-center">
        <AdminNav />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-100 mb-4">Please log in to access the admin dashboard.</p>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F5A623] hover:bg-[#e0941a]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const formatTimeSeriesData = stats?.timeSeries.map(item => {
    const date = new Date(item.date)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submissions: item.submissions
    }
  }) || []

  return (
    <>
      <Head>
        <title>Admin Dashboard - Photo Booth Backdrop Tool</title>
        <meta name="description" content="Manage photo booth attendants, backdrops, and client submissions" />
      </Head>
      <div className="min-h-screen bg-[#1a1a1f] flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNav />
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Overview of your photo booth backdrop selection tool</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Attendants */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#F5A623]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Attendants</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.totals.attendants || 0}</p>
              </div>

              {/* Total Backdrops */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Backdrops</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.totals.backdrops || 0}</p>
              </div>

              {/* Total Submissions */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#EC4899]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#EC4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.totals.submissions || 0}</p>
              </div>

              {/* Recent Submissions */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">This Week</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white">{stats?.totals.recentSubmissions || 0}</p>
                  {stats?.totals.recentSubmissionsChange !== undefined && (
                    <span className={`text-sm font-medium mb-1 ${
                      stats.totals.recentSubmissionsChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stats.totals.recentSubmissionsChange >= 0 ? '+' : ''}{stats.totals.recentSubmissionsChange.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Submissions Over Time */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-6">Submissions Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={formatTimeSeriesData}>
                    <defs>
                      <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F5A623" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F5A623" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#24242A',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="submissions"
                      stroke="#F5A623"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSubmissions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Backdrop Distribution */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-6">Top Backdrop Selections</h3>
                {stats?.backdropDistribution && stats.backdropDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.backdropDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.backdropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#24242A',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    No backdrop selections yet
                  </div>
                )}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Attendant Activity */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-6">Top Attendants by Submissions</h3>
                {stats?.attendantActivity && stats.attendantActivity.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.attendantActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#24242A',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="submissions" fill="#F5A623" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    No attendant activity yet
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-[#24242A] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link
                    href="/admin/dashboard/attendants"
                    className="block bg-[#2a2a30] hover:bg-[#3a3a40] rounded-lg p-4 border border-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#F5A623]/20 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Manage Attendants</p>
                        <p className="text-gray-400 text-sm">Add, edit, and manage attendants</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin/dashboard/backdrops"
                    className="block bg-[#2a2a30] hover:bg-[#3a3a40] rounded-lg p-4 border border-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Manage Backdrops</p>
                        <p className="text-gray-400 text-sm">Upload and organize backdrop photos</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin/dashboard/submissions"
                    className="block bg-[#2a2a30] hover:bg-[#3a3a40] rounded-lg p-4 border border-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#EC4899]/20 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-[#EC4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">View Submissions</p>
                        <p className="text-gray-400 text-sm">See client backdrop selections</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}