'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function SimpleChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi có thể giúp gì cho bạn về dịch vụ đặt phòng? 😊',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Predefined responses cho các câu hỏi thường gặp
  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('giá') || message.includes('price') || message.includes('cost')) {
      return 'Giá phòng của chúng tôi dao động từ 500,000 - 2,000,000 VNĐ/đêm tùy theo loại phòng và thời điểm. Bạn có thể xem chi tiết giá trên trang web hoặc liên hệ hotline 1900-xxxx để được tư vấn cụ thể.'
    }
    
    if (message.includes('đặt phòng') || message.includes('booking') || message.includes('reserve')) {
      return 'Để đặt phòng, bạn có thể: 1) Chọn phòng trên website, 2) Điền thông tin và thanh toán, 3) Nhận email xác nhận. Hoặc gọi hotline 1900-xxxx để được hỗ trợ trực tiếp.'
    }
    
    if (message.includes('hủy') || message.includes('cancel')) {
      return 'Bạn có thể hủy đặt phòng miễn phí trước 24h. Sau thời gian này sẽ có phí hủy. Chi tiết xem trong điều khoản đặt phòng hoặc liên hệ hotline.'
    }
    
    if (message.includes('thanh toán') || message.includes('payment') || message.includes('pay')) {
      return 'Chúng tôi chấp nhận thanh toán qua: Thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), và tiền mặt tại khách sạn.'
    }
    
    if (message.includes('wifi') || message.includes('internet')) {
      return 'Tất cả phòng đều có WiFi miễn phí tốc độ cao. Mật khẩu WiFi sẽ được cung cấp khi bạn check-in.'
    }
    
    if (message.includes('check-in') || message.includes('checkin')) {
      return 'Thời gian check-in: 14:00 - 24:00. Check-out: 12:00. Bạn có thể check-in sớm hoặc check-out muộn (có phụ phí) nếu phòng còn trống.'
    }
    
    if (message.includes('địa chỉ') || message.includes('address') || message.includes('location')) {
      return 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM. Chúng tôi có bãi đỗ xe miễn phí và gần các điểm du lịch nổi tiếng.'
    }
    
    if (message.includes('hotline') || message.includes('phone') || message.includes('số điện thoại')) {
      return 'Hotline hỗ trợ 24/7: 1900-xxxx. Email: support@airbnbclone.com. Chúng tôi luôn sẵn sàng hỗ trợ bạn!'
    }
    
    if (message.includes('cảm ơn') || message.includes('thank') || message.includes('thanks')) {
      return 'Cảm ơn bạn! Rất vui được phục vụ. Nếu có thắc mắc gì khác, đừng ngần ngại hỏi nhé! 😊'
    }
    
    if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
      return 'Xin chào! Chào mừng bạn đến với dịch vụ đặt phòng của chúng tôi. Tôi có thể giúp gì cho bạn?'
    }
    
    // Default responses
    const defaultResponses = [
      'Cảm ơn bạn đã liên hệ! Để được hỗ trợ tốt nhất, vui lòng gọi hotline 1900-xxxx hoặc email support@airbnbclone.com',
      'Tôi hiểu câu hỏi của bạn. Bạn có thể xem thêm thông tin trên website hoặc liên hệ trực tiếp với chúng tôi.',
      'Thông tin này rất hữu ích! Bạn có câu hỏi nào khác về dịch vụ đặt phòng không?',
      'Chúng tôi đánh giá cao phản hồi của bạn. Đội ngũ hỗ trợ sẽ liên hệ lại sớm nhất có thể.',
      'Cảm ơn bạn! Nếu cần hỗ trợ thêm, vui lòng liên hệ hotline 24/7: 1900-xxxx'
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const response = getResponse(inputMessage)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000) // Random delay 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button - Will be positioned by parent container */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat với chúng tôi
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-blue-100">Trực tuyến • Thường phản hồi ngay</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-white border border-gray-200'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${
                    message.isUser ? 'text-gray-900' : 'text-gray-900'
                  }`}>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-gray-600' : 'text-gray-600'
                  }`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Đang nhập...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Hỏi về: giá phòng, đặt phòng, thanh toán, check-in...
            </p>
          </div>
        </div>
      )}
    </>
  )
}
