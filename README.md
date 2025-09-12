# Mechat

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Project Structure 

src/app/
│
├── services/                # Application-wide services
│   ├── auth.service.ts      # Handles login, register, token storage
│   └── chat.service.ts      # WebSocket service for sending/receiving messages
│
├── guards/                  # Route guards
│   └── auth.guard.ts        # Protects dashboard routes
│
├── interceptors/            # HTTP interceptors
│   └── auth.interceptor.ts  # Attaches JWT token to outgoing requests
│
├── models/                  # Interfaces / types
│   ├── message.model.ts     # Chat message model
│   └── user.model.ts        # User model
│
├── auth/                    # Auth feature module
│   ├── login/               # Login component (Reactive form)
│   ├── register/            # Register component
│   ├── auth-routing.module.ts
│   └── auth.module.ts
│
├── dashboard/               # Chat feature module
│   ├── chat-list/           # Sidebar with conversations
│   ├── chat-window/         # Active chat window
│   ├── contacts/            # Contact list
│   ├── dashboard-routing.module.ts
│   └── dashboard.module.ts
│
├── shared/                  # Shared reusable module
│   ├── navbar/              # Top navigation bar
│   ├── message-bubble/      # Chat bubble UI
│   ├── avatar/              # User avatar
│   └── shared.module.ts
│
├── app-routing.module.ts    # Root routes (lazy load Auth/Dashboard)
└── app.module.ts


## 🧩 Core Modules

🔐 Auth Module:

LoginComponent – Reactive form for email/password login

RegisterComponent – User registration form

Routes: /auth/login, /auth/register

💬 Dashboard Module:

ChatListComponent – Displays list of conversations

ChatWindowComponent – Shows messages in active chat, input to send new message

ContactsComponent – List of available contacts

Routes: / (chat list), /chat/:id (chat window)

🛠 Shared Module:

NavbarComponent – Top bar with navigation

MessageBubbleComponent – Individual chat message UI

AvatarComponent – User avatar display

Exports CommonModule, FormsModule, ReactiveFormsModule for reuse

## ⚡ Services & Utilities

AuthService:

Handles login, register, logout

Persists user/token in localStorage

Exposes user$ as an observable for auth state

ChatService:

Manages WebSocket connection

Sends/receives Message objects

Exposes messages$ stream

AuthGuard:

Prevents access to dashboard routes if user is not authenticated

AuthInterceptor:

Attaches JWT from AuthService to outgoing API requests

## 🔗 Routing Overview

/auth → AuthModule (lazy-loaded)

/auth/login

/auth/register

/ → DashboardModule (lazy-loaded, protected by AuthGuard)

/chat/:id