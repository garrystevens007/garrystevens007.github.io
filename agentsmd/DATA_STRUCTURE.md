# Data Structure - lib/data.ts

This document shows how to organize all API Playground data in the existing `lib/data.ts` file.

---

## Type Definitions

Add these TypeScript interfaces to `lib/data.ts`:

```typescript
// ============ API Playground Types ============

export interface Endpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  category: 'profile' | 'experience' | 'skills' | 'projects' | 'fun' | 'stats' | 'search';
  description: string;
  queryParams?: QueryParam[];
  pathParams?: PathParam[];
  requestBody?: RequestBodySpec;
  responses: ResponseSpec[];
}

export interface QueryParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
  example?: string;
}

export interface PathParam {
  name: string;
  type: 'string' | 'number';
  description: string;
  example: string;
}

export interface RequestBodySpec {
  type: 'json';
  schema: {
    [key: string]: 'string' | 'number' | 'boolean' | 'array';
  };
  example: object;
}

export interface ResponseSpec {
  statusCode: number;
  statusLabel: string;
  emoji: string;
  contentType: 'application/json';
  body: any;
  description?: string;
}

export interface PresetRequest {
  id: string;
  label: string;
  description: string;
  method: string;
  path: string;
  queryParams?: Record<string, string>;
  body?: object;
}

export interface PresetCategory {
  name: string;
  description?: string;
  presets: PresetRequest[];
}
```

---

## Endpoints Definition

```typescript
export const apiPlaygroundEndpoints: Endpoint[] = [
  // ===== PROFILE CATEGORY =====
  {
    id: 'get-cv',
    path: '/api/profile/cv',
    method: 'GET',
    category: 'profile',
    description: 'Download Garry\'s CV as structured data',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          message: 'CV loaded fresh from the vault',
          data: {
            name: 'Garry Stevens',
            title: 'Backend Engineer',
            location: 'South Jakarta, Indonesia',
            email: 'stevens.garrys@gmail.com',
            bio: 'Backend Engineer with 7+ years of experience building enterprise-grade Java applications.',
            summary: 'Experienced in designing RESTful services, optimizing databases, and improving system reliability.',
            links: {
              github: 'https://github.com/garrystevens007',
              linkedin: 'https://linkedin.com/in/garrystevens',
            },
          },
        },
      },
    ],
  },

  {
    id: 'get-about',
    path: '/api/profile/about',
    method: 'GET',
    category: 'profile',
    description: 'Get more about Garry (playful narrative version)',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          message: 'Found 1 backend engineer in database',
          data: {
            who: 'Garry Stevens - a backend engineer who actually ships things',
            currently: 'Building distributed systems and fixing production bugs at 3 AM',
            passionate_about: [
              'RESTful API design',
              'Database optimization',
              'System reliability',
              'Clean, testable code',
              'Mentoring junior engineers',
            ],
            fun_fact: 'Has fixed more security vulnerabilities than can be counted on fingers.',
            open_to: ['Opportunities', 'Collaborations', 'Interesting projects'],
            response_time: 'Usually replies within 24 hours',
          },
        },
      },
    ],
  },

  {
    id: 'post-contact',
    path: '/api/profile/contact',
    method: 'POST',
    category: 'profile',
    description: 'Send Garry a message (simulated)',
    requestBody: {
      type: 'json',
      schema: {
        name: 'string',
        email: 'string',
        subject: 'string',
        message: 'string',
      },
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Let\'s collaborate',
        message: 'I think we could build something great together...',
      },
    },
    responses: [
      {
        statusCode: 201,
        statusLabel: 'Created',
        emoji: '🎉',
        contentType: 'application/json',
        body: {
          status: 'success',
          message: 'Message received and queued for processing',
          data: {
            ticket_id: 'MSG-20240907-XYZ123',
            submitted_at: '2024-09-07T10:30:45Z',
            estimated_response: '24 hours',
            note: 'Garry will review this message and respond personally.',
          },
        },
      },
      {
        statusCode: 400,
        statusLabel: 'Bad Request',
        emoji: '⚠️',
        contentType: 'application/json',
        body: {
          status: 'error',
          message: 'Validation failed',
          errors: {
            email: 'Invalid email format',
            message: 'Message must be at least 10 characters',
          },
        },
      },
    ],
  },

  // ===== EXPERIENCE CATEGORY =====
  {
    id: 'get-experience-timeline',
    path: '/api/experience/timeline',
    method: 'GET',
    category: 'experience',
    description: 'Get career timeline with detailed roles',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            total_years: 7,
            companies: 2,
            roles: [
              {
                position: 'Software Engineer',
                company: 'Unit4 — United Kingdom, Remote',
                duration: 'May 2023 — Present',
                highlights: [
                  'Identified and remediated a critical security vulnerability',
                  'Developed and maintained enterprise REST APIs in Java',
                  'Investigated and resolved production incidents',
                ],
              },
              {
                position: 'Software Engineer',
                company: 'Samsung Research Indonesia — Jakarta, Hybrid',
                duration: 'Feb 2022 — Apr 2023',
                highlights: [
                  'Designed and developed an internal web platform',
                  'Built ~10 RESTful API endpoints from scratch',
                  'Implemented Elasticsearch indexing',
                ],
              },
            ],
          },
        },
      },
    ],
  },

  {
    id: 'get-experience-role',
    path: '/api/experience/roles/{company}',
    method: 'GET',
    category: 'experience',
    description: 'Get detailed information about a specific role',
    pathParams: [
      {
        name: 'company',
        type: 'string',
        description: 'Company name: "unit4" or "samsung"',
        example: 'unit4',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            position: 'Software Engineer',
            company: 'Unit4',
            location: 'United Kingdom, Remote',
            duration: 'May 2023 — Present',
            duration_months: 16,
            key_achievements: [
              {
                title: 'Security Vulnerability Fix',
                description: 'Fixed critical password storage vulnerability',
                impact: '100% of users secured',
              },
            ],
          },
        },
      },
      {
        statusCode: 404,
        statusLabel: 'Not Found',
        emoji: '🤔',
        contentType: 'application/json',
        body: {
          status: 'error',
          message: 'Company not found',
          available_companies: ['unit4', 'samsung'],
        },
      },
    ],
  },

  // ===== SKILLS CATEGORY =====
  {
    id: 'get-skills',
    path: '/api/skills',
    method: 'GET',
    category: 'skills',
    description: 'Get all skills grouped by category',
    queryParams: [
      {
        name: 'category',
        type: 'string',
        description: 'Filter by skill category',
        required: false,
        example: 'languages',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            languages: [
              { skill: 'Java', proficiency: 90, years: 7 },
              { skill: 'SQL', proficiency: 85, years: 6 },
            ],
            frameworks: [
              { skill: 'Spring Boot', proficiency: 85, years: 6 },
              { skill: 'RESTful APIs', proficiency: 90, years: 7 },
            ],
            databases: [
              { skill: 'MySQL', proficiency: 80, years: 5 },
              { skill: 'PostgreSQL', proficiency: 75, years: 4 },
            ],
            tools: [
              { skill: 'Docker', proficiency: 75, years: 3 },
              { skill: 'Git', proficiency: 85, years: 7 },
            ],
          },
        },
      },
    ],
  },

  {
    id: 'get-skill-detail',
    path: '/api/skills/{skillName}',
    method: 'GET',
    category: 'skills',
    description: 'Get detailed info about a specific skill',
    pathParams: [
      {
        name: 'skillName',
        type: 'string',
        description: 'Skill name: "java", "spring", "docker", etc.',
        example: 'java',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            skill: 'Java',
            proficiency_level: 'Expert',
            proficiency_score: 90,
            years_of_experience: 7,
            description: 'Extensive experience building enterprise-grade Java applications',
            projects_used_in: [
              'ERP modules at Unit4',
              'AI training platform at Samsung',
            ],
            expertise: [
              'Object-oriented design',
              'Concurrency and multithreading',
              'Spring Framework ecosystem',
            ],
          },
        },
      },
    ],
  },

  // ===== PROJECTS CATEGORY =====
  {
    id: 'get-projects',
    path: '/api/projects',
    method: 'GET',
    category: 'projects',
    description: 'Get list of featured projects',
    queryParams: [
      {
        name: 'limit',
        type: 'number',
        description: 'Number of projects to return',
        required: false,
        example: '10',
      },
      {
        name: 'tech',
        type: 'string',
        description: 'Filter by technology',
        required: false,
        example: 'java',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          count: 3,
          data: [
            {
              id: 'proj-001',
              name: 'AI Training Platform',
              description: 'Internal web platform supporting AI training workflows',
              company: 'Samsung Research Indonesia',
              technologies: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'Docker'],
              highlights: [
                'Built 10+ REST API endpoints from scratch',
                'Implemented Elasticsearch for search accuracy',
              ],
            },
          ],
        },
      },
    ],
  },

  {
    id: 'get-project-detail',
    path: '/api/projects/{projectId}',
    method: 'GET',
    category: 'projects',
    description: 'Get detailed info about a specific project',
    pathParams: [
      {
        name: 'projectId',
        type: 'string',
        description: 'Project ID',
        example: 'proj-001',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✅',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            id: 'proj-001',
            name: 'AI Training Platform',
            description: 'Internal web platform supporting AI training workflows',
            company: 'Samsung Research Indonesia',
            role: 'Software Engineer',
            duration: '14 months',
            technologies: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'Elasticsearch'],
            detailed_achievements: [
              {
                title: 'REST API Development',
                description: 'Designed and implemented 10+ RESTful API endpoints',
                metrics: '100% of required endpoints delivered',
              },
            ],
            team_size: '8 engineers',
            agile_method: 'Kanban',
          },
        },
      },
    ],
  },

  // ===== FUN CATEGORY =====
  {
    id: 'get-joke',
    path: '/api/fun/joke',
    method: 'GET',
    category: 'fun',
    description: 'Get a programming joke',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '😂',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            joke: 'Why do Java developers wear glasses?',
            punchline: 'Because they don\'t C#',
            rating: 'dad-joke/10',
          },
        },
      },
    ],
  },

  {
    id: 'get-fact',
    path: '/api/fun/random-fact',
    method: 'GET',
    category: 'fun',
    description: 'Get a random fact about Garry',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '✨',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            fact: 'Garry has debugged production issues at 3 AM more times than there are beans in a Java JAR file',
            context: 'Welcome to the life of a backend engineer',
          },
        },
      },
    ],
  },

  {
    id: 'get-status',
    path: '/api/fun/status',
    method: 'GET',
    category: 'fun',
    description: 'Get Garry\'s current status (creative)',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '💪',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            currently: 'Building cool things',
            mood: '💪 Ready for new challenges',
            caffeine_level: 87,
            focus_mode: true,
            next_deadline: 'Always shipping on time',
          },
        },
      },
    ],
  },

  // ===== STATS CATEGORY =====
  {
    id: 'get-stats',
    path: '/api/stats',
    method: 'GET',
    category: 'stats',
    description: 'Get career statistics',
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '📊',
        contentType: 'application/json',
        body: {
          status: 'success',
          data: {
            lines_of_code_written: 30000,
            bugs_fixed: 156,
            security_vulnerabilities_resolved: 8,
            features_shipped: 47,
            code_reviews_conducted: 230,
            test_coverage: '85%',
            ci_cd_pipelines_set_up: 12,
            containers_deployed: 45,
            database_optimizations: 23,
            production_uptime: '99.8%',
          },
        },
      },
    ],
  },

  // ===== SEARCH CATEGORY =====
  {
    id: 'get-search',
    path: '/api/search',
    method: 'GET',
    category: 'search',
    description: 'Search across all content',
    queryParams: [
      {
        name: 'q',
        type: 'string',
        description: 'Search query',
        required: true,
        example: 'java',
      },
      {
        name: 'type',
        type: 'string',
        description: 'Result type: "all", "skills", "projects", "experience"',
        required: false,
        example: 'all',
      },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '🔍',
        contentType: 'application/json',
        body: {
          status: 'success',
          results: {
            skills: [{ name: 'Java', proficiency: 90 }],
            projects: [{ name: 'AI Training Platform', relevance: 0.95 }],
            experience: [{ highlight: 'Java Spring framework expertise', company: 'Unit4' }],
          },
          total_results: 5,
        },
      },
      {
        statusCode: 200,
        statusLabel: 'OK',
        emoji: '🔍',
        contentType: 'application/json',
        description: 'No results found',
        body: {
          status: 'success',
          results: {},
          total_results: 0,
          message: 'No results found for "xyz". Try searching for "java", "spring", "docker".',
        },
      },
    ],
  },
];
```

---

## Preset Categories & Requests

```typescript
export const apiPresetCategories: PresetCategory[] = [
  {
    name: 'Quick Start',
    description: 'Common, beginner-friendly requests',
    presets: [
      {
        id: 'preset-cv',
        label: 'Get CV Data',
        description: 'Download structured CV data',
        method: 'GET',
        path: '/api/profile/cv',
      },
      {
        id: 'preset-skills',
        label: 'Check Skills',
        description: 'See all technical skills grouped by category',
        method: 'GET',
        path: '/api/skills',
      },
      {
        id: 'preset-timeline',
        label: 'View Experience',
        description: 'See full career timeline',
        method: 'GET',
        path: '/api/experience/timeline',
      },
    ],
  },
  {
    name: 'Advanced',
    description: 'Complex queries with filters',
    presets: [
      {
        id: 'preset-java-skills',
        label: 'Java Skills Detail',
        description: 'Get detailed info about Java expertise',
        method: 'GET',
        path: '/api/skills/java',
      },
      {
        id: 'preset-unit4-role',
        label: 'Unit4 Role Details',
        description: 'Get detailed info about current role',
        method: 'GET',
        path: '/api/experience/roles/unit4',
      },
      {
        id: 'preset-search',
        label: 'Search for Java',
        description: 'Search across portfolio for Java mentions',
        method: 'GET',
        path: '/api/search',
        queryParams: { q: 'java' },
      },
    ],
  },
  {
    name: 'Fun & Errors',
    description: 'Try these for fun or to see error handling',
    presets: [
      {
        id: 'preset-joke',
        label: 'Get a Joke',
        description: 'Need a laugh?',
        method: 'GET',
        path: '/api/fun/joke',
      },
      {
        id: 'preset-fact',
        label: 'Random Fact',
        description: 'Learn something about Garry',
        method: 'GET',
        path: '/api/fun/random-fact',
      },
      {
        id: 'preset-status',
        label: 'Check Status',
        description: 'What\'s Garry up to?',
        method: 'GET',
        path: '/api/fun/status',
      },
      {
        id: 'preset-404',
        label: 'Error Scenario (404)',
        description: 'See how errors are handled',
        method: 'GET',
        path: '/api/nonexistent',
      },
    ],
  },
  {
    name: 'Interactive',
    description: 'Endpoints that accept input',
    presets: [
      {
        id: 'preset-contact',
        label: 'Send Message',
        description: 'Try sending a message',
        method: 'POST',
        path: '/api/profile/contact',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Let\'s collaborate',
          message: 'I think we could build something great together...',
        },
      },
    ],
  },
];
```

---

## Helper Functions

Add these utility functions to work with the API data:

```typescript
// Get all endpoints
export function getAllEndpoints(): Endpoint[] {
  return apiPlaygroundEndpoints;
}

// Get endpoints by category
export function getEndpointsByCategory(
  category: string
): Endpoint[] {
  return apiPlaygroundEndpoints.filter(ep => ep.category === category);
}

// Get single endpoint by ID
export function getEndpointById(id: string): Endpoint | undefined {
  return apiPlaygroundEndpoints.find(ep => ep.id === id);
}

// Search endpoints
export function searchEndpoints(query: string): Endpoint[] {
  const q = query.toLowerCase();
  return apiPlaygroundEndpoints.filter(
    ep =>
      ep.path.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.category.includes(q)
  );
}

// Get random success response
export function getSuccessResponse(endpoint: Endpoint): any {
  const successResponses = endpoint.responses.filter(r =>
    r.statusCode >= 200 && r.statusCode < 300
  );
  if (successResponses.length === 0) return null;
  return successResponses[0].body;
}

// Simulate API call with random response time
export async function simulateApiCall(
  endpoint: Endpoint,
  options?: { forceStatus?: number }
): Promise<{ body: any; statusCode: number; time: number }> {
  const delay = Math.random() * 1000 + 500; // 500-1500ms
  
  await new Promise(resolve => setTimeout(resolve, delay));

  let response: ResponseSpec;
  
  if (options?.forceStatus) {
    response = endpoint.responses.find(r => r.statusCode === options.forceStatus) ||
      endpoint.responses[0];
  } else {
    // 90% success, 10% error
    const random = Math.random();
    const successResponses = endpoint.responses.filter(r =>
      r.statusCode >= 200 && r.statusCode < 300
    );
    const errorResponses = endpoint.responses.filter(r =>
      r.statusCode >= 400
    );
    
    response = random < 0.9 && successResponses.length > 0
      ? successResponses[0]
      : errorResponses[0] || endpoint.responses[0];
  }

  return {
    body: response.body,
    statusCode: response.statusCode,
    time: Math.round(delay),
  };
}

// Get category icon
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    profile: '👤',
    experience: '💼',
    skills: '🛠️',
    projects: '🚀',
    fun: '🎮',
    stats: '📊',
    search: '🔍',
  };
  return icons[category] || '📌';
}

// Format endpoint path with query params
export function formatEndpointUrl(
  endpoint: Endpoint,
  params?: Record<string, string>
): string {
  let url = endpoint.path;
  
  // Replace path parameters
  if (endpoint.pathParams && params) {
    endpoint.pathParams.forEach(param => {
      url = url.replace(`{${param.name}}`, params[param.name] || '');
    });
  }
  
  // Add query parameters
  const queryParts: string[] = [];
  if (endpoint.queryParams && params) {
    endpoint.queryParams.forEach(param => {
      if (params[param.name]) {
        queryParts.push(`${param.name}=${encodeURIComponent(params[param.name])}`);
      }
    });
  }
  
  if (queryParts.length > 0) {
    url += '?' + queryParts.join('&');
  }
  
  return url;
}

// Validate request body
export function validateRequestBody(
  endpoint: Endpoint,
  body: any
): { valid: boolean; errors?: string[] } {
  if (!endpoint.requestBody) {
    return { valid: true };
  }

  const errors: string[] = [];
  const bodyObj = typeof body === 'string' ? JSON.parse(body) : body;

  // Simple validation
  Object.entries(endpoint.requestBody.schema).forEach(([key, type]) => {
    if (!(key in bodyObj)) {
      errors.push(`Missing required field: ${key}`);
    } else if (typeof bodyObj[key] !== type.toLowerCase()) {
      errors.push(`${key} must be ${type}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
```

---

## Usage in Components

Example of how to use this data in your React components:

```typescript
import { 
  apiPlaygroundEndpoints, 
  getEndpointsByCategory,
  simulateApiCall,
  formatEndpointUrl 
} from '@/lib/data';

export function APIPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    try {
      const result = await simulateApiCall(selectedEndpoint);
      setResponse(result);
    } finally {
      setIsLoading(false);
    }
  };

  const allEndpoints = apiPlaygroundEndpoints;

  return (
    <div>
      {/* Render endpoint list */}
      {allEndpoints.map(endpoint => (
        <button
          key={endpoint.id}
          onClick={() => setSelectedEndpoint(endpoint)}
          className={selectedEndpoint?.id === endpoint.id ? 'selected' : ''}
        >
          {endpoint.method} {endpoint.path}
        </button>
      ))}

      {/* Render response */}
      {response && (
        <div>
          <code>{JSON.stringify(response.body, null, 2)}</code>
        </div>
      )}

      {/* Render loading state */}
      {isLoading && <div>Loading...</div>}
    </div>
  );
}
```

