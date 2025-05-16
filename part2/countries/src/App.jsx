import { useState, useEffect } from "react";
import "./index.css";
import countryService from "./services/countries";
import CountriesList from "./components/CountriesList";
import Filter from "./components/FIlter";

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
