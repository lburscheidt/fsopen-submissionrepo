const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://burscheidt:${password}@cluster0.pmxvhmu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name: name,
	number: number,
});

mongoose.set("strictQuery", false);

mongoose.connect(url);

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

if (process.argv.length === 3) {
	console.log("connected");
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
}

if (process.argv.length === 5) {
	person.save().then((result) => {
		console.log(`added ${person.name} ${person.number}!`);
		mongoose.connection.close();
	});
}
