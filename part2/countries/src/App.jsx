import { useState, useEffect } from "react";
import countryService from "./services/countries";
import "./index.css";

const App = () => {
	const [searchInput, setSearchInput] = useState("");
	const [countries, setCountries] = useState([]);

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

	const showCountry = () => {
		if (searchInput === "") {
			return <div>No search input yet</div>;
		}

		if (countriesToShow.length > 10) {
			return <div>Too many countries to show</div>;
		}
		if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
			const cca3 = countriesToShow.map((c) => c.cca3);
			const name = countriesToShow.map((c) => c.name.common);
			const capital = countriesToShow.map((c) => c.capital[0]);
			const area = countriesToShow.map((c) => c.area);
			const languages = countriesToShow.map((c) => c.languages);
			const flag = countriesToShow.map((c) => c.flags.png);
			return (
				<div>
					{countriesToShow.map((country) => (
						<p key={country.cca3}>
							{country.name.common}
							<button type="button" onClick={showCountry}>
								Show
							</button>
						</p>
					))}
				</div>
			);
		}
		if (countriesToShow.length === 1) {
			const cca3 = countriesToShow.map((c) => c.cca3);
			const name = countriesToShow.map((c) => c.name.common);
			const capital = countriesToShow.map((c) => c.capital[0]);
			const area = countriesToShow.map((c) => c.area);
			const languages = countriesToShow.map((c) => c.languages);
			const flag = countriesToShow.map((c) => c.flags.png);
			return (
				<div>
					<div key={cca3}>
						<h1>{name}</h1>
						<p>Capital {capital}</p>
						<p>Area {area}</p>
						<h2>Languages</h2>
						<ul>
							{Object.keys(languages[0]).map((key) => (
								<li key={key}>{languages[0][key]}</li>
							))}
						</ul>
						<img className="flag" src={flag} alt={`Flag of ${name}`} />
					</div>
				</div>
			);
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
			{showCountry()}
			<h2>Weather in [Capital]</h2>
		</>
	);
};

export default App;
