1️⃣ Chat.jsx — The Main Controller

This is the brain of the application.
It manages the full chat flow, the UI, and handles all communication between components.

Key Responsibilities:

Controls the chat layout and logic.

Keeps track of all messages (both user and AI).

Stores chat history in localStorage so data isn’t lost after refresh.

Handles API calls to the backend (/sec-query) through api.js.

Displays messages using the ChatMessage component.

Shows a scroll-to-bottom arrow button for long responses.

Contains the top navigation bar (App Name + Login/Signup).

How Data Flows:

User types query → ChatInput → Chat.jsx (handleSend)
→ api.js → Backend (/sec-query)
→ Backend returns AI response
→ Chat.jsx adds AI reply
→ ChatMessage displays both messages

2️⃣ ChatInput.jsx — The Message Box

This component is responsible for capturing user input.

What it does:

Lets the user type a question.
When submitted, it calls a function from Chat.jsx (onSend).
After sending, it clears the input box for the next messag

Flow:

User types → ChatInput → calls onSend() in Chat.jsx

3️⃣ ChatMessage.jsx — Message Display

This component is in charge of showing messages — both user and AI responses.

Display Style:

User message → blue bubble on the right side.

AI message → gray box on the left side.

Flow:

Chat.jsx → passes sender & text → ChatMessage → formatted display

4️⃣ api.js — Connecting to the Backend

This file is responsible for sending and receiving data from the backend API.

It uses Axios to handle HTTP requests.

Example:

api.post("/sec-query", { query: text });


This sends the user’s query to the backend and waits for the AI’s response.

Flow:

Chat.jsx → api.js → Backend (Express + Azure OpenAI)

🔁 3. Full Workflow Summary (Step-by-Step)

User types a query into the input box.

ChatInput sends the message to Chat.jsx through onSend().

Chat.jsx adds the user’s message to the screen.

It then calls the backend API using api.js (/sec-query).

The backend processes the query using Azure OpenAI and prepares a structured answer.

The backend response is sent back to the frontend.

Chat.jsx adds this AI-generated response to the chat.

ChatMessage displays the formatted answer neatly.

All messages are saved to localStorage, so they remain even after refreshing the page.

The scroll arrow helps users quickly jump to the latest message — it stays fixed while scrolling long answers and disappears when you reach the end.