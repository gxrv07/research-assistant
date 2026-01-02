# Research Assistant Project

## Overview

The Research Assistant project consists of a Chrome extension and a backend service. Together, they allow users to select text on a webpage, summarize it using AI, and save notes locally. This project is designed for local use and learning purposes.

## Features

### Chrome Extension

- **Text Summarization**: Select text on a webpage and click the "Summarize" button to generate an AI-powered summary.
- **Save Notes**: Save summarized notes in the browser's local storage for easy access.
- **User-Friendly Interface**: Simple and intuitive design for seamless interaction.

### Backend Service

- **AI Summarization**: Processes text summarization requests using AI.
- **REST API**: Provides endpoints for communication with the Chrome extension.

## Prerequisites

### Chrome Extension

- Google Chrome browser

### Backend Service

- **Java 21 or higher**
- **Maven**
- **Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/))

## Installation and Usage

### Chrome Extension

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/research-assistant.git
   ```
2. Navigate to the `research-assistant-ext` directory.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable "Developer mode" in the top-right corner.
5. Click "Load unpacked" and select the `research-assistant-ext` folder.
6. Navigate to any webpage, select text, and use the extension to summarize and save notes.

### Backend Service

1. Navigate to the `research-assistant-backend` directory:
   ```bash
   cd research-assistant-backend
   ```
2. Set up environment variables:

   ```bash
   export GEMINI_API_KEY=your_gemini_api_key_here
   export GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=
   ```

   > To get a free Gemini API key, visit [Google AI Studio](https://aistudio.google.com/) and create a new API key.

3. Build the project using Maven:
   ```bash
   ./mvnw clean install
   ```
4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
5. The backend will start on `http://localhost:8080`.

## File Structure

```
research-assistant/
├── research-assistant-ext/                  # Chrome extension source code
│   ├── background.js                        # Background script for handling extension events
│   ├── manifest.json                        # Chrome extension manifest file
│   ├── sidepanel.css                        # Styles for the side panel UI
│   ├── sidepanel.html                       # HTML structure for the side panel
│   ├── sidepanel.js                         # JavaScript for side panel functionality
├── research-assistant-backend/              # Backend service source code
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/gxrv/research_assistant_backend/
│   │   │   │   ├── GeminiResponse.java      # Model for AI responses
│   │   │   │   ├── ResearchAssistantBackendApplication.java # Main application class
│   │   │   │   ├── ResearchController.java  # REST controller for handling requests
│   │   │   │   ├── ResearchRequest.java     # Model for incoming requests
│   │   │   │   ├── ResearchService.java     # Service layer for AI integration
│   │   └── resources/
│   │       ├── application.properties       # Configuration file
│   └── test/
│       └── java/com/gxrv/research_assistant_backend/
│           ├── ResearchAssistantBackendApplicationTests.java # Test cases
├── README.md                                # Project documentation
```

## API Endpoints

### Backend Service

- **POST /summarize**: Accepts a text payload and returns a summarized response.

## Future Enhancements

- Add support for exporting notes to external formats (e.g., PDF, Markdown).
- Enable synchronization of notes across devices using cloud storage.
- Provide customization options for summarization (e.g., length, tone).

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy researching!
