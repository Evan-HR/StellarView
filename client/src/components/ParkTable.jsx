//Displays park table
import React, { Component } from "react";

class ParkTable extends Component {
	state = {}
	/* Note - park object is:
        {
            distance: number,
            id: number,
            lat: number,
            lng: number,
            light_pol: number,
            name: string,
            osmid: number,
        }
    */

	renderParkTable = () => {
		if (this.props.parkList.length > 0) {
			return this.props.parkList.map(this.renderPark);
		} else {
			return (
				<tr>
					<td colSpan={3}>
						<strong style={{ color: "red" }}>
							No parks available.
						</strong>
					</td>
				</tr>
			);
		}
	};

	renderMoonData(){
		if(this.props.parkList.length > 0){
			var moonDataString = "";
			var moonIllum=this.props.moon
			var moonType=this.props.moonType
			moonDataString = `The moon is ${moonType}, meaning it is ${moonIllum}% illuminated.`

return moonDataString}
	}
		
			
		
		
	

	renderPark = park => (
		<tr>
			<td>{park.name_alt}</td>
			<td>{park.light_pol}</td>
			<td>{park.distance}</td>
		</tr>
	);

	render() {
		console.log("ParkTable - rendered");
		return (
			<div className="border border-primary">
			{this.renderMoonData()}
			
				<table className="table table-hover">
					<tr>
						<th>Name</th>
						<th>Light</th>
						<th>Distance</th>
					</tr>
					<tbody>{this.renderParkTable()}</tbody>
				</table>
			</div>
		);
	}
}

export default ParkTable;
