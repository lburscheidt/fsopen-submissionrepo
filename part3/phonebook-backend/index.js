const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const password = process.argv[2];
const url = `mongodb+srv://burscheidt:${password}@cluster0.pmxvhmu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});
const Person = mongoose.model("Person", personSchema);

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

mongoose.set("strictQuery", false);
mongoose.connect(url);

morgan.token("personData", (req) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	}
});

app.use(cors());
app.use(morgan(":method :url :response-time :personData"));
app.use(express.json());
app.use(express.static("dist"));

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.json());

app.use(express.json());

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/info", (request, response) => {
	const time = new Date();
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`,
	);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const maxId =
		persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
	return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	}

	if (!body.number) {
		return response.status(400).json({
			error: "number missing",
		});
	}

	if (
		persons.find((obj) => {
			return obj.name === person.name;
		})
	) {
		return response.status(400).json({
			error: "already in phonebook",
		});
	}

	persons = persons.concat(person);

	response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
