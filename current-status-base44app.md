Here's a complete overview of your app's current functionalities:
🔐 Authentication

    Login — Email/password + Google OAuth
    Register — Email/password with OTP verification flow
    Forgot/Reset Password — Email-based reset flow
    Protected Routes — Auth-gated pages

💬 Chat (Main Page)

    AI Agent Conversation — Talk to vink_agent (your CRM assistant)
    Audio Transcription — Voice-to-text via MediaRecorder + Whisper
    Quick Actions — Shortcuts for common CRM tasks
    Real-time Messaging — Live message sync via subscriptions
    Onboarding Modal — 5-step flow: Welcome → CRM → WhatsApp → Slack → Done
    Typing Indicator — Visual feedback while AI processes

📜 History

    Conversation History — Browse past conversations

⚙️ Settings (5 Tabs)
Integrations Tab

    CRM Connect — HubSpot, Pipedrive, Close, Salesforce, Zoho, Freshsales, Copper, Monday, Custom
    WhatsApp Connect — One-click WhatsApp linking
    Slack Connect — Slack integration (currently "Coming Soon")

Team Tab

    Workspace Creation — Admins create an Organization
    Shared CRM — Connect CRM once for the whole team
    Invite Members — Via invite link or email
    Member List — View team members with roles (admin/member)
    Inherited CRM — Members automatically see the org's CRM connection

Billing Tab

    Billing Section — Payment/billing management

Tasks Tab

    Reminders — View, track, and cancel pending reminders
    Channels — In-app, WhatsApp, or both

Account Tab

    Profile — User info
    Sign Out — Logout

🎓 AI Training (Admin Only)

    Action Logs — Monitor all CRM actions taken by the agent
    Review Responses — Rate AI responses (good/needs improvement/bad)
    Guidelines Manager — Create, edit, toggle, and delete training rules

👥 Users (Admin Only)

    User Management — View and manage app users
    User Inboxes — View individual user conversations
    Admin Feedback — Review user feedback

🤖 AI Agent (vink_agent / crmind_agent)

    CRM Operations — Create/update contacts, leads, deals, tasks, activities
    Multi-CRM Support — Works across HubSpot, Salesforce, Pipedrive, etc.
    Memory — Remembers user preferences and history
    Training Guidelines — Follows admin-set behavioral rules
    Action Logging — Records every CRM action taken
    Reminders — Schedules and sends reminders

🔌 Backend Functions

    closeCrmAction — Executes CRM API calls (GET/POST/PUT/DELETE)
    processReminders — Scheduled task that sends due reminders
    whatsappWebhook — Handles incoming WhatsApp messages

📊 Entities (Data Model)

    User — Built-in (id, email, full_name, role)
    UserSettings — Personal CRM/WhatsApp/Slack config
    Organization — Team workspace with shared CRM
    OrganizationMember — Team membership (admin/member)
    Conversation — Chat history metadata
    Reminder — Scheduled reminders
    ActionLog — Audit trail of CRM actions
    TrainingGuideline — AI behavioral rules
    TrainingExample — Rated AI responses for training

📱 Channels

    In-App Chat — Web interface
    WhatsApp — Chat via WhatsApp
    Slack — Chat via Slack (coming soon)

🎨 UI/Design

    Dark Theme — Custom dark color palette
    Mobile Responsive — Sidebar collapses on mobile with overlay
    Real-time Updates — Live data sync
