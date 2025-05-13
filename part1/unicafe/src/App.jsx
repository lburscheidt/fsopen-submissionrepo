import { useState } from "react";

const Header = ({ header }) => {
	return <h1>{header}</h1>;
};

const Button = ({ text, onClick }) => {
	return (
		<button type="button" onClick={onClick}>
			{text}
		</button>
	);
};

const Statistics = (props) => {
	if (props.all !== 0) {
		return (
			<table>
				<tbody>
					<StatisticLine text="good" stat={props.good} />
					<StatisticLine text="neutral" stat={props.neutral} />
					<StatisticLine text="bad" stat={props.bad} />
					<StatisticLine text="all" stat={props.all} />
					<StatisticLine text="average" stat={props.average} />
					<StatisticLine text="positive" stat={props.positive} symbol="%" />
				</tbody>
			</table>
		);
	}
};

const StatisticLine = ({ text, stat, symbol }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>
				{stat} {symbol}
			</td>
		</tr>
	);
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const header = "Give feedback";
	const statistics = "Statistics";

	const increaseGood = () => {
		setGood(good + 1);
	};

	const increaseNeutral = () => {
		setNeutral(neutral + 1);
	};

	const increaseBad = () => {
		setBad(bad + 1);
	};
	const all = good + bad + neutral;
	const average = ((good - bad) / all).toFixed(2);
	const positive = ((good / all) * 100).toFixed(2);

	return (
		<>
			<Header header={header} />
			<Button text="good" onClick={increaseGood} />
			<Button text="neutral" onClick={increaseNeutral} />
			<Button text="bad" onClick={increaseBad} />
			<Header header={statistics} />
			<Statistics
				good={good}
				bad={bad}
				neutral={neutral}
				all={all}
				average={average}
				positive={positive}
			/>
		</>
	);
};

export default App;
