# Kyuka AI

Multi-Agent AI HR Management System

Kyuka AI is an AI-powered HR management platform designed to simplify employee management, leave management, HR policy assistance, workforce analysis, notifications, and HR decision support using multiple specialized AI agents.

## Key Features
- Role-based Admin, HR and Employee portals
- Employee management
- HR management
- Leave management
- AI-powered leave recommendations
- HR Policy Assistant
- Workload Risk Detection
- Burnout Detection
- HR Copilot
- Automated HR Emails
- Smart Reminders
- Notifications
- Company Announcements

## User Roles

### Admin
- View all users
- Create HR users
- Create Employees
- Manage users
- Review employee leave
- Review HR leave
- Approve/reject leave
- View AI recommendations
- View workload risks
- View burnout alerts
- View reports
- Create announcements

### HR
- Manage employees
- Upload HR policies
- Apply for own leave
- View own leave
- Review employee leave
- Approve/reject employee leave
- View AI recommendations
- View workload risks
- View burnout alerts
- Use HR Copilot

### Employee
- Apply for leave
- View own leave
- View leave status
- View policies
- Use AI Policy Assistant
- View notifications
- Manage profile

## AI Agents

### Policy Agent
Retrieves relevant HR policy information for leave requests.

### Recommendation Agent
Analyzes leave requests and provides:
- Recommendation
- Reason
- Confidence score

### Workload Agent
Determine whether approving a leave request could create a workload or staffing risk.

Analyzes:
- Employees on leave
- Department
- Team capacity
- Project deadlines
Returns:
- Safe
- Risk
- High Risk

### Burnout Agent
Identify potential employee burnout risk using available workforce information.

Analyzes factors such as:
- Overtime
- Unused leave
- Weekend work
- Continuous working periods
- Leave history

### Email Agent
Generates professional HR emails.
Examples include:

Leave approved
Leave rejected
Employee added
Policy uploaded
HR reminders
Other HR notifications

The agent generates professional email subjects and message bodies.

### HR Copilot
Processes natural-language HR questions and returns relevant HR information.

Examples of questions:

Show employees with pending approvals.

Who has the highest burnout risk?

Employees without uploaded documents.

Who has taken the most sick leave?

Show employees whose probation ends this month.

### Reminder Agent
Monitors pending HR work such as:
- Pending approvals
- Missing documents
- Probation deadlines
- Contract deadlines
- Notifications

## Leave Workflow
For Employee leave:
`Employee` &rarr; `Leave Request` &rarr; `Policy Agent` &rarr; `Recommendation Agent` &rarr; `Workload Agent` &rarr; `HR Review` &rarr; `Approve / Reject` &rarr; `Notification / Email`

For HR leave:
`HR` &rarr; `Leave Request` &rarr; `Policy Agent` &rarr; `Recommendation Agent` &rarr; `Workload Agent` &rarr; `Admin Review` &rarr; `Approve / Reject` &rarr; `Notification / Email`

## Tech Stack
**Frontend:**
- React
- Vite
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

**AI:**
- Groq API

## Project Structure
```
frontend/
  src/
    components/
    pages/
    services/
backend/
  controllers/
  models/
  routes/
  services/
    agents/
  middleware/
```

## Installation

### Clone
```bash
git clone <repository-url>
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory, and provide the required values:

| Variable | Purpose |
|----------|---------|
| `PORT` | The port the backend server runs on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `GROQ_API_KEY` | Groq API Key for AI Agents |
| `ADMIN_EMAIL` | Initial admin configuration |
| `ADMIN_PASSWORD` | Initial admin configuration |

**Security:** Never commit the `.env` file or expose API keys, database credentials, JWT secrets, or passwords in the repository.

### Run Backend
```bash
cd backend
npm run dev
```

### Run Frontend
```bash
cd frontend
npm run dev
```

### Try the Live Demo

A dedicated Demo Admin account is available for recruiters and visitors who want to try Kyuka AI.

Demo Admin Login
# ADMIN_EMAIL= hr.admin@kyukaai.com
# ADMIN_PASSWORD= HrAdmin@123

Note: The Demo Admin account is connected to the database used by the deployed demo application. Data created or modified while testing the demo may affect the demo application's data.

### Demo Data Notice

The public demo uses the database configured for the deployed application.

This is a shared demonstration environment, not a private production environment.

Please do not enter:

Real employee information
Personal information
Confidential HR information
Real company data
Sensitive documents
Private credentials

Demo data may be modified or removed as the application is tested and maintained.

### Creating HR and Employee Accounts

The Demo Admin can create HR and Employee accounts from the existing user-management interface.

When an account is created, a temporary password is generated and provided to the Admin so the new user can sign in.

The new user can then use the provided credentials to access the appropriate HR or Employee interface.

### Want to Use HRFlow AI for Your Own Company?

The public Demo Admin credentials are intended only for trying the deployed HRFlow AI demonstration.

For actual company use, do not use the public Demo Admin credentials.

Instead, deploy your own instance and configure your own database and Admin credentials.

You should create your own:

MongoDB database
Groq API key
JWT secret
Admin email
Admin password
Environment variables

Note - Admin email,Admin password are one time only .Changing ADMIN_EMAIL or ADMIN_PASSWORD in .env second time will not create another Admin.

## Architecture
`React Frontend` &rarr; `Axios` &rarr; `Express API` &rarr; `JWT Authentication / Role Authorization` &rarr; `MongoDB` &rarr; `AI Agent Services` &rarr; `Groq API`
                  
## System Architecture   

                    HRFlow AI
                        │
                        ↓
                React + Vite Frontend
                        │
                      Axios
                        │
                        ↓
                Node + Express API
                        │
             ┌──────────┴──────────┐
             │                     │
             ↓                     ↓
       Authentication         AI Services
       & Authorization              │
             │                      ↓
             ↓                  Groq API
       MongoDB / Mongoose
             │
             ↓
       HRFlow AI Data
       
## AI Processing Architecture

                 Leave Request
                       │
                       ↓
                 Policy Agent
                       │
                       ↓
            Relevant HR Policy
                       │
                       ↓
            Recommendation Agent
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
       Recommendation       Confidence Score
             │
             ↓
           Workload Agent
             │
             ↓
       Workload Risk
             │
             ↓
       HR / Admin Review
             │
        ┌────┴────┐
        ↓         ↓
     Approve    Reject
        │         │
        └────┬────┘
             ↓
       Email / Notification
## Security
- JWT authentication
- Role-based authorization
- Password hashing using bcrypt
- Environment variables for secrets
- MongoDB access protection

## Deployment
- **Live Demo**: [Add deployed URL]
- **GitHub**: [Add repository URL]

## Future Improvements
- More advanced HR analytics
- Additional AI agents
- Better document processing
- Advanced reporting
- Calendar integration
- More granular permissions

## Screenshots

### Landing Page

![Kyuka AI Landing Page](screenshots/landing.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### HR Dashboard

![HR Dashboard](screenshots/hr-dashboard.png)

### Employee Dashboard

![Employee Dashboard](screenshots/employee-dashboard.png)

### AI Assistant

![AI Assistant](screenshots/ai-assistant.png)

### Leave Management

![Leave Management](screenshots/leave-management.png)

## License

This project is developed for educational and portfolio purposes.