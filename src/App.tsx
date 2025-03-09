import { Flex, Spin } from 'antd'
import { AppRoutes } from '@app/app-routes'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { ThemeProvider } from '@features/system/components'

//system
const HomePage = lazy(() => import('@features/system/pages/Home'))
const AboutPage = lazy(() => import('@features/system/pages/About'))
const NotFound = lazy(() => import('@features/system/pages/NotFound'))
const ErrorPage = lazy(() => import('@features/system/pages/Error'))

const DataRoute = lazy(() => import('@features/system/components/DataRoute'))

//login
const Login = lazy(() => import('@features/auth/pages/Login'))

const AuthProtectedComponent = lazy(() => import('@services/auth.service'))

//admin pages
const AdminLayout = lazy(() => import('@features/layout/admin'))
const Groups = lazy(() => import('@features/groups/pages/Groups'))
const Categories = lazy(() => import('@features/categories/pages/Categories'))
const Game = lazy(() => import('@features/games/pages/Game'))

const router = createBrowserRouter([
  {
    element: <DataRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: AppRoutes.main,
        element: <AuthProtectedComponent />
      },
      {
        path: AppRoutes.about,
        element: <AboutPage />
      },
      {
        path: AppRoutes.login,
        element: <Login />
      },
      {
        element: <AdminLayout children={<Groups />} />,
        path: AppRoutes.groups
      },
      {
        element: <AdminLayout children={<Categories />} />,
        path: AppRoutes.categories
      },
      {
        element: <AdminLayout children={<Game />} />,
        path: AppRoutes.game
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
