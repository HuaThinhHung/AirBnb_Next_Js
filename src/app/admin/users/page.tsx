'use client'

import DataTable from '@/components/admin/DataTable'

export default function UsersPage() {
  const users = [
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      joinDate: '2024-01-15',
      bookings: 5,
      status: 'active'
    },
    {
      id: 'USR002',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8901',
      joinDate: '2024-01-10',
      bookings: 3,
      status: 'active'
    },
    {
      id: 'USR003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8902',
      joinDate: '2024-01-08',
      bookings: 8,
      status: 'active'
    },
    {
      id: 'USR004',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 234 567 8903',
      joinDate: '2024-01-05',
      bookings: 2,
      status: 'pending'
    },
    {
      id: 'USR005',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+1 234 567 8904',
      joinDate: '2024-01-03',
      bookings: 12,
      status: 'active'
    }
  ]

  const columns = [
    { key: 'id', label: 'User ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'joinDate', label: 'Join Date', sortable: true },
    { key: 'bookings', label: 'Bookings', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const handleViewUser = (user: any) => {
    alert(`View user details for ${user.name}`)
  }

  const handleEditUser = (user: any) => {
    alert(`Edit user ${user.name}`)
  }

  const handleDeleteUser = (user: any) => {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      alert(`User ${user.name} deleted`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">Manage registered users and their accounts</p>
      </div>

      <DataTable
        title="All Users"
        columns={columns}
        data={users}
        actions={{
          view: handleViewUser,
          edit: handleEditUser,
          delete: handleDeleteUser
        }}
      />
    </div>
  )
}