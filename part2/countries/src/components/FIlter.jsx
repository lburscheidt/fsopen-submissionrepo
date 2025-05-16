const Filter = ({ searchInput, handleSearchChange }) => {
	return (
		<label>
			find countries
			<input value={searchInput} onChange={handleSearchChange} />
		</label>
	);
};

export default Filter;
