import type MockAdapter from 'axios-mock-adapter';

type MockUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

const users: MockUser[] = [
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
];

const createToken = (userId: number): string =>
  `mock-jwt-${userId}-${Date.now()}`;

export const registerAuthMocks = (mock: MockAdapter): void => {
  mock.onPost('/login').reply(config => {
    const {email, password} = JSON.parse(config.data as string) as {
      email: string;
      password: string;
    };

    const user = users.find(
      entry => entry.email === email && entry.password === password,
    );

    if (!user) {
      return [401, {message: 'Invalid email or password'}];
    }

    return [
      200,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        token: createToken(user.id),
      },
    ];
  });

  mock.onPost('/register').reply(config => {
    const {email, password, name} = JSON.parse(config.data as string) as {
      email: string;
      password: string;
      name?: string;
    };

    if (users.some(entry => entry.email === email)) {
      return [409, {message: 'Email already registered'}];
    }

    const newUser: MockUser = {
      id: users.length + 1,
      email,
      password,
      name: name || email.split('@')[0] || 'User',
    };
    users.push(newUser);

    return [
      201,
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: createToken(newUser.id),
      },
    ];
  });
};
