import React from "react";
import styled from "styled-components";
import QGISModel from "./style/Images/QGISModel.png";
import WeatherEstimation from "./style/Images/Weather-Estimation-Test.png";
import ParkMapNA from "./style/Images/ParkMapNA.png";
import lightPolMapDemo from "./style/Images/lightPolMapDemo.png";
import StarBackgroundLess from "./StarBackgroundLess";

const FAQ = (props) => (
  <FAQStyle>
    <h1 className="FAQHeader">FAQ</h1>

    <div className="FAQ_Sections">
      <StarBackgroundLess />
      <ol>
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
          <a href="#dataGeneration">Where do the data come from?</a>
        </li>
        <li>
          <a href="#realTime">
            What happens in the back-end during a real-time search?
          </a>
        </li>
        <li>
          <a href="#score">How is the score calculated?</a>
        </li>
        <li>
          <a href="#future">Future</a>
        </li>
        <li>
          <a href="#credits">Credits</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ol>
    </div>
    <div className="FAQ_Sections_Content">
      <h1 id="who">Who are we?</h1>
      <div className="Background">
        <span>
          STELLARGAZE is an idea come to life by 3 developers who met at
          McMaster University's Computer Science department in Hamilton,
          Ontario. Inspired by Evan Reaume, Stellargaze hopes to simplify the
          stargazing process. The front-end and back-end was fully implemented
          by both{" "}
          <a href="http://www.dustinjurkaulionis.com" target="_blank">
            Dustin Jurkaulionis
          </a>{" "}
          and{" "}
          <a href="http://www.vladfalach.com" target="_blank">
            Vlad Falach
          </a>{" "}
          over the Summer of 2019 as their first full-scale web application. It
          was designed by all three.
        </span>
      </div>
      <h1 id="why">Why was this made?</h1>
      <div className="Background">
        <span>
          {" "}
          Humans have a special connection to the sky. There are roughly 5000
          stars visible at night, and such stars are not so easy to spot due to
          light pollution and our migration into cities. This project was made
          to help us all make stargazing more enjoyable. To us, this means being
          able to see the stars as conveniently as possible. Our scoring
          algorithm hopes to achieve that for you, so that less time is spent
          planning and reading complicated light pollution maps.
        </span>
      </div>
      <h1 id="how">How does it work?</h1>
      <div className="Background">
        <span className="HowWork">
          STELLARGAZE works in 3 main steps: <br></br>
          <br></br>
          <ol>
            <li>
              We analyze a satellite image provided by the Earth Observations
              Group (EOG) at NOAA/NCEI. This Day/Night Band image captures the
              average radiance values of North America, Australia, and New
              Zealand. The pixel values we extract correspond to a number on the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Bortle_scale"
                target="_blank"
              >
                Bortle scale
              </a>
              , which gives an approximate measure of the night sky's brightness
              at a particular location.{" "}
            </li>
            <li>
              We then find the nearest parks relative to the user with a Bortle
              class of <i>at most</i> 4 - the <i>Rural/Suburban</i> transition
              zone. These parks are available to us using Open Street Maps and a
              database. We store only the parks below a certain radiance value,
              corresponding to a Bortle class. Thus, parks located in a densely
              populated area with lots of light pollution are not stored.{" "}
            </li>
            <li>
              Parks within 140km of the user in lower light-pollution zones are
              then ranked based on not only the light pollution, but cloud
              coverage (the % of the sky covered by clouds), humidity %, and
              moon phase. Distance is calculated using an "As the crow flies"
              methodology, not road distance. As a result, some parks across
              bodies of water might get suggested, which may not be feasible.
            </li>
          </ol>
          <figure>
            <a href={ParkMapNA} target="_blank">
              <img
                src={ParkMapNA}
                alt="Stored parks, coloured according to light pollution, lighter=more light pollution"
              />
            </a>
            <figcaption>
              Figure 1: Stored parks coloured according to light pollution - the
              lighter the colour, the more light pollution.
            </figcaption>
          </figure>
          Ideally, parks with a score of <i>75% or higher</i> are the parks
          suitable for naked-eye stargazing. This score means that these parks
          have a Bortle class of <i>at most</i> 4 (Rural/suburban transition) or
          below, cloud coverage below 25%, humidity below 70%, and a moon phase
          below 50% illumination (First Quarter and below, for instance).
          <figure>
            <a href={lightPolMapDemo} target="_blank">
              <img
                src={lightPolMapDemo}
                alt="Stored parks, coloured according to light pollution, lighter=more light pollution"
              />
            </a>
            <figcaption>
              Figure 2: User searching from a high light pollution zone (inner
              city). Stellargaze directs them to parks in less polluted areas
              (green) such as this one. Source:{" "}
              <a href="https://www.lightpollutionmap.info" target="_blank">
                https://www.lightpollutionmap.info
              </a>
            </figcaption>
          </figure>
        </span>
      </div>

      <h1 id="dataGeneration">Where do the data come from?</h1>
      <div className="Background">
        <span className="HowWork">
          <p>
            The process of calculating star visibility requires a combination of
            multiple data sources: real-time data such as weather data and sky
            object data, and non-real-time data, such as park location and light
            pollution. This data is not real-time since the values don't change
            significantly from day to day. As a result, these values are best
            calculated beforehand and stored in a database.
          </p>
          <p>
            An invaluable tool in creating the database was the QGIS process
            toolkit. The process began by collecting data on all objects labeled
            as <i>parks</i> on OpenStreetMaps. This was done via the{" "}
            <a href="https://github.com/3liz/QuickOSM">QuickOSM</a> plugin,
            which allowed this process to be automatic. The process had to be
            run on each state/province sized area in turn, so it's wrapped in
            another python script.
          </p>
          <figure>
            <a href={QGISModel} target="_blank">
              <img src={QGISModel} alt="QGIS Graphical Process Modeler" />
            </a>
            <figcaption>Figure 3: QGIS Graphical Process Modeler</figcaption>
          </figure>

          <p>
            The average light pollution for each park is sampled, and the extra
            information is dropped from the parks. The parks which have too much
            light pollution are dropped.
          </p>
          <p>
            A number of parks listed in OSM don't have names, since they
            represent small parkettes or rural sports fields. In order to deal
            with having a large number of <i>"Unnamed"</i> parks, we had to
            develop a script which uses a reverse geocoding service,{" "}
            <a href="https://nominatim.org/">Nominatim</a>, in order to generate
            approximate names for these missing parks. Some of these parks
            returned simply street addresses, but others returned names of other
            nearby objects, such as monuments or schools.
          </p>
          <p>
            This process was done for all parks in Canada (minus some PEI), USA,
            New Zealand and Australia. The generated parks dataset is then
            stored in the database for later use.
          </p>
        </span>
      </div>
      <h1 id="realTime">
        What happens in the back-end during a real-time search?
      </h1>
      <div className="Background">
        <span className="HowWork">
          <p>
            When a request is executed, a number of real-time data has to be
            collected in order to calculate the score, such as the forecasted
            weather, moon phase, distance, park reviews, etc.
          </p>
          <p>
            Weather forecast data is obtained from{" "}
            <a href="https://openweathermap.org/">OpenWeather</a>. Due to the
            data limitations and the wide area required for forecasting, doing
            forecast requests for <i>each park</i> individually was infeasible,
            as well as not financially viable. As a result, a{" "}
            <i>k-means clustering algorithm</i> was used to cluster nearby parks
            together, since all parks in an area could share a forecast. After
            some testing, there was not a significant difference between using
            nearest neighbour and the more elaborate methods, so nearest
            neighbour was used. As a result, the centroid of each cluster of
            parks is used as the forecast request point, and all parks in a
            cluster share the same forecast.
          </p>
          <figure>
            <a href={WeatherEstimation} target="_blank">
              <img src={WeatherEstimation} alt="Weather Estimation Test" />
            </a>
            <figcaption>Figure 4: Weather Estimation Test</figcaption>
          </figure>
          <p>
            If the user makes a search after it is already dark, a future
            weather forecast wouldn't be as useful as the current weather. Thus,
            they are shown the current conditions instead of the forecast.
          </p>
        </span>
      </div>
      <h1 id="score">How is the score calculated?</h1>
      <div className="Background">
        <span>
          <p>
            The final park score is calculated from a combination of factors,
            primarily the moon illumination percentage, humidity, cloud coverage
            and light pollution.
          </p>
          <p>
            The significance of the moon illumination is that just like the sun,
            the moon reflects light to Earth which is scattered in the
            atmosphere. The effect is that when the moon is in the sky at full
            illumination it can actually crowd out a lot of the smaller, dimmer
            stars which we feel users should enjoy seeing.
          </p>
          <p>
            Humidity also contributes to poor star visibility. Humidity itself
            refers to the amount of water vapor in the air, with 100% humidity
            being the point where it begins to condense into dew. As a result,
            higher humidity means that there is more light scattering. This
            makes it easier for dimmer stars to be crowded out.
          </p>
          <p>
            Cloud coverage effect on star visibility is obvious, since clouds
            block the sky. However at reasonably low cloud coverage levels it
            may still be possible to view stars through gaps in the clouds.
          </p>
          <p>
            Light pollution obfuscates dimmer objects in the sky and in urban
            centers actually makes star gazing impossible. One of the main
            sources of light pollution is street lights, which scatter light.
            Further, humidity plays a role in light pollution, since humidity
            scatters light from ground sources, so our scoring algorithm takes
            into account a humidity multiplier - the light pollution score is
            decreased on humid days, lowering the overall score.
          </p>
        </span>
      </div>

      <h1 id="future">Future Notes</h1>
      <div className="Background">
        <span>
          (Updated 11/21/2021) This section will be continously updated. We plan
          on: <br></br>
          <br></br>
          <ul>
            <li>
              Making a mobile app which will combine stargazing condition
              push-notifications with experiential meditation. Think
              Calm/Headspace with stargazing.
            </li>
            <li>Better weather API and refining the algorithm.</li>
          </ul>
        </span>
      </div>
      <h1 id="credits">Credits</h1>
      <div className="Background">
        <span>
          <ul>
            <li>
              Light pollution data provided by the VIIRS Day/Night Band
              Nighttime Lights images via the{" "}
              <a
                target="_blank"
                href="https://eogdata.mines.edu/download_dnb_composites.html"
              >
                Earth Observations Group (EOG)
              </a>
            </li>
            VIIRS Day/Night Band Nighttime Lights
            <li>
              Band value numbers for the radiance corresponding to a Bortle
              number provided by Jurij Stare of{" "}
              <a target="_blank" href="https://www.lightpollutionmap.info/">
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
              OpenStreetMap data gathered via{" "}
              <a target="_blank" href="https://github.com/3liz/QuickOSM">
                QuickOSM
              </a>{" "}
              plugin.
            </li>
            <li>
              Telescope animation in homepage adapted based on a Codepen by{" "}
              <a target="_blank" href="https://codepen.io/littleginger">
                @littleginger
              </a>
            </li>
            <li>
              404 page astronaut animation adapted based on a Codepen by{" "}
              <a target="_blank" href="https://codepen.io/hellochad">
                @hellochad
              </a>
            </li>
          </ul>
        </span>
      </div>
      <h1 id="contact">Contact</h1>
      <div className="Background">
        <span>
          Are you a sidewalk astronomer? Casual observer of the skies?
          Professional? A human? We'd love to hear your feedback! Our algorithm
          is continuously being improved so any advice and/or feedback would be
          greatly appreciated. Please email us at{" "}
          <a href="mailto:dev@stellargaze.com">dev@stellargaze.com</a> and{" "}
          <a target="_blank" href="https://github.com/CyberTropic/StellarGaze">
            visit the repo.
          </a>
          {"   "}Please note the code is old as it was our first experience with
          React / web apps, and is not indicative of our current web development
          skills :)
        </span>
      </div>
    </div>
  </FAQStyle>
);

export default FAQ;

const FAQStyle = styled.div`
  .FAQ_Sections {
    font-size: 17px;
    margin-bottom: 80px;
    border-bottom: 2px solid ${(props) => props.theme.moonBackground};
    font-weight: 400;

    ol {
      /* list-style: none; */
      text-align: left;
      color: ${(props) => props.theme.white};
      /* padding: 0;
			list-style-type: none; */
    }
    a {
      color: ${(props) => props.theme.white};
      text-decoration: none;
      :hover {
        color: ${(props) => props.theme.colorMedium};
      }
    }
  }

  .FAQHeader {
    margin-bottom: 50px;
    text-align: left;
  }
  width: 85%;
  margin: auto auto;
  max-width: 900px;

  font-family: "Lato", sans-serif;
  h1 {
    color: ${(props) => props.theme.colorMedium};
    margin: 20px 0px;
    font-size: 35px;
  }

  .FAQ_Sections_Content {
    color: ${(props) => props.theme.white};
    text-align: left;
    font-weight: 400;

    figcaption {
      font-size: 13px;
      padding: 10px 0px;
    }
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
      border: 4px solid ${(props) => props.theme.prettyDark};
      border-radius: 20px;
      margin-top: 20px;
    }

    .Background {
      background: ${(props) => props.theme.moonBackground};
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 60px;
    }
    span {
      a {
        color: ${(props) => props.theme.colorMedium};
        text-decoration: none;
        :hover {
          color: ${(props) => props.theme.yellow};
        }
      }
    }
  }
`;
