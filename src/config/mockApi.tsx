import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create an instance of Axios
export const api = axios.create();

// Create an instance of MockAdapter and attach it to the Axios instance
export const mock = new MockAdapter(api, {delayResponse: 1000}); // Simulate a 1-second delay