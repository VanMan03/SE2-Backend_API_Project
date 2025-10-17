# SE2-Backend_API_Project
A Library Management API - an API for managing library systems to handle Books, Members, and Loans.

Base URL: https://se2-backend-api-project.onrender.com

| Method | Endpoint                | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | /api/books             | Retrieve a list of all books             |
| GET    | /api/books/:id         | Retrieve details of a specific book      |
| POST   | /api/books             | Add a new book                            |
| PUT    | /api/books/:id         | Update an existing book by ID            |
| DELETE | /api/books/:id         | Delete a book by ID                       |
| GET    | /api/members           | Retrieve a list of all members           |
| GET    | /api/members/:id       | Retrieve details of a specific member    |
| POST   | /api/members           | Add a new member                          |
| PUT    | /api/members/:id       | Update an existing member by ID          |
| DELETE | /api/members/:id       | Delete a member by ID                     |
| GET    | /api/loans             | Retrieve a list of all loans             |
| GET    | /api/loans/:id         | Retrieve details of a specific loan      |
| POST   | /api/loans             | Create a new loan                         |
| PUT    | /api/loans/:id         | Update an existing loan by ID            |
| DELETE | /api/loans/:id         | Delete a loan by ID                       |

Sample Request: 
POST /api/rooms
Content-Type: application/json

{
  "number": 101,
  "type": "Single",
  "price": 1500,
  "status": "available"
}

Group 2 - Library Management CRUD
Name: Ivan Teofilo N. Regalario
Course/Block/Year: BSCS 4-1
