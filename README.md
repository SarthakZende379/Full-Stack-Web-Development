# Sensor Data Management System

A full-stack web application for managing and visualizing sensor data, built progressively from a basic server-side implementation to a complete React-based solution.

## Overview

This project demonstrates the evolution of a web application through multiple stages, showcasing various technologies and architectural patterns. The system manages sensor data through a responsive interface, implementing real-time data categorization and efficient database interactions.

## Project Evolution

### 1. Basic Server Implementation
- Initial server-side program built with JavaScript
- Foundation for handling sensor data processing
- Basic routing and request handling

### 2. Database Integration
- MongoDB integration for persistent data storage
- Implementation of Data Access Object (DAO) pattern
- Efficient asynchronous database operations

### 3. Web Services Layer
- RESTful API implementation
- Endpoint creation for sensor data CRUD operations
- API documentation and testing

### 4. Browser-Based Interface (TypeScript)
- Initial frontend implementation using TypeScript
- Basic data visualization and management interface
- Type-safe client-server interaction

### 5. React Implementation
- Complete migration to React framework
- Responsive user interface design
- Real-time data updates and visualization
- Enhanced user experience with modern UI components

## Technical Stack

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB
- **Architecture**: Microservices
- **Testing**: Mocha, Chai

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: CSS
- **State Management**: React Hooks

### Tools & Infrastructure
- **Version Control**: Git
- **Package Management**: NPM
- **Development Workflow**: SDLC practices

## Key Features

- Real-time sensor data management
- Asynchronous data processing
- Responsive design for multiple device types
- Comprehensive unit testing
- MongoDB-based data persistence
- Microservices architecture for scalability

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/sensor-data-management.git
cd sensor-data-management
```

2. Install dependencies
```bash
npm install
```

3. Set up MongoDB
- Ensure MongoDB is installed and running
- Configure database connection in `.env` file

4. Start the application
```bash
# Start backend server
npm run server

# Start frontend development server
npm run client
```

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure
```
sensor-data-management/
├── client/                 # React frontend
│   ├── src/
│   ├── components/
│   └── tests/
├── server/                 # Backend services
│   ├── dao/               # Data Access Objects
│   ├── routes/            # API endpoints
│   └── models/            # Data models
├── config/                # Configuration files
└── tests/                 # Test suites
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

Contact: szende@binghamton.edu
