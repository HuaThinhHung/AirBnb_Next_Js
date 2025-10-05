# Google Maps API Setup Guide

## 🗺️ How to Enable Google Maps in Your Airbnb Clone

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (required)
   - **Places API** (optional, for enhanced features)

### Step 2: Create API Key

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to your domain for security

### Step 3: Add API Key to Your Project

1. Create a `.env.local` file in your project root directory
2. Add your API key:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Example:**

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## 🎯 What You'll See

Once the API key is properly configured, the map will display:

- **Interactive Google Map** centered on New York City
- **Custom markers** for popular locations:
  - Times Square
  - Central Park
  - Statue of Liberty
  - Empire State Building
- **Custom styling** with blue theme matching your site
- **Responsive design** that works on all devices

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Consider restricting your API key to specific domains
- Monitor your API usage in Google Cloud Console

## 🆘 Troubleshooting

### Common Issues:

1. **InvalidKeyMapError**: Check if your API key is correct
2. **Map not loading**: Ensure Maps JavaScript API is enabled
3. **Quota exceeded**: Check your billing settings in Google Cloud Console

### Need Help?

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
