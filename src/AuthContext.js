import React, { createContext } from "react";
import Api from "./Api";

export const AuthContext = createContext();

export class AuthProvider extends React.Component {
    state = {
        isLoggedIn: false,
    };

    login = () => {
        this.setState({ isLoggedIn: true });
    };

    logout = async () => {
        await Api.post('/accounts/logout', null, { withCredentials: true },
        )
        .then((res) => {
            console.log(res)
            this.setState({ isLoggedIn: false });
        })
        .catch((error) => {
            console.error("Error during logout:", error);
        });
    };

    // Restore auth state on mount
    componentDidMount() {
        this.checkAuthState();
    }

    checkAuthState = async () => {
        await Api.get('/accounts/check-session', {withCredentials: true})
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                this.setState({ isLoggedIn: true });
            }
        })
        .catch((error) => {
            this.setState({ isLoggedIn: false });
        });
    };

    render() {
        return (
        <AuthContext.Provider
            value={{
            isLoggedIn: this.state.isLoggedIn,
            login: this.login,
            logout: this.logout,
            }}
        >
            {this.props.children}
        </AuthContext.Provider>
        );
    }
}