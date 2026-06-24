import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRouter from './router/AppRouter'
import { AuthContextProvider } from '../features/Auth/context/AuthContext'
import { AuthUiContextProvider } from '../features/Auth/context/AuthUiContext'


function App() {

  return (
    <BrowserRouter>

      {/* Auth context provider */}
      <AuthContextProvider>

        {/* auth ui provider */}  
        <AuthUiContextProvider>


          <AppRouter />


        </AuthUiContextProvider>


      </AuthContextProvider>
    </BrowserRouter>

  )
}

export default App
