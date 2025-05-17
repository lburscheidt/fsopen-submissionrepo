require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

/*const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});*/
const Person = require("./models/person");

/*mongoose.set("strictQuery", false);*/

morgan.token("personData", (req) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	}
});

app.use(morgan(":method :url :response-time :personData"));
app.use(express.json());
app.use(express.static("dist"));

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
	Person.find({}).then((persons) => {
		response.send(
			`<p>Phonebook has info for ${persons.length} people</p>
             <p>${time}</p>`,
		);
	});
});
app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})

		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

const generateId = () => {
	const maxId =
		persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
	return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({ error: "name missing" });
	}

	if (!body.number) {
		return response.status(400).json({ error: "number missing" });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	Person.findById(request.params.id)
		.then((person) => {
			if (!person) {
				return response.status(404).end();
			}

			person.name = name;
			person.number = number;

			return person.save().then((updatedPerson) => {
				response.json(updatedPerson);
			});
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
