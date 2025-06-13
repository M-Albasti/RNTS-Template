This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# RNTS-Template - React Native Template

Welcome to **RNTS-Template**, an open-source React Native template designed and developed by **Mahmoud Albasti**, a Senior React Native Developer. This template includes a comprehensive set of features to help you get started with your next React Native project, built with **modern technologies** and **best practices**.

**RNTS-Template** offers **multiple authentication methods**, including Firebase authentication, mock API login, social logins (Google, Facebook, Apple), and more. It is designed with an **atomic component structure** for scalability, and it’s fully documented to help you get up and running quickly.

## Key Features

- **Firebase Authentication**: Support for email/password login, phone login, and Google login.
- **Mock API Login**: Built-in mock API login for quick testing and prototyping.
- **Social Logins**: Easy integration for Facebook and Apple logins.
- **Atomic Design Structure**: Components are modular, reusable, and maintainable.
- **Well-Documented**: Every part of the template is thoroughly documented.
- **Latest Technologies**: Built with the latest versions of React Native, TypeScript, Redux, Firebase, and other modern libraries.

## Tech Stack

- **React Native**: For building native mobile applications.
- **Firebase**: For authentication and backend services.
- **React Navigation**: For seamless navigation.
- **Redux**: For state management.
- **Axios**: For HTTP requests.
- **TypeScript**: For type-safe development.
- **i18next**: for Internationalization with multiple languages and regions.

## Authentication Methods

This template supports several authentication methods, including:

### Firebase Authentication

- **Email/Password Login**: Easily authenticate users via email and password.
- **Phone Login**: Firebase phone authentication for secure sign-in via SMS.
- **Google Login**: Use Firebase and Google Sign-In SDKs to authenticate with Google accounts.

### Mock API Login

For quick prototyping, this template includes a mock API login to simulate a backend authentication flow.

### Social Logins

- **Facebook Login**: Simple integration for Facebook login using Firebase.
- **Apple Login**: Apple authentication for users on iOS devices.

## Contributing

This project is open-source, and contributions are always welcome! To contribute:

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/RNTS-Template.git`
3. Create a new branch: `git checkout -b feature-name`
4. Make your changes and test them.
5. Push your branch: `git push origin feature-name`
6. Submit a pull request.

## Documentation

The template is **well-documented** to make it easier to get started and understand the project structure. You'll find detailed documentation on:

- **Project structure** and the **atomic design components** (atoms, molecules, organisms).
- Step-by-step instructions for **setting up Firebase authentication** and integrating **social logins**.
- How to extend the app with your own features, such as adding more auth methods or custom API calls.

## Dynamic Import Routes (Module Aliases)

This project is configured to use **dynamic import routes** (also known as module path aliases) to simplify the import statements, making them more readable and maintainable. Instead of using long relative paths, you can import modules using short, meaningful aliases such as `@atoms/`, `@hooks/`, `@services/`, and so on.

### Benefits of Dynamic Import Routes:
- **Simplifies imports**: Makes your import statements shorter and cleaner.
- **Easier to refactor**: No need to worry about updating relative paths when moving files.
- **Improves maintainability**: By using aliases, you make it easier for other developers to understand and navigate the codebase.

## **Internationalization (i18n)**

This project uses **i18next** for handling internationalization (i18n), enabling the app to support multiple languages and regions. It provides an easy way to localize content in the app based on the user's preferences.

#### **How it Works**
- **React-i18next** is integrated for seamless translation and language switching.
- Language files for each supported language are stored in the `src/translations/` directory.
- The app automatically detects the device's default language, but users can also manually switch languages.

#### **Supported Languages**
The template currently supports the following languages (you can add more as needed):
- English (en)
- Arabic (ar)

## Error Tracking and Monitoring with Sentry

This project integrates **Sentry** to provide real-time error tracking, performance monitoring, and profiling. With Sentry, we can easily trace and monitor issues, crashes, and performance bottlenecks in the app, allowing for quick and efficient debugging.

### What Does Sentry Do?

- **Error Tracking**: Sentry automatically captures unhandled errors, exceptions, and crashes that occur in the app. It logs the stack traces and user context to help you identify and fix issues faster.
- **Performance Monitoring**: It provides insights into how your app is performing in the real world, tracking page load times, latency, and more. You can get alerts when performance drops or there are unusual spikes in errors.
- **Profiling**: Sentry profiles and traces every event in the app, providing detailed information about where bottlenecks are occurring, helping you optimize the app's performance.

You can learn more about Sentry at [Sentry Documentation](https://docs.sentry.io/).

## Error Handling with Error Boundaries

This project implements **Error Boundaries** to gracefully handle runtime errors and prevent the entire app from crashing. The error boundaries are placed around each **Navigator** to ensure that individual screens or navigators don't bring down the entire app if an error occurs.

### How Error Boundaries Work

- **Component-Level Error Handling**: Each screen and navigator is wrapped with an error boundary, ensuring that errors in one part of the app don't affect the rest of the application.
- **Fallback UI**: If an error is caught, a fallback UI is rendered, which can be customized to display a friendly message to the user.
- **Integration with Sentry**: When an error is caught by the error boundary, it is automatically reported to **Sentry** for monitoring and debugging purposes. This helps developers trace and resolve issues quickly.

With this approach, we ensure that users have a smooth experience and that any issues can be tracked, debugged, and resolved without crashing the app.

## Form Validation with Zod

This project uses **Zod** for form validation to ensure that all user inputs are valid and meet the required constraints. Zod provides a **TypeScript-first** approach to schema validation, making it a great choice for type-safe forms in React Native.

### How Zod Works in This Project

- **Validation on Form Submission**: Zod schemas are applied to validate the data before it is submitted, ensuring the form data adheres to the specified rules (e.g., required fields, proper email format, etc.).
- **Error Handling**: If a validation fails, the error message is returned and can be displayed to the user next to the respective form field.
- **Type Safety**: Zod provides full integration with TypeScript to ensure type safety, so your form data is always strongly typed.

## Troubleshooting

If you encounter any issues while running the app or setting it up, please consult the [official React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting). If the issue persists, feel free to open an issue on this repository.

## Learn More

Here are some resources to help you get the most out of **RNTS-Template**:

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Redux Documentation](https://redux.js.org/introduction/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ⭐️ Star this Repository

If you find this project helpful, please give it a star! ⭐️

Stars help the project gain visibility and show your support for open-source development. It also helps others discover this project and contribute to its improvement.

To star the project, just click the **star icon** at the top of this repository. Your support is greatly appreciated! 🙌

## Final Thoughts

**RNTS-Template** is your go-to foundation for building modern, scalable, and feature-rich React Native apps. With built-in authentication methods, social login integrations, and a clean, atomic design structure, this template is ready to kickstart your next project!
