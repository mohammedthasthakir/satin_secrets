import { RouterProvider } from 'react-router'
import { router } from './routes'
import { AppProvider } from '../store/AppProvider'

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
