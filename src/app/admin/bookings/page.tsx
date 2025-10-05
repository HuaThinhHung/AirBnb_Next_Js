'use client'

import DataTable from '@/components/admin/DataTable'

export default function BookingsPage() {
  const bookings = [
    {
      id: 'BK001',
      guest: 'John Doe',
      room: 'Deluxe Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      amount: 450,
      status: 'active'
    },
    {
      id: 'BK002',
      guest: 'Sarah Wilson',
      room: 'Standard Room',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      amount: 320,
      status: 'pending'
    },
    {
      id: 'BK003',
      guest: 'Mike Johnson',
      room: 'Premium Suite',
      checkIn: '2024-01-14',
      checkOut: '2024-01-17',
      amount: 680,
      status: 'completed'
    },
    {
      id: 'BK004',
      guest: 'Emily Davis',
      room: 'Standard Room',
      checkIn: '2024-01-18',
      checkOut: '2024-01-21',
      amount: 320,
      status: 'cancelled'
    },
    {
      id: 'BK005',
      guest: 'David Brown',
      room: 'Deluxe Suite',
      checkIn: '2024-01-20',
      checkOut: '2024-01-23',
      amount: 450,
      status: 'active'
    }
  ]

  const columns = [
    { key: 'id', label: 'Booking ID', sortable: true },
    { key: 'guest', label: 'Guest Name', sortable: true },
    { key: 'room', label: 'Room Type', sortable: true },
    { key: 'checkIn', label: 'Check-in', sortable: true },
    { key: 'checkOut', label: 'Check-out', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const handleViewBooking = (booking: any) => {
    alert(`View booking details for ${booking.guest}`)
  }

  const handleEditBooking = (booking: any) => {
    alert(`Edit booking for ${booking.guest}`)
  }

  const handleDeleteBooking = (booking: any) => {
    if (confirm(`Are you sure you want to delete booking ${booking.id}?`)) {
      alert(`Booking ${booking.id} deleted`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-2">Manage hotel bookings and reservations</p>
      </div>

      <DataTable
        title="All Bookings"
        columns={columns}
        data={bookings}
        actions={{
          view: handleViewBooking,
          edit: handleEditBooking,
          delete: handleDeleteBooking
        }}
      />
    </div>
  )
}