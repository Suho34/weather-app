import PropTypes from "prop-types";
import { useState } from "react";
import Logo from "../assets/logo.png";

export default function Search({ setCity }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setCity(searchQuery.trim()); // Pass the city name to Weather
      setSearchQuery(""); // Optional: Clear input after search
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <img src={Logo} alt="Weather App Logo" className="logo" />
      <div className="search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

Search.propTypes = {
  setCity: PropTypes.func.isRequired,
};
