# Management System Dashboard

This project implements a comprehensive management system dashboard featuring API integration, state management, data visualization, CRUD operations, performance optimization, and security measures and is written mainly in React Javascript and SCSS. It utilizes Firebase and Firestore as a database and authorization solution while also integrating data from the JSONPlaceholder API. The following documentation provides an overview of the project's features, dependencies, setup instructions, usage, deployment, and submission details.

## Features

### API Integration and State Management

The project integrates with the JSONPlaceholder API to fetch sample data, including users, posts, comments, and todos. The fetched data is utilized to create various pages:

1. **User Profile Page**: Displays individual user details.
2. **User Listing Page**: Shows a paginated list of users.
3. **Dashboard**: Provides visual insights through charts, such as:
   - Quarterly sales analysis.
   - User recent transactions.
   - User pending orders.
   - Daily inventory level.
   - Average comments per user.
   - Average comments per user.
   - Number of completed todos per user.
   - Top words in posts.
   - Top words in comments.
   - User heatmap based on latitude and longitude.
4. **Post Listing Page**: Lists all posts.
5. **Post Detail Page**: Displays individual post details along with comments.
6. **Navigation Sidebaar**: Facilitates navigation between different pages.

State management is handled using React Context to maintain and manage the fetched data state across various dashboard components. Loading states and error handling mechanisms are also implemented.

### Dashboard Components and Layout

The dashboard includes reusable components that display key metrics such as quarterly sales analytics, inventory count per day count, pending orders, recent transactions and more user retention metrics. The layout is designed using CSS Grid and Flexbox to ensure responsiveness and optimal display on both desktop and mobile devices.

### Data Visualization and Charts

A charting library (Highcharts) is integrated to visualize sales trends, inventory levels, and user retention metrics in line or bar format. Highcharts is also used to display the number of msot completed todos for the users in a pie chart format. The chart configurations and tooltips are customized for better data interpretation.

### User Interaction and Filtering

Interactive elements allow users to filter posts by user and perform searches by post or user information.

### CRUD Operations and Data Management

The dashboard simulates CRUD operations, allowing users to add, update, and delete sample inventory items or orders directly from the interface. API requests and responses are handled accordingly.

### Performance Optimization and Security

Various performance optimization techniques are employed, including lazy loading components, caching API responses, and implementing data fetching strategies like pagination and infinite scrolling. Basic security measures are also in place, such as input validation, sanitization, and handling potential security vulnerabilities.

### Deployment and Documentation

The application is deployed on a hosting platform (e.g., Netlify, Vercel). Detailed documentation, including setup instructions, key dependencies, and information for maintaining and extending the dashboard, is provided.

## Dependencies

The project relies on the following dependencies:

- `@testing-library/jest-dom`: ^5.17.0
- `@testing-library/react`: ^13.4.0
- `@testing-library/user-event`: ^13.5.0
- `axios`: ^1.7.2
- `firebase`: ^10.12.1
- `formik`: ^2.4.6
- `highcharts`: ^11.4.1
- `highcharts-react-official`: ^3.2.1
- `leaflet`: ^1.9.4
- `leaflet.heat`: ^0.2.0
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-icons`: ^5.2.1
- `react-leaflet`: ^4.2.1
- `react-random-avatars`: ^1.3.1
- `react-router-dom`: ^6.23.1
- `react-scripts`: 5.0.1
- `sass`: ^1.77.2
- `scss`: ^0.2.4
- `stopword`: ^3.0.1
- `yup`: ^1.4.0

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` File**:
   Add your Firebase configuration and base URL:
   ```env
   REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
   REACT_APP_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   REACT_APP_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   REACT_APP_FIREBASE_APP_ID=<your-firebase-app-id>
   REACT_APP_BASE_URL=<your-api-base-url>
   ```

4. **Start the Development Server**:
   ```bash
   npm start
   ```

## Usage

- Use the navigation bar to explore different pages.
- View the user listing page with pagination.
- Access user profiles and their todos.
- Interact with the dashboard to view key metrics and charts.
- Perform CRUD operations on sample inventory items or orders.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
