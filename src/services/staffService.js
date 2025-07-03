import api from './api'

export const staffService = {
  async getStaffList() {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    
    return await api.post('/Staff/getStaffDetails.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async getStaffSchedule(staffId, dateFrom, dateTo) {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    if (staffId) formData.append('staff_id', staffId)
    if (dateFrom) formData.append('date_from', dateFrom)
    if (dateTo) formData.append('date_to', dateTo)
    
    return await api.post('/Staff/viewStaffSchedule.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async checkIn() {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    
    return await api.post('/Staff/check_in.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async checkOut() {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    
    return await api.post('/Staff/check_out.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async updateBookingStatus(appointmentId, status, notes = '') {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    formData.append('appointment_id', appointmentId)
    formData.append('status', status)
    if (notes) formData.append('notes', notes)
    
    return await api.post('/Staff/staffUpdateBookingStatus.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async createStaff(staffData) {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    
    Object.entries(staffData).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    return await api.post('/Staff/createStaff.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async updateStaffDetails(staffId, updateData) {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    formData.append('staff_id', staffId)
    
    Object.entries(updateData).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    return await api.post('/Staff/updateStaffDetails.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async getSalary(staffId, period) {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    formData.append('staff_id', staffId)
    formData.append('period', period)
    
    return await api.post('/Staff/get_salary.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async assignStaff(appointmentId, staffId) {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    const formData = new FormData()
    formData.append('user_id', userData.id)
    formData.append('role', userData.role)
    formData.append('appointment_id', appointmentId)
    formData.append('staff_id', staffId)
    
    return await api.post('/Staff/assignStaff.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}