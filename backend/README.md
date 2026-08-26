
# Backend API Documentation

## Register User

### Endpoint

`POST /users/register`

Creates a new user account, hashes the password, and returns an authentication token.

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "fullname": {
    "firstname": "Jatin",
    "lastname": "Rathore"
  },
  "email": "jatin@example.com",
  "password": "password123"
}
```

### Required Data

| Field                  | Type   | Required | Validation                       |
| ---------------------- | ------ | -------- | -------------------------------- |
| `fullname.firstname` | String | Yes      | Minimum 3 characters             |
| `fullname.lastname`  | String | No       | Minimum 3 characters if provided |
| `email`              | String | Yes      | Must be a valid email address    |
| `password`           | String | Yes      | Minimum 6 characters             |

### Success Response

#### `201 Created`

```json
{
  "token": "authentication-token",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "Jatin",
      "lastname": "Rathore"
    },
    "email": "jatin@example.com"
  }
}
```

### Error Responses

#### `400 Bad Request`

Returned when the request data fails validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid result",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### `500 Internal Server Error`

Returned when an unexpected server or database error occurs.

### Example cURL Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Jatin",
      "lastname": "Rathore"
    },
    "email": "jatin@example.com",
    "password": "password123"
  }'
```
