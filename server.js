import express from "express";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial State
let invoiceState = {
  number: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'INR',
  sender: {
    name: '',
    address: '',
    email: ''
  },
  client: {
    name: '',
    address: '',
    email: ''
  },
  items: [],
  notes: ''
};

// Helper to push updates to client
const replyWithState = (message) => ({
  content: message ? [{ type: "text", text: message }] : [],
  structuredContent: { invoice: invoiceState },
});

// Create MCP Server
const server = new McpServer({ name: "invoice-generator", version: "1.0.0" });

// Resource: The UI Widget
server.registerResource(
  "invoice-widget",
  "ui://widget/invoice.html",
  {},
  async () => {
    // Read the built HTML file from Vite output
    // We assume the build output is in client/dist/index.html
    const indexPath = path.join(__dirname, "client/dist/index.html");
    const htmlContent = readFileSync(indexPath, "utf8");

    return {
      contents: [
        {
          uri: "ui://widget/invoice.html",
          mimeType: "text/html+skybridge",
          text: htmlContent,
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    };
  }
);

// Tool: Update Metadata (Number, Date, Notes)
server.registerTool(
  "update_metadata",
  {
    title: "Update Invoice Metadata",
    description: "Sets the invoice number, dates, and notes.",
    inputSchema: {
      number: z.string().optional(),
      date: z.string().optional(),
      dueDate: z.string().optional(),
      notes: z.string().optional(),
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/invoice.html",
    },
  },
  async (args) => {
    invoiceState = { ...invoiceState, ...args };
    return replyWithState("Updated invoice metadata.");
  }
);

// Tool: Update Sender Details
server.registerTool(
  "update_sender",
  {
    title: "Update Sender (Freelancer) Details",
    description: "Sets the invoice sender's name, address, and email.",
    inputSchema: {
      name: z.string().optional(),
      address: z.string().optional(),
      email: z.string().email().optional(),
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/invoice.html",
    },
  },
  async (args) => {
    invoiceState.sender = { ...invoiceState.sender, ...args };
    return replyWithState("Updated sender details.");
  }
);

// Tool: Update Client Details
server.registerTool(
  "update_client",
  {
    title: "Update Client Details",
    description: "Sets the client's name, address, and email.",
    inputSchema: {
      name: z.string().optional(),
      address: z.string().optional(),
      email: z.string().email().optional(),
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/invoice.html",
    },
  },
  async (args) => {
    invoiceState.client = { ...invoiceState.client, ...args };
    return replyWithState("Updated client details.");
  }
);

// Tool: Set Line Items
server.registerTool(
  "set_items",
  {
    title: "Set Invoice Items",
    description: "Sets the list of services or products. Completely replaces existing items.",
    inputSchema: {
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        rate: z.number(),
      })),
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/invoice.html",
    },
  },
  async (args) => {
    invoiceState.items = args.items;
    return replyWithState(`Updated invoice with ${args.items.length} items.`);
  }
);

// Express App for HTTP Handling
const app = express();
const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

// Serve Static Files (JS/CSS from Vite build)
// Vite puts assets in client/dist/assets
app.use("/assets", express.static(path.join(__dirname, "client/dist/assets")));

// Main MCP Endpoint
app.all(MCP_PATH, async (req, res) => {
  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (!req.method || !MCP_METHODS.has(req.method)) {
     res.status(405).end("Method Not Allowed");
     return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
  res.setHeader("Access-Control-Allow-Headers", "content-type, mcp-session-id");
  
  if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
  }

  // Create Transport
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, 
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("MCP Error:", error);
    if (!res.headersSent) res.status(500).end("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Invoice MCP Server Running. Connect via ChatGPT.");
});

app.listen(port, () => {
  console.log(`Invoice MCP Server running at http://localhost:${port}${MCP_PATH}`);
});
