import React from "react";

import { AuthProvider, AuthConsumer } from "./AuthContext";
import App from "../App";
//import { Cookies } from "react-cookie";

// {"cookie":{"originalMaxAge":null,"expires":null,
// "httpOnly":true,"path":"/"},"passport":{"user":{"user_id":81}}}
export class Auth extends React.Component {
	state = {
		//userID: cookies.get().passport.user.user_id,
		firstName: "Sanchez",
		isAuth: false
	};

	render() {
		//console.log(cookies.get().passport.user.user_id);

		return (
			// We wrap all of the components that need access
			// to the lastName property in FamilyProvider.
			<AuthProvider value={this.state}>
				<App />
			</AuthProvider>
		);
	}
}

export default Auth;

// const Mother = () => {
// 	return <Child />;
// };

// const Child = () => {
// 	// We wrap the component that actaully needs access to
// 	// the lastName property in FamilyConsumer
// 	return <FamilyConsumer>{context => <p>{context}</p>}</FamilyConsumer>;
// };
