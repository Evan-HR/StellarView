import React, { Component }  from 'react';
import styled from 'styled-components';

const Footer = () => {
    return (  
        <FooterStyle>
        <div>
            <p>THIS IS A FOOTER</p>
        </div>
        </FooterStyle>
    );
}
 
export default Footer;
/////////////////////////////////////////

const FooterStyle=styled.div`
font-size: 100px;
color: white;

position: absolute;
  bottom: 0;
  width: 100%;
  background-color:aquamarine;
    

    



`

