import { useState, useEffect } from "react";
import Weather from "./Weather";

const Country = ({ ctry }) => {
	const country = ctry;
	const cca3 = country.cca3;
	const name = country.name.common;
	const capital = country.capital[0];
	const area = country.area;
	const languages = country.languages;
	const flag = country.flags.png;
	const lat = country.capitalInfo.latlng[0];
	const lon = country.capitalInfo.latlng[1];
	return (
		<div key={cca3}>
			<h1>{name}</h1>
			<p>Capital {capital}</p>
			<p>Area {area}</p>
			<h2>Languages</h2>
			<ul>
				{Object.values(languages).map((value) => (
					<li key={value}>{value}</li>
				))}
			</ul>
			<img className="flag" src={flag} alt={`Flag of ${name}`} />
			<Weather lat={lat} lon={lon} capital={capital} />
		</div>
	);
};

const CountriesList = ({ searchInput, filteredCountries }) => {
	const [showCountry, setShowCountry] = useState([]);

	useEffect(() => {
		setShowCountry(filteredCountries);
	}, [filteredCountries]);

	if (searchInput === "") {
		return <div>No search input yet</div>;
	}

	if (filteredCountries.length > 10) {
		return <div>Too many countries to show</div>;
	}
	if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
		return (
			<ul className="no-bullets">
				{showCountry.map((country, index) => (
					<li key={index}>
						{country.name.common}
						<input
							key={index}
							type="button"
							value={showCountry[index].show ? "hide" : "show"}
							onClick={() => {
								const copy = [...showCountry];
								copy[index].show = !copy[index].show;
								setShowCountry(copy);
							}}
						/>
						{country.show ? <Country ctry={country} /> : null}
					</li>
				))}
			</ul>
		);
	}
	if (filteredCountries.length === 1) {
		return <Country ctry={filteredCountries[0]} />;
	}
};

export default CountriesList;
