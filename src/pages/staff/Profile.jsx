import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Calendar, Edit, Save, X, Briefcase, DollarSign } from 'lucide-react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

const StaffProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  // Fetch staff profile data from API
  const { data: staffData, isLoading: profileLoading, refetch } = useQuery(
    'staff-profile',
    async () => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('csrf_token', localStorage.getItem('auth_token'))

      const response = await fetch('http://localhost/senior-nooralshams/api/Profile/viewStaffProfile.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch profile')
      }

      return result
    },
    {
      enabled: !!user,
      onSuccess: (data) => {
        if (data.status === 'success') {
          const profile = data.data
          setValue('full_name', profile.full_name)
          setValue('email', profile.email)
          setValue('phone', profile.phone)
          setValue('dob', profile.dob)
          setValue('notes', profile.notes)
        } else {
          toast.error(data.message || 'فشل تحميل البيانات')
        }
      },
      onError: () => {
        toast.error('حدث خطأ أثناء تحميل البيانات')
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (profileData) => {
      const formData = new FormData()
      formData.append('user_id', user?.id)
      formData.append('role', user?.role)
      formData.append('csrf_token', localStorage.getItem('auth_token'))
      formData.append('full_name', profileData.full_name)
      formData.append('phone', profileData.phone)
      formData.append('dob', profileData.dob)

      const response = await fetch('http://localhost/senior-nooralshams/api/Profile/updateStaffProfile.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to update profile')
      }

      return result
    },
    {
      onSuccess: (data) => {
        if (data.status === 'success') {
          toast.success('تم تحديث الملف الشخصي بنجاح!')
          setIsEditing(false)
          refetch()
        } else {
          toast.error(data.message || 'فشل في التحديث')
        }
      },
      onError: () => {
        toast.error('حدث خطأ أثناء التحديث')
      }
    }
  )

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const profile = staffData?.data || {}

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلوماتك كموظف</p>
        </motion.div>

        {profileLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="card p-6 text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary-200" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{profile.full_name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Briefcase className="w-4 h-4" />
                    <span>موظف</span>
                  </div>
                  {profile.salary_per_hour && (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <DollarSign className="w-4 h-4" />
                      <span>الراتب بالساعة: {profile.salary_per_hour} ₪</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>نشط</span>
                  </div>
                </div>
              </div>

              {/* Work Statistics */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 mt-4"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات العمل</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المواعيد المكتملة</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ساعات العمل (الشهر الحالي)</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تقييم العملاء</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Profile Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">معلومات الموظف</h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn-outline flex items-center space-x-2 space-x-reverse">
                      <Edit className="w-4 h-4" />
                      <span>تعديل</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2 space-x-reverse">
                      <button onClick={handleCancel} className="btn-outline flex items-center space-x-2 space-x-reverse">
                        <X className="w-4 h-4" />
                        <span>إلغاء</span>
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('full_name', { required: 'الاسم الكامل مطلوب' })}
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''} ${errors.full_name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('email')}
                        type="email"
                        disabled
                        className="input-field pr-12 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                        type="tel"
                        disabled={!isEditing}
                        className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''} ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('dob')}
                        type="date"
                        disabled={!isEditing}
                        className={`input-field pr-12 ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Notes (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                    <textarea
                      {...register('notes')}
                      rows="3"
                      disabled
                      className="input-field w-full bg-gray-50"
                      placeholder="ملاحظات إضافية..."
                    />
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      {updateProfileMutation.isLoading ? (
                        <LoadingSpinner size="sm" text="" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>حفظ التغييرات</span>
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* Schedule Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 mt-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">ملخص الجدول</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مواعيد اليوم</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مواعيد الأسبوع</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الساعات المجدولة (الأسبوع)</span>
                    <span className="font-bold text-primary-200">-</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/staff/schedule" className="btn-outline w-full text-center block">
                    عرض الجدول الكامل
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default StaffProfile