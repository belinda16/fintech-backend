# Fintech Backend System

## Overview

This is a backend system for a fintech application that facilitates financial transactions between users. The system is built using Node.js and TypeScript, and it uses PostgreSQL as the relational database. The system supports the following functionalities:

- User registration and authentication with email verification.
- Automatic wallet creation upon user registration.
- Viewing wallet balance.
- Transaction processing with idempotency to prevent duplicate transactions.
- Viewing transaction history.
- Real-time notifications for transactions.

## Project Architecture

The project is structured as follows:


### Controllers

- **authController.ts**: Handles user registration, login, and email verification.
- **transactionController.ts**: Manages transaction processing and retrieving transaction history.

### Models

- **user.ts**: Defines the User entity.
- **wallet.ts**: Defines the Wallet entity associated with each user.
- **transaction.ts**: Defines the Transaction entity to record transactions.

### Services

- **authService.ts**: Contains business logic for authentication and email verification.
- **transactionService.ts**: Contains business logic for processing transactions.

### Utils

- **notifications.ts**: Contains utilities for sending notifications, such as emails.

## Sample Requests

### User Registration

```sh
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}


GET http://localhost:3000/api/auth/verify-email?token=<verification_token>


POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}


POST http://localhost:3000/api/transaction/send
Content-Type: application/json

{
  "recipientId": 2,
  "amount": 100,
  "idempotencyKey": "unique-key-1"
}


GET http://localhost:3000/api/transaction/history
Authorization: Bearer <jwt_token>


GET http://localhost:3000/api/wallet/balance
Authorization: Bearer <jwt_token>

```

## Set up environment variables

Create a .env file in the root directory with the following content:

## Install dependencies
```sh
npm install
```

## Start Docker containers

```sh
docker-compose up --build
```