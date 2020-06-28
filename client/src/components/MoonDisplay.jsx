import React from 'react';
import styled from 'styled-components';

export default function MoonDisplay({ phase }) {
  phase = phase * 100;

  var phaseScale = 1,
    phaseTrans = 100,
    phaseRight = 0,
    phaseFlip = 1;

  if (phase > 50) {
    phase = 100 - phase;
    phaseFlip = -1;
  }

  if (phase <= 25) {
    phaseRight = 1 - phase / 25;
  }

  if (phase >= 25 && phase <= 50) {
    phaseScale = 1 - (phase - 25) / 25;
    phaseTrans = 100 * phaseScale;
  }

  return (
    <MoonSVGStyle
      phaseScale={phaseScale}
      phaseTrans={phaseTrans}
      phaseRight={phaseRight}
      phaseFlip={phaseFlip}
    >
      <div className="moon">
        <svg
          className="moon-left"
          viewBox="0 0 100 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="100"
            r="100"
            // stroke="whitesmoke"
            fill="#dadada"
            className="bg"
          />
          <circle
            cx="100"
            cy="100"
            r="100"
            // stroke="whitesmoke"
            fill="#121414"
            className="fg"
          />
        </svg>
        <svg
          className="moon-right"
          viewBox="0 0 100 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="0"
            cy="100"
            r="100"
            // stroke="whitesmoke"
            fill="#dadada"
            className="bg"
          />
          <circle
            cx="0"
            cy="100"
            r="100"
            // stroke="whitesmoke"
            fill="#121414"
            className="fg"
          />
        </svg>
      </div>
    </MoonSVGStyle>
  );
}

const MoonSVGStyle = styled.div`
	.moon {
		/* width: 90px; */
		/* margin: 2rem auto; */
		transform: scaleX(${(props) => props.phaseFlip});

		/* ${({ isHomeMoon }) =>
      isHomeMoon && 'box-shadow: 0 0 20px #485261; border-radius:100px;'}; */
  /* border-radius:100px;
  box-shadow: 0 0 20px #485261; */
		/* @keyframes glowing {
  0% { box-shadow: -10 -10px #485261; }
  40% { box-shadow: 0 0 20px #485261; }
  60% { box-shadow: 0 0 20px #485261; }
  100% { box-shadow: -10 -10px #485261; }
}
  animation: glowing 6000ms infinite; */

	}
	.moon-left,
	.moon-right {
		display: inline-block;
		width: 50%;
		position: relative;
		margin: 0;
	}
	.moon-left .bg,
	.moon-right .bg {
		/* stroke-width: 2px; */
	}
	.moon-right .fg {
		/* stroke-width: 2px; */
		transform: scaleX(${(props) => props.phaseRight});
	}
	.moon-left .bg {
		fill: ${(props) => props.theme.prettyDark};
	}
	.moon-left .fg {
		fill: ${(props) => props.theme.white};
		transform-origin: 0% 0%;
		transform: translate(${(props) => props.phaseTrans}px, 0)
			scaleX(${(props) => 1 - props.phaseScale});
	}
`;
