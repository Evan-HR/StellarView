import React from "react";
import styled from "styled-components";

const backdrop = props => <Backdrop onClick={props.click} />;

export default backdrop;
/////////////////////////////////////
const Backdrop = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	z-index: 6;
	top: 0;
	left: 0;
`;
