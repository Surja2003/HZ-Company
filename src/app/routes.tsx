import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import("./pages/Home")).Home }),
      },
      {
        path: "about",
        lazy: async () => ({ Component: (await import("./pages/About")).About }),
      },
      {
        path: "services",
        lazy: async () => ({ Component: (await import("./pages/Services")).Services }),
      },
      {
        path: "portfolio",
        lazy: async () => ({ Component: (await import("./pages/Portfolio")).Portfolio }),
      },
      {
        path: "contact",
        lazy: async () => ({ Component: (await import("./pages/Contact")).Contact }),
      },
      {
        path: "hire-us",
        lazy: async () => ({ Component: (await import("./pages/HireUs")).HireUs }),
      },
    ],
  },
]);
