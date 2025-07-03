import React from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { useQuery } from 'react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import CountUp from 'react-countup'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Dashboard = () => {
  const { data: statsData, isLoading } = useQuery(
    'admin-dashboard-stats',
    async () => {
      const response = await fetch('/api/admin/dashboardStats.php')
      return response.json()
    },
    { refetchOnWindowFocus: false }
  )

  const stats = statsData?.data || {}

  const dashboardCards = [
    {
      title: 'إجمالي العملاء',
      value: stats.users?.client || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'المواعيد اليوم',
      value: stats.today_appointments || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%'
    },
    {
      title: 'الإيرادات الشهرية',
      value: stats.month_revenue || 0,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+15%',
      prefix: 'ر.س '
    },
    {
      title: 'إجمالي الموظفين',
      value: stats.users?.staff || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2%'
    }
  ]

  const appointmentData = [
    { name: 'السبت', appointments: 12 },
    { name: 'الأحد', appointments: 19 },
    { name: 'الاثنين', appointments: 15 },
    { name: 'الثلاثاء', appointments: 22 },
    { name: 'الأربعاء', appointments: 18 },
    { name: 'الخميس', appointments: 25 },
    { name: 'الجمعة', appointments: 8 },
  ]

  const serviceData = [
    { name: 'العناية بالشعر', value: 40, color: '#ff85a2' },
    { name: 'العناية بالبشرة', value: 30, color: '#ffa5b9' },
    { name: 'المكياج', value: 20, color: '#ff8e71' },
    { name: 'أخرى', value: 10, color: '#ffe0e6' },
  ]

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

      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم الإدارة</h1>
          <p className="text-gray-600">نظرة عامة على أداء الصالون</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{card.change}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.prefix}
                    <CountUp end={card.value} duration={2} />
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">المواعيد الأسبوعية</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#ff85a2" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">توزيع الخدمات</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">النشاط الأخير</h3>
          <div className="space-y-4">
            {stats.recent_appointments?.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{appointment.client_name}</h4>
                    <p className="text-gray-600 text-sm">{appointment.service_name}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">{appointment.appointment_date}</p>
                  <p className="text-sm text-gray-500">{appointment.appointment_time}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد أنشطة حديثة</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
