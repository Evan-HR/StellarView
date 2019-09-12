import React from "react";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from "react-places-autocomplete";

import styled from "styled-components";

class LocationSearchInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { address: "" };
	}

	handleChange = address => {
		this.setState({ address });
	};

	handleSelect = address => {
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => console.log("Success", latLng))
			.catch(error => console.error("Error", error));
	};

	render() {
		return (
			<AutoCompleteStyle>
				<PlacesAutocomplete
					value={this.state.address}
					onChange={this.handleChange}
					onSelect={this.handleSelect}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
						loading
					}) => (
						<div>
							<input
								{...getInputProps({
									placeholder: "Search Places ...",
									className: "location-search-input"
								})}
							/>
							<div className="autocomplete-dropdown-container">
								{loading && <div>Loading...</div>}
								{suggestions.map(suggestion => {
									const className = suggestion.active
										? "suggestion-item--active"
										: "suggestion-item";
									// inline style for demonstration purpose
									const style = suggestion.active
										? {
												backgroundColor: "#cecece",
												cursor: "pointer"
										  }
										: {
												backgroundColor: "#dadada",
												cursor: "pointer"
										  };
									return (
										<div
											{...getSuggestionItemProps(
												suggestion,
												{
													className,
													style
												}
											)}
										>
											<span>
												{suggestion.description}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
			</AutoCompleteStyle>
		);
	}
}

export default LocationSearchInput;

const AutoCompleteStyle = styled.div`
	/* .pac-items {
		background: ${props => props.theme.white};
	} */
`;
