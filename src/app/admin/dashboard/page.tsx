'use client'

import MetricsCard from '@/components/admin/MetricsCard'
import DataTable from '@/components/admin/DataTable'

export default function AdminDashboard() {
  // Sample data for metrics
  const metrics = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      changeType: 'increase' as const,
      color: 'blue' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: 'Active Bookings',
      value: '1,247',
      change: '+8.2%',
      changeType: 'increase' as const,
      color: 'green' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'increase' as const,
      color: 'purple' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Available Rooms',
      value: '89',
      change: '-2.1%',
      changeType: 'decrease' as const,
      color: 'yellow' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ]

  // Sample data for recent bookings
  const recentBookings = [
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
    },
    {
      id: 'BK006',
      guest: 'Lisa Anderson',
      room: 'Premium Suite',
      checkIn: '2024-01-22',
      checkOut: '2024-01-25',
      amount: 680,
      status: 'pending'
    }
  ]

  const bookingColumns = [
    { key: 'id', label: 'Booking ID', sortable: true },
    { key: 'guest', label: 'Guest Name', sortable: true },
    { key: 'room', label: 'Room Type', sortable: true },
    { key: 'checkIn', label: 'Check-in', sortable: true },
    { key: 'checkOut', label: 'Check-out', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const handleViewBooking = (booking: any) => {
    console.log('View booking:', booking)
    alert(`View booking details for ${booking.guest}`)
  }

  const handleEditBooking = (booking: any) => {
    console.log('Edit booking:', booking)
    alert(`Edit booking for ${booking.guest}`)
  }

  const handleDeleteBooking = (booking: any) => {
    console.log('Delete booking:', booking)
    if (confirm(`Are you sure you want to delete booking ${booking.id}?`)) {
      alert(`Booking ${booking.id} deleted`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your hotel booking performance and manage operations</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            color={metric.color}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600">Chart.js integration</p>
              <p className="text-sm text-gray-500">Revenue trends over time</p>
            </div>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Occupancy</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-600">Chart.js integration</p>
              <p className="text-sm text-gray-500">Room occupancy rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <DataTable
        title="Recent Bookings"
        columns={bookingColumns}
        data={recentBookings}
        actions={{
          view: handleViewBooking,
          edit: handleEditBooking,
          delete: handleDeleteBooking
        }}
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200">
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium text-gray-900">Add New Room</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors duration-200">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-gray-900">New Booking</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors duration-200">
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="font-medium text-gray-900">Manage Users</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200">
            <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}