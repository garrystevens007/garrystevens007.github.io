# Implementation Guide - API Playground

Step-by-step instructions for Claude/Copilot to implement the API Playground feature.

---

## 1. Setup & Data Layer

### Step 1.1: Update `lib/data.ts`

**Action**: Add all the types, endpoints, presets, and helper functions from `DATA_STRUCTURE.md` to the existing `lib/data.ts` file.

**Check**:
- All TypeScript types are defined
- All 14+ endpoints are exported
- All preset categories are configured
- Helper functions (simulateApiCall, formatEndpointUrl, etc.) are implemented
- No TypeScript errors

### Step 1.2: Verify Data Integrity

**Action**: Ensure all endpoint responses are valid JSON and match their schema.

**Check**:
```bash
# Verify by importing and testing in a simple Node script
import { apiPlaygroundEndpoints } from '@/lib/data';
apiPlaygroundEndpoints.forEach(ep => {
  ep.responses.forEach(resp => {
    try {
      JSON.stringify(resp.body);
    } catch(e) {
      console.error(`Invalid JSON in ${ep.id}`);
    }
  });
});
```

---

## 2. Component Creation

### Step 2.1: Create `components/APIPlayground/index.tsx` (Main Container)

**Purpose**: Root component orchestrating the entire playground.

**Implementation**:
- Import all necessary data from `lib/data.ts`
- Set up React state for:
  - `selectedEndpoint`
  - `requestMethod`
  - `requestBody`
  - `response`
  - `isLoading`
  - `requestHistory`
  - `totalRequests`
- Layout: `grid grid-cols-2 gap-6` on desktop, stack on mobile
- Left panel (40%): Endpoint list + presets
- Right panel (60%): Request builder + response display

**Key Props**: None (uses hooks)

**Exports**: Named export `APIPlayground`

---

### Step 2.2: Create `components/APIPlayground/EndpointList.tsx`

**Purpose**: Searchable list of all available endpoints.

**Props**:
```typescript
interface EndpointListProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (endpoint: Endpoint) => void;
}
```

**Features**:
- Search input that filters by path/description
- Scroll container with `max-h-[600px] overflow-y-auto`
- EndpointItem for each endpoint
- Visual indication of selected endpoint

**Styling**: `space-y-3` for gaps between items

---

### Step 2.3: Create `components/APIPlayground/EndpointItem.tsx`

**Purpose**: Individual endpoint card in the list.

**Props**:
```typescript
interface EndpointItemProps {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
}
```

**Structure**:
- MethodBadge showing GET/POST/PUT/DELETE
- Endpoint path in monospace
- Description text
- "Use" button to select

**Styling**: Border-2 changes color on selection (pink-500 when selected)

---

### Step 2.4: Create `components/APIPlayground/MethodBadge.tsx`

**Purpose**: Colored badge for HTTP method.

**Props**:
```typescript
interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}
```

**Colors**:
- GET: `bg-emerald-100 text-emerald-800 border-emerald-300`
- POST/PUT: `bg-blue-100 text-blue-800 border-blue-300`
- DELETE: `bg-red-100 text-red-800 border-red-300`

**Styling**: `rounded border px-2 py-1 text-xs font-bold`

---

### Step 2.5: Create `components/APIPlayground/RequestBuilder.tsx`

**Purpose**: Form where users construct their API request.

**Props**:
```typescript
interface RequestBuilderProps {
  endpoint: Endpoint | null;
  requestMethod: string;
  onMethodChange: (method: string) => void;
  requestBody: string;
  onBodyChange: (body: string) => void;
  isLoading: boolean;
  onSendRequest: () => void;
}
```

**Sections**:
1. **Method Selector**: 4 buttons (GET, POST, PUT, DELETE)
   - Only show valid methods for endpoint
   - Selected method has `bg-pink-600 text-white`
   - Others have `bg-gray-200 text-gray-700`

2. **URL Preview**: Display-only box showing constructed URL
   - `bg-gray-100 rounded font-mono text-sm`
   - Shows path + query params

3. **Request Body Editor**: Only shown for POST/PUT
   - Textarea with `font-mono text-sm`
   - Dark background: `bg-gray-900 text-gray-100`
   - JSON placeholder

4. **Headers Section**: Collapsible `<details>`
   - Shows mock headers (Content-Type, Server, etc.)
   - Read-only

5. **Send Button**: Large, prominent
   - `w-full px-6 py-3 bg-pink-600 text-white font-bold rounded-lg`
   - Shows "🚀 SEND" text
   - Disabled during loading
   - Shows spinner when loading

---

### Step 2.6: Create `components/APIPlayground/RequestBodyEditor.tsx`

**Purpose**: JSON editor for POST/PUT bodies.

**Props**:
```typescript
interface RequestBodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  example?: object;
}
```

**Features**:
- Textarea for JSON input
- Optional "Load Example" button to populate with endpoint's example
- Validation feedback (optional)

---

### Step 2.7: Create `components/APIPlayground/ResponseDisplay.tsx`

**Purpose**: Shows API response with metadata.

**Props**:
```typescript
interface ResponseDisplayProps {
  response: any | null;
  isLoading: boolean;
  statusCode?: number;
  responseTime?: number;
}
```

**Sections** (shown when response exists):
1. **Status Badge**: Shows status code with emoji
2. **Response Time**: "Response time: XXms"
3. **Response Headers** (collapsible):
   - Content-Type
   - Server
   - X-Response-Time
4. **Response Body**: Formatted JSON with syntax highlighting
5. **Copy Button**: Copies formatted JSON to clipboard

**Empty State**: 
"Select an endpoint and click SEND to see the response here"

---

### Step 2.8: Create `components/APIPlayground/ResponseBodyFormatter.tsx`

**Purpose**: Display JSON with syntax highlighting and collapsibility.

**Props**:
```typescript
interface ResponseBodyFormatterProps {
  data: any;
  level?: number; // For nested indentation
}
```

**Features**:
- Color-coded syntax (keys, strings, numbers, booleans, null)
- Collapsible objects and arrays
- Proper indentation for nested structures

**Colors**:
- Keys: `text-blue-600`
- Strings: `text-green-600`
- Numbers: `text-orange-600`
- Booleans/null: `text-gray-500`

---

### Step 2.9: Create `components/APIPlayground/LoadingAnimation.tsx`

**Purpose**: Creative loading state shown while API responds.

**Features**:
- Spinning animation (Tailwind's `animate-spin`)
- Random loading message that types out
- Progress bar animation
- Duration: 1.5-2.5 seconds

**Messages** (randomly selected):
- 🔍 Searching database...
- ⚙️ Processing your request...
- 🚀 Deploying from the cloud...
- 🧠 Consulting the backend oracle...
- 📡 Pinging the server...
- 🔐 Encrypting transmission...
- ⏳ Almost there...

---

### Step 2.10: Create `components/APIPlayground/StatusBadge.tsx`

**Purpose**: Display HTTP status code with emoji.

**Props**:
```typescript
interface StatusBadgeProps {
  statusCode: number;
}
```

**Status Mapping**:
- 200: `✅ OK` (green)
- 201: `🎉 Created` (green)
- 400: `⚠️ Bad Request` (yellow)
- 404: `🤔 Not Found` (orange)
- 429: `⏳ Rate Limited` (orange)
- 500: `💥 Server Error` (red)

**Styling**: `inline-block px-3 py-2 rounded border-2 font-semibold`

---

### Step 2.11: Create `components/APIPlayground/CopyButton.tsx`

**Purpose**: Copy response to clipboard with feedback.

**Props**:
```typescript
interface CopyButtonProps {
  text: string;
  label?: string;
}
```

**Features**:
- Copies text to clipboard on click
- Shows "✓ Copied!" for 2 seconds
- Then reverts to "📋 Copy"

**Styling**:
- Default: `bg-gray-200 text-gray-700`
- Copied: `bg-green-500 text-white`

---

### Step 2.12: Create `components/APIPlayground/PresetsSection.tsx`

**Purpose**: Quick-load example requests.

**Props**:
```typescript
interface PresetsSectionProps {
  presetCategories: PresetCategory[];
  onLoadPreset: (preset: PresetRequest) => void;
}
```

**Structure**:
- Collapsible `<details>` for each category
- Buttons under each category
- Shows method + path on hover/focus

**Styling**: `bg-gray-50` background, hover state changes to `bg-blue-50`

---

### Step 2.13: Create `components/APIPlayground/StatsBar.tsx`

**Purpose**: Display playground statistics.

**Props**:
```typescript
interface StatsBarProps {
  totalRequests: number;
  mostPopularEndpoint: string;
  avgResponseTime: number;
  lastRequestTime: string;
}
```

**Layout**: `grid grid-cols-4 gap-4`

**Cards** (StatCard component):
- 📊 Total Requests
- 🎯 Most Popular
- ⚡ Avg Response
- 🕐 Last Request

---

### Step 2.14: Create `components/APIPlayground/RequestHistory.tsx`

**Purpose**: Show recent requests for quick re-access.

**Props**:
```typescript
interface RequestHistoryProps {
  requests: HistoryItem[];
  onLoadRequest: (request: HistoryItem) => void;
  onClearHistory: () => void;
}
```

**Features**:
- Shows last 5 requests
- Click to re-run request
- Clear button
- Each item shows: Method badge + endpoint path

---

## 3. Integration into Dashboard

### Step 3.1: Update `app/dashboard/page.tsx`

**Action**: Add APIPlayground section below existing content.

**Code**:
```typescript
import { APIPlayground } from '@/components/APIPlayground';

export default function DashboardPage() {
  return (
    <div>
      {/* Existing dashboard content */}
      
      {/* New API Playground section */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔌 API Playground
        </h2>
        <p className="text-gray-600 mb-6">
          Test real endpoints and explore mock data. This is a playful
          showcase of backend API design.
        </p>
        <APIPlayground />
      </section>
    </div>
  );
}
```

---

## 4. State Management & Logic

### Step 4.1: Implement Request Handling

**In APIPlayground component**:

```typescript
const handleSendRequest = async () => {
  if (!selectedEndpoint) return;

  setIsLoading(true);
  setResponse(null);

  try {
    const result = await simulateApiCall(selectedEndpoint);
    setResponse(result);
    
    // Add to history
    setRequestHistory(prev => [
      {
        endpoint: selectedEndpoint.path,
        method: requestMethod,
        timestamp: new Date(),
      },
      ...prev.slice(0, 4), // Keep last 5
    ]);
    
    // Increment total requests
    setTotalRequests(prev => prev + 1);
  } finally {
    setIsLoading(false);
  }
};
```

### Step 4.2: Implement Search

**In EndpointList component**:

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredEndpoints = useMemo(() => {
  if (!searchQuery) return endpoints;
  return searchEndpoints(searchQuery);
}, [searchQuery, endpoints]);
```

### Step 4.3: Implement Preset Loading

**In APIPlayground component**:

```typescript
const handleLoadPreset = (preset: PresetRequest) => {
  const endpoint = getEndpointById(preset.id);
  if (!endpoint) return;

  setSelectedEndpoint(endpoint);
  setRequestMethod(preset.method);
  
  if (preset.body) {
    setRequestBody(JSON.stringify(preset.body, null, 2));
  }

  // Auto-scroll to request builder
  requestBuilderRef?.current?.scrollIntoView({ behavior: 'smooth' });
};
```

---

## 5. Styling & Responsive Design

### Step 5.1: Apply Tailwind Classes

**Follow DESIGN_SPECS.md** for:
- Color system
- Typography
- Spacing
- Borders & radius
- Shadows
- Animations

### Step 5.2: Responsive Breakpoints

**Desktop (> 1024px)**:
- Two-column grid (40/60 split)
- Sidebar navigation visible

**Tablet (640px - 1024px)**:
- Adjust gaps and padding
- May stack vertically

**Mobile (< 640px)**:
- Single column (stack vertically)
- Reduce padding: `sm:p-3`
- Smaller fonts: `sm:text-sm`

**Implementation**:
```typescript
// Main container
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_60%] gap-6">
  <div>{/* Left panel */}</div>
  <div>{/* Right panel */}</div>
</div>
```

---

## 6. Testing & Verification

### Step 6.1: Component Rendering Test

**Check**:
- [ ] All components render without errors
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Layout looks correct on desktop/tablet/mobile

### Step 6.2: Functionality Test

**Endpoints**:
- [ ] Select each endpoint from list
- [ ] Request builder updates correctly
- [ ] Method buttons work
- [ ] URL preview updates

**Request Sending**:
- [ ] Clicking SEND triggers loading animation
- [ ] Loading animation plays for 1.5-2.5s
- [ ] Response displays after loading
- [ ] Status badge shows correct emoji/color
- [ ] Response body is formatted with syntax highlighting

**Search & Presets**:
- [ ] Search filters endpoints
- [ ] Preset categories expand/collapse
- [ ] Clicking preset loads request correctly
- [ ] Request history shows recent requests
- [ ] Clear history button works

**Response Display**:
- [ ] Copy button copies JSON to clipboard
- [ ] Headers section collapsible
- [ ] Response time displays correctly
- [ ] Different status codes show correct badges

### Step 6.3: Accessibility Test

- [ ] Keyboard navigation works (Tab, Enter)
- [ ] All buttons have focus rings
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels on interactive elements
- [ ] No keyboard traps

### Step 6.4: Performance Test

- [ ] Search is responsive (debounced)
- [ ] No layout shift during interactions
- [ ] Loading animation smooth (60fps)
- [ ] Copy action instant

---

## 7. Optional Enhancements

### 7.1: Add More Endpoints

**Future additions**:
- `/api/projects/{id}/similar` - Find similar projects
- `/api/skills/recommendations` - Get skill recommendations
- `/api/availability` - Check availability for collaborations

### 7.2: Add Export Feature

**Code export** (curl, JavaScript, Python):
```typescript
const generateCurl = (endpoint: Endpoint, params?: any) => {
  return `curl -X ${endpoint.method} "${formatEndpointUrl(endpoint, params)}"`;
};
```

### 7.3: Add Request History Persistence

**Use localStorage**:
```typescript
useEffect(() => {
  const saved = localStorage.getItem('apiPlayground-history');
  if (saved) setRequestHistory(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem('apiPlayground-history', JSON.stringify(requestHistory));
}, [requestHistory]);
```

### 7.4: Add Dark Mode Support

**Add `dark:` prefix** to all color classes in DESIGN_SPECS.md

### 7.5: Add Error Boundary

**Wrap APIPlayground** in error boundary to handle unexpected errors gracefully.

---

## 8. Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] All components tested
- [ ] No console warnings
- [ ] Responsive design verified
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] SEO meta tags (if needed)
- [ ] Build completes successfully (`npm run build`)
- [ ] No runtime errors in production mode
- [ ] Ready for Vercel deployment

---

## File Structure Summary

```
src/
├── components/
│   └── APIPlayground/
│       ├── index.tsx (main container)
│       ├── EndpointList.tsx
│       ├── EndpointItem.tsx
│       ├── MethodBadge.tsx
│       ├── RequestBuilder.tsx
│       ├── RequestBodyEditor.tsx
│       ├── ResponseDisplay.tsx
│       ├── ResponseBodyFormatter.tsx
│       ├── LoadingAnimation.tsx
│       ├── StatusBadge.tsx
│       ├── CopyButton.tsx
│       ├── PresetsSection.tsx
│       ├── StatsBar.tsx
│       ├── StatCard.tsx (sub-component of StatsBar)
│       └── RequestHistory.tsx
├── lib/
│   └── data.ts (updated with API playground data)
├── app/
│   └── dashboard/
│       └── page.tsx (updated to include APIPlayground)
```

---

## Development Tips

1. **Start with the data layer** (`lib/data.ts`) - ensure all types and data are correct
2. **Build bottom-up** - create smaller components first, then compose larger ones
3. **Test frequently** - build one component at a time, test it, move to next
4. **Follow the design specs** - use the exact Tailwind classes from DESIGN_SPECS.md
5. **Use TypeScript** - leverage types from DATA_STRUCTURE.md
6. **Keep it modular** - each component should have a single responsibility
7. **Test responsiveness early** - don't build for desktop-only then add mobile later
8. **Consider accessibility** - test with keyboard navigation from the start

---

## Questions? 

Refer back to:
- **Overall concept**: API_PLAYGROUND_OVERVIEW.md
- **Endpoint details**: ENDPOINTS_DEFINITION.md
- **Component structure**: UI_COMPONENTS.md
- **Styling**: DESIGN_SPECS.md
- **Data organization**: DATA_STRUCTURE.md
