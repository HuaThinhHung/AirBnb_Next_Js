import SearchBar from './SearchBar'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-700 to-blue-700">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-blue-300">Stay</span>
          </h1>
          
{/* Logo */}
<div className="flex justify-center mb-8">
             <div className="w-52 h-30 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
               <img 
                 src="/logo.png" 
                 alt="Airbnb Clone Logo" 
                 className="w-full h-full object-contain rounded-2xl"
                 style={{
                   imageRendering: '-webkit-optimize-contrast',
                   filter: 'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(10deg)'
                 }}
               />
             </div>
           </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover amazing places to stay around the world. From cozy apartments to luxury villas, 
            find the perfect accommodation for your next adventure.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-blue-200">Happy Guests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
