import React, { Component } from "react";
import styled from "styled-components";

export default function MoonDisplay({phase}) {
	function inRange(x, min, max) {
		return (x - min) * (x - max) <= 0;
	}

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
			<div class="moon">
				<svg
					class="moon-left"
					viewBox="0 0 100 200"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="100"
						cy="100"
						r="100"
						// stroke="whitesmoke"
						fill="whitesmoke"
						class="bg"
					/>
					<circle
						cx="100"
						cy="100"
						r="100"
						// stroke="whitesmoke"
						fill="#121414"
						class="fg"
					/>
				</svg>
				<svg
					class="moon-right"
					viewBox="0 0 100 200"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="0"
						cy="100"
						r="99"
						// stroke="whitesmoke"
						fill="whitesmoke"
						class="bg"
					/>
					<circle
						cx="0"
						cy="100"
						r="100"
						// stroke="whitesmoke"
						fill="#121414"
						class="fg"
					/>
				</svg>
			</div>
		</MoonSVGStyle>
	);
}

const MoonSVGStyle = styled.div`
	.moon {
		width: 90px;
		/* margin: 2rem auto; */
		transform: scaleX(${props => props.phaseFlip});
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
		transform: scaleX(${props => props.phaseRight});
	}
	.moon-left .bg {
		fill: #121414;
	}
	.moon-left .fg {
		fill: whitesmoke;
		transform-origin: 0% 0%;
		transform: translate(${props => props.phaseTrans}px, 0)
			scaleX(${props => 1 - props.phaseScale});
	}
`;
