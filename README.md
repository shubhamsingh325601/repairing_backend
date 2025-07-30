# Home Appliance Repairing App Backend

This is the backend API for a Home Appliance Repairing App, built with Node.js, Express, and MongoDB.

## Features
- User and Agent registration/login
- Agent profile management (skills, availability, etc.)
- Service catalog (CRUD for repairable appliances/services)
- Customer can submit repair requests to selected agents
- Agents receive notifications for new requests (via FCM)
- Agents can accept/reject requests; customers are notified
- Booking status tracking (pending, accepted, rejected, in-progress, completed, cancelled)
- Feedback and rating system for completed jobs
- Razorpay UPI payment integration
- Commenting system for all resources
- Admin endpoints for management

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Set up MongoDB connection in your config
   - Add your Razorpay and Firebase credentials in `src/config/`
4. **Run the server:**
   ```bash
   npm start
   ```

## API Overview

### Authentication
- `/api/Auth/register` - Register user/agent
- `/api/Auth/login` - Login

### Agents
- `/api/Agent/agents` - List all agents
- `/api/Agent/agent?id=...` - Get agent profile
- `/api/Agent/update-profile` - Update agent profile

### Services
- `/api/Service` - List, create, update, delete services

### Bookings
- `POST /api/Booking` - Create a booking (customer)
- `GET /api/Booking/customer` - Customer's bookings
- `GET /api/Booking/agent` - Agent's bookings
- `PATCH /api/Booking/:bookingId/status` - Agent updates booking status

### Payments
- `POST /api/Payment/upi` - Initiate UPI payment (Razorpay)

### Comments
- `/api/Comment` - CRUD for comments on any resource

### Feedback
- Included in booking feedback field (rating, comment)

### Notifications
- Push notifications via Firebase (FCM)

## Contribution
Pull requests are welcome!

## License
MIT 