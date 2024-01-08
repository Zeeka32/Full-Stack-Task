# Task Timer

This is a task timer application built with React and TypeScript on the frontend, and Nest and MongoDB on the backend. It allows users to create tasks, set them as active, and track the time spent on each task.

## Features

- User authentication
- Create tasks
- Set a task as active
- Track time spent on active task

## Tech Stack

- Frontend: React, TypeScript
- Backend: Nest, MongoDB

## Installation

To install and run the project, follow these steps:

1. Clone the repository: `git clone https://github.com/username/repository.git`
2. Navigate to the project directory: `cd repository`
3. Start the application with Docker Compose: `docker-compose up`

## Usage

After starting the server, open `http://localhost:3001` in your browser. You can create an account, log in, create tasks, and start tracking your time.


## API Endpoints

The backend server provides the following endpoints:

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Log in a user
- `GET /tasks/all`: Get all tasks for the logged in user
- `POST /tasks/create`: Create a new task
- `POST /tasks/update`: Update an existing task
- `POST /tasks/delete`: Delete a task
- `POST /tasks/search`: Search for tasks by title
- `GET time/:id`: Get the time spent on a task
