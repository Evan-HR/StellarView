import React from "react";
import styled from "styled-components";

const FAQ = props => (
	<React.Fragment>
		<h1>FAQ</h1>
		<a href="#who">Who we are</a>
		<a href="#why"></a>
		<a href="#tutorial"></a>
		<a href="#how">How does it work </a>
		<a href="#dataGeneration">Link to datageneration</a>
		<a href="#programming-tools">Link to programming info</a>
		<a href="#ranking">park ranking factors</a>
		<a href="#future">Future Notes</a>
		<a href="#credits">Link to credits</a>
		<a href="#contact">Contact</a>
		/*all dustin */
		<h1 id="who">This is whom we is</h1>
		<h1 id="why">This is the inspo stuff</h1>
		<h1 id="tutorial">This is the tutorial section</h1>
		/*dustin will do some of programming tools / data gen / and write entire
		overview */
		<h1 id="how">How does it work?</h1>
		<h2 id="dataGeneration">
			QGIS, openstreetmaps, satellite image, how it blends together,
			distances(crow flies /w research), weather(how we got around excess
			API calls)
		</h2>
		<h2 id="programming-tools">Mention the frameworks/tools used</h2>
		<h2 id="ranking">Factors (moon, humidity, cloud cov, lightpol) </h2>
		/*all dustin */
		<h1 id="future">
			Ideas for the future, refactoring lots of the code, mobile version,
			push notifications
		</h1>
		<div id="credits">
			Mention all the imgs / open source stuff / the Dr. (astronomer) /
			tech stuff / dataset satellite images / lightpollutionmaps.info /
			openstreetmaps{" "}
		</div>
		<h1 id="contact">
			Are you a sidewalk astronmer? Professional? We'd love to hear your
			feedback! Our algorithm is currently under-development so any advice
			and/or feedback please email us @{" "}
		</h1>
	</React.Fragment>
);

export default FAQ;

//////////////////////////////////////////// Dustin's WORLD FAMOUS functional components
