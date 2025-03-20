import { Flex, Spin } from 'antd'
import { AppRoutes } from '@app/app-routes'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Pto } from '@rtx/types'
// import { ThemeProvider } from '@features/system/components'

//system
// const HomePage = lazy(() => import('@features/system/pages/Home'))
const AboutPage = lazy(() => import('@features/system/pages/About'))
const NotFound = lazy(() => import('@features/system/pages/NotFound'))
const ErrorPage = lazy(() => import('@features/system/pages/Error'))

const DataRoute = lazy(() => import('@features/system/components/DataRoute'))

//login
const Login = lazy(() => import('@features/auth/pages/Login'))

const AuthComponent = lazy(() => import('@features/auth/components/AuthComponent'))
const ProtectedRoute = lazy(() => import('@features/auth/components/ProtectedRoute'))

//admin pages
const AdminLayout = lazy(() => import('@features/layout/admin'))
const Groups = lazy(() => import('@features/groups/pages/Groups'))
const Categories = lazy(() => import('@features/categories/pages/Categories'))
const Game = lazy(() => import('@features/games/pages/Game'))
const Nodes = lazy(() => import('@features/nodes/pages/Nodes'))
const Answers = lazy(() => import('@features/answers/pages/Answers'))
const AllUsers = lazy(() => import('@features/users/pages/Users'))
const Results = lazy(() => import('@features/results/pages/Results'))

const GroupDetailsPage = lazy(() => import('@features/groups/pages/GroupDetails'))

//user pages
const UserLayout = lazy(() => import('@features/layout/users'))
const CurrentGroup = lazy(() => import('@features/groups/pages/CurrentGroup'))

const router = createBrowserRouter([
  {
    element: <DataRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: AppRoutes.main,
        element: <AuthComponent />
      },
      {
        path: AppRoutes.login,
        element: <Login />
      },
      {
        element: <ProtectedRoute allowedRoles={[Pto.Users.UserRole.Admin, Pto.Users.UserRole.SystemAdmin]} />,
        children: [
          {
            element: <AdminLayout children={<Groups />} />,
            path: AppRoutes.groups
          },
          {
            element: <AdminLayout children={<GroupDetailsPage />} />,
            path: `${AppRoutes.groups}/:groupId`
          },
          {
            element: <AdminLayout children={<Categories />} />,
            path: AppRoutes.categories
          },
          {
            element: <AdminLayout children={<Game />} />,
            path: AppRoutes.game
          },
          {
            element: <AdminLayout children={<Nodes />} />,
            path: AppRoutes.nodes
          },
          {
            element: <AdminLayout children={<AllUsers />} />,
            path: AppRoutes.users
          },
          {
            element: <AdminLayout children={<Answers />} />,
            path: AppRoutes.allAnswers
          },
          {
            element: <AdminLayout children={<Answers processed={false} />} />,
            path: AppRoutes.unprocessedAnswers
          },
          {
            element: <AdminLayout children={<Answers processed={true} />} />,
            path: AppRoutes.processedAnswers
          },
          {
            element: <AdminLayout children={<Results />} />,
            path: AppRoutes.results
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <UserLayout children={<AboutPage />} />,
            path: AppRoutes.about
          },
          {
            element: <UserLayout children={<CurrentGroup />} />,
            path: AppRoutes.currentGroup
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])
function App() {
  return (
    // <ThemeProvider>
    <Suspense
      fallback={
        <Flex className="w-screen h-dvh lg:h-screen" justify="center" align="center">
          <Spin spinning={true} size="large" />
        </Flex>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
    // </ThemeProvider>
  )
}

export default App
