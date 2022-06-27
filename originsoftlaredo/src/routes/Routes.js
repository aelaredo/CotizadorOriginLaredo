import React, { lazy } from 'react'
import RouteController from '../controllers/RouteController'
const Login = lazy(() => import('../components/Login'))
const Layout= lazy(() => import('../components/Layout'))

const routes = [
    {
        path: "/",
        exact: true,
        render: props => <Login {...props} />
    },
    {
        path: "/app",
        render: props => <RouteController element={<Login/>} {...props} />,
        routes: [
            {
                path: "/app",
                exact: true,
                render: props => <RouteController element={<Layout/>} {...props} />
            }
        ]
    }
]

export default routes