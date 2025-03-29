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
import PaymentComponents from "./Features/PaymentComponents.tsx"
import Scanner from "./Features/Scanner.jsx"
import AllEvents from "./pages/AllEvents.jsx"
import { AddEvent } from './components/index.js';
import EventDetails from './pages/EventDetails.jsx';
import EditEvent from "./pages/EditEvent.jsx"
import BookEvent from './BookingAndPayment/BookEvent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EventAttendees from './components/EventAttendees.jsx';
import Support from './pages/Support.jsx';

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
        path:"/about",
        element:(
          <AuthLayout authentication>
          {" "}
        <PaymentComponents />
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
        path: "/events/:eventId",  // Dynamic route parameter
        element: (
          <AuthLayout authentication>
            {" "}
            <EventDetails />
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
