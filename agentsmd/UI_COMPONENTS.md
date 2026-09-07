# UI Components & Layout Specification

## Component Hierarchy

```
APIPlayground (Container)
├── Header
│   ├── Title "API Playground"
│   ├── Subtitle "Test real endpoints, explore mock data"
│   └── Info Icon (tooltip about the feature)
├── StatsBar
│   ├── StatCard: Total Requests
│   ├── StatCard: Most Popular Endpoint
│   ├── StatCard: Avg Response Time
│   └── StatCard: Last Request
├── MainContent
│   ├── LeftPanel (40%)
│   │   ├── EndpointList
│   │   │   ├── SearchInput
│   │   │   └── EndpointItem (repeating)
│   │   │       ├── MethodBadge
│   │   │       ├── EndpointPath
│   │   │       ├── Description
│   │   │       └── QuickSelect Button
│   │   └── PresetsSection
│   │       ├── PresetCategory (collapsible)
│   │       └── PresetButton (repeating)
│   └── RightPanel (60%)
│       ├── RequestBuilder
│       │   ├── MethodSelector
│       │   ├── URLPreview
│       │   ├── RequestBodyEditor (collapsible)
│       │   ├── HeadersSection (collapsible)
│       │   └── SendButton
│       └── ResponseDisplay
│           ├── LoadingAnimation (while loading)
│           ├── StatusBadge
│           ├── ResponseHeaders
│           ├── ResponseBody (formatted JSON)
│           ├── ResponseTime
│           ├── CopyButton
│           └── ShareButton
└── RequestHistory
    ├── RecentRequests (last 5)
    └── ClearHistory Button
```

---

## Component Details

### 1. **APIPlayground (Main Container)**

**Props**:
- None (uses hooks for state)

**State**:
```javascript
const [selectedEndpoint, setSelectedEndpoint] = useState(null);
const [requestMethod, setRequestMethod] = useState('GET');
const [requestBody, setRequestBody] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [response, setResponse] = useState(null);
const [requestHistory, setRequestHistory] = useState([]);
const [totalRequests, setTotalRequests] = useState(0);
```

**Styling**:
- Container: `grid grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow-sm`
- On mobile (`md:`): Stack vertically with `flex flex-col`

---

### 2. **EndpointList Component**

Displays all available endpoints in a searchable, scrollable list.

**Props**:
```typescript
interface EndpointListProps {
  endpoints: Endpoint[];
  onSelectEndpoint: (endpoint: Endpoint) => void;
  selectedEndpoint: Endpoint | null;
}
```

**Structure**:
```jsx
<div className="space-y-3 max-h-[600px] overflow-y-auto">
  <input
    type="text"
    placeholder="Search endpoints..."
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
  />
  
  {filteredEndpoints.map((endpoint) => (
    <EndpointItem 
      key={endpoint.id}
      endpoint={endpoint}
      isSelected={selectedEndpoint?.id === endpoint.id}
      onSelect={() => onSelectEndpoint(endpoint)}
    />
  ))}
</div>
```

---

### 3. **EndpointItem Component**

Individual endpoint card in the list.

**Props**:
```typescript
interface EndpointItemProps {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
}
```

**Styling**:
```jsx
<div className={`
  p-4 rounded-lg border-2 cursor-pointer transition-all
  ${isSelected 
    ? 'bg-pink-50 border-pink-500 shadow-md' 
    : 'bg-white border-gray-200 hover:border-pink-300'
  }
`}>
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        {/* Method Badge */}
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-gray-700">
          {endpoint.path}
        </code>
      </div>
      <p className="text-xs text-gray-600">{endpoint.description}</p>
    </div>
    <button
      onClick={onSelect}
      className="px-2 py-1 text-xs font-semibold text-pink-600 bg-pink-100 rounded hover:bg-pink-200 transition"
    >
      Use
    </button>
  </div>
</div>
```

---

### 4. **MethodBadge Component**

Colored badge showing HTTP method.

**Props**:
```typescript
interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}
```

**Styling**:
```javascript
const methodColors = {
  GET: 'bg-teal-100 text-teal-800 border-teal-300',
  POST: 'bg-blue-100 text-blue-800 border-blue-300',
  PUT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  DELETE: 'bg-red-100 text-red-800 border-red-300',
};

return (
  <span className={`
    px-2 py-1 text-xs font-bold rounded border
    ${methodColors[method]}
  `}>
    {method}
  </span>
);
```

---

### 5. **RequestBuilder Component**

The form where users construct their request.

**Props**:
```typescript
interface RequestBuilderProps {
  endpoint: Endpoint;
  onSendRequest: (request: Request) => void;
  isLoading: boolean;
}
```

**Structure**:
```jsx
<div className="space-y-4">
  {/* Method Selector */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Method
    </label>
    <div className="flex gap-2">
      {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
        <button
          key={method}
          onClick={() => setRequestMethod(method)}
          className={`
            px-4 py-2 rounded font-semibold transition
            ${requestMethod === method
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          {method}
        </button>
      ))}
    </div>
  </div>

  {/* URL Preview */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      URL
    </label>
    <div className="p-3 bg-gray-100 rounded font-mono text-sm text-gray-800 break-all">
      {constructURL(endpoint, requestMethod)}
    </div>
  </div>

  {/* Request Body (for POST/PUT) */}
  {['POST', 'PUT'].includes(requestMethod) && (
    <RequestBodyEditor
      value={requestBody}
      onChange={setRequestBody}
    />
  )}

  {/* Headers Section */}
  <HeadersSection endpoint={endpoint} />

  {/* Send Button */}
  <button
    onClick={() => handleSendRequest()}
    disabled={isLoading}
    className={`
      w-full px-6 py-3 rounded-lg font-bold text-white transition
      ${isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-pink-600 hover:bg-pink-700 active:scale-95'
      }
    `}
  >
    {isLoading ? 'Sending...' : '🚀 SEND'}
  </button>
</div>
```

---

### 6. **RequestBodyEditor Component**

JSON editor for POST/PUT request bodies.

**Props**:
```typescript
interface RequestBodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}
```

**Styling**:
```jsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Request Body
  </label>
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={'{\n  "key": "value"\n}'}
    className={`
      w-full h-40 p-3 font-mono text-sm border border-gray-300 rounded
      focus:outline-none focus:ring-2 focus:ring-pink-500
      bg-gray-900 text-gray-100 text-sm
    `}
  />
</div>
```

---

### 7. **LoadingAnimation Component**

Creative loading state shown while waiting for response.

**Features**:
- Terminal-style typing effect
- Random fun messages
- 1.5-2.5 second duration

**Implementation**:
```jsx
const loadingMessages = [
  '🔍 Searching database...',
  '⚙️ Processing your request...',
  '🚀 Deploying from the cloud...',
  '🧠 Consulting the backend oracle...',
  '📡 Pinging the server...',
  '🔐 Encrypting transmission...',
  '⏳ Almost there...',
];

return (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="relative w-12 h-12 mb-4">
      {/* Spinner animation */}
      <div className="absolute inset-0 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin" />
    </div>
    
    <div className="text-center">
      <p className="text-sm text-gray-600 min-h-6">
        <TypewriterText 
          text={randomMessage}
          speed={50}
        />
      </p>
    </div>
    
    {/* Progress indicator */}
    <div className="w-32 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
      <div className="h-full bg-pink-600 animate-pulse" style={{
        animation: 'progress 2s ease-in-out'
      }} />
    </div>
  </div>
);
```

---

### 8. **ResponseDisplay Component**

Shows formatted response with metadata.

**Props**:
```typescript
interface ResponseDisplayProps {
  response: ApiResponse;
  isLoading: boolean;
  requestTime: number;
}
```

**Structure**:
```jsx
<div className="space-y-4">
  {isLoading ? (
    <LoadingAnimation />
  ) : response ? (
    <>
      {/* Status Badge */}
      <StatusBadge 
        status={response.status}
        code={response.statusCode}
      />

      {/* Response Time */}
      <div className="text-xs text-gray-600">
        Response time: <span className="font-mono font-semibold">{requestTime}ms</span>
      </div>

      {/* Response Headers */}
      <details className="bg-gray-50 p-3 rounded cursor-pointer">
        <summary className="font-semibold text-gray-700">Response Headers</summary>
        <div className="mt-2 text-xs font-mono text-gray-600 space-y-1">
          <div>Content-Type: application/json</div>
          <div>Server: Backend™ v1.0</div>
          <div>X-Response-Time: {requestTime}ms</div>
        </div>
      </details>

      {/* Response Body */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-gray-700">Response Body</label>
          <CopyButton 
            text={JSON.stringify(response.data, null, 2)}
          />
        </div>
        <ResponseBodyFormatter data={response.data} />
      </div>
    </>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <p>Select an endpoint and click SEND to see the response here</p>
    </div>
  )}
</div>
```

---

### 9. **StatusBadge Component**

Shows HTTP status code with emoji.

**Props**:
```typescript
interface StatusBadgeProps {
  status: 'success' | 'error';
  code: number;
}
```

**Styling**:
```javascript
const statusConfig = {
  200: { color: 'bg-green-100 border-green-300', emoji: '✅', label: 'OK' },
  201: { color: 'bg-green-100 border-green-300', emoji: '🎉', label: 'Created' },
  400: { color: 'bg-yellow-100 border-yellow-300', emoji: '⚠️', label: 'Bad Request' },
  404: { color: 'bg-orange-100 border-orange-300', emoji: '🤔', label: 'Not Found' },
  429: { color: 'bg-orange-100 border-orange-300', emoji: '⏳', label: 'Rate Limited' },
  500: { color: 'bg-red-100 border-red-300', emoji: '💥', label: 'Server Error' },
};

const config = statusConfig[code];

return (
  <div className={`
    inline-block px-3 py-2 rounded border-2 font-semibold
    ${config.color}
  `}>
    <span className="mr-2">{config.emoji}</span>
    {code} {config.label}
  </div>
);
```

---

### 10. **ResponseBodyFormatter Component**

Displays JSON with syntax highlighting and collapsible sections.

**Props**:
```typescript
interface ResponseBodyFormatterProps {
  data: any;
  level?: number;
}
```

**Features**:
- Collapsible nested objects
- Color-coded syntax (keys, values, strings, numbers)
- Readable indentation

**Colors**:
- Keys: `text-blue-600`
- Strings: `text-green-600`
- Numbers: `text-orange-600`
- Booleans: `text-purple-600`
- null: `text-gray-500`

---

### 11. **CopyButton Component**

Copies response to clipboard with feedback.

**Props**:
```typescript
interface CopyButtonProps {
  text: string;
  label?: string;
}
```

**Implementation**:
```jsx
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

return (
  <button
    onClick={handleCopy}
    className={`
      px-3 py-1 text-sm rounded font-semibold transition
      ${copied
        ? 'bg-green-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }
    `}
  >
    {copied ? '✓ Copied!' : '📋 Copy'}
  </button>
);
```

---

### 12. **PresetsSection Component**

Quick-load example requests.

**Structure**:
```jsx
<div className="mt-6 border-t pt-4">
  <h3 className="font-semibold text-gray-700 mb-3">Preset Examples</h3>
  
  <div className="space-y-3">
    {presetCategories.map((category) => (
      <details key={category.name} className="bg-gray-50 rounded">
        <summary className="p-3 font-semibold cursor-pointer hover:bg-gray-100">
          {category.name}
        </summary>
        
        <div className="p-3 space-y-2 bg-white border-t">
          {category.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 rounded transition"
            >
              <div className="font-semibold text-gray-700">
                {preset.label}
              </div>
              <div className="text-xs text-gray-500">
                {preset.method} {preset.path}
              </div>
            </button>
          ))}
        </div>
      </details>
    ))}
  </div>
</div>
```

---

### 13. **StatsBar Component**

Shows playground statistics.

**Props**:
```typescript
interface StatsBarProps {
  totalRequests: number;
  mostPopularEndpoint: string;
  avgResponseTime: number;
  lastRequestTime: string;
}
```

**Structure**:
```jsx
<div className="grid grid-cols-4 gap-4 mb-6">
  <StatCard
    icon="📊"
    label="Total Requests"
    value={totalRequests}
  />
  <StatCard
    icon="🎯"
    label="Most Popular"
    value={mostPopularEndpoint}
  />
  <StatCard
    icon="⚡"
    label="Avg Response"
    value={`${avgResponseTime}ms`}
  />
  <StatCard
    icon="🕐"
    label="Last Request"
    value={lastRequestTime}
  />
</div>
```

---

### 14. **RequestHistory Component**

Shows recent requests for quick re-access.

**Props**:
```typescript
interface RequestHistoryProps {
  requests: HistoryItem[];
  onLoadRequest: (request: HistoryItem) => void;
  onClearHistory: () => void;
}
```

**Implementation**:
```jsx
<div className="mt-6 bg-gray-50 p-4 rounded">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-gray-700">Request History</h3>
    <button
      onClick={onClearHistory}
      className="text-xs text-gray-500 hover:text-red-600"
    >
      Clear
    </button>
  </div>
  
  <div className="space-y-2">
    {requests.slice(0, 5).map((req, idx) => (
      <button
        key={idx}
        onClick={() => onLoadRequest(req)}
        className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:border-pink-300 transition"
      >
        <div className="flex items-center gap-2">
          <MethodBadge method={req.method} />
          <code className="text-gray-700">{req.endpoint}</code>
        </div>
      </button>
    ))}
  </div>
</div>
```

---

## Responsive Breakpoints

- **Mobile** (`< 768px`): Stack left and right panels vertically
- **Tablet** (`768px - 1024px`): Adjust grid, reduce gaps
- **Desktop** (`> 1024px`): Side-by-side layout with 40/60 split

```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
```

---

## Animation Details

### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Typewriter Effect (Loading Message)
```javascript
const [displayedText, setDisplayedText] = useState('');

useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    setDisplayedText(message.slice(0, index + 1));
    index++;
    if (index >= message.length) clearInterval(interval);
  }, 50);
  
  return () => clearInterval(interval);
}, [message]);
```

### Progress Bar
```css
@keyframes progress {
  0% { width: 0%; }
  50% { width: 80%; }
  100% { width: 100%; }
}
```

### Copy Button Feedback
```jsx
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

---

## Accessibility Features

- **ARIA Labels**: All buttons and inputs have descriptive labels
- **Keyboard Navigation**: Tab through all interactive elements
- **Focus Styles**: `focus:outline-none focus:ring-2 focus:ring-pink-500`
- **Color Contrast**: All text meets WCAG AA standards
- **Semantic HTML**: Use `<button>`, `<label>`, `<details>` properly
- **Error Messages**: Clear, actionable feedback
- **Loading States**: Always indicate when loading
- **Disabled States**: Clearly show when buttons are disabled

---

## Performance Optimization

- **Virtualized List**: For large endpoint list, use react-window or similar
- **Debounced Search**: Search input debounced by 300ms
- **Memoized Components**: Use `React.memo()` for expensive renders
- **Lazy Loading**: Load response syntax highlighting only when needed
- **No External CDNs**: All styling via Tailwind, no external JS libraries

