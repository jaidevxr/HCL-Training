# HCL Training — Full-Stack AWS EC2 Deployment Project

A beginner-friendly, production-ready full-stack task manager app built for learning cloud deployment on AWS EC2.

---

## 📁 Repository Structure

```text
HCL-Training/
├── frontend/             # React single-page application
│   ├── src/
│   │   ├── App.jsx       # Main UI component (state, API calls, JSX)
│   │   └── index.js      # React DOM entry point
│   ├── public/
│   │   └── index.html    # Base HTML template
│   └── package.json
│
├── backend/              # Node.js + Express REST API
│   ├── server.js         # Single clean Express server file
│   ├── .env.example      # Example environment configuration
│   └── package.json
│
├── database/             # Database initialization scripts
│   ├── setup_mysql.sql   # MySQL setup script (creates database and table)
│   └── setup.sql         # PostgreSQL setup script
│
└── README.md
```

---

## 🚀 Running Locally

### 1. Database Setup
- **MySQL:** Run `setup_mysql.sql` in MySQL Workbench or command line:
  ```bash
  mysql -u root -p < database/setup_mysql.sql
  ```
- **PostgreSQL (alternative):**
  ```bash
  psql -U postgres -f database/setup.sql
  ```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env and set your DB credentials
node server.js
```
The backend API runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The React frontend opens at `http://localhost:3000`.

---

## ☁️ Deploying to AWS EC2

### Step 1: Launch an EC2 Instance
- **AMI:** Ubuntu 22.04 LTS (Free Tier eligible)
- **Instance Type:** `t2.micro`
- **Security Group Inbound Rules:**
  - `SSH` (Port 22) — Your IP
  - `HTTP` (Port 80) — Anywhere (`0.0.0.0/0`)
  - `Custom TCP` (Port 5000) — Anywhere (for backend API)
  - `Custom TCP` (Port 3000) — Anywhere (for frontend testing)

### Step 2: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 3: Install Node.js on EC2
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

### Step 4: Clone this Repository on EC2
```bash
git clone https://github.com/jaidevxr/HCL-Training.git
cd HCL-Training
```

### Step 5: Start the Backend with PM2
```bash
cd backend
npm install
sudo npm install -g pm2
pm2 start server.js --name "task-backend"
```

### Step 6: Build and Serve Frontend
```bash
cd ../frontend
npm install
npm run build

# Install Nginx to serve the build
sudo apt install nginx -y
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
```
