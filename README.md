# Smart Excalidraw

AI-powered diagram generation using Excalidraw and Large Language Models.

## Features

- 🤖 **AI-Powered Generation**: Use OpenAI or Anthropic models to generate diagrams from natural language descriptions
- 🎨 **Interactive Canvas**: Full Excalidraw integration for viewing and editing generated diagrams
- 💬 **Chat Interface**: Conversational interface for iterative diagram creation
- 📝 **Code Editor**: Monaco-based editor to view and modify generated Excalidraw code
- ⚙️ **Flexible Configuration**: Support for multiple LLM providers (OpenAI, Anthropic)
- 💾 **Local Storage**: Configurations persist in your browser

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- An API key from OpenAI or Anthropic

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd smart-excalidraw-next
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. Click the **"Configure LLM"** button in the top-right corner
2. Fill in the configuration form:
   - **Provider Name**: A friendly name for your configuration
   - **Provider Type**: Choose between OpenAI or Anthropic
   - **Base URL**: API endpoint (e.g., `https://api.openai.com/v1` or `https://api.anthropic.com/v1`)
   - **API Key**: Your API key
3. Click **"Load Available Models"** to fetch available models
4. Select a model from the dropdown
5. Click **"Save Configuration"**

## Usage

### Creating Diagrams

1. **Enter a Description**: Type your diagram request in the chat input
   - Example: "Create a flowchart for user authentication"
   - Example: "Draw a mind map about machine learning concepts"
   - Example: "Generate an architecture diagram for a microservices system"

2. **View Generated Code**: The AI will generate Excalidraw code displayed in the code editor

3. **See the Diagram**: The diagram automatically renders on the canvas

4. **Edit if Needed**: 
   - Modify the code in the editor
   - Click "Apply to Canvas" to update the diagram
   - Or continue the conversation to refine the diagram

### Layout

- **Left Panel (Top)**: Chat interface for conversation with AI
- **Left Panel (Bottom)**: Code editor showing generated Excalidraw code
- **Right Panel**: Excalidraw canvas displaying the diagram
- **Resizable**: Drag the divider between chat and code editor to adjust sizes

## Diagram Types Supported

- **Flowcharts**: Process flows and decision trees
- **Mind Maps**: Hierarchical concept relationships
- **Architecture Diagrams**: System components and connections
- **Concept Maps**: Knowledge structures with labeled relationships
- **Timelines**: Sequential events and milestones
- **Network Diagrams**: Node and edge relationships

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS
- **Diagram Engine**: @excalidraw/excalidraw
- **Code Editor**: @monaco-editor/react
- **LLM Integration**: OpenAI & Anthropic APIs

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate/      # Code generation API endpoint
│   │   └── models/        # Model listing API endpoint
│   ├── page.js            # Main application page
│   └── layout.js          # Root layout
├── components/
│   ├── Chat.jsx           # Chat interface component
│   ├── CodeEditor.jsx     # Monaco code editor component
│   ├── ConfigModal.jsx    # LLM configuration modal
│   └── ExcalidrawCanvas.jsx # Excalidraw canvas wrapper
├── lib/
│   ├── config.js          # Configuration management
│   ├── llm-client.js      # LLM API client
│   └── prompts.js         # System prompts
└── docs/
    ├── excalidraw-doc.md  # Excalidraw API documentation
    └── requirement.md     # Project requirements
```

## API Endpoints

### POST /api/generate
Generate Excalidraw code from user input.

**Request Body:**
```json
{
  "config": {
    "type": "openai",
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": "sk-...",
    "model": "gpt-4"
  },
  "messages": [],
  "userInput": "Create a flowchart..."
}
```

**Response:** Server-Sent Events (SSE) stream with generated code

### GET /api/models
Fetch available models from the configured provider.

**Query Parameters:**
- `type`: Provider type (openai/anthropic)
- `baseUrl`: API base URL
- `apiKey`: API key

**Response:**
```json
{
  "models": [
    { "id": "gpt-4", "name": "gpt-4" }
  ]
}
```

## Development

### Build for Production

```bash
pnpm build
```

### Run Production Build

```bash
pnpm start
```

### Lint

```bash
pnpm lint
```

## Notes

- All configuration is stored in browser localStorage
- No data is sent to any server except the configured LLM provider
- The application requires a valid LLM API key to function
- Streaming responses provide real-time feedback during generation

## Troubleshooting

### "Please configure your LLM provider first"
- Click "Configure LLM" and enter your API credentials

### "Failed to generate code"
- Check your API key is valid
- Verify the base URL is correct
- Ensure you have API credits available

### Diagram not rendering
- Check the generated code in the editor for syntax errors
- Try clicking "Apply to Canvas" manually
- Look for errors in the browser console

## License

MIT
