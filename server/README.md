### Buggo Database Schema

Below represents the database schema for Buggo. This schema is subject to change as the project evolves.
![ERD](/assets/ERD.png)

### Buggo API Endpoints

Below represents the API endpoints for Buggo. These enpoints are subject to change as the project evolves.

| Endpoint (`/api/`) | Method | Description |
| :--- | :--- | :--- |
| validate | **POST** | Validate a user token |
| signup | **POST** | Create a user |
| signin | **POST** | Authenticate a user |
| users | **GET** | Get all users (authorized) |
| users/:id | **GET** | Get a user by id |
| users | **POST** | Create a user |
| users/:id | **PUT** | Update a user |
| users/:id | **DELETE** | Delete a user |
| projects | **GET** | Get all projects |
| projects/:id | **GET** | Get a project by id |
| projects | **POST** | Create a project |
| projects/:id | **PUT** | Update a project |
| projects/:id | **DELETE** | Delete a project |
| projects/:id/invite | **GET** | Invite to a project |
| projects/:id/accept-invite | **POST** | Accept an invite to a project |
| projects/:id/tickets | **POST** | Create a ticket on a project |
| tickets | **GET** | Get all tickets |
| tickets/:id | **GET** | Get a ticket by id |
| tickets/:id | **PUT** | Update a ticket |
| tickets/:id | **DELETE** | Delete a ticket |
| tickets/:id/comments | **POST** | Create a comment on a ticket |