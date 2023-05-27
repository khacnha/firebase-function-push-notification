# Peach App - Server with Firebase functions

## Features:
- Notification screen
- Push Notification

## Require:
- Firebase function
- Firebase Admin
- Only working with Firebase Live

## Config:
- Setup firebase admin config: `firebase functions:config:set private.key="YOUR API KEY" project.id="YOUR CLIENT ID" client.email="YOUR CLIENT EMAIL"`
- And run `firebase functions:config:get > .runtimeconfig.json`

## Run:
- Demo: 
    + Terminal 1: `npm run build:watch`
    + Terminal 2:`firebase emulators:start` or `firebase emulators:start --inspect-functions`
- Deploy: `firebase deploy --only functions`