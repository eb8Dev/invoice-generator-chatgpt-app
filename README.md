# Invoice Generator MCP Server

A custom **Model Context Protocol (MCP)** server that enables ChatGPT to generate, edit, and render professional invoices dynamically.

This project demonstrates how to extend ChatGPT's capabilities by connecting it to a local Node.js application with a rich React UI.

![Invoice Generator Demo](<images/Screenshot (249).png>)

## 🚀 Features

- **Natural Language Control**: Create invoices by simply telling ChatGPT (e.g., "Create an invoice for Sharma Traders for web design services").
- **Real-time UI**: Updates the invoice preview instantly as you chat.
- **Rich Frontend**: Uses a modern React + Tailwind CSS interface for rendering the invoice.
- **Print & PDF**: Built-in button to download or print the final invoice.
- **MCP Integration**: Fully compliant with the Model Context Protocol for seamless AI tool use.
- **Currency Support**: Defaults to **INR (₹)** for seamless local invoicing.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, `@modelcontextprotocol/sdk`
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Connectivity**: ngrok (for secure tunneling)
- **Validation**: Zod (for type-safe tool inputs)

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/eb8Dev/invoice-generator-chatgpt-app.git
cd invoice-generator-chatgpt-app
```

### 2. Install Server Dependencies
```bash
npm install
```

### 3. Install & Build Client
The server serves the built React files, so you need to build the frontend first.

```bash
cd client
npm install
npm run build
cd ..
```

## 🏃‍♂️ Usage

### 1. Start the Server
```bash
npm start
```
The server will run on `http://localhost:8787` (or the port defined in your environment).

### 2. Expose via ngrok
To let ChatGPT talk to your local server, use ngrok to create a secure tunnel.

```bash
ngrok http 8787
```
Copy the HTTPS URL provided by ngrok (e.g., `https://your-url.ngrok-free.app`).

### 3. Connect to ChatGPT
1. Go to your ChatGPT MCP settings (usually under developer settings or a specific MCP client).
2. Add a new server configuration.
3. Use the ngrok URL as the endpoint.

## 🤖 Example Prompts

Once connected, try these prompts in ChatGPT:

*   "Create a new invoice for **Tech Solutions Pvt Ltd**."
*   "Add an item: 10 hours of Consulting at **₹5,000/hr**."
*   "Set the due date to next Friday."
*   "Add a note: Payment via UPI or Bank Transfer is accepted."

## 📸 Gallery

| Dashboard | Editing |
|---|---|
| ![Screenshot 1](<images/Screenshot (244).png>) | ![Screenshot 2](<images/Screenshot (245).png>) |
| ![Screenshot 3](<images/Screenshot (246).png>) | ![Screenshot 4](<images/Screenshot (247).png>) |

## 📝 License

MIT
