# Invoice Generator MCP Server

A custom **Model Context Protocol (MCP)** server that enables ChatGPT to generate, edit, and render professional invoices dynamically.

This project demonstrates how to extend ChatGPT's capabilities by connecting it to a local Node.js application with a rich React UI.

![Invoice Generator Demo](https://via.placeholder.com/800x400?text=Place+Screenshot+Here)

## 🚀 Features

- **Natural Language Control**: Create invoices by simply telling ChatGPT (e.g., "Create an invoice for John Doe for web design services").
- **Real-time UI**: Updates the invoice preview instantly as you chat.
- **Rich Frontend**: Uses a modern React + Tailwind CSS interface for rendering the invoice.
- **Print & PDF**: Built-in button to download or print the final invoice.
- **MCP Integration**: Fully compliant with the Model Context Protocol for seamless AI tool use.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, `@modelcontextprotocol/sdk`
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Validation**: Zod (for type-safe tool inputs)

## 📦 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd invoice-generator
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

*   "Create a new invoice for Acme Corp."
*   "Add an item: 10 hours of Consulting at $150/hr."
*   "Set the due date to next Friday."
*   "Add a note: Thank you for your business!"

## 📝 License

MIT
