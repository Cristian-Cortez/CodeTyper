# CodeTyper

## CSE264 Final Project: Full Stack

## Due: Friday, Dec 5, 2025 at 11:59 PM

Jake Bernardi jpb626
Kevin Sullivan kjs226
Cristian Cortez cmc226

## Team Members & Roles

- **Jake Bernardi** – Full stack - DB setup/management
- **Kevin Sullivan** – Full stack - mainly backend (Express routes, queries, auth, leaderboard, admin endpoints.)
- **Cristian Cortez** – Full stack - mainly frontend (React, routing, Material UI, typing UI.)

## Project Overview

- **Name:** CodeTyper
- **Description:** Web app that gives you random code snippets to type, shows mistakes/accuracy/WPM, and tracks your best scores.
- **Purpose:** Make typing practice more relevant for programmers and provide simple stats + leaderboard

## Features vs Requirements

**User Accounts & Roles**

- Create account: `POST /api/users` (first name, last name, username, password, favorite word).
- Login: `POST /api/login` (username + password).
- Passwords stored as `hash(password + salt)` (SHA-256).
- `users.isadmin` column:
  - Admin-only APIs require `adminId` query param and check `isadmin = true`.
  - Admins see an extra **Admin** tab in the Navbar, which links to `/admin`:
    - `/admin` shows a simple users table.
    - Admin can delete other users via a Delete button.

**Database**

- PostgreSQL (Supabase).
- `users` table stores:
  - `id`, `first_name`, `last_name`, `username` (unique)
  - `password_hash`, `salt`
  - `favorite_word`, `best_wpm`, `isadmin`
- `best_wpm`

**Interactive UI**

- React + Vite single-page app.
- Pages:
  - `/` Login
  - `/create-account` CreateAccount
  - `/home` Typing game
  - `/profile` Profile
  - `/leaderboard` Leaderboard
  - `/admin` Admin (only shown in Navbar if `user.isadmin` is true)
- Interactive typing view:
  - Uses `react-typing-game-hook` to track client typing state.
  - Live updates correct and incorrect chars as you type them, live update mistakes, accuracy, current WPM.
  - On completion calls `onPerfectFinish(finalWpm)`.

**New Libraries / Frameworks**

- Frontend:
  - `react-typing-game-hook` (typing logic, timing, accuracy).
  - also made use of `@mui/material` we covered in class (Navbar, buttons, text fields).
- Backend:
  - `jsdom` + `he` for HTML parsing / decoding of external code snippets.
  - `crypto` for password hashing + salting

**Internal REST API**

- `GET /up` – health check.
- `GET /api/random-snippet?lang=LANG` – random code snippet for language tag.
- `GET /random-word` – random word + definition + example (word practice).
- `POST /api/users` – create user, hash+salt password.
- `POST /api/login` – validate credentials, return user data.
- `PATCH /api/users/:id/best-wpm` – increase best WPM if new value is higher.
- `GET /api/leaderboard?n=10` – top N users ordered by `best_wpm`.
- `GET /api/users?adminId=:id` – admin-only list of all users.
- `DELETE /api/users/:id?adminId=:id` – admin-only delete user.

**External REST APIs**

- **StackExchange / StackOverflow API**
  - Used in `GET /api/random-snippet`:
    - Fetches questions tagged with the chosen language.
    - Uses `jsdom` to grab `<pre><code>` blocks from HTML.
    - Normalizes tabs and line endings; returns one random snippet.
- **Datamuse API**
  - Used in `/random-word` to get random words by letter.
- **dictionaryapi.dev**
  - Would be used to fetch definition and example sentence for the chosen word. Didnt make it to final app.

## Key Frontend Components

**TypingGameComponent**

- Uses `useTypingGame(text)`:
  - Tracks `chars`, `charsState`, `currIndex`, `correctChar`, `errorChar`, `startTime`, `endTime`.
- Behavior:
  - Listens to key events on a `<pre class="codeBox">` element.
  - Shows characters color-coded:
    - Incomplete: grey
    - Correct: green
    - Incorrect: red
  - Shows:
    - **Mistakes** = `errorChar` (total mistakes ever made).
    - **Accuracy** = `correctChar / (correctChar + errorChar)` as a percentage.
    - **WPM** = `correctChar / 5 / minutes`.
- Perfect completion:
  - Uses `charsState` to check:
    - No `CharStateType.Incomplete`.
    - No current `CharStateType.Incorrect`.
    - `endTime` is set.
  - If perfect and not yet reported, calls `onPerfectFinish(finalWpm)` once.

**Home**

- State:
  - `text` – current snippet.
  - `lang` – selected language.
  - `user` – current logged-in user (from `localStorage`).
- Functions:
  - `load(lang)` – fetches `GET http://localhost:3000/api/random-snippet?lang=LANG`.
  - `handlePerfectFinish(finalWpm)`:
    - If no user, do nothing.
    - Compare `finalWpm` with `user.best_wpm` (default 0).
    - If higher, `PATCH /api/users/:id/best-wpm` with `{ wpm: finalWpm }`.
    - Merge the patch result (`{ id, best_wpm }`) into existing `user` and write to `localStorage`.

**Profile**

- Reads `user` from `localStorage`.
- Displays:
  - Full name (`first_name last_name`).
  - Favorite word (or “None yet”).
  - Best WPM (or 0 if not set).

**Leaderboard**

- Fetches `GET http://localhost:3000/api/leaderboard?n=10`.
- Shows table: rank, username, best WPM.
- Highlights current user row (matching `user.username`) with “★ YOU”.

**Admin**

- Visible in Navbar only if `user.isadmin` (server sends this on login).
- Page `/admin`:
  - On mount, calls `GET /api/users?adminId=<currentUserId>`.
  - Renders table with:
    - ID, username, name, best WPM, admin flag, actions.
  - Delete:
    - On “Delete” click, confirms, then calls `DELETE /api/users/:id?adminId=<currentUserId>`.
    - On success, removes that user from local state.
    - Prevents deleting self (button disabled when `u.id === user.id`).

---

## Installation & Setup

Make sure you have git and node installed

```bash
git clone https://github.com/Cristian-Cortez/CodeTyper.git
cd CodeTyper

cd server
npm install

cd ../client
npm install
```

make server/.env:
POSTGRES_USERNAME=postgres.oolvkhaoizxeomhqkdge
POSTGRES_PASSWORD=Nelly123_Kevi
POSTGRES_HOST=aws-0-us-west-2.pooler.supabase.com
POSTGRES_PORT=6543
POSTGRES_DBNAME=postgres
PORT=3000

In both client and server, do:

```bash
npm run dev
```

## Database setup used

### users table

create table if not exists users (
  id serial primary key,
  first_name text not null,
  last_name text not null,
  username text unique not null,
  password_hash text not null,
  salt text not null,
  favorite_word text,
  best_wpm integer,
  isadmin boolean default false
);

### to make a user an admin

update users
set isadmin = true
where username = 'jake';

