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


## Login User

### Endpoint

`POST /users/login`

Authenticates an existing user and returns an authentication token.

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "jatin@example.com",
  "password": "password123"
}
```

### Required Data

| Field        | Type   | Required | Validation                    |
| ------------ | ------ | -------- | ----------------------------- |
| `email`    | String | Yes      | Must be a valid email address |
| `password` | String | Yes      | Minimum 6 characters          |

### Success Response

#### `200 OK`

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

Returned when the email or password fails validation.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "invalid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### `401 Unauthorized`

Returned when the user does not exist or the password is incorrect.

```json
{
  "message": "User not found"
}
```

or

```json
{
  "message": "Invalid password"
}
```

### Example cURL Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jatin@example.com",
    "password": "password123"
  }'
```




## Logout User

### Endpoint

`GET /users/logout`

Logs out the authenticated user, clears the authentication cookie, and blacklists the token.

### Authentication

Provide the token using either:

- `token` cookie
- `Authorization` header:

```http
Authorization: Bearer <authentication-token>
```

### Success Response

#### `200 OK`

```json
{
  "message": "User logged out successfully"
}
```

### Error Responses

#### `400 Bad Request`

Returned when no authentication token is provided.

```json
{
  "message": "No token provided"
}
```

#### `401 Unauthorized`

Returned when the token is missing, invalid, or already blacklisted.

```json
{
  "message": "Access denied. No token provided"
}
```

### Example cURL Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <authentication-token>"
```
