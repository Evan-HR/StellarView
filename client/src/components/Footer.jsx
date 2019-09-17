import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
	render() {
		return <FooterStyle>© Vlad Falach x Dustin Jurkaulionis x Evan Reaume</FooterStyle>;
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
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.2em;
    background-color: ${props=>props.theme.prettyDark};
    color: ${props => props.theme.cardLight};
   
        font-weight: 400;
        font-size: 13px;
  
`;
