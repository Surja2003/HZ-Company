import { RouterProvider } from 'react-router';
import { router } from './routes';
import { RouteFallback } from "./components/RouteFallback";

export default function App() {
  return <RouterProvider router={router} fallbackElement={<RouteFallback />} />;
}
