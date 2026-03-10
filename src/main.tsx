import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AttendeeLandingPage from './pages/attendee-landing-page.tsx';
import { AuthProvider } from 'react-oidc-context';
import { createBrowserRouter, RouterProvider } from 'react-router';
import OrganizersLandingPage from './pages/organizers-landing-page.tsx';
import DashboardManageEventPage from './pages/dashboard-manage-event-page.tsx';
import LoginPage from './pages/login-page.tsx';
import ProtectedRoute from './components/protected-route.tsx';
import CallbackPage from './pages/callback-page.tsx';
import DashboardListEventsPage from './pages/dashboard-list-events-page.tsx';
import PublishedEventsPage from './pages/published-events-page.tsx';
import PurchaseTicketPage from './pages/purchase-ticket-page.tsx';
import DashboardListTickets from './pages/dashboard-list-tickets.tsx';
import DashboardPage from './pages/dashboard-page.tsx';
import DashboardViewTicketPage from './pages/dashboard-view-ticket-page.tsx';
import DashboardValidateQrPage from './pages/dashboard-validate-qr-page.tsx';
import ErrorPage from './components/error-page.tsx';
import NotFoundPage from './components/not-found-page.tsx';
import ErrorBoundary from './components/error-boundary.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AttendeeLandingPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/callback',
    Component: CallbackPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    Component: LoginPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/events/:id',
    Component: PublishedEventsPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/events/:eventId/purchase/:ticketTypeId',
    element: (
      <ProtectedRoute>
        <PurchaseTicketPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/organizers',
    Component: OrganizersLandingPage,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/events',
    element: (
      <ProtectedRoute>
        <DashboardListEventsPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/tickets',
    element: (
      <ProtectedRoute>
        <DashboardListTickets />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/tickets/:id',
    element: (
      <ProtectedRoute>
        <DashboardViewTicketPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/validate-qr',
    element: (
      <ProtectedRoute>
        <DashboardValidateQrPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/events/create',
    element: (
      <ProtectedRoute>
        <DashboardManageEventPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard/events/update/:id',
    element: (
      <ProtectedRoute>
        <DashboardManageEventPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);

const oidcConfig = {
  authority: 'http://localhost:9090/realms/event-ticket-platform',
  client_id: 'event-ticket-platform-app',
  redirect_uri: 'http://localhost:5173/callback',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider {...oidcConfig}>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
