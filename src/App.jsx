import {
  BrowserRouter as Router,
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import AuthInitializer from './context/AuthInitializer';
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {

  return (
    <AuthInitializer>
      {/* <AuthProvider> */}

      <Router>
        {/*//! Loading Bar  */}
        <AppRoutes />

      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          }
        }}
      />

      {/* </AuthProvider> */}
    </AuthInitializer>
  )
}
export default App