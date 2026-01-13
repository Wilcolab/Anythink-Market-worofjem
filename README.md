# GitHub Copilot Workshop

## Enhance a Node Calculator app using GitHub Copilot

<img width="400" alt="Node Calculator image" src="./assets/Node%20calculator%20image.png">

## Overview

This project is a Node.js calculator application that exposes REST APIs to perform arithmetic operations. It includes a web-based UI and a comprehensive test suite using Mocha and Chai.

## Features

- ✅ Basic arithmetic operations (addition, subtraction, multiplication, division)
- ✅ Advanced calculator functions (power, square root, percentage, etc.)
- ✅ Web-based calculator interface
- ✅ RESTful API endpoints
- ✅ Comprehensive test coverage
- ✅ ESLint code quality checks
- ✅ Live reload with Nodemon

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Testing**: Mocha, Chai, Supertest, NYC (code coverage)
- **Code Quality**: ESLint
- **Build Tools**: Gulp

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Wilcolab/Anythink-Market-worofjem.git
cd Anythink-Market-worofjem
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Running Tests

Run the test suite:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

## API Endpoints

### GET /arithmetic

Perform arithmetic operations on two operands.

**Query Parameters:**
- `operation`: The operation to perform (add, subtract, multiply, divide)
- `operand1`: First number
- `operand2`: Second number

**Example:**
```bash
curl "http://localhost:3000/arithmetic?operation=add&operand1=5&operand2=3"
```

**Response:**
```json
{"result": 8}
```

## Project Structure

```
.
├── api/
│   ├── controller.js    # API logic and handlers
│   └── routes.js        # Route definitions
├── public/
│   ├── index.html       # Calculator UI
│   ├── client.js        # Frontend logic
│   └── default.css      # Styles
├── test/
│   ├── arithmetic.test.js  # Test suite
│   ├── helpers.js          # Test helpers
│   └── config.json         # Test configuration
├── server.js            # Express server setup
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Create a pull request to main

## License

MIT

## Acknowledgements

A special thanks to the following awesome Hubbers who have contributed in many different ways to this repository. 
[pierluigi](https://github.com/pierluigi), [parroty](https://github.com/yuichielectric), [yuichielectric](https://github.com/yuichielectric), [dchomh](https://github.com/dchomh), [nolecram](https://github.com/nolecram), [rsymo](https://github.com/rsymo), [damovisa](https://github.com/damovisa) and anyone else I've inadvertently missed.

_v1.0 Released June, 2023_
