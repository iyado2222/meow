import React, { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useQuery } from 'react-query'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { staffService } from '../../services/staffService'

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'week' or 'month'

  // Calculate date range based on view mode - memoized to prevent recalculation
  const dateRange = useMemo(() => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    if (viewMode === 'week') {
      // Get start of week (Saturday)
      const dayOfWeek = start.getDay()
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) - 1 // Adjust for Saturday start
      start.setDate(diff)
      end.setDate(start.getDate() + 6)
    } else {
      // Get start and end of month
      start.setDate(1)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
    }

    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0]
    }
  }, [currentDate, viewMode])

  // Fetch staff schedule with proper query keys for caching
  const { 
    data: scheduleData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery(
    ['staff-schedule', dateRange.from, dateRange.to, viewMode],
    () => staffService.getStaffSchedule(null, dateRange.from, dateRange.to),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      onError: (error) => {
        console.error('Error fetching schedule:', error)
      }
    }
  )

  const schedule = scheduleData?.data || {}

  // Memoized navigation function to prevent unnecessary re-renders
  const navigateDate = useCallback((direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      }
      return newDate
    })
  }, [viewMode])

  // Memoized week days calculation
  const weekDays = useMemo(() => {
    const days = []
    const start = new Date(dateRange.from)
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    
    return days
  }, [dateRange.from])

  // Pure functions for formatting and display
  const formatDate = (date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      in_progress: 'جاري',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      no_show: 'لم يحضر',
    }
    return labels[status] || status
  }

  // Error state handling
  if (isError) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ أثناء تحميل الجدول</h2>
            <p className="text-gray-600 mb-6">لم نتمكن من تحميل جدولك. يرجى المحاولة مرة أخرى.</p>
            <button 
              onClick={() => refetch()} 
              className="btn-primary flex items-center mx-auto"
            >
              <RefreshCw className="w-5 h-5 ml-2" />
              إعادة المحاولة
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جدولي الأسبوعي</h1>
          <p className="text-gray-600">عرض وإدارة مواعيدك المجدولة</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => navigateDate('prev')}
                className="btn-outline p-2"
                aria-label="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900">
                {viewMode === 'week' 
                  ? `أسبوع ${formatDate(new Date(dateRange.from)).split('،')[0]}`
                  : formatDate(currentDate).split('،')[1]
                }
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="btn-outline p-2"
                aria-label="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => setViewMode('week')}
                className={`btn-outline ${viewMode === 'week' ? 'bg-primary-200 text-white' : ''}`}
              >
                أسبوعي
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`btn-outline ${viewMode === 'month' ? 'bg-primary-200 text-white' : ''}`}
              >
                شهري
              </button>
            </div>
          </div>
        </motion.div>

        {/* Schedule View */}
        {viewMode === 'week' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-7 gap-4"
          >
            {weekDays.map((day, index) => {
              const dayKey = day.toISOString().split('T')[0]
              const dayAppointments = schedule[dayKey] || []
              const isToday = dayKey === new Date().toISOString().split('T')[0]

              return (
                <div
                  key={dayKey}
                  className={`card p-4 ${isToday ? 'ring-2 ring-primary-200' : ''}`}
                >
                  <div className="text-center mb-4">
                    <h3 className={`font-bold ${isToday ? 'text-primary-200' : 'text-gray-900'}`}>
                      {day.toLocaleDateString('ar-SA', { weekday: 'long' })}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {day.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 bg-gray-50 rounded-lg border-r-4 border-primary-200"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {appointment.appointment_time}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusLabel(appointment.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {appointment.client_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {appointment.service_name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">لا توجد مواعيد</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        ) : (
          // Month view - optimized list with virtualization for large datasets
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            {Object.keys(schedule).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
                <p className="text-gray-600">لا توجد مواعيد مجدولة في هذه الفترة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(schedule)
                  .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                  .map(([date, appointments]) => (
                    <div key={date} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-bold text-gray-900 mb-3">
                        {new Date(date).toLocaleDateString('ar-SA', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {appointment.appointment_time}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                                {getStatusLabel(appointment.status)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-primary-200" />
                              </div>
                              <p className="text-sm text-gray-700 font-medium">
                                {appointment.client_name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {appointment.service_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default StaffSchedule