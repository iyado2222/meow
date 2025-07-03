import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, Users, LogIn, LogOut } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import CountUp from 'react-countup'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

const StaffDashboard = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch staff schedule from API
  const { data: scheduleData, isLoading } = useQuery(
    'staff-schedule',
    async () => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('csrf_token', localStorage.getItem('auth_token'))

      const response = await fetch('http://localhost/senior-nooralshams/api/Staff/viewStaffSchedule.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch schedule')
      }

      return result
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!user?.id,
      onError: (error) => {
        console.error('Error fetching schedule:', error)
        toast.error('فشل في تحميل الجدول')
      }
    }
  )

  // Check-in mutation
  const checkInMutation = useMutation(
    async () => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('csrf_token', localStorage.getItem('auth_token'))

      const response = await fetch('http://localhost/senior-nooralshams/api/Staff/check_in.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success!' && result.status !== 'success') {
        throw new Error(result.message || 'Failed to check in')
      }

      return result
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || 'تم تسجيل الحضور بنجاح!')
        queryClient.invalidateQueries('staff-attendance')
      },
      onError: (error) => {
        toast.error(error.message || 'فشل في تسجيل الحضور')
      }
    }
  )

  // Check-out mutation
  const checkOutMutation = useMutation(
    async () => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('csrf_token', localStorage.getItem('auth_token'))

      const response = await fetch('http://localhost/senior-nooralshams/api/Staff/check_out.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success!' && result.status !== 'success') {
        throw new Error(result.message || 'Failed to check out')
      }

      return result
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || 'تم تسجيل الانصراف بنجاح!')
        queryClient.invalidateQueries('staff-attendance')
      },
      onError: (error) => {
        toast.error(error.message || 'فشل في تسجيل الانصراف')
      }
    }
  )

  // Update booking status mutation
  const updateBookingStatusMutation = useMutation(
    async ({ appointmentId, status }) => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('appointment_id', appointmentId)
      formData.append('status', status)
      formData.append('csrf_token', localStorage.getItem('auth_token'))

      const response = await fetch('http://localhost/senior-nooralshams/api/Staff/staffUpdateBookingStatus.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to update booking status')
      }

      return result
    },
    {
      onSuccess: () => {
        toast.success('تم تحديث حالة الموعد بنجاح')
        queryClient.invalidateQueries('staff-schedule')
      },
      onError: (error) => {
        toast.error(error.message || 'فشل في تحديث حالة الموعد')
      }
    }
  )

  const appointments = scheduleData?.data || []
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date).toDateString()
    const today = new Date().toDateString()
    return appointmentDate === today
  })

  const stats = [
    {
      title: 'مواعيد اليوم',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'المواعيد المكتملة',
      value: todayAppointments.filter(a => a.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'المواعيد المؤكدة',
      value: todayAppointments.filter(a => a.status === 'confirmed').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'إجمالي العملاء',
      value: new Set(todayAppointments.map(a => a.client_name)).size,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const handleCheckIn = () => {
    checkInMutation.mutate()
  }

  const handleCheckOut = () => {
    checkOutMutation.mutate()
  }

  const handleStatusUpdate = (appointmentId, status) => {
    updateBookingStatusMutation.mutate({ appointmentId, status })
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم الموظف</h1>
          <p className="text-gray-600">إدارة مواعيدك وتسجيل الحضور والانصراف</p>
        </motion.div>

        {/* Check-in/Check-out Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">تسجيل الحضور والانصراف</h2>
          <div className="flex space-x-4 space-x-reverse">
            <button
              onClick={handleCheckIn}
              disabled={checkInMutation.isLoading}
              className="btn-primary flex items-center space-x-2 space-x-reverse disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              <span>تسجيل حضور</span>
              {checkInMutation.isLoading && <LoadingSpinner size="sm" text="" />}
            </button>
            
            <button
              onClick={handleCheckOut}
              disabled={checkOutMutation.isLoading}
              className="btn-secondary flex items-center space-x-2 space-x-reverse disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل انصراف</span>
              {checkOutMutation.isLoading && <LoadingSpinner size="sm" text="" />}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      <CountUp end={stat.value} duration={2} />
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">مواعيد اليوم</h2>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.client_name}</h3>
                      <p className="text-gray-600 text-sm">{appointment.service_name}</p>
                      <p className="text-gray-500 text-sm">{appointment.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'completed' && 'مكتمل'}
                      {appointment.status === 'confirmed' && 'مؤكد'}
                      {appointment.status === 'in_progress' && 'جاري'}
                      {appointment.status === 'pending' && 'في الانتظار'}
                    </span>
                    
                    {appointment.status !== 'completed' && (
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment.appointment_id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        disabled={updateBookingStatusMutation.isLoading}
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="in_progress">جاري</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                        <option value="no_show">لم يحضر</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد اليوم</h3>
              <p className="text-gray-600">استمتع بيوم هادئ!</p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default StaffDashboard