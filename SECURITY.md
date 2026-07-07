# Security Policy & Hardening Review

This document outlines the security architecture, audits, and hardening implementations performed on **Smart Bharat AI** to protect citizen data and prevent API key exposure.

---

## 🔒 Security Hardening Implementations

### 1. API Secret Leak Prevention & Mitigation
*   **Audit**: Checked for hardcoded API keys or credentials.
    *   *Finding*: Verified that no Firebase or Gemini secrets are hardcoded in the codebase source files. All services fetch values dynamically from environment variables (`import.meta.env`).
    *   *Git Configuration*: Confirmed that `.env.local` and similar secret-containing files are ignored via `.gitignore` and have never been committed. Verified `.env.example` contains only safe placeholders.
*   **Build-time Secret Mitigation**:
    *   *Problem*: In static Vite applications, any client-side environment variable prefixed with `VITE_` (like `VITE_GEMINI_API_KEY`) is statically baked into the production Javascript bundles during compilation. 
    *   *Solution*: We modified the Gemini service and UI to support **session-storage key injections**:
        1.  If the project is built for production *without* the `VITE_GEMINI_API_KEY` set, the app loads correctly but flags "API Key Required".
        2.  A secure, custom API key input form was added directly to the chatbot sidebar. This key is stored temporarily in `sessionStorage` (restricted to the active tab session and cleared when the browser tab is closed).
        3.  The Gemini service (`gemini.js`) was updated to dynamically read the session storage key first before falling back to the environment variable.
        4.  This allows secure public hosting of the site without leaking any billing or quota details.

### 2. XSS & Injection Protection
*   **Audit**: Examined all input fields and rendering methods.
    *   *Forms*: Form pages (e.g. `ReportComplaintPage`, `SchemesPage`, and `TrackComplaintPage`) utilize standard React text node rendering (e.g. `{title}`, `{description}`). React automatically escapes strings before rendering, mitigating standard HTML/Javascript script injection (XSS) vectors.
    *   *Inputs*: `Input.jsx` is a wrapper around the standard HTML input tag, which inherently escapes values and does not evaluate text as HTML.
    *   *Markdown Rendering*: Hardened the custom markdown parser in `ChatMessage.jsx` (`renderMarkdown`).
        *   HTML tags are escaped via `.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')` before any markdown parsing.
        *   Added secure standard markdown link parsing `[text](url)` constrained strictly to `http://` or `https://` protocols. This prevents malicious protocol payloads (e.g. `javascript:alert(1)`) from executing.

### 3. Local/Session Storage Security
*   **Audit**: Inspected how the app stores data in the browser.
    *   *Theme Storage*: Verified `localStorage` is used solely to store the user's theme preference (`sb-theme` - `"light"` or `"dark"`). No sensitive PII or complaint data is stored permanently.
    *   *Session Key*: Custom Gemini API keys are only kept in `sessionStorage` (`sb_custom_gemini_key`) so they are never written to disk and disappear when the browser tab/window is closed.
    *   *Chat Logs*: Kept entirely in React's component state memory; they are not saved to any browser storage, protecting citizens on shared/public internet kiosk devices.

### 4. Error Handling & Info Exposure
*   **Audit**: Verified that errors do not print stack traces or internal environment variables to users.
    *   *Implementation*: `getErrorMessage` in `gemini.js` parses various technical errors (network errors, rate limits, safety blocks, key issues) and maps them to citizen-friendly emoji warnings (e.g. "Rate limit reached. Please wait a moment...").
    *   *Forms*: Complaint file submissions use a generic, friendly fallback banner ("Failed to file complaint. Please try again.") without exposing backend logs.

---

## 🚀 Recommended Future Hardening

While the frontend is secure, a production environment requires supplementary backend/platform protections:

### 1. Configure Firebase Security Rules
Ensure the Firebase console project has strict rules enforced for Firestore and Cloud Storage, since client keys are visible to users.

*   **Firestore Rules** (`firestore.rules`):
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /complaints/{complaint} {
          // Allow citizens to create new complaints, and anyone with the ID to track it
          allow create: if true;
          allow read: if true;
          // Block editing or deleting submitted complaints on client
          allow update, delete: if false;
        }
      }
    }
    ```

*   **Firebase Storage Rules** (`storage.rules`):
    ```javascript
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /complaints/{complaintId}/{allPaths=**} {
          // Allow uploads of images only
          allow write: if request.resource.contentType.matches('image/.*')
                       && request.resource.size < 5 * 1024 * 1024;
          allow read: if true;
        }
      }
    }
    ```

### 2. Move Gemini API calls to a Serverless Proxy
To fully shield the Gemini API key from client delivery, implement a Vercel Serverless Function or Node.js backend proxy:
1.  Deploy a function at `/api/gemini` that receives user messages.
2.  Store `GEMINI_API_KEY` strictly as a backend environment variable on Vercel (which is hidden from client-side JS).
3.  The client requests `/api/gemini`, and the serverless function calls Gemini and returns the response.
