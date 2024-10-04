Disclaimer: Security Features Currently Under Development

FlightPal
FlightPal is a web application designed to manage flight information for users. It allows users to register, log in, and manage their flight records, including adding new flights and viewing existing flight information. The application supports multiple users and maintains a record of flights for each user.

Features
User Registration and Authentication: Users can register, log in, and manage their accounts.
Flight Management: Users can add new flights, view their flight information, and manage existing flight records.
Multi-user Support: The application supports assigning flights to multiple users (e.g., crew members).

Technologies Used
Frontend: React, React Router
Backend: ASP.NET Core Web API
Database: Entity Framework Core with SQL Server

Getting Started

Prerequisites
Node.js (for frontend)
.NET SDK (for backend)
SQL Server or another supported database

Installation
Clone the Repository

git clone https://github.com/yourusername/flightpal.git
cd flightpal

Setup Backend

Navigate to the FlightPalApi directory and set up the backend:
cd FlightPalApi
Create a .env file for configuration if needed.

Run database migrations:

dotnet ef migrations add InitialCreate
dotnet ef database update

Start the backend server:
dotnet run

Setup Frontend

Navigate to the FlightPalFrontend directory and set up the frontend:
cd FlightPalFrontend

Install dependencies:
npm install

Start the frontend server:
npm start

The frontend should now be running at http://localhost:3000.

API Endpoints
Users
POST /api/users: Register a new user.
GET /api/users/{id}: Get user details by ID.

Flights
POST /api/flights: Add a new flight.
GET /api/flights: Get all flights.
GET /api/flights/{id}: Get flight details by ID.
PUT /api/flights/{id}: Update flight information.
DELETE /api/flights/{id}: Delete a flight.

Frontend Components
UserHome: The main page where users can view their information, add flights, and log out.
FlightForm: A form for adding new flights.
FlightTable: Displays a table of flights for the user.

Configuration
The backend and frontend can be configured via environment variables and configuration files. Refer to .env.example and appsettings.json for configuration details.

Troubleshooting
Ensure that both frontend and backend servers are running.
Check the console for errors if the application is not working as expected.
Verify database connection strings and migrations.

License
This project is licensed under the MIT License - see the LICENSE file for details.
