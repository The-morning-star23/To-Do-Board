Collaborative Kanban Board – Real-Time Task Management App
🚀 Project Overview
This is a full-stack collaborative Kanban board app that enables users to manage tasks in real time with features like drag-and-drop columns, Smart Assign, conflict detection, and a live activity log. Built with a modern tech stack, it supports team collaboration and dynamic updates via WebSockets.

Try it live 👉 https://to-do-board-navy.vercel.app/login
🎥 Watch the video 👉 https://drive.google.com/file/d/1oVoLs-cDGVntf8zv9LEt-RX2ttgNyH9E/view?usp=sharing

🛠 Tech Stack
Frontend:
React (with Hooks)

React DnD for drag-and-drop

Socket.IO Client for real-time sync

Axios for API requests

CSS Modules (custom styles, no frameworks)

Backend:
Node.js + Express.js

MongoDB with Mongoose

JWT Authentication

Socket.IO Server

REST API

⚙️ Setup & Installation

1. Clone the repository

git clone https://github.com/The-morning-star23/To-Do-Board.git
cd collab-todo-board

2. Environment Variables

🔐 Backend .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

🌍 Frontend .env
Create a .env file in the frontend folder:
REACT_APP_API_URL=http://localhost:5000

3. Install and Run Backend

cd backend
npm install
npm run dev

4. Install and Run Frontend

cd frontend
npm install
npm start

✅ Features & Usage Guide

Feature	Description
📝 User Auth	Secure login/register using JWT
🧩 Kanban Board	Tasks organized under Todo, In Progress, Done
🧲 Drag-and-Drop	Move tasks across columns interactively
⚡ Real-Time Sync	All task changes synced instantly via WebSockets
🧠 Smart Assign	Auto-assigns tasks to the user with the fewest active tasks
⚔️ Conflict Detection	Prevents overwrites if two users edit the same task simultaneously
🗃️ Activity Log	Live feed of user actions (create, update, delete, assign)
🧹 Clear Logs	Admin can clear the action log panel

💡 Smart Assign – Explained
Smart Assign balances workload across team members automatically.

It finds all registered users.

Counts how many tasks each user has in “Todo” or “In Progress”.

Chooses the user with the lowest task count.

Assigns the task and logs the action with a real-time update.

This prevents bottlenecks and ensures fair distribution of work.

🔄 Conflict Handling – Explained
To prevent two users from unintentionally overwriting each other’s changes:

Each task has an updatedAt timestamp.

When a user opens the task editor, the current timestamp is saved.

Upon saving, the backend compares the client’s timestamp with the latest one in DB.

If they mismatch → a 409 Conflict is returned.

The frontend then lets the user:

View both versions

Merge changes

Overwrite or cancel

This ensures safer collaboration and data integrity.

👏 Highlight
My favorite and most challenging feature was Conflict Resolution. Designing it to detect mismatches and offering merge/overwrite UI options added a real-world collaboration experience to the app, similar to how tools like Notion or Trello handle concurrent edits.