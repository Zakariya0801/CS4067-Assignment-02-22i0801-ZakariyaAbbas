import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import SignUpPage from './SignUp'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './NavBar';
import EventsPage from './Events';
function App() {

  return (
    <>
      <Router >
      {/* <Layout> */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Dashboard />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          
        </Routes>
      {/* </Layout> */}
    </Router>
    </>
  )
}

export default App
