import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Sample array of users
const users = [
  {
    id: 1,
    email: 'mahmoud@gmail.com',
    password: 'Password@123',
    name: 'Mahmoud Albasti',
  },
  {
    id: 2,
    email: 'albasti@gmail.com',
    password: 'Password@1234',
    name: 'Albasti Mahmoud',
  },
  // Add more users as needed
];

// Create an instance of Axios
export const api = axios.create();

// Create an instance of MockAdapter and attach it to the Axios instance
const mock = new MockAdapter(api, {delayResponse: 1000}); // Simulate a 1-second delay

// Mock POST /login API
mock.onPost('/login').reply(config => {
  // Parse email and password from request data
  const {email, password} = JSON.parse(config.data);

  // Find the user with matching email and password
  const user = users.find(
    user => user.email === email && user.password === password,
  );

  if (user) {
    // Return user data along with token
    return [200, {id: user.id, name: user.name, email: user.email}];
  } else {
    // If no user is found or password doesn't match
    return [401, {message: 'Invalid email or password'}];
  }
});