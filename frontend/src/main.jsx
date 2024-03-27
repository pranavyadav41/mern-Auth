import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom';
import store from './store.js';
import { Provider } from 'react-redux';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PrivateRoute from './components/PrivateRoute.jsx';
import Homescreen from './screens/HomeScreen.jsx'
import LoginScreen from'./screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import AdminLogin from './screens/AdminLogin.jsx'
import Dashboard from './screens/Dashboard.jsx';
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route index path='/' element={<Homescreen/>} />
      <Route path='/signin' element={<LoginScreen/>}/>
      <Route path='/signup' element={<RegisterScreen/>} />
      <Route path='/admin' element={<AdminLogin/>}/>
      {/* Private routes */}
      <Route path='' element={<PrivateRoute />}>
      <Route path='/profile' element={<ProfileScreen/>} />
      </Route>
      
      <Route path="" element={<AdminPrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </Provider>
  
)
