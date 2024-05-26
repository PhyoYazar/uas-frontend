import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard/Dashboard";
import { Settings } from "@/pages/Settings/Settings";
import { Student } from "@/pages/Students/Student";
import { SubjectDetail } from "@/pages/SubjectDetail/SubjectDetail";
import { Subjects } from "@/pages/Subjects/Subjects";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "subjects",
        element: <Subjects />,
      },
      {
        path: "subjects/:subjectId",
        element: <SubjectDetail />,
      },
      { path: "students", element: <Student /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export function RootRoute() {
  return <RouterProvider router={router} />;
}
