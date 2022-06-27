import React, {Suspense} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/Layout'

const App = () => {
  return (
    <Router>
        <Suspense fallback={<p>Loading....</p>}>
            {/* {renderRoutes(routes)} */}
            <Routes>
            <Route exact path='/' name='Login' element={<Login/>}></Route>
            <Route exact path='/app' name='Layout' element={<Layout/>}></Route>
          </Routes>
        </Suspense>
    </Router>
  )
}

export default App;