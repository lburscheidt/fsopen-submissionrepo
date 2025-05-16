import axios from "axios";

const getWeather = (lat, lon) => {

	const request = axios.get(
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto&wind_speed_unit=ms`,
	);
	return request.then((response) => response.data);
};

export default { getWeather };
