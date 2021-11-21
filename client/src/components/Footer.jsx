import React, { Component } from 'react';
import styled from 'styled-components';

class Footer extends Component {
  render() {
    return (
      <FooterStyle>
        <span className="Contact">
          <a href="mailto:dev@stellargaze.com">dev@stellargaze.com</a>
        </span>
      </FooterStyle>
    );
  }
}

export default Footer;

const FooterStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-family: Lato;
  align-items: center;
  height: 110px;
  font-weight: 500;
  letter-spacing: 0.2em;
  background-color: ${(props) => props.theme.prettyDark};
  color: ${(props) => props.theme.cardLight};
  margin: 30px auto 15px auto;
  font-weight: 400;
  font-size: 11px;
  padding: 10px 13px;
  /* max-width: 600px; */

  @media screen and (min-width: 320px) {
    font-size: 11px;
    height: 150px;
  }

  @media screen and (min-width: 400px) {
    font-size: 12px;
    width: 90%;
  }

  @media screen and (min-width: 450px) {
    height: 110px;
  }

  @media screen and (min-width: 600px) {
    font-size: 12px;
  }

  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    'Quote Quote Quote'
    'Vlad Dustin Evan'
    'Contact Contact Contact';
  /* .Copyright{
		grid-area: Copyright;
	} */
  .Vlad {
    grid-area: Vlad;
  }
  .Dustin {
    grid-area: Dustin;
    padding: 0 10px;
  }
  .Evan {
    grid-area: Evan;
    color: ${(props) => props.theme.white};
    font-weight: 300;
  }
  .Names {
    display: flex;
    margin: 7px 0;
    flex-direction: column;
    font-weight: 600;
    color: ${(props) => props.theme.colorMedium};
    @media screen and (min-width: 455px) {
      flex-direction: row;
    }
  }

  .Quote {
    grid-area: Quote;
    a {
      color: ${(props) => props.theme.pink};
      font-weight: 600;
    }
  }

  .Contact {
    grid-area: Contact;
  }

  a {
    all: unset;
    padding: 0px 4px;
    :hover,
    :active {
      color: ${(props) => props.theme.highlightPink};
      transition: color 0.2s ease;
      cursor: pointer;
    }
  }
`;
