import React from "react";
import styled from "styled-components";
import QGISModel from "./style/Images/QGISModel.png";
import WeatherEstimation from "./style/Images/Weather-Estimation-Test.png";

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
					<a href="#register">Why register?</a>
				</li>
				<li>
					<a href="#secure">How secure is this?</a>
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
					Ontario. The idea came from Evan Reaume, after realizing the
					current applications out there are not so user-friendly. The
					front and back-end was fully implemented by both Dustin
					Jurkaulionis and Vlad Falach over the Summer of 2019 as
					their first full-scale web application. It was designed by
					all three.
				</span>
			</div>
			<h1 id="why">Why was this made?</h1>
			<div className="Background">
				<span>
					{" "}
					Humans have a special connection to the sky. There are
					roughly 5000 stars visible at night, and such stars are not
					so easy to spot due to light pollution and our migration
					into cities. This project was made to help us all make
					stargazing more enjoyable. To us, this means being able to
					see the stars as conveniently as possible. Our scoring
					algorithm hopes to achieve that for you, so that less time
					is spent planning and more time can be spent stargazing.
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
			<h1 id="register">Why register?</h1>
			<div className="Background">
				<span>
					Registering grants you the ability to review a park. In the
					future, it will be important for e-mail alerts/newsletters.
					These e-mail alerts will be automatically sent in the
					morning and will suggest parks that are predicted to have
					good naked-eye star visibility. We will ask for user
					permission before this is fully implemented.
				</span>
			</div>
			<h1 id="secure">How secure is this?</h1>
			<div className="Background">
				<span>
					<ul>
						<li>
							This site makes use of cookies. We only store your
							preferred name and user id in them. The user id
							allows us to gather your reviews and favorited
							parks. We use cookies so that your log-in status
							persists even if our server shuts down.
						</li>
						<li>
							Your password is encrypted using{" "}
							<a
								target="_blank"
								href="https://en.wikipedia.org/wiki/Bcrypt"
							>
								Bcrypt
							</a>
							. Thus, we do not view or store any plaintext
							passwords.
						</li>
					</ul>
				</span>
			</div>
			<h2 id="dataGeneration">
				QGIS, openstreetmaps, satellite image, how it blends together
			</h2>
			<div className="Background">
				<span className="HowWork">
					<p>
						The process of calculating star visibility requires a
						combination of multiple data sources: real-time data
						such as weather data and sky object data, and
						non-real-time data, such as park location and light
						pollution. This data is not real-time since the values,
						don't change significantly from day to day. As a result,
						these values are best calculated beforehand and stored
						in a database.
					</p>
					<p>
						An invaluable tool in creating the database was the QGIS
						process toolkit. The process begins by collecting data
						on all objects labeled as parks on OpenStreetMaps. This
						is done via the{" "}
						<a href="https://github.com/3liz/QuickOSM">QuickOSM</a>{" "}
						plugin, which allows this process to be automatic. The
						process has to be run on each state sized area in turn,
						so it's wrapped in another python script.
					</p>
					<figure>
						<img
							src={QGISModel}
							alt="QGIS Graphical Process Modeler"
						/>
					</figure>

					<p>
						The average light pollution for each park is sampled,
						and the extra information is dropped from the parks. The
						parks are then filtered by light pollution, to drop the
						ones that have too much light pollution to be used for
						stargazing regardless of the conditions from the
						database.
					</p>
					<p>
						A number of parks listed in OSM don't have names, since
						they represent small parkettes or rural sports fields.
						In order to deal with having a large number of "Unnamed"
						parks, we had to develop a script which uses a reverse
						geocoding service,{" "}
						<a href="https://nominatim.org/">Nominatim</a>, in order
						to generate approximate names for these missing parks.
						Some of these parks returned simply street addresses,
						but others returned names of other nearby objects, such
						as monuments or schools.
					</p>
					<p>
						This process was done for all parks in Canada, USA, New
						Zealand and Australia. The generated parks dataset is
						then stored in the database for later use.
					</p>
				</span>
			</div>
			<h2>
				distances(crow flies /w research), weather(how we got around
				excess API calls)
			</h2>
			<div className="Background">
				<span className="HowWork">
					<p>
						When a request is executed, a number of real-time data
						has to be collected in order to caluclate the score,
						such as the forecasted weather, moon phase, and
						distance, among others.
					</p>
					<p>
						Weather forecast data is obtained from{" "}
						<a href="https://openweathermap.org/">OpenWeather</a>.
						Due to the data limitations and the wide area required
						for forecasting, doing forecast requests for each park
						individually was infeasible. As a result a k-means
						clustering algorithm was used to cluster nearby parks
						together, since all parks in an area could share a
						forecast. After some testing, there was not a
						significant difference between using nearest neighbor
						and the more elaborate methods, so nearest neighbor was
						used. As a result, the centroid of each cluster of parks
						is used as the forecast request point, and all parks in
						a cluster share the same forecast.
					</p>
					<img
						src={WeatherEstimation}
						alt="Weather Estimation Test"
					/>
					<p>
						If the user makes a search after it is already dark, a
						future weather forecast wouldn't be as useful as the
						current weather, in which case they are shown the
						current conditions instead of the forecast.
					</p>
				</span>
			</div>
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
							Better login/registration system with e-mail
							confirmation, ability to change passwords, delete
							account, etc.
						</li>
						<li>
							More accurate weather predictions using a paid
							weather API service.
						</li>
					</ul>
				</span>
			</div>
			<h1 id="credits">Credits</h1>
			<div className="Background">
				<span>
					<ul>
						<li>
							Light pollution data provided by the VIIRS Day/Night
							Band Nighttime Lights images via the{" "}
							<a
								target="_blank"
								href="https://eogdata.mines.edu/download_dnb_composites.html"
							>
								Earth Observations Group (EOG)
							</a>
						</li>
						VIIRS Day/Night Band Nighttime Lights
						<li>
							Band value numbers for the radiance corresponding to
							a Bortle number provided by Jurij Stare of{" "}
							<a
								target="_blank"
								href="https://www.lightpollutionmap.info/"
							>
								lightpollutionmap.info
							</a>
						</li>
						<li>
							Moonrise/moonset and sunrise/sunset data provided by{" "}
							<a target="_blank" href="http://suncalc.net">
								Suncalc
							</a>
						</li>
						<li>
							Telescope animation in homepage adapted based on a
							Codepen by{" "}
							<a
								target="_blank"
								href="https://codepen.io/littleginger"
							>
								@littleginger
							</a>
						</li>
						<li>
							404 page astronaut animation adapted based on a
							Codepen by{" "}
							<a
								target="_blank"
								href="https://codepen.io/hellochad"
							>
								@hellochad
							</a>
						</li>
					</ul>
				</span>
			</div>
			<h1 id="contact">How do I contact?</h1>
			<div className="Background">
				<span>
					Are you a sidewalk astronmer? Casual observer of the skies?
					Professional? A human? We'd love to hear your feedback! Our
					algorithm is continuously being improved so any advice
					and/or feedback would be greatly appreciated. Please email
					us at{" "}
					<a href="mailto:dev@stellargaze.com">dev@stellargaze.com</a>
				</span>
			</div>
		</div>
	</FAQStyle>
);

export default FAQ;

const FAQStyle = styled.div`
	.FAQHeader {
		text-align: center;
		margin-bottom: 50px;
	}
	width: 85%;
	margin: auto auto;
	max-width: 700px;

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
			padding: 0;
			list-style-type: none;
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

		ul {
			list-style-position: inside;
			padding-left: 0;
		}
		.HowWork {
			li {
				padding-bottom: 20px;
			}
		}

		img {
			width: 100%;
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
