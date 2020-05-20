const suncalc = require("suncalc");

function getMoon(userTime) {
	var time = new Date(userTime);
	var phaseInfo = suncalc.getMoonIllumination(time);
	return phaseInfo;
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

function getMoonPhaseString(phase) {
	let moonType = "New Moon";
	if (inRange(phase, 0.9375, 1) || inRange(phase, 0, 0.0625)) {
		moonType = "New Moon";
	} else if (inRange(phase, 0.0625, 0.1875)) {
		moonType = "Waxing Crescent";
	} else if (inRange(phase, 0.1875, 0.3125)) {
		moonType = "First Quarter";
	} else if (inRange(phase, 0.3125, 0.4375)) {
		moonType = "Waxing Gibbous";
	} else if (inRange(phase, 0.4375, 0.5625)) {
		moonType = "Full Moon";
	} else if (inRange(phase, 0.5625, 0.6875)) {
		moonType = "Waning Gibbous";
	} else if (inRange(phase, 0.6875, 0.8125)) {
		moonType = "Last Quarter";
	} else if (inRange(phase, 0.8125, 0.9375)) {
		moonType = "Waning Crescent";
	}
	return moonType;
}

exports.getMoon = getMoon;
exports.toRadians = toRadians;
exports.inRange = inRange;
exports.getMoonPhaseString = getMoonPhaseString;
