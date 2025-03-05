import { Flex, Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppRoutes } from './app/app-routes'

const HomePage = lazy(() => import('./features/system/pages/Home'))
const AboutPage = lazy(() => import('./features/system/pages/About'))
const NotFound = lazy(() => import('./features/system/pages/NotFound'))
const Groups = lazy(() => import('./features/groups/pages/Groups'))

const router = createBrowserRouter([
  {
    path: AppRoutes.main,
    element: <HomePage />
  },
  {
    path: AppRoutes.main,
    element: <AboutPage />
  },
  { path: AppRoutes.groups, element: <Groups /> },
  {
    path: '*',
    element: <NotFound />
  }
])
function App() {
  return (
    <Suspense
      fallback={
        <Flex className="w-screen h-dvh lg:h-screen" justify="center" align="center">
          <Spin spinning={true} size="large" />
        </Flex>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
