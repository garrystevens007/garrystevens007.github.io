# API Endpoints Definition

## Endpoint Categories & Responses

All endpoints return mocked data. Mix of realistic data + playful narrative elements.

---

## 📋 PROFILE ENDPOINTS

### 1. `GET /api/profile/cv`
**Description**: Download Garry's CV as structured data

**Method**: GET

**Query Parameters**: None

**Response (200)**:
```json
{
  "status": "success",
  "message": "CV loaded fresh from the vault",
  "data": {
    "name": "Garry Stevens",
    "title": "Backend Engineer",
    "location": "South Jakarta, Indonesia",
    "email": "stevens.garrys@gmail.com",
    "bio": "Backend Engineer with 7+ years of experience building enterprise-grade Java applications. Passionate about clean code, system reliability, and shipping features that matter.",
    "summary": "Experienced in designing RESTful services, optimizing databases, and improving system reliability in production environments. Strong focus on data integrity, performance optimization, and writing testable, maintainable code.",
    "links": {
      "github": "https://github.com/garrystevens007",
      "linkedin": "https://linkedin.com/in/garrystevens"
    }
  }
}
```

---

### 2. `GET /api/profile/about`
**Description**: Get more about Garry (playful narrative version)

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "message": "Found 1 backend engineer in database",
  "data": {
    "who": "Garry Stevens - a backend engineer who actually ships things",
    "currently": "Building distributed systems and fixing production bugs at 3 AM",
    "passionate_about": [
      "RESTful API design",
      "Database optimization",
      "System reliability",
      "Clean, testable code",
      "Mentoring junior engineers"
    ],
    "fun_fact": "Has fixed more security vulnerabilities than can be counted on fingers. Currently leading initiatives on code quality and system resilience.",
    "open_to": ["Opportunities", "Collaborations", "Interesting projects"],
    "response_time": "Usually replies within 24 hours"
  }
}
```

---

### 3. `POST /api/profile/contact`
**Description**: Send Garry a message (simulated)

**Method**: POST

**Body**:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

**Response (201)**:
```json
{
  "status": "success",
  "message": "Message received and queued for processing",
  "data": {
    "ticket_id": "MSG-20240907-XYZ123",
    "submitted_at": "2024-09-07T10:30:45Z",
    "estimated_response": "24 hours",
    "note": "Garry will review this message and respond personally. Thanks for reaching out!"
  }
}
```

**Response (400 - Validation Error)**:
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "message": "Message must be at least 10 characters"
  }
}
```

---

## 💼 EXPERIENCE ENDPOINTS

### 4. `GET /api/experience/timeline`
**Description**: Get career timeline with detailed roles

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "total_years": 7,
    "companies": 2,
    "roles": [
      {
        "position": "Software Engineer",
        "company": "Unit4 — United Kingdom, Remote",
        "duration": "May 2023 — Present",
        "highlights": [
          "Identified and remediated a critical security vulnerability where user passwords were stored in plaintext",
          "Developed and maintained enterprise REST APIs in Java for ERP modules",
          "Investigated and resolved production incidents using root-cause analysis",
          "Optimized SQL queries to improve performance of data-intensive workflows",
          "Contributed to CI/CD workflows using Jenkins and Azure DevOps"
        ]
      },
      {
        "position": "Software Engineer",
        "company": "Samsung Research Indonesia — Jakarta, Hybrid",
        "duration": "Feb 2022 — Apr 2023",
        "highlights": [
          "Designed and developed an internal web platform supporting AI training workflows",
          "Built ~10 RESTful API endpoints from scratch using Java MVC pattern",
          "Modeled database interactions and implemented backend logic",
          "Implemented Elasticsearch indexing for improved search accuracy",
          "Containerized services using Docker for consistent development environments",
          "Worked in Agile environment using Jira and Kanban for iterative delivery"
        ]
      }
    ]
  }
}
```

---

### 5. `GET /api/experience/roles/{company}`
**Description**: Get detailed information about a specific role

**Method**: GET

**Path Parameters**:
- `company` (string): "unit4" or "samsung"

**Response (200 - unit4)**:
```json
{
  "status": "success",
  "data": {
    "position": "Software Engineer",
    "company": "Unit4",
    "location": "United Kingdom, Remote",
    "duration": "May 2023 — Present",
    "duration_months": 16,
    "key_achievements": [
      {
        "title": "Security Vulnerability Fix",
        "description": "Identified and fixed a critical vulnerability where passwords were stored in plaintext. Implemented secure encryption and safe handling across API and database layers.",
        "impact": "100% of users secured"
      },
      {
        "title": "REST API Development",
        "description": "Developed and maintained enterprise REST APIs in Java for ERP modules, ensuring backward compatibility.",
        "impact": "Delivering backend enhancements end-to-end"
      }
    ]
  }
}
```

**Response (404)**:
```json
{
  "status": "error",
  "message": "Company not found",
  "available_companies": ["unit4", "samsung"]
}
```

---

## 🛠️ SKILLS ENDPOINTS

### 6. `GET /api/skills`
**Description**: Get all skills grouped by category

**Method**: GET

**Query Parameters**:
- `category` (optional): "languages", "frameworks", "databases", "tools"

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "languages": [
      { "skill": "Java", "proficiency": 90, "years": 7 },
      { "skill": "SQL", "proficiency": 85, "years": 6 },
      { "skill": "JavaScript", "proficiency": 70, "years": 4 }
    ],
    "frameworks": [
      { "skill": "Spring Boot", "proficiency": 85, "years": 6 },
      { "skill": "RESTful APIs", "proficiency": 90, "years": 7 },
      { "skill": "MVC Pattern", "proficiency": 85, "years": 5 }
    ],
    "databases": [
      { "skill": "MySQL", "proficiency": 80, "years": 5 },
      { "skill": "PostgreSQL", "proficiency": 75, "years": 4 },
      { "skill": "Elasticsearch", "proficiency": 70, "years": 2 }
    ],
    "tools": [
      { "skill": "Docker", "proficiency": 75, "years": 3 },
      { "skill": "Git", "proficiency": 85, "years": 7 },
      { "skill": "Jenkins", "proficiency": 70, "years": 2 }
    ]
  }
}
```

---

### 7. `GET /api/skills/{skillName}`
**Description**: Get detailed info about a specific skill

**Method**: GET

**Path Parameters**:
- `skillName` (string): e.g., "java", "spring", "docker"

**Response (200 - java)**:
```json
{
  "status": "success",
  "data": {
    "skill": "Java",
    "proficiency_level": "Expert",
    "proficiency_score": 90,
    "years_of_experience": 7,
    "description": "Extensive experience building enterprise-grade Java applications",
    "projects_used_in": [
      "ERP modules at Unit4",
      "AI training platform at Samsung",
      "Multiple microservices"
    ],
    "expertise": [
      "Object-oriented design",
      "Concurrency and multithreading",
      "Spring Framework ecosystem",
      "JUnit and Mockito for testing",
      "Maven and Gradle for build management"
    ]
  }
}
```

---

## 🚀 PROJECT ENDPOINTS

### 8. `GET /api/projects`
**Description**: Get list of featured projects

**Method**: GET

**Query Parameters**:
- `limit` (optional, default: 10): Number of projects to return
- `tech` (optional): Filter by technology (e.g., "java", "react")

**Response (200)**:
```json
{
  "status": "success",
  "count": 3,
  "data": [
    {
      "id": "proj-001",
      "name": "AI Training Platform",
      "description": "Internal web platform supporting AI training workflows",
      "company": "Samsung Research Indonesia",
      "duration": "Feb 2022 — Apr 2023",
      "technologies": ["Java", "Spring Boot", "REST API", "MySQL", "Docker"],
      "highlights": [
        "Built 10+ REST API endpoints from scratch",
        "Implemented Elasticsearch for search accuracy",
        "Containerized microservices with Docker"
      ]
    },
    {
      "id": "proj-002",
      "name": "Security Vulnerability Remediation",
      "description": "Fixed critical security vulnerability in enterprise system",
      "company": "Unit4",
      "duration": "May 2023 — Jun 2023",
      "technologies": ["Java", "Encryption", "Security", "Spring"],
      "highlights": [
        "Identified plaintext password storage issue",
        "Implemented secure encryption mechanisms",
        "Secured 100% of user data"
      ]
    }
  ]
}
```

---

### 9. `GET /api/projects/{projectId}`
**Description**: Get detailed info about a specific project

**Method**: GET

**Path Parameters**:
- `projectId` (string): e.g., "proj-001"

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "id": "proj-001",
    "name": "AI Training Platform",
    "description": "Internal web platform supporting AI training workflows with Elasticsearch integration and Docker containerization",
    "company": "Samsung Research Indonesia",
    "role": "Software Engineer",
    "duration": "14 months",
    "technologies": ["Java", "Spring Boot", "REST API", "MySQL", "Elasticsearch", "Docker", "MVC Pattern", "Jira"],
    "detailed_achievements": [
      {
        "title": "REST API Development",
        "description": "Designed and implemented 10+ RESTful API endpoints using Java Spring framework",
        "metrics": "100% of required endpoints delivered"
      },
      {
        "title": "Database Design",
        "description": "Modeled database interactions using MVC pattern with optimized queries",
        "metrics": "< 200ms average query time"
      },
      {
        "title": "Search Infrastructure",
        "description": "Implemented and fine-tuned Elasticsearch for relevance scoring",
        "metrics": "99.2% search accuracy"
      }
    ],
    "team_size": "8 engineers",
    "agile_method": "Kanban"
  }
}
```

---

## 🎮 FUN ENDPOINTS

### 10. `GET /api/fun/joke`
**Description**: Get a programming joke

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "joke": "Why do Java developers wear glasses?",
    "punchline": "Because they don't C#",
    "rating": "dad-joke/10"
  }
}
```

---

### 11. `GET /api/fun/random-fact`
**Description**: Get a random fact about Garry

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "fact": "Garry has debugged production issues at 3 AM more times than there are beans in a Java JAR file",
    "context": "Welcome to the life of a backend engineer"
  }
}
```

---

### 12. `GET /api/fun/status`
**Description**: Get Garry's current status (creative)

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "currently": "Building cool things",
    "mood": "💪 Ready for new challenges",
    "caffeine_level": 87,
    "focus_mode": true,
    "next_deadline": "Always shipping on time"
  }
}
```

---

## 📊 STATS ENDPOINTS

### 13. `GET /api/stats`
**Description**: Get career statistics

**Method**: GET

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "lines_of_code_written": 30000,
    "bugs_fixed": 156,
    "security_vulnerabilities_resolved": 8,
    "features_shipped": 47,
    "code_reviews_conducted": 230,
    "test_coverage": "85%",
    "ci_cd_pipelines_set_up": 12,
    "containers_deployed": 45,
    "database_optimizations": 23,
    "production_uptime": "99.8%"
  }
}
```

---

## 🔍 SEARCH ENDPOINT

### 14. `GET /api/search`
**Description**: Search across all content

**Method**: GET

**Query Parameters**:
- `q` (required): Search query
- `type` (optional): "all", "skills", "projects", "experience"

**Response (200 - query: "java")**:
```json
{
  "status": "success",
  "results": {
    "skills": [
      { "name": "Java", "proficiency": 90 }
    ],
    "projects": [
      { "name": "AI Training Platform", "relevance": 0.95 },
      { "name": "ERP Modules", "relevance": 0.92 }
    ],
    "experience": [
      { "highlight": "Java Spring framework expertise", "company": "Unit4" }
    ]
  },
  "total_results": 5
}
```

**Response (200 - no results)**:
```json
{
  "status": "success",
  "results": {},
  "total_results": 0,
  "message": "No results found for 'xyz'. Try searching for 'java', 'spring', 'docker', etc."
}
```

---

## ❌ ERROR EXAMPLES

### 404 Not Found
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Endpoint not found. Check the URL and try again.",
  "documentation": "https://github.com/garrystevens/portfolio/api-docs"
}
```

### 500 Server Error (Simulated)
```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Something went wrong on our end. The backend gremlins are being poked with a stick.",
  "error_id": "ERR-20240907-ABC123"
}
```

### 429 Rate Limited (Simulated)
```json
{
  "status": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Take a coffee break!",
  "retry_after": 60
}
```

---

## Preset Request Examples

Users can quickly load these examples to try the API:

1. **Get CV Data**
   - Endpoint: `GET /api/profile/cv`
   - Description: Download structured CV data

2. **Check Skills**
   - Endpoint: `GET /api/skills`
   - Description: See all technical skills

3. **View Experience**
   - Endpoint: `GET /api/experience/timeline`
   - Description: See full career timeline

4. **Send Message**
   - Endpoint: `POST /api/profile/contact`
   - Method: POST
   - Body: Name, email, subject, message

5. **Get a Joke**
   - Endpoint: `GET /api/fun/joke`
   - Description: Need a laugh?

6. **View Stats**
   - Endpoint: `GET /api/stats`
   - Description: See career statistics

7. **Error Scenario (404)**
   - Endpoint: `GET /api/nonexistent`
   - Description: See how errors are handled

8. **Search Test**
   - Endpoint: `GET /api/search?q=java`
   - Description: Try searching for a skill
