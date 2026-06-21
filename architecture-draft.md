# Vink AI Assistant – Architecture Draft (Phase 1)

## Goal

Build a minimal AI-powered CRM assistant that can:

* Accept natural language from the user.
* Understand the user's intent.
* Decide which tool should be executed.
* Execute the appropriate CRM API.
* Return a natural language response.

The focus of this phase is understanding the complete AI tool-calling loop rather than building authentication, databases, or production infrastructure.

---

# High-Level Architecture

```text
                React Client
                     │
                     ▼
             POST /chat (Node.js)
                     │
                     ▼
         Conversation Manager
                     │
                     ▼
                  OpenAI
        (Intent + Tool Selection)
                     │
                     ▼
              Tool Router
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   HubSpot Adapter        Future Adapters
                            Salesforce
                            Pipedrive
                            Email
                            Calendar
                     │
                     ▼
                CRM API
                     │
                     ▼
            Structured Tool Result
                     │
                     ▼
                  OpenAI
      (Generate Final Response)
                     │
                     ▼
               React Client
```

---

# Core Components

## 1. React Client

Responsibilities:

* Display chat interface
* Send messages
* Display assistant responses

The frontend should remain simple and contain no CRM logic.

---

## 2. Conversation Manager

Responsibilities:

* Store conversation history
* Add system prompts
* Send messages to the LLM
* Execute requested tools
* Send tool results back to the LLM
* Return the final response

This is the orchestrator of the entire system.

---

## 3. AI Layer

Responsibilities:

* Understand user intent
* Decide which tool to execute
* Extract tool arguments

Example:

User:

> Show me my pipeline deals

LLM Output:

```json
{
  "tool": "get_deals",
  "arguments": {
    "stage": "pipeline"
  }
}
```

The LLM should never know API URLs or authentication details.

---

## 4. Tool Router

Responsibilities:

* Receive tool requests
* Validate arguments
* Execute the correct tool

Example:

```
get_deals
    ↓
HubSpotAdapter.getDeals()

get_contacts
    ↓
HubSpotAdapter.getContacts()
```

---

## 5. CRM Adapter Layer

Purpose:

Hide CRM-specific implementation details from the rest of the application.

Example interface:

```
CRMAdapter

getDeals()

getContacts()

createDeal()

updateDeal()
```

Implementations:

```
HubSpotAdapter

SalesforceAdapter

PipedriveAdapter
```

The AI and router should only depend on the interface, not on individual CRM implementations.

---

## 6. HubSpot Adapter

Responsibilities:

* Authenticate requests
* Call HubSpot APIs
* Handle pagination
* Normalize data
* Return consistent objects

Example:

Instead of returning HubSpot's raw payload:

```json
{
    ...
}
```

Return:

```json
{
    "id": "...",
    "name": "...",
    "amount": 5000,
    "stage": "pipeline"
}
```

The rest of the system should never depend on HubSpot's raw schema.

---

# Conversation Flow

## Step 1

User sends:

> Show me my deals

---

## Step 2

Conversation Manager sends conversation history to OpenAI.

---

## Step 3

OpenAI selects a tool.

Example:

```
Tool:
get_deals()
```

---

## Step 4

Tool Router executes:

```
HubSpotAdapter.getDeals()
```

---

## Step 5

HubSpot returns structured data.

---

## Step 6

Conversation Manager sends the tool result back to OpenAI.

Example:

```
Tool Result:

Nike
$25,000

Apple
$90,000
```

---

## Step 7

OpenAI generates the final response.

Example:

> You currently have two active pipeline deals:
>
> • Nike — $25,000
> • Apple — $90,000

---

# Conversation Memory

For Phase 1, keep memory in RAM.

Example:

```
[
  System,
  User,
  Assistant,
  User,
  Assistant
]
```

This enables follow-up questions such as:

> Which one is the largest?

without additional backend logic if the required information is already in the conversation.

---

# Current Folder Structure

```
backend/

  ai/
      intent.js

  conversation/
      conversationManager.js

  router/
      toolRouter.js

  tools/
      crmTools.js

  crm/
      hubspot.js

  server.js
```

---

# Future Folder Structure

```
backend/

  ai/

  conversation/

  router/

  adapters/

      hubspot/

      salesforce/

      pipedrive/

  tools/

  memory/

  auth/

  prompts/

  services/

  server.js
```

---

# Development Roadmap

## Phase 1

* Chat endpoint
* Intent extraction
* Tool routing
* HubSpot integration
* Final AI response

---

## Phase 2

* Multiple tool calls
* Conversation memory
* Better prompts
* Error handling

---

## Phase 3

* OAuth
* Multiple users
* Database
* Persistent conversation history

---

## Phase 4

* Multiple CRM providers
* Email tools
* Calendar tools
* Task management
* Slack integration

---

## Phase 5

* Agent planning
* Parallel tool execution
* Background jobs
* Long-term memory
* Marketplace integrations

---

# Design Principles

1. The LLM decides **what** should happen.
2. The backend decides **how** it happens.
3. Adapters isolate third-party APIs.
4. The Conversation Manager orchestrates the workflow.
5. Tools expose business capabilities, not HTTP endpoints.
6. CRM-specific details remain hidden behind adapter interfaces.
7. New tools should be added without changing the core orchestration flow.
