import { useState, useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

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
				<Person
					key={person.id}
					id={person.id}
					name={person.name}
					number={person.number}
					deletePerson={props.deletePerson}
				/>
			))}
		</div>
	);
};

const Person = (props) => {
	return (
		<p key={props.id}>
			{props.name} {props.number}
			<button
				type="button"
				onClick={() => {
					if (window.confirm(`Do you want to delete ${props.name}?`)) {
						props.deletePerson(props.id);
					}
				}}
			>
				Delete
			</button>
		</p>
	);
};

const Notification = ({ message }) => {
	if (message === "") {
		return null;
	}

	return <div className="error">{message}</div>;
};
const SuccessNotification = ({ message }) => {
	if (message === "") {
		return null;
	}

	return <div className="success">{message}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

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
				personService
					.update(id, newPerson, { runValidators: true })
					.then((response) => {
						setSuccessMessage(`Successfully added new number for ${newName}`);
						setTimeout(() => {
							setSuccessMessage("");
						}, 5000);
					})
					.catch((error) => {
						const msg = error.response.data.error;
						setErrorMessage(`${msg}`);
						setTimeout(() => {
							setErrorMessage("");
						}, 5000);
					});

				personService.getAll().then((persons) => {
					setPersons(persons);
				});
			}
		} else {
			personService
				.create(newPerson)
				.then((newPerson) => {
					setPersons(persons.concat(newPerson));
					setSuccessMessage(`Successfully added ${newName}`);
					setTimeout(() => {
						setSuccessMessage("");
					}, 5000);
				})
				.catch((error) => {
					const msg = error.response.data.error;
					setErrorMessage(`${msg}`);
					setTimeout(() => {
						setErrorMessage("");
					}, 5000);
				});
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
			<Notification message={errorMessage} />
			<SuccessNotification message={successMessage} />
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
