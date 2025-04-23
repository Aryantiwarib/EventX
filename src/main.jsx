import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from 'react-redux';
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Signup from "./pages/Signup";
import Home from "./pages/Home.jsx";
import AuthLayout from "./components/AuthLayout/AuthLayout.jsx"
import Login from "./pages/Login.jsx"
// import PaymentComponents from "./Features/PaymentComponents.tsx"
// import Scanner from "./Features/Scanner.jsx"
import AllEvents from "./pages/AllEvents.jsx"
import { AddEvent } from './components/index.js';
import EventDetails from './pages/EventDetails.jsx';
import EditEvent from "./pages/EditEvent.jsx"
import BookEvent from './BookingAndPayment/BookEvent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EventAttendees from './components/EventAttendees.jsx';
import Support from './pages/Support.jsx';
import WorkFlow from './pages/WorkFlow';
import Notifications from './pages/Notifications.jsx';
import PaymentHistory from './pages/PaymentHistory';
import EventTickets from './components/Tickets/EventTickets';
import EventTicket from './components/Tickets/EventTicket';
import Tickets from './components/Tickets/Tickets';
import Contact from './pages/Contact.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/login",
        element:(
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        ),
      },
      {
        path:"/signup",
        element:<AuthLayout authentication={false}>
        <Signup />
        </AuthLayout>
        
      },
      {
        path:"/work-flow",
        element:(
          <AuthLayout authentication>
          {" "}
        <WorkFlow />
        </AuthLayout>
        )
        
      },
      {
        path:"/add-event",
        element:(
          <AuthLayout authentication>
            {""}
            <AddEvent/>
          </AuthLayout>
        )
      },
      {
        path:"/events",
        element:(
          <AuthLayout authentication>
            {""}
            <AllEvents/>
          </AuthLayout>
        )
      },
      {
        path:"/events/:eventId",
        element:(
          <AuthLayout authentication>
            {""}
            <EventDetails/>
          </AuthLayout>
        )
      },
      
      {
        path:"/events/category/:category",
        element:(
          <AuthLayout authentication>
            {""}
            <AllEvents/>
          </AuthLayout>
        )
      },

      {
        path: "/edit-event/:eventId",
        element: (
            <AuthLayout authentication>
                {" "}
                <EditEvent />
            </AuthLayout>
        ),
    },
    {
      path: "/book-event/:eventId",
      element: (
          <AuthLayout authentication>
              {" "}
              <BookEvent />
          </AuthLayout>
      ),
  },
  {
    path: "/dashboard",
    element: (
        <AuthLayout authentication>
            {" "}
            <Dashboard />
        </AuthLayout>
    ),
},
  {
    path: "/event-attendees/:eventId",
    element: (
        <AuthLayout authentication>
            {" "}
            <EventAttendees />
        </AuthLayout>
    ),
},
{
  path: "/support",
  element: (
      <AuthLayout authentication>
          {" "}
          <Support />
      </AuthLayout>
  ),
},
{
  path: "/notifications",
  element: (
      <AuthLayout authentication>
          {" "}
          <Notifications />
      </AuthLayout>
  ),
},
{
  path: "/payment-history",
  element: (
      <AuthLayout authentication>
          {" "}
          <PaymentHistory />
      </AuthLayout>
  ),
},

{
  path: "/tickets",
  element: (
      <AuthLayout authentication>
          {" "}
          <Tickets />
      </AuthLayout>
  ),
},
{
  path: "/tickets/:eventId",
  element: (
      <AuthLayout authentication>
          {" "}
          <EventTickets />
      </AuthLayout>
  ),
},
{
  path: "/events/:eventId/tickets/:ticketId",
  element: (
      <AuthLayout authentication>
          {" "}
          <EventTicket />
      </AuthLayout>
  ),
},
{
  path: "/contact",
  element: (
      <AuthLayout authentication>
          {" "}
          <Contact />
      </AuthLayout>
  ),
},
{
  path: "/about-us",
  element: (
      <AuthLayout authentication>
          {" "}
          <AboutUs />
      </AuthLayout>
  ),
},
{
  path: "/legal/terms",
  element: (
      <AuthLayout authentication>
          {" "}
          <Terms />
      </AuthLayout>
  ),
},
{
  path: "/legal/privacy",
  element: (
      <AuthLayout authentication>
          {" "}
          <Privacy />
      </AuthLayout>
  ),
},
{
  path: "/legal/refund",
  element: (
      <AuthLayout authentication>
          {" "}
          <Refund />
      </AuthLayout>
  ),
},




      
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
        <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);















// Another Route set up





// import './index.css';
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { Provider } from 'react-redux';
// import store from './store/store.js'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import Signup from "./pages/Signup";
// import Home from "./pages/Home.jsx";
// import AuthLayout from "./components/AuthLayout/AuthLayout.jsx"
// import Login from "./pages/Login.jsx"
// import AllEvents from "./pages/AllEvents.jsx"
// import { AddEvent } from './components/index.js';
// import EventDetails from './pages/EventDetails.jsx';
// import EditEvent from "./pages/EditEvent.jsx"
// import BookEvent from './BookingAndPayment/BookEvent.jsx';
// import Dashboard from './pages/Dashboard.jsx';
// import EventAttendees from './components/EventAttendees.jsx';
// import Support from './pages/Support.jsx';
// import WorkFlow from './pages/WorkFlow';
// import Notifications from './pages/Notifications.jsx';
// import PaymentHistory from './pages/PaymentHistory';
// import EventTickets from './components/Tickets/EventTickets';
// import EventTicket from './components/Tickets/EventTicket';
// import Tickets from './components/Tickets/Tickets';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Home />
//       },
//       {
//         path: "login",
//         element: (
//           <AuthLayout authentication={false}>
//             <Login />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "signup",
//         element: (
//           <AuthLayout authentication={false}>
//             <Signup />
//           </AuthLayout>
//         )
//       },
//       // Events routes
//       {
//         path: "events",
//         children: [
//           {
//             index: true,
//             element: (
//               <AuthLayout authentication>
//                 <AllEvents />
//               </AuthLayout>
//             )
//           },
//           {
//             path: ":category",
//             element: (
//               <AuthLayout authentication>
//                 <AllEvents />
//               </AuthLayout>
//             )
//           },
//           {
//             path: "detail/:eventId",
//             element: (
//               <AuthLayout authentication>
//                 <EventDetails />
//               </AuthLayout>
//             )
//           }
//         ]
//       },
//       // Tickets routes
//       {
//         path: "tickets",
//         children: [
//           {
//             index: true,
//             element: (
//               <AuthLayout authentication>
//                 <Tickets />
//               </AuthLayout>
//             )
//           },
//           {
//             path: ":eventId",
//             element: (
//               <AuthLayout authentication>
//                 <EventTickets />
//               </AuthLayout>
//             )
//           },
//           {
//             path: ":eventId/:ticketId",
//             element: (
//               <AuthLayout authentication>
//                 <EventTicket />
//               </AuthLayout>
//             )
//           }
//         ]
//       },
//       // Other authenticated routes
//       {
//         path: "add-event",
//         element: (
//           <AuthLayout authentication>
//             <AddEvent />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "edit-event/:eventId",
//         element: (
//           <AuthLayout authentication>
//             <EditEvent />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "book-event/:eventId",
//         element: (
//           <AuthLayout authentication>
//             <BookEvent />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "dashboard",
//         element: (
//           <AuthLayout authentication>
//             <Dashboard />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "event-attendees/:eventId",
//         element: (
//           <AuthLayout authentication>
//             <EventAttendees />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "support",
//         element: (
//           <AuthLayout authentication>
//             <Support />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "notifications",
//         element: (
//           <AuthLayout authentication>
//             <Notifications />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "payment-history",
//         element: (
//           <AuthLayout authentication>
//             <PaymentHistory />
//           </AuthLayout>
//         )
//       },
//       {
//         path: "work-flow",
//         element: (
//           <AuthLayout authentication>
//             <WorkFlow />
//           </AuthLayout>
//         )
//       }
//     ]
//   }
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </React.StrictMode>
// );