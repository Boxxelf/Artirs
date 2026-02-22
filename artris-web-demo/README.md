# Artris Web Demo

A professional portfolio mentoring platform connecting Chinese students with top U.S. art school mentors.

## Features

- **Dual Platform**: Student and Teacher interfaces
- **Bilingual Support**: Full English and Chinese language support
- **Complete Booking Flow**: Browse mentors → Book sessions → Confirm orders
- **Real-time Messaging**: Chat system between students and teachers
- **Education Verification**: Teacher credential verification system
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Professional UI with Framer Motion

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Framer Motion
- i18next (Internationalization)
- date-fns

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Demo Credentials

- Email: demo@artris.com
- Password: demo123

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
│   ├── Auth/       # Login & Register
│   ├── Student/     # Student pages
│   └── Teacher/    # Teacher pages
├── context/        # React Context (Auth, Language)
├── data/           # Mock data
├── i18n/           # Internationalization
└── App.jsx         # Main app component
```

## Features Overview

### Student Features
- Browse and search mentors
- View mentor profiles with portfolios
- Book one-on-one sessions
- Manage appointments
- Chat with mentors
- View success stories

### Teacher Features
- Dashboard with statistics
- Schedule management
- Earnings tracking
- Education verification
- Student messaging

## License

MIT
