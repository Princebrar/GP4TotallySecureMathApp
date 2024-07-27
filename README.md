# Security for Software Developers: Cross-Platform Security

## Introduction
In this lab, we identified and addressed vulnerabilities in a mobile app related to insecure data storage, improper authentication, code injection, insufficient input validation, and insecure code practices. We enhanced the app’s security and applied best practices to mitigate potential risks.

## Identified Vulnerabilities
1. **Insecure Data Storage**:
   - Hardcoded credentials in `Login.tsx`.
   - Plaintext storage of notes in `Notes.tsx` with storage keys including plaintext credentials.

2. **Improper Authentication**:
   - No secure authentication practices (e.g., no hashed passwords).

3. **Insecure Code Practices**:
   - Use of plaintext credentials in storage keys in `Notes.tsx`.

## Implemented Security Measures
1. **In `Login.tsx`**:
   - **Password Hashing**: Utilized `crypto-js` for hashing passwords instead of storing them in plaintext.
   - **Secure Storage**: Replaced plaintext storage with `react-native-keychain` to securely store user session data.
   - **Input Validation and Sanitization**: Added input validation and sanitization for username and password fields to ensure only valid inputs are accepted.

2. **In `Notes.tsx`**:
   - **Secure Storage**: Replaced plaintext storage with `react-native-keychain` to securely store notes.
   - **Refactoring**: Removed the use of plaintext credentials in storage keys.
   - **Input Validation and Sanitization**: Added input validation and sanitization for note title and text fields to ensure only valid inputs are accepted.

## Reflection
During this process, we learned the importance of:
- **Secure Data Storage**: Ensuring sensitive data is encrypted and securely stored.
- **Proper Authentication**: Using hashed passwords and avoiding plaintext storage of credentials.
- **Input Validation and Sanitization**: Validating and sanitizing user inputs to prevent code injection.
- **Insecure Code Practices**: Avoiding the use of plaintext credentials and implementing secure coding practices.

Moving forward, these best practices will be implemented to mitigate potential risks and enhance the security of software applications.

## References
1. Crypto-js. (n.d.). Retrieved from https://www.npmjs.com/package/crypto-js
2. React Native Keychain. (n.d.). Retrieved from https://github.com/oblador/react-native-keychain
