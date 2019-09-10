import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return <FooterStyle><span>MADE WITH 🌌 <br></br> <span className="Names">Vlad Falach x Dustin Jurkaulionis</span></span></FooterStyle>;
	}
}

export default Footer;

const FooterStyle = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    font-family: Lato;
    align-items: center;

    height: 150px;
    /* font-family: monospace; */
    font-weight: 600;
    font-size: 22px;
    background-color: ${props=>props.theme.prettyDark};
    color: ${props => props.theme.white};
    .Names{
        font-family: monospace;
        font-weight: 400;
        font-size: 13px;
    }
`;
