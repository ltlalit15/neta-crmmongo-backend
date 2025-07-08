# Comments API Documentation

## Overview
The Comments API allows users to create, read, update, and delete comments on daily logs. All endpoints require authentication and admin privileges.

## Base URL
```
http://localhost:3000/api/comments
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Comment
**POST** `/api/comments`

**Request Body:**
```json
{
  "dailylog_id": "64f1234567890abcdef12345",
  "comment": "This is a comment on the daily log"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "_id": "64f1234567890abcdef12346",
    "user_id": {
      "_id": "64f1234567890abcdef12347",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dailylog_id": "64f1234567890abcdef12345",
    "comment": "This is a comment on the daily log",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Comments
**GET** `/api/comments`

**Response:**
```json
{
  "success": true,
  "message": "Comments fetched successfully",
  "data": [
    {
      "_id": "64f1234567890abcdef12346",
      "user_id": {
        "_id": "64f1234567890abcdef12347",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "dailylog_id": {
        "_id": "64f1234567890abcdef12345",
        "title": "Daily Log Title",
        "description": "Daily log description"
      },
      "comment": "This is a comment",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Comment by ID
**GET** `/api/comments/:id`

**Response:**
```json
{
  "success": true,
  "message": "Comment fetched successfully",
  "data": {
    "_id": "64f1234567890abcdef12346",
    "user_id": {
      "_id": "64f1234567890abcdef12347",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dailylog_id": {
      "_id": "64f1234567890abcdef12345",
      "title": "Daily Log Title",
      "description": "Daily log description"
    },
    "comment": "This is a comment",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Get Comments by Daily Log ID
**GET** `/api/comments/dailylog/:dailylog_id`

**Response:**
```json
{
  "success": true,
  "message": "Comments with daily log fetched successfully",
  "data": {
    "daily_log": {
      "dailylog_id": "64f1234567890abcdef12345",
      "title": "Daily Log Title",
      "description": "Daily log description",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "comments": [
      {
        "_id": "64f1234567890abcdef12346",
        "user_id": {
          "_id": "64f1234567890abcdef12347",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "comment": "This is a comment",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 5. Update Comment
**PUT** `/api/comments/:id`

**Request Body:**
```json
{
  "comment": "Updated comment text"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "_id": "64f1234567890abcdef12346",
    "user_id": {
      "_id": "64f1234567890abcdef12347",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dailylog_id": "64f1234567890abcdef12345",
    "comment": "Updated comment text",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### 6. Delete Comment
**DELETE** `/api/comments/:id`

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Daily log ID and comment are required."
}
```

### 401 Unauthorized
```json
{
  "error": "Not Authorization!"
}
```

### 403 Forbidden
```json
{
  "error": "Not Allowed"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Comment not found"
}
```

## Features Implemented

✅ **Authentication & Authorization**: All routes require admin authentication
✅ **CRUD Operations**: Create, Read, Update, Delete comments
✅ **Data Validation**: Validates required fields and existing daily logs
✅ **User Data Population**: Comments include user information (firstName, lastName, email)
✅ **Daily Log Integration**: Comments are linked to daily logs
✅ **Authorization Checks**: Users can only edit/delete their own comments (admins can edit all)
✅ **Error Handling**: Comprehensive error responses
✅ **Timestamps**: Automatic creation and update timestamps

## Security Features

- JWT token authentication required
- Admin role verification
- User ownership validation for updates/deletes
- Input validation and sanitization
- Proper error handling without exposing sensitive data 