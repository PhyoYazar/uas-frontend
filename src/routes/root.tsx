import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard/Dashboard";
import { Settings } from "@/pages/Settings/Settings";
import { Student } from "@/pages/Students/Student";
import { SubjectDetail } from "@/pages/SubjectDetail/SubjectDetail";
import { SubjectCreate } from "@/pages/Subjects/SubjectCreate";
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
        path: "subject",
        element: <Subjects />,
      },
      {
        path: "subject/create",
        element: <SubjectCreate />,
      },
      {
        path: "subject/:subjectId",
        element: <SubjectDetail />,
      },
      { path: "student", element: <Student /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export function RootRoute() {
  return <RouterProvider router={router} />;
}
