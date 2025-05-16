import { useState, useEffect } from "react";
import axios from "axios";
import countryService from "./services/countries";
import "./index.css";
import Weather from "./components/Weather";

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
	if (searchInput === "") {
		return <div>No search input yet</div>;
	}

	if (filteredCountries.length > 10) {
		return <div>Too many countries to show</div>;
	}
	if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
		return (
			<div>
				{filteredCountries.map((c) => (
					<form key={c.cca3}>
						{c.name.common}
						<button type="submit">Show</button>
					</form>
				))}
			</div>
		);
	}
	if (filteredCountries.length === 1) {
		return <Country ctry={filteredCountries[0]} />;
	}
};

const Filter = ({ searchInput, handleSearchChange }) => {
	return (
		<label>
			find countries
			<input value={searchInput} onChange={handleSearchChange} />
		</label>
	);
};

const App = () => {
	const [searchInput, setSearchInput] = useState("");
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		countryService.getAll().then((countries) => {
			setCountries(countries);
		});
	}, []);

	const handleSearchChange = (event) => {
		console.log(event.target.value);
		setSearchInput(event.target.value);
	};

	const filteredCountries =
		searchInput !== ""
			? countries.filter((c) =>
					c.name.common.toLowerCase().includes(searchInput.toLowerCase()),
				)
			: countries;

	return (
		<>
			<Filter
				handleSearchChange={handleSearchChange}
				searchInput={searchInput}
			/>
			<CountriesList
				searchInput={searchInput}
				filteredCountries={filteredCountries}
			/>
		</>
	);
};

export default App;
