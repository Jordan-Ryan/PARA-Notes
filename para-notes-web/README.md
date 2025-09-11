# PARA Notes - Next.js 14 Web Application

A modern, full-featured note-taking application organized around the PARA method (Projects, Areas, Resources, Archive) built with Next.js 14, TypeScript, and Supabase. This application provides both mobile and desktop experiences with a responsive design.

## 🚀 Features

### Core PARA Organization
- **Projects**: Things with a deadline and specific outcome
- **Areas**: Standards you want to maintain over time  
- **Resources**: Topics or themes of ongoing interest
- **Archive**: Inactive items from the other categories

### Rich Text Editing
- **Modern Editor**: Powered by Tiptap for a smooth writing experience
- **Rich Formatting**: Bold, italic, lists, links, and more
- **Real-time Collaboration**: Multi-user editing support
- **Markdown Support**: Import/export Markdown files
- **Encryption**: Optional client-side encryption for sensitive notes

### Desktop & Mobile Experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Desktop Features**: 
  - Persistent sidebar navigation
  - Keyboard shortcuts (⌘K for search)
  - Hover effects and animations
  - Multi-column layouts
  - Custom scrollbars
- **Mobile Features**:
  - Collapsible sidebar
  - Touch-friendly interface
  - Mobile-optimized forms

### Advanced Features
- **Real-time Sync**: Automatic synchronization with Supabase
- **Offline Support**: Works offline with local storage and sync when online
- **Search & Filtering**: Full-text search across all content
- **Tags & Organization**: Flexible tagging system
- **Settings & Preferences**: Comprehensive user settings
- **Data Export/Import**: Backup and restore functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom PARA theme
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand + TanStack Query
- **UI Components**: Headless UI + Custom components
- **Rich Text**: Tiptap
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd para-notes-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env.template .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

### 4. Set up Supabase

#### Option A: Local Development (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Start local Supabase:
```bash
npm run supabase:start
```

3. Run database migrations:
```bash
npm run supabase:db:push
```

4. Generate TypeScript types:
```bash
npm run supabase:gen:types
```

#### Option B: Remote Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `supabase/migrations/` in your Supabase dashboard
3. Update your environment variables with the remote credentials

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── notes/         # Notes management
│   │   ├── projects/      # Projects management
│   │   ├── areas/         # Areas management
│   │   ├── resources/     # Resources management
│   │   ├── archive/       # Archive management
│   │   └── settings/      # User settings
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── crypto/           # Encryption utilities
│   ├── para/             # PARA-specific logic
│   └── utils/            # General utilities
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
└── constants/            # App constants
```

## 🎨 Design System

### PARA Color Scheme
- **Projects**: Blue (#0ea5e9) - Action-oriented, deadline-driven
- **Areas**: Green (#22c55e) - Maintenance, ongoing standards
- **Resources**: Yellow (#eab308) - Reference materials, learning
- **Archive**: Gray (#64748b) - Completed, inactive items

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Code**: JetBrains Mono

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: API and database testing
- **Component Tests**: React component testing
- **E2E Tests**: Playwright for full user flows
- **Security Tests**: Authentication and authorization testing

Run all tests:
```bash
npm run test:all
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## 🔒 Security

- **Row Level Security (RLS)**: All database operations are secured
- **JWT Authentication**: Secure user authentication
- **Client-side Encryption**: Optional encryption for sensitive data
- **Input Validation**: All inputs are validated and sanitized
- **HTTPS**: Secure connections in production

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:

- **Touch-friendly Interface**: Large touch targets and gestures
- **Mobile Navigation**: Collapsible sidebar and bottom navigation
- **Offline Support**: Works without internet connection
- **Progressive Web App**: Installable on mobile devices

## 🎯 Desktop Features

Enhanced desktop experience with:

- **Keyboard Shortcuts**: ⌘K for search, ⌘N for new note
- **Multi-window Support**: Open multiple notes simultaneously
- **Drag & Drop**: Reorder items and upload files
- **Hover Effects**: Rich interactive feedback
- **Custom Scrollbars**: Styled scrollbars for better UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tiago Forte](https://fortelabs.co/) for creating the PARA method
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for the design system
- [Tiptap](https://tiptap.dev/) for the rich text editor

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/your-repo/issues)
3. Create a [new issue](https://github.com/your-repo/issues/new)

---

**Built with ❤️ for productivity enthusiasts**