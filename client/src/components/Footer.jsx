import React, { Component } from "react";
import styled from "styled-components";

class Footer extends Component {
  render() {
    return (
      <FooterStyle>
        <a href="/FAQ" className="FAQ_footer">
          FAQ
        </a>
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
  font-weight: 500;
  letter-spacing: 0.2em;
  background-color: ${(props) => props.theme.prettyDark};
  color: ${(props) => props.theme.cardLight};
  margin: 30px auto 15px auto;
  font-weight: 400;
  font-size: 11px;

  @media screen and (min-width: 320px) {
    font-size: 11px;
  }

  @media screen and (min-width: 400px) {
    font-size: 12px;
    width: 90%;
  }

  @media screen and (min-width: 600px) {
    font-size: 12px;
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

  @media screen and (max-width: 320px) {
    .FAQ_footer {
      display: flex;
    }
    .Names {
      display: none;
    }
  }
  @media screen and (min-width: 320px) {
    .FAQ_footer {
      display: flex;
    }
    .Names {
      display: none;
    }
  }
  @media screen and (min-width: 600px) {
    .FAQ_footer {
      display: none;
    }
  }
`;
