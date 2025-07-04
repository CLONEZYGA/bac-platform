# BAC Platform Mobile App

A React Native mobile application built with Expo for the BAC Platform, providing a streamlined experience for student registration and application management.

## 🚀 Features

### Student Features
- User registration and authentication
- Application form submission
- Document upload and management
- Application status tracking
- Real-time updates on application progress

### Admin Features
- Secure admin authentication
- Application review dashboard
- Document verification
- Application status management
- Student communication tools

## 🛠 Tech Stack

- **Frontend Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation
- **UI Components**: Custom components with React Native Paper
- **Storage**: AsyncStorage (local), Firebase Storage (cloud)
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database (MVP)

## 📱 Screenshots

(Screenshots will be added as the app develops)

## 🏗 Project Structure

```
BACApp/
├── assets/                   # Images, logos, PDF icons, etc.
├── components/              # Reusable UI components
├── constants/               # App-wide constants
├── context/                 # Global context providers
├── navigation/              # Stack/Tab navigators
├── screens/                 # All screen pages
│   ├── student/            # Student-specific screens
│   ├── admin/              # Admin-specific screens
│   └── shared/             # Shared screens (auth, etc.)
├── services/               # API calls, Firebase wrappers
├── utils/                  # Helper functions
├── hooks/                  # Custom React hooks
└── db/                     # Database schema and config
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd BACApp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 🔧 Environment Setup

1. Create a `.env` file in the root directory:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

2. Update the Firebase configuration in `services/firebase.ts`

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the established project structure

### Git Workflow
1. Create feature branches from `main`
2. Use meaningful commit messages
3. Submit PRs for review
4. Keep the main branch stable

## 🔐 Security Considerations

- Never commit sensitive data or API keys
- Implement proper authentication checks
- Validate all user inputs
- Use secure storage for sensitive data
- Follow Firebase security rules

## 📈 Future Enhancements

- Gradebook system integration
- Real-time notifications
- Offline support
- Push notifications
- Analytics dashboard
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Your Name] - Lead Developer
- [Other Team Members]

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- Firebase team
- All contributors and supporters 