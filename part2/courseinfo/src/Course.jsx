const Header = ({ course }) => {
	return <h1>{course}</h1>;
};

const Content = ({ parts }) => {
	return (
		<>
			{parts.map((part) => (
				<Part key={part.id} name={part.name} exercises={part.exercises} />
			))}
		</>
	);
};

const Part = ({ name, exercises }) => {
	return (
		<p>
			{name} {exercises}
		</p>
	);
};

const Total = ({ parts }) => {
	const exercises = parts.map((part) => part.exercises);
	const total = exercises.reduce((s, p) => s + p, 0);
	return <p>Total of {total} exercises</p>;
};

const Course = ({ course }) => {
	return (
		<>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</>
	);
};

export default Course;
