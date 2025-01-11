import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, role, allowedRole, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                role === allowedRole ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" />
                )
            }
        />
    );
};

export default ProtectedRoute;
