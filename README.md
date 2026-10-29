# Event Booking Platform

React + Redux Toolkit + React Router + Axios + json-server + Bootstrap (plain div + className)

## Run karne ke steps

    npm install
    npm run server    (json-server -> http://localhost:5000)
    npm run dev       (React app -> http://localhost:5173)

Dono commands alag-alag terminal me chalao.

## Demo login

| Role      | Email               | Password |
|-----------|---------------------|----------|
| Organizer | organizer@gmail.com | 123456   |
| Customer  | user@gmail.com      | 123456   |

## Folder structure

- db.json            -> users, events, bookings (json-server database)
- src/api            -> axios instance (baseURL http://localhost:5000)
- src/redux          -> store + auth / events / bookings slices (reducers + async thunks)
- src/components     -> Navbar, EventCard, ProtectedRoute
- src/pages          -> all pages (Home, Login, Register, EventDetails, MyBookings, Organizer pages)
