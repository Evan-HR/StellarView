import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return <FooterStyle>© Vlad Falach, Dustin Jurkaulionis 2019</FooterStyle>;
	}
}

export default Footer;

const FooterStyle = styled.div`
    width: 100%;
    background-color: black;
    color: #4E4F55;
`;
