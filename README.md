Disclaimer: Security Features Currently Under Development

Flight Pal
Flight Pal is a full-stack web application designed to help pilots and crew members manage their flight data, aircraft, and crew information efficiently. It provides an intuitive interface for adding and viewing flights, tracking aircraft requirements, and monitoring flight data in real-time.

Table of Contents
Features
Tech Stack
Installation
Configuration
Usage
API Documentation
Deployment
Future Improvements


Features
User Registration & Authentication: 
  Secure user sign-up and login functionality.
Add Flights: 
  Users can add flight details, including aircraft, duration, start and stop locations, date, and crew member information.
Flight Management:
  View a list of all flights with details in a sortable and filterable table.
  Toggle flight deletion with a confirmation modal for secure deletion.
Crew Management:
  Add, update, and remove crew members associated with each flight.
  Ensure accurate crew details per flight record.
Aircraft Management:
  Add, view, and manage aircraft data, including aircraft types, roles, and logged flight hours.
  Option to add aircraft during registration and within the user dashboard.
User Home Layout Customization: 
  Users can customize the layout and arrangement of cards on their dashboard, and the state is persisted across sessions.
Weather Data Integration:
  View real-time and forecasted weather data for specific locations, including a radar map and a weekly forecast.
  Integrated OpenWeather API for up-to-date information.
Responsive Design: 
  Mobile-friendly and responsive UI built with modern CSS (Flexbox and Grid) for optimal viewing on different devices.

Tech Stack
Frontend: React, Axios for API calls, CSS for styling.
Backend: C# ASP.NET Core, Entity Framework for ORM, MySQL for database management.
APIs: RESTful API built with ASP.NET, integrated with OpenWeather and Google Maps for external services.
Hosting: AWS (EC2 for backend, RDS for database, Amplify for frontend).
Domain: Managed via Squarespace with SSL certificates through AWS.


Installation
Clone the repository:

git clone https://github.com/yourusername/FlightPal.git

Navigate to the frontend:

cd flightpal-frontend

Install dependencies:

npm install

Navigate to the backend:

cd ../flightpalapi

Install backend dependencies:

dotnet restore



Configuration

Frontend
  Update the .env file in the flightpal-frontend folder with the API URL:
  bash

  REACT_APP_API_URL=http://localhost:5092/api

Backend
  Update the appsettings.json file with your database connection string:

  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=your-db;User Id=your-user;Password=your-password;"
  }
  
Add your API keys (OpenWeather, Google Maps) as environment variables on AWS or in a .env file for local testing.

Usage
Run the frontend:

npm start

Run the backend:

dotnet run

Access the app at http://localhost:3000.


API Documentation
Endpoints
User Endpoints

POST /api/users/register: Register a new user.
POST /api/users/login: Authenticate a user.
Flight Endpoints

GET /api/flights/user/{userId}: Fetch all flights for a user.
POST /api/flights: Add a new flight.
DELETE /api/flights/{flightId}: Delete a flight by ID.
Aircraft Endpoints

GET /api/aircraft/user/{userId}: Fetch all aircraft for a user.
POST /api/aircraft: Add a new aircraft.
Weather Endpoints

GET /api/weather/{location}: Fetch current weather data.
GET /api/weather/forecast/{location}: Fetch forecasted weather data.


Deployment
The application is hosted using AWS services:

Frontend: Deployed via AWS Amplify for continuous integration and deployment linked to GitHub.
Backend: Hosted on AWS EC2, with database services managed through AWS RDS.
Domain: Managed with Squarespace, using AWS for SSL certificates.

To deploy updates, zip and upload the backend to AWS Elastic Beanstalk, and push frontend changes to the GitHub repository for AWS Amplify to build and deploy.


Future Improvements

Enhanced Security: Implement token-based authentication (JWT) and improve API security.
Flight Data Analysis: Add visualization features for flight statistics (e.g., hours logged per aircraft, crew member stats).

License
This project is licensed under the MIT License - see the LICENSE file for details.
