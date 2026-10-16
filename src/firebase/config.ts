/**
 * Firebase web config for the live project. Not a secret: every read and write is
 * governed by database.rules.json. Emulator runs override the project with
 * `demo-frontier` in init.ts.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyCRnMWn6-u4nlXBTmEtihpcKt7DG9NAIXA',
  authDomain: 'frontier-feed-9759d.firebaseapp.com',
  databaseURL: 'https://frontier-feed-9759d-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'frontier-feed-9759d',
  storageBucket: 'frontier-feed-9759d.firebasestorage.app',
  messagingSenderId: '239012877125',
  appId: '1:239012877125:web:04637ba5f303a6f480642c',
} as const;

/** Project ID used for every emulator run; needs no login or credentials. */
export const EMULATOR_PROJECT_ID = 'demo-frontier';
export const EMULATOR_HOST = '127.0.0.1';
export const EMULATOR_AUTH_PORT = 9099;
export const EMULATOR_DATABASE_PORT = 9000;
