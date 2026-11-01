# JAssistant integration

The ChatGPT Dock entry now opens the JAssistant chat UI. Project/profile retrieval runs locally and is explicitly labelled; it is not a substitute for model-generated answers.

The provider is pending confirmation of its documentation, URL, authentication and model/assistant ID. No secret has been added to the browser or repository.

Frontend contract reserved for a Cloudflare Pages Function at `POST /api/assistant`:

- Input: `{ messages: [{ role: 'user' | 'assistant', content: string }], language: 'zh' | 'en' }`. Frontend bounds history to 12 messages and each new question to 2,000 characters.
- Output: `{ answer: string, projectIds: string[] }`. IDs are checked against real projects; answers are rendered as text, not arbitrary HTML.
- Missing endpoint, non-JSON response, timeout or provider failure falls back to clearly labelled local archive retrieval.
- Future server adapter must inject trusted portfolio facts server-side, keep credentials in Cloudflare secrets, bound requests/output, and return documented project IDs. Do not accept API keys or arbitrary upstream URLs from visitors.

Local history is kept only in this open app instance. Closing/restarting aborts pending requests. Live API integration cannot be verified until provider details are supplied.
