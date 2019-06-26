import React from "react";

import { AuthProvider, AuthConsumer } from "./AuthContext";
import App from "../App";
import axios from 'axios';
//import { Cookies } from "react-cookie";

// {"cookie":{"originalMaxAge":null,"expires":null,
// "httpOnly":true,"path":"/"},"passport":{"user":{"user_id":81}}}
export class Auth extends React.Component {
	state = {
		//userID: cookies.get().passport.user.user_id,
		firstName: "",
		userID:"",
		isAuth: "",
		apiResponse: []
	};

	

	callAPI() {
		  
		axios.get("/api/getUserInfo")

		.then(({ data })=> {
			this.setState({ 
			firstName: "",
			isAuth: data.isAuth, 
			userID: data.userID
		  });
		})
	   .catch((error)=>{
		  console.log(error);
	   });
	}

	componentWillMount() {
		this.callAPI();
	}

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
