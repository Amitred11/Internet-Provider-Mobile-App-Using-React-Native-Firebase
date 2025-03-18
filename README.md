# Postpaid Internet Subscription Management System

## Project Overview
This capstone project is designed to develop a comprehensive postpaid management system for Fibear Network Technologies Corp. The system will allow users to manage their internet subscription plans, view billing details, track payment history, and receive important notifications.

## Features
- **User Authentication**: Secure login and signup functionality.
- **Plan Management**: Users can view their current plan details.
- **Billing & Payment Tracking**: Displays billing cycle, current bill, and due date.
- **Notifications**: Alerts for upcoming due dates and other important updates.

## Technologies Used
- **Frontend**: React Native
- **Backend**: Firebase (Authentication, Realtime Database, Storage)
- **Database**: Firebase Realtime Database
- **Storage**: Firebase Storage for handling documents and attachments

## Setup Instructions
1. **Clone the Repository**
   ```sh
   git clone https://github.com/Amitred11/Fibear-Network-App.git
   cd Fibear-Network-App
   ```

   or
   Download the **ZIP**, and open it in **VSCODE**
3. **Install Dependencies**
   ```sh
   npm install
   ```
4. **Setup Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add the Firebase config to `firebaseConfig.js`
   - Enable **Authentication** (Email/Password)
   - Set up **Realtime Database**
   - Configure **Storage Rules**

5. **Run the Project**
   ```sh
   npx expo start
   ```
   or
   ```sh
   npm start
   ```

## Development Timeline
This project is expected to be completed within **7 months**, with the following milestones:
- **Month 1-2**: UI/UX Design & Firebase Setup
- **Month 3-4**: Core Feature Implementation (Authentication, Billing)
- **Month 5**: Testing & Debugging
- **Month 6**: Deployment Preparation
- **Month 7**: Final Testing & Documentation
- **Kunwari lang**

## Contributors
- **Developer:** Leoncio D. Amadore III
- **College:** Colegio de Montalban
  - **Institute:** Computing Studies
## License
This project is for educational purposes only. All rights reserved by Fibear Network Technologies Corp.

# How to create a React-Native App

## 1. Install Expo CLI Globally
First, install Expo CLI globally so you can create and manage Expo projects easily:

sh
Copy
Edit
npm install -g expo-cli
To verify the installation, run:

sh
Copy
Edit
expo --version
## 2. Create a New Expo Project
Now, create your new React Native app with Expo:

sh
Copy
Edit
npx create-expo-app MyApp
Replace "MyApp" with your preferred project name.
Select the blank template when prompted.
Navigate into your project folder:

sh
Copy
Edit
cd MyApp
## 3. Start the Development Server
Run the Expo development server with:

sh
Copy
Edit
npx expo start
This opens the Expo Developer Tools in your browser.
You'll see a QR code and multiple options to run your app.

