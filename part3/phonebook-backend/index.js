require("dotenv").config();
const express = require("express");
const Person = require("./models/person");

const app = express();
const morgan = require("morgan");

morgan.token("personData", (req) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	}
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}
	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}
	if (error.name === "AxiosError") {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :response-time :personData"));

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

app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
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

// this has to be the last loaded middleware, also all the routes should be registered before this!

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
