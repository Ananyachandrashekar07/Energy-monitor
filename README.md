Energy Usage Monitoring System for Smart Buildings
Project Overview

The Energy Usage Monitoring System for Smart Buildings is a web-based application designed to monitor, analyze, and manage energy consumption in smart buildings. The system helps building administrators track energy usage across different floors, zones, and sensors, enabling efficient energy management and sustainability.

Objectives
Monitor real-time energy consumption.
Track energy usage across buildings, floors, and zones.
Generate energy consumption reports.
Identify areas with excessive energy usage.
Promote energy efficiency and cost reduction.
Features
User Authentication and Authorization
Building Management
Floor Management
Zone Management
Sensor Management
Energy Consumption Tracking
Energy Usage Dashboard
Historical Data Analysis
Report Generation
Feedback Management
Technology Stack
Frontend
HTML
CSS
JavaScript
React.js
Backend
Node.js
Express.js
Database
MariaDB
Tools
Visual Studio Code
Git & GitHub
Postman
System Architecture
User
  ↓
Frontend (React)
  ↓
Backend (Node.js + Express)
  ↓
MariaDB Database
Database Modules
Users

Stores user account information.

Buildings

Stores building details.

Floors

Stores floor information for each building.

Zones

Stores zone information within floors.

Sensors

Stores sensor details and configurations.

Energy Readings

Stores energy consumption data collected from sensors.

Feedback

Stores user feedback and suggestions.

API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login

Building Management
GET /api/buildings
POST /api/buildings
PUT /api/buildings/:id
DELETE /api/buildings/:id

Floor Management
GET /api/floors
POST /api/floors

Zone Management
GET /api/zones
POST /api/zones

Sensor Management
GET /api/sensors
POST /api/sensors

Energy Monitoring
GET /api/energy/readings
POST /api/energy/readings

Project Outcomes
Centralized monitoring of energy consumption.
Improved energy efficiency.
Better decision-making through data analytics.
Reduced operational costs.
Support for sustainable smart building management.

Future Enhancements
IoT-based real-time sensor integration.
AI-powered energy consumption prediction.
Mobile application support.
Automated energy-saving recommendations.
Cloud deployment and monitoring.

Contributors
Ananya
B.E. Computer Science and Engineering

License

This project is developed for educational and academic purposes.
