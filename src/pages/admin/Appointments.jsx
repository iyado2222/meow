import api from './api'

// Mock data for appointments
const mockAppointments = [
  {
    appointment_id: 1,
    client_name: 'محمد شكري',
    staff_name: null,
    service_name: 'Laser Hair Removal',
    price: 230.00,
    date: '2025-07-15',
    time: '10:00:00',
    status: 'pending'
  },
  {
    appointment_id: 2,
    client_name: 'سارة أحمد',
    staff_name: 'Lana Khalil',
    service_name: 'Facial Treatment',
    price: 120.00,
    date: '2025-07-16',
    time: '14:30:00',
    status: 'confirmed'
  },
  {
    appointment_id: 3,
    client_name: 'نورا محمد',
    staff_name: 'Maya Odeh',
    service_name: 'Henna Design',
    price: 70.00,
    date: '2025-07-14',
    time: '11:15:00',
    status: 'completed'
  },
  {
    appointment_id: 4,
    client_name: 'ليلى خالد',
    staff_name: null,
    service_name: 'Pedicare',
    price: 80.00,
    date: '2025-07-17',
    time: '16:00:00',
    status: 'pending'
  },
  {
    appointment_id: 5,
    client_name: 'فاطمة علي',
    staff_name: 'Noura Hasan',
    service_name: 'Nails Polishing',
    price: 130.00,
    date: '2025-07-13',
    time: '09:30:00',
    status: 'cancelled'
  },
  {
    appointment_id: 6,
    client_name: 'رنا سمير',
    staff_name: 'Rania Samir',
    service_name: 'Laser Hair Removal',
    price: 230.00,
    date: '2025-07-18',
    time: '13:45:00',
    status: 'in-progress'
  },
  {
    appointment_id: 7,
    client_name: 'هدى عمر',
    staff_name: null,
    service_name: 'Facial Treatment',
    price: 120.00,
    date: '2025-07-19',
    time: '15:30:00',
    status: 'pending'
  }
]

export const appointmentService = {
  async getAllAppointments(filters = {}) {
    // In a real implementation, this would be an API call
    // return await api.get('/Booking/viewAllAppointments.php', { params: filters })
    
    // For now, return mock data
    let filtered = [...mockAppointments]
    
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status)
    }
    
    if (filters.date) {
      filtered = filtered.filter(a => a.date === filters.date)
    }
    
    if (filters.client_name) {
      const term = filters.client_name.toLowerCase()
      filtered = filtered.filter(a => a.client_name.toLowerCase().includes(term))
    }
    
    return {
      status: 'success',
      data: filtered
    }
  },
  
  async assignStaff(appointmentId, staffId) {
    // In a real implementation, this would be an API call
    // return await api.post('/Staff/assignStaff.php', { appointment_id: appointmentId, staff_id: staffId })
    
    // For now, simulate a successful response
    console.log(`Assigning staff ${staffId} to appointment ${appointmentId}`)
    return {
      status: 'success',
      message: 'تم تعيين الموظف بنجاح'
    }
  },
  
  async updateAppointmentStatus(appointmentId, status) {
    // In a real implementation, this would be an API call
    // return await api.post('/Staff/staffUpdateBookingStatus.php', { appointment_id: appointmentId, status })
    
    // For now, simulate a successful response
    console.log(`Updating appointment ${appointmentId} status to ${status}`)
    return {
      status: 'success',
      message: 'تم تحديث حالة الحجز بنجاح'
    }
  }
}