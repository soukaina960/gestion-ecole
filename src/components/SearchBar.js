import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="input-group me-2" style={{ width: '250px' }}>
      <span className="input-group-text">
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder="Rechercher un utilisateur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
