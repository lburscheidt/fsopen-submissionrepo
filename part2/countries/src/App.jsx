import { useState, useEffect } from "react";
import axios from "axios";
import countryService from "./services/countries";
import "./index.css";

const WeatherIcon = ({ code }) => {
	function translate(code) {
		if (code === 0) {
			return "clear-day";
		}
		if (code === 1 || code === 2 || code === 3) {
			return "partly-cloudy-day";
		}
		if (code === 45 || code === 48) {
			return "fog";
		}
		if (code === 51 || code === 53 || code === 55) {
			return "rain";
		}
		if (code === 56 || code === 57) {
			return "rain-snow-showers-day";
		}
		if (code === 61 || code === 63 || code === 65) {
			return "rain";
		}
		if (code === 66 || code === 67) {
			return "sleet";
		}
		if (code === 71 || code === 73 || code === 75 || code === 77) {
			return "snow";
		}
		if (code === 80 || code === 81 || code === 82) {
			return "showers-day";
		}
		if (code === 85 || code === 86) {
			return "snow-showers-day";
		}
		if (code === 95 || code === 96 || code === 97) {
			return "thunder";
		}
	}
	const imageLink = `./images/${translate(code)}.svg`;
	return <img src={imageLink} alt={translate(code)} width="200" height="200" />;
};

const Weather = ({ lat, lon, capital }) => {
	const [weather, setWeather] = useState({});

	const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto&wind_speed_unit=ms`;

	useEffect(() => {
		axios.get(url).then((response) => {
			setWeather(response.data);
		});
	}, [url]);
	return (
		<div>
			<h3>Weather in {capital}</h3>
			{weather.current && (
				<div>
					<div>temperature {weather.current.temperature_2m}°C</div>
					<div>wind {weather.current.wind_speed_10m} m/s</div>
					<WeatherIcon code={weather.current.weather_code} />
				</div>
			)}
		</div>
	);
};

const Country = ({ filteredCountries }) => {
	if (filteredCountries.length === 1) {
		const country = filteredCountries[0];
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
	}
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
		return <div>No list</div>;
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

			<h2>Countries</h2>
			<CountriesList
				searchInput={searchInput}
				filteredCountries={filteredCountries}
			/>
			<Country filteredCountries={filteredCountries} />
		</>
	);
};

export default App;
