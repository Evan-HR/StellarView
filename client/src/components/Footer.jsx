import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return <FooterStyle><span>MADE WITH ❤ <br></br> © Vlad Falach and Dustin Jurkaulionis</span></FooterStyle>;
	}
}

export default Footer;

const FooterStyle = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;

    height: 150px;
    font-family: monospace;
    font-weight: 300;
    font-size: 25px;
    background-color: black;
    color: whitesmoke;
`;
