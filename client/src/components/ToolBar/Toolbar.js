import React, { Component } from 'react';
import DrawerToggleButton from './DrawerToggleButton';
import styled from 'styled-components';
import { AuthProvider, AuthConsumer } from '../AuthContext';
import { withRouter, Link } from 'react-router-dom';
import Login from '../Login';
import axios from 'axios';
import Register from '../Register';
import FAQ from '../FAQ';
import logo from '../style/Media/StellarStarLogo.svg';
import SVG from 'react-inlinesvg';

class Toolbar extends Component {
  state = {};

  handleLogout(e) {
    e.preventDefault();
    axios.get('/api/logout');
    this.props.handleLogoutState();
  }

  render() {
    return (
      <ToolbarStyle>
        <div className="toolbar__center">
          <nav className="toolbar__navigation">
            <div>
              <DrawerToggleButton click={this.props.drawerClickHandler} />
            </div>

            <div className="toolbarLogo">
              <Link to="/home">
                <SVG src={logo}></SVG>
              </Link>
            </div>
            <div className="spacer" />
            <div className="toolbar_navigation-items">
              <ul>
                {/* <AuthConsumer>
                  {(x) => {
                    if (x.isAuth === true) {
                      return (
                        <li>
                          <Link to="/profile">
                            <div className="toolbarLink">FAVORITES</div>
                          </Link>
                        </li>
                      );
                    }
                  }}
                </AuthConsumer>
                <AuthConsumer> */}
                {/* {(x) => {
                    if (x.isAuth === true) {
                      return (
                        <li>
                          <div
                            className="toolbarLink"
                            onClick={(e) => this.handleLogout(e)}
                          >
                            LOGOUT
                          </div>
                        </li>
                      );
                    } else {
                      return (
                        <li>
                          <Login handleLogin={this.props.handleLogin}>
                            <div className="toolbarLink">LOGIN</div>
                          </Login>
                        </li>
                      );
                    }
                  }}
                </AuthConsumer>
                <li>
                  <Register handleLogin={this.props.handleLogin}>
                    <div className="toolbarLink">REGISTER</div>
                  </Register>
                </li>
                <li> */}
                <Link to="/FAQ">
                  <div className="toolbarLink">FAQ</div>
                </Link>
              </ul>
            </div>
          </nav>
        </div>
      </ToolbarStyle>
    );
  }
}

export default withRouter(Toolbar);

////////////////////////////////////////////////

const ToolbarStyle = styled.header`
  width: 100%;
  margin: 0.3rem 0px 0px 0px;
  left: 0;

  @media screen and (min-width: 480px) {
    margin: 0.3rem 0px 0px 0px;
  }

  @media screen and (min-width: 801px) {
    /* margin: 30px 0px 0px 0px; */
  }

  .toolbar__center {
    display: block;
    /* width: 85%; */
    height: 100%;
    margin: 0.5rem auto 0 auto;
    width: 90%;
    /* max-width: 1467px; */

    @media screen and (min-width: 320px) {
      width: 90%;
      margin: 0.5rem auto 0 auto;
    }

    @media screen and (min-width: 480px) {
      width: 90%;
      margin: 0.5rem auto 0 auto;
    }

    @media screen and (min-width: 600px) {
      padding: 0px 6.5% 10px 6.5%;
      width: 100%;
      margin: 2rem auto 0 auto;
    }

    @media screen and (min-width: 1025px) {
      padding: 0px 6.5% 30px 6.5%;
      margin: 2rem auto 0 auto;
    }
  }

  .toolbarLogo {
    svg {
      width: 80%;
      margin: 0 10% 0 0px;
      @media screen and (min-width: 320px) {
        max-width: 300px;
      }

      @media screen and (min-width: 480px) {
        width: 80%;
        margin: 0 10% 0 0px;
        max-width: 360px;
      }

      @media screen and (min-width: 600px) {
        width: 80%;
        margin: 0 35% 0 0px;
      }
    }
  }

  .toolbar__navigation {
    display: flex;
    align-items: center;
    height: 100%;
    bottom: 0;
  }

  .toolbar_navigation-items {
    margin-top: 1%;

    a {
      font-family: 'Lato', sans-serif;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.08em;
      transition: color 0.2s ease;
      color: ${(props) => props.theme.white};
      :hover,
      :active {
        transition: color 0.2s ease;
        color: ${(props) => props.theme.colorMedium};
      }
    }

    ul {
      text-transform: uppercase;
      list-style: none;
      padding: 0;
      display: flex;
    }

    li {
      padding: 0 0.5rem;
      :last-child {
        padding: 0 0 0 0.5rem;
      }
    }
  }

  .toolbarLink {
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.08em;
    transition: color 0.2s ease;
    color: ${(props) => props.theme.white};
    :hover,
    :active {
      transition: color 0.2s ease;
      color: ${(props) => props.theme.colorMedium};
    }
  }

  @media screen and (max-width: 320px) {
    .toolbar_navigation-items {
      display: none;
    }
  }
  @media screen and (min-width: 320px) {
    .toolbar_navigation-items {
      display: none;
    }
  }
  @media screen and (min-width: 600px) {
    .toolbar_navigation-items {
      display: flex;
    }
  }

  .spacer {
    flex: 1;
  }
`;
