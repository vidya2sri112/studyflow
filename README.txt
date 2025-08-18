✅ STEP-BY-STEP COMMANDS FOR LOCAL DEPLOYMENT (Windows)

📦 1. Install Prerequisites (manual download – skip if already done)

Download & Install Node.js (LTS)

Download & Install MongoDB Community Server

Download & Install Git (optional)

⚙️ 2. Start MongoDB Service

net start MongoDB

⚠️ If you get: System error 5 has occurred. Access is denied.,Right-click Command Prompt → Run as Administrator, then retry.

📁 3. Navigate to Your Project Folder

cd path\to\study-planner-app

For example, if it's on Desktop:

cd C:\Users\YourName\Desktop\study-planner-app

🛠️ 4. Install Backend Dependencies

npm install

🖼️ 5. Install Frontend Dependencies

cd client
npm install
cd ..

🧾 6. Create the .env File for Backend

cd server
notepad .env

Paste the following in the file:

MONGODB_URI=mongodb://localhost:27017/studyplanner
JWT_SECRET=this_is_your_secret_key
PORT=5000

Save and close, then go back:

cd ..

🔄 7. Run Backend Server

If you're using nodemon, run:

npm run dev

Or if not using nodemon:

node server/server.js

Leave this terminal running!

🚀 8. Run Frontend Server in a New Terminal

Open another Command Prompt window:

cd path\to\study-planner-app\client
npm start

This will open your React app at:👉 http://localhost:3000

✅ Optional: One-Command Setup with concurrently

📥 Install concurrently

npm install concurrently --save-dev

📝 Add Script in Root package.json

In study-planner-app/package.json, add this:

"scripts": {
  "dev": "nodemon server/server.js",
  "dev-all": "concurrently \"npm run dev\" \"cd client && npm start\""
}

▶️ Run Both Servers Together:

npm run dev-all

🧠 DONE! App Running Locally

Part

URL

Frontend

http://localhost:3000

Backend

http://localhost:5000/api

MongoDB

mongodb://localhost:27017

If anything goes wrong, feel free to paste the error — I’ll help you fix it.Would you also like deployment instructions to host this online (free)?