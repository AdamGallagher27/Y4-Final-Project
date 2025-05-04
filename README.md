# 🧱 Decentralized CMS

This project focuses on designing and implementing a **Decentralized Content Management System (DCMS)** that combines decentralized storage with traditional content management features. Unlike conventional CMS platforms that rely on centralized servers, this DCMS leverages peer-to-peer technology to eliminate single points of failure, enhance security, and increase system resilience. By abstracting the complexities of decentralized architecture, it aims to simplify the development of decentralized applications—empowering developers to build secure, scalable solutions without requiring deep expertise in blockchain or distributed systems.

---

## 🚀 Project Setup

Follow the steps below to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/decentralized-cms.git
cd decentralized-cms
```

### 2. 📦 Install Packages

Before running the project, install the dependencies you’ll need to use the `--force` flag:
⚠️ Note: There are some peer dependency warnings during installation. These do not break the project or affect functionality. The --force flag is used to bypass them safely.

### 3. 🗂️ Check and Delete auth.json (If It Exists)
For first-time setup, you may need to check if an auth.json file exists in the public directory. If it does, please delete it to ensure the project is correctly initialized.

```bash
# Navigate to the public directory and check for the auth.json file
cd public

# If the auth.json file exists, delete it
rm -f auth.json
```
Note: This step is necessary to ensure a clean setup during your first run. If the auth.json file doesn't exist, you can safely proceed without any changes.

### 6. 🚀 Run Development Server & Authenticate with MetaMask
After completing the setup, run the development server:

```bash
npm run dev
```
Visit http://localhost:3000 in your browser.
When you open the application, you'll be prompted to authenticate with MetaMask. Follow the on-screen instructions to complete the authentication process. This will generate the .env file containing the RSA keys and API keys required for your application.
