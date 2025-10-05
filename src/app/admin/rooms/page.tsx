'use client'

import DataTable from '@/components/admin/DataTable'

export default function RoomsPage() {
  const rooms = [
    {
      id: 'RM001',
      name: 'Deluxe Suite',
      type: 'Suite',
      price: 450,
      capacity: 4,
      amenities: 'WiFi, Pool, Kitchen',
      status: 'available'
    },
    {
      id: 'RM002',
      name: 'Standard Room',
      type: 'Standard',
      price: 320,
      capacity: 2,
      amenities: 'WiFi, TV',
      status: 'occupied'
    },
    {
      id: 'RM003',
      name: 'Premium Suite',
      type: 'Suite',
      price: 680,
      capacity: 6,
      amenities: 'WiFi, Pool, Kitchen, Balcony',
      status: 'available'
    },
    {
      id: 'RM004',
      name: 'Economy Room',
      type: 'Economy',
      price: 180,
      capacity: 2,
      amenities: 'WiFi',
      status: 'maintenance'
    },
    {
      id: 'RM005',
      name: 'Family Suite',
      type: 'Suite',
      price: 550,
      capacity: 6,
      amenities: 'WiFi, Pool, Kitchen, Playground',
      status: 'available'
    }
  ]

  const columns = [
    { key: 'id', label: 'Room ID', sortable: true },
    { key: 'name', label: 'Room Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'price', label: 'Price/Night', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { key: 'amenities', label: 'Amenities', sortable: false },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const handleViewRoom = (room: any) => {
    alert(`View room details for ${room.name}`)
  }

  const handleEditRoom = (room: any) => {
    alert(`Edit room ${room.name}`)
  }

  const handleDeleteRoom = (room: any) => {
    if (confirm(`Are you sure you want to delete room ${room.name}?`)) {
      alert(`Room ${room.name} deleted`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
        <p className="text-gray-600 mt-2">Manage hotel rooms and their availability</p>
      </div>

      <DataTable
        title="All Rooms"
        columns={columns}
        data={rooms}
        actions={{
          view: handleViewRoom,
          edit: handleEditRoom,
          delete: handleDeleteRoom
        }}
      />
    </div>
  )
}