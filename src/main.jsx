import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  RouterProvider, createRootRoute, createRoute, createRouter,
} from '@tanstack/react-router';
import { Home, Idle, Shell, Shop, Wander, Yarn } from './App.jsx';
import './styles.css';

const rootRoute = createRootRoute({ component: Shell });
const makeRoute = (path, component) => createRoute({ getParentRoute: () => rootRoute, path, component });
const routeTree = rootRoute.addChildren([
  makeRoute('/', Home), makeRoute('/wander', Wander), makeRoute('/idle', Idle),
  makeRoute('/yarn', Yarn), makeRoute('/shop', Shop),
]);
const router = createRouter({ routeTree, defaultPreload: 'intent', scrollRestoration: true });

createRoot(document.getElementById('root')).render(<StrictMode><RouterProvider router={router} /></StrictMode>);
