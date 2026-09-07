# API Playground - Portfolio Feature Specification

## Vision

Transform Garry's portfolio into an **interactive API explorer** styled like Postman/Swagger, where visitors can test real endpoints that return creative, playful mock data. This section showcases backend expertise while providing an engaging, memorable user experience.

## Location & Integration

- **Where**: New section under the **Dashboard > Overview** page
- **Position**: Below the stats cards and before the "Top Skills" section
- **Style**: Distinct from the traditional dashboard—more colorful, playful, and interactive
- **Sidebar**: Consider adding an "API Playground" icon to the sidebar for quick access

## Key Features

### 1. **Endpoint Explorer**
- Clean, documented list of available endpoints
- Each endpoint shows:
  - HTTP method badge (GET, POST, PUT, DELETE)
  - Endpoint path
  - Brief description
  - Required/optional parameters

### 2. **Interactive Request Builder**
- **Endpoint Selector**: Dropdown to choose which endpoint to test
- **Method Picker**: Buttons for GET, POST, PUT, DELETE
- **URL Preview**: Live URL construction as user selects options
- **Request Body Editor**: JSON editor with syntax highlighting (for POST/PUT)
- **Headers Section**: Collapsible, shows mock auth headers
- **Submit Button**: "SEND" or "HIT" with creative styling

### 3. **Creative Loading State**
- Animated terminal/console effect with fun messages
- Messages like:
  - "🔍 Searching database..."
  - "⚙️ Processing your request..."
  - "🚀 Deploying response from the cloud..."
  - "🧠 Consulting the backend oracle..."
- Optional: Animated progress bar or particle effects
- Duration: 1.5-2.5 seconds (then reveal response)

### 4. **Response Display**
- **Formatted JSON**: Syntax highlighting, collapsible sections
- **Status Badge**: 200 ✅ | 404 🤔 | 500 💥 | 201 🎉
- **Response Headers**: Shows realistic headers (Content-Type, Server, etc.)
- **Response Time**: Displays fake but realistic timing (e.g., "245ms")
- **Copy Button**: One-click copy to clipboard with feedback animation
- **Share Button**: (Optional) Copy sharable response snippet

### 5. **Dashboard Statistics**
- Total API hits (increments with each request)
- Most popular endpoint
- Average response time
- Recent request history (last 5)

### 6. **Request History**
- Shows recent requests made in the session
- Quick-load feature to re-run previous requests
- Clear history button

### 7. **Preset Examples**
- Pre-filled request shortcuts
- Categories:
  - **Quick Start**: Common, beginner-friendly requests
  - **Advanced**: Complex queries with filters
  - **Error Scenarios**: Show 404s, validation errors, etc.
  - **Fun**: Easter egg requests (e.g., `/joke`, `/random-fact`)

## Color Scheme & Styling

Using your existing pink theme with endpoint-based color coding:

- **GET**: Teal/Green (`#10b981`)
- **POST/PUT**: Blue (`#3b82f6`)
- **DELETE**: Red/Orange (`#ef4444`)
- **Background**: Light neutral (`#f9fafb`) with dark accents
- **Cards**: White with subtle shadows
- **Accent**: Your existing pink (`#ec4899`) for highlights
- **Text**: Dark gray (`#1f2937`) on light, white on dark

## Tech Stack Integration

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Data**: Single `lib/data.ts` file
- **Charts**: Recharts (for dashboard stats)
- **State**: React hooks (useState, useCallback)
- **No external API**: All responses are mocked/hardcoded

## User Flow

1. User scrolls to "API Playground" section on dashboard
2. Sees list of available endpoints with descriptions
3. Clicks an endpoint or uses dropdown selector
4. Builder shows: method, URL preview, optional request body
5. User clicks "SEND"
6. Loading animation plays (1.5-2.5s)
7. Response appears with formatted JSON
8. User can:
   - Copy response
   - Try a different endpoint
   - Load a preset example
   - View request history

## Animation & Interactivity

- **Smooth transitions** on all state changes
- **Syntax highlighting** for JSON (consider using `highlight.js` or inline Tailwind classes)
- **Collapsible sections** for request body, headers, response
- **Copy feedback**: Toast notification or button state change
- **Loading animation**: Terminal-style typing effect
- **Hover effects**: Cards and buttons respond to mouse movement
- **Responsive**: Mobile-friendly (stack vertically on small screens)

## Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast meets WCAG AA standards
- Skip link to main API playground section
- Clear error messages for validation

## Performance Considerations

- All data is static/mocked (no API calls)
- Instant response (no real latency except simulated loading animation)
- Lightweight JSON responses
- No external dependencies for core functionality
- Debounce input handlers if needed

## Future Enhancements

- Connect to a real backend API later
- Save favorite requests
- Download response as JSON file
- Share request/response as link
- Request validation based on endpoint schema
- Code generation (curl, JavaScript, Python)
