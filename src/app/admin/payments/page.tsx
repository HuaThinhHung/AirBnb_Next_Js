"use client";

import DataTable from "@/components/admin/DataTable";

interface Payment extends Record<string, unknown> {
  id: string;
  bookingId: string;
  guest: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export default function PaymentsPage() {
  const payments: Payment[] = [
    {
      id: "PAY001",
      bookingId: "BK001",
      guest: "John Doe",
      amount: 450,
      method: "Credit Card",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "PAY002",
      bookingId: "BK002",
      guest: "Sarah Wilson",
      amount: 320,
      method: "PayPal",
      status: "pending",
      date: "2024-01-16",
    },
    {
      id: "PAY003",
      bookingId: "BK003",
      guest: "Mike Johnson",
      amount: 680,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: "PAY004",
      bookingId: "BK004",
      guest: "Emily Davis",
      amount: 320,
      method: "Credit Card",
      status: "refunded",
      date: "2024-01-18",
    },
    {
      id: "PAY005",
      bookingId: "BK005",
      guest: "David Brown",
      amount: 450,
      method: "Credit Card",
      status: "completed",
      date: "2024-01-20",
    },
  ];

  const columns = [
    { key: "id", label: "Payment ID", sortable: true },
    { key: "bookingId", label: "Booking ID", sortable: true },
    { key: "guest", label: "Guest Name", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
    { key: "method", label: "Payment Method", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "date", label: "Date", sortable: true },
  ];

  const handleViewPayment = (payment: Payment) => {
    alert(`View payment details for ${payment.guest}`);
  };

  const handleEditPayment = (payment: Payment) => {
    alert(`Edit payment for ${payment.guest}`);
  };

  const handleDeletePayment = (payment: Payment) => {
    if (confirm(`Are you sure you want to delete payment ${payment.id}?`)) {
      alert(`Payment ${payment.id} deleted`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Payments Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage payment transactions and refunds
        </p>
      </div>

      <DataTable
        title="All Payments"
        columns={columns}
        data={payments}
        actions={{
          view: handleViewPayment,
          edit: handleEditPayment,
          delete: handleDeletePayment,
        }}
      />
    </div>
  );
}
