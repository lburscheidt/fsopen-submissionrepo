import { useState, useEffect } from "react";
import countryService from "./services/countries";
import "./index.css";

const App = () => {
	const [searchInput, setSearchInput] = useState("");
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("");

	useEffect(() => {
		countryService.getAll().then((countries) => {
			setCountries(countries);
		});
	}, []);

	const handleSearchChange = (event) => {
		setSearchInput(event.target.value);
		console.log(event.target.value);
	};

	const countriesToShow =
		searchInput !== ""
			? countries.filter((c) =>
					c.name.common.toLowerCase().includes(searchInput.toLowerCase()),
				)
			: countries;

	const SingleCountryData = ({ country }) => {
		console.log(country.languages);
		console.log(Object.values(country.languages));
		const cca3 = country.cca3;
		const name = country.name.common;
		const capital = country.capital[0];
		const area = country.area;
		const languages = country.languages;
		const flag = country.flags.png;
		return (
			<div>
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
			</div>
		);
	};

	const Country = () => {
		const showCountry = (country) => {
			return <SingleCountryData country={country} />;
		};

		if (searchInput === "") {
			return <div>No search input yet</div>;
		}

		if (countriesToShow.length > 10) {
			return <div>Too many countries to show</div>;
		}
		if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
			return (
				<div>
					{countriesToShow.map((c) => (
						<p key={c.cca3}>
							{c.name.common}
							<button
								type="button"
								onClick={() => {
									showCountry(c);
								}}
							>
								Show
							</button>
						</p>
					))}
				</div>
			);
		}
		if (countriesToShow.length === 1) {
			return <SingleCountryData country={countriesToShow[0]} />;
		}
	};

	return (
		<>
			<h2>Search</h2>
			<div>
				<label>
					filter shown with
					<input value={searchInput} onChange={handleSearchChange} />
				</label>
			</div>
			<h2>Countries</h2>
			<Country />
			<h2>Weather in [Capital]</h2>
		</>
	);
};

export default App;
