import React from "react";
import styled from "styled-components";

const FAQ = props => (
	<FAQStyle>
		<h1 className="FAQHeader">FAQ</h1>
		<div className="FAQ_Sections">
			<ul>
				<li>
					<a href="#who">Who are we?</a>
				</li>
				<li>
					<a href="#why">Why was this made?</a>
				</li>
				<li>
					<a href="#how">How does it work?</a>
				</li>
				<li>
					<a href="#dataGeneration">Link to datageneration</a>
				</li>
				<li>
					<a href="#programming-tools">Link to programming info</a>
				</li>
				<li>
					<a href="#ranking">park ranking factors</a>
				</li>
				<li>
					<a href="#future">Future</a>
				</li>
				<li>
					<a href="#credits">credits</a>
				</li>
				<li>
					<a href="#contact">Contact</a>
				</li>
			</ul>
		</div>
		<div className="FAQ_Sections_Content">
			<h1 id="who">Who are we?</h1>
			<div className="Background">
				<span>
					STELLARGAZE is made by 3 developers who met at McMaster
					University's Computer Science department in Hamilton,
					Ontario. It was implemented by Dustin Jurkaulionis and Vlad
					Falach over the Summer of 2019. The idea came from Evan
					Reaume. It was designed by all three.
				</span>
			</div>
			<h1 id="why">Why was this made?</h1>
			<div className="Background">
				<span>
					This project was made to help us all make stargazing more
					enjoyable. To us, this means being able to see the stars as
					conveniently as possible. Our scoring algorithm hopes to
					achieve that for you, so that an enjoyable experience can be
					had by directing you to a nearby park with low light
					pollution and good weather.
				</span>
			</div>
			<h1 id="how">How does it work?</h1>
			<div className="Background">
				<span className="HowWork">
					This app works in 3 main steps: <br></br>
					<br></br>
					<ol>
						<li>
							We analyze a satellite image provided by the Earth
							Observations Group (EOG) at NOAA/NCEI. This
							Day/Night Band image captures the average radiance
							values of North America and New Zealand. The pixel
							values we extract correspond to a number on the
							Bortle scale, which gives an approximate measure of
							the night sky's brightness at a particular location.{" "}
						</li>
						<li>
							We then find the nearest parks to the user with a
							Bortle class of at most 4 - the Rural/Suburban
							transition zone. These parks are available to us
							using Open Street Maps and a database. We store only
							the parks below a certain radiance value,
							corresponding to a Bortle class. Thus, parks located
							in a densely populated area with lots of light
							pollution are not stored.{" "}
						</li>
						<li>
							Parks within a maximum of 200km of the user in lower
							light-pollution zones are given a score based on not
							only the light pollution, but cloud coverage (the %
							of the sky covered by clouds), humidity %, and moon
							phase.
						</li>
					</ol>
					Ideally, parks with a score of 75% are higher are the parks
					suitable for naked-eye stargazing. This score means that
					these parks have a Bortle class of 4 (Rural/suburban
					transition) or below, cloud coverage below 25%, humidity
					below 70%, and a moon phase below 50% illumination (First
					Quarter and below, for instance).
				</span>
			</div>
			<h2 id="dataGeneration">
				QGIS, openstreetmaps, satellite image, how it blends together,
				distances(crow flies /w research), weather(how we got around
				excess API calls)
			</h2>
			<h2 id="programming-tools">Mention the frameworks/tools used</h2>
			<h2 id="ranking">Factors (moon, humidity, cloud cov, lightpol) </h2>
			/*all dustin */
			<h1 id="future">Future notes</h1>
			<div className="Background">
				<span>
					This section will be continously updated. We plan on:{" "}
					<br></br>
					<br></br>
					<ul>
						<li>
							Push notifications so users don't have to
							continuously check the website - our server will run
							the queries for you and then notify if there are
							parks above a score of 75%.
						</li>
						<li>
							Refactoring the{" "}
							<a
								target="_blank"
								href="https://github.com/CyberTropic/StellarGaze"
							>
								code
							</a>{" "}
							to allow for better open-source collaboration.
						</li>

						<li>Android/iOS application.</li>
						<li>
							More accurate weather predictions using a paid
							weather API service.
						</li>
					</ul>
				</span>
			</div>
			<div id="credits"></div>
			<h1 id="contact">How do I contact you?</h1>
			<div className="Background">
				<span>
					Are you a sidewalk astronmer? Casual observer of the skies?
					Professional? A human? We'd love to hear your feedback! Our
					algorithm is continuously being improved so any advice
					and/or feedback would be greatly appreciated. Please email
					us at dev@stellargaze.com.
				</span>
			</div>
		</div>
	</FAQStyle>
);

export default FAQ;

const FAQStyle = styled.div`
	width: 75%;
	margin: auto auto;

	font-family: "Lato", sans-serif;
	h1 {
		color: ${props => props.theme.colorMedium};
		margin: 20px 0px;
	}
	.FAQ_Sections {
		font-size: 17px;
		ul {
			list-style: none;
			text-align: left;
		}
		a {
			color: ${props => props.theme.white};
			text-decoration: none;
			:hover {
				color: ${props => props.theme.colorMedium};
			}
		}
	}

	.FAQ_Sections_Content {
		color: ${props => props.theme.white};
		text-align: left;
		font-size: large;
		.HowWork {
			li {
				padding-bottom: 20px;
			}
		}

		.Background {
			background: ${props => props.theme.moonBackground};
			border-radius: 8px;
			padding: 20px;
		}
		span {
			a {
				color: ${props => props.theme.colorMedium};
				text-decoration: none;
				:hover {
					color: ${props => props.theme.yellow};
				}
			}
		}
	}
`;
