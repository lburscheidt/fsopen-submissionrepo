import { useState, useEffect } from "react";
import axios from "axios";
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

export default Weather;
