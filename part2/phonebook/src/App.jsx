import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

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

const Persons = (props) => {
	console.log(props);
	return (
		<div>
			{props.personsToShow.map((person) => (
				<p key={person.id}>
					{person.name} {person.number}
					<button
						type="button"
						id={person.id}
						onClick={() => {
							if (window.confirm(`Do you want to delete ${person.name}?`)) {
								props.deletePerson(person.id);
							}
						}}
					>
						delete
					</button>
				</p>
			))}
		</div>
	);
};
const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		personService.getAll().then((persons) => {
			setPersons(persons);
		});
	}, []);

	function addPerson(event) {
		event.preventDefault();
		const newPerson = { name: `${newName}`, number: `${newNumber}` };
		if (persons.find((p) => p.name === newName)) {
			const id = persons.find((p) => p.name === newName).id;
			if (
				window.confirm(
					`${newName} is already in phonebook, want to replace the old number with a new one?`,
				)
			) {
				personService.update(id, newPerson);
				personService.getAll().then((persons) => {
					setPersons(persons);
				});
			}
		} else {
			setPersons(persons.concat(newPerson));
			personService.create(newPerson);
		}
		setNewName("");
		setNewNumber("");
	}

	const personsToShow =
		searchInput !== ""
			? persons.filter((p) =>
					p.name.toLowerCase().startsWith(searchInput.toLowerCase()),
				)
			: persons;

	const deletePerson = (id) => {
		personService.remove(id).then(() => {
			setPersons(persons.filter((person) => person.id !== id));
		});
	};

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
			<Persons personsToShow={personsToShow} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
