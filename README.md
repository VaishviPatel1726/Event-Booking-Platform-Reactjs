Event Booking Platform

React + Redux Toolkit + React Router + Axios + json-server + Bootstrap (plain div + className)

Product Goal
Build an event discovery and booking platform where users can discover events and reserve tickets.
Users
Customer
Register
Login
Browse events
Search events
Filter events
View event details
Book tickets
View booking history
Cancel booking
Logout
Organizer
Can:
Create event
Edit event
Delete event
View bookings
Manage available seats
Suggested Collections
users
events
bookings
Event Fields
title
description
location
date
time
category
price
totalSeats
availableSeats
createdBy
Booking Fields
userId
eventId
numberOfTickets
totalAmount
status
bookingDate
Reference
Use BookMyShow as a product reference.
Study:
Event discovery
Categories
Event details
Seat/ticket selection
Booking history



## Run karne ke steps

    npm install
    npm run server    (json-server -> http://localhost:5000)
    npm run dev       (React app -> http://localhost:5173)

Dono commands alag-alag terminal me chalao.

## Folder structure

- db.json            -> users, events, bookings (json-server database)
- src/api            -> axios instance (baseURL http://localhost:5000)
- src/redux          -> store + auth / events / bookings slices (reducers + async thunks)
- src/components     -> Navbar, EventCard, ProtectedRoute
- src/pages          -> all pages (Home, Login, Register, EventDetails, MyBookings, Organizer pages)
