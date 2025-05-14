import { useState, useEffect } from "react";
import axios from "axios";

const Person = ({ name, number }) => {
	return (
		<p key={name}>
			{name} {number}
		</p>
	);
};

const Filter = ({ searchInput, handleSearchChange }) => {
	return (
		<div>
			<label>
				filter shown with
				<input value={searchInput} onChange={handleSearchChange} />
			</label>
		</div>
	);
};

const PersonForm = (props) => {
	return (
		<form onSubmit={props.addPerson}>
			<div>
				<label>
					name:
					<input value={props.newName} onChange={props.handleNameChange} />
				</label>
			</div>
			<div>
				<label>
					number:
					<input value={props.newNumber} onChange={props.handleNumberChange} />
				</label>
			</div>

			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

const Persons = ({ persons }) => {
	return persons.map((p) => (
		<Person key={p.name} name={p.name} number={p.number} />
	));
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		axios.get("http://localhost:3001/persons").then((response) => {
			setPersons(response.data);
		});
	}, []);

	function addPerson(event) {
		event.preventDefault();
		const newPerson = { name: `${newName}`, number: `${newNumber}` };
		if (persons.find((p) => p.name === newName)) {
			alert(`${newName} is already in phonebook`);
		} else {
			setPersons(persons.concat(newPerson));
		}
		setNewName("");
	}

	const personsToShow =
		searchInput !== ""
			? persons.filter((p) =>
					p.name.toLowerCase().startsWith(searchInput.toLowerCase()),
				)
			: persons;

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};
	const handleSearchChange = (event) => {
		setSearchInput(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter
				searchInput={searchInput}
				handleSearchChange={handleSearchChange}
			/>

			<h2>add a new person</h2>
			<PersonForm
				newName={newName}
				newNumber={newNumber}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
				addPerson={addPerson}
			/>

			<h2>Numbers</h2>
			<Persons persons={personsToShow} />
		</div>
	);
};

export default App;
