import { useState, useEffect } from "react";
import countryService from "./services/countries";
import "./index.css";

const Filter = (props) => {
	return (
		<label>
			find countries
			<input value={props.value} onChange={props.onChange} />
		</label>
	);
};

const CountriesList = ({ filteredCountries }) => {
	if (filteredCountries.length > 10) {
		return <div>Too many countries to show</div>;
	}
	if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
		return (
			<div>
				{filteredCountries.map((country) => (
					<p key={country.cca3}>
						{country.name.common} <button type="button">Show</button>
					</p>
				))}
			</div>
		);
	}
	if (filteredCountries.length === 1) {
		const country = filteredCountries[0];
		const capital = country.capital[0];
		const cca3 = country.cca3;
		const name = country.name.common;
		const area = country.area;
		const languages = country.languages;
		const flag = country.flags.png;
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
			</div>
		);
	}
};

const App = () => {
	const [searchInput, setSearchInput] = useState("");
	const [countries, setCountries] = useState([]);
	const [renderSingleCountry, setRenderSingleCountry] = useState(false);

	useEffect(() => {
		countryService.getAll().then((countries) => {
			setCountries(countries);
		});
	}, []);

	const handleSearchChange = (event) => {
		setSearchInput(event.target.value);
		console.log(event.target.value);
	};

	const filteredCountries =
		searchInput !== ""
			? countries.filter((c) =>
					c.name.common.toLowerCase().includes(searchInput.toLowerCase()),
				)
			: countries;

	return (
		<>
			<h2>Search</h2>
			<Filter value={searchInput} onChange={handleSearchChange} />
			<h2>Countries</h2>
			<CountriesList filteredCountries={filteredCountries} />
			<h2>Weather in [Capital]</h2>
		</>
	);
};

export default App;
