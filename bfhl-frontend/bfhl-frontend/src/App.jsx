import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const dropdownOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleSubmit = async () => {
    setError("");
    setResponse(null);
    try {
      // Validate and parse JSON input
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        throw new Error("Invalid JSON: 'data' key missing.");
      }

      // Make POST request to backend
      const apiResponse = await axios.post("http://localhost:5000/bfhl", parsedInput);
      setResponse(apiResponse.data);
    } catch (err) {
      setError(err.message || "Invalid JSON or Server Error");
    }
  };

  const renderResponse = () => {
    if (!response || selectedOptions.length === 0) return null;

    // Filter response based on selected dropdown options
    const filteredResponse = selectedOptions.map((option) => ({
      [option.label]: response[option.value],
    }));

    return (
      <div>
        {filteredResponse.map((item, index) => (
          <div key={index} className="response-section">
            <h4>{Object.keys(item)[0]}:</h4>
            <pre>{JSON.stringify(Object.values(item)[0], null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      {/* JSON Input */}
      <textarea
        placeholder='Enter JSON (e.g., { "data": ["A", "1", "b"] })'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows="6"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit</button>

      {/* Error Display */}
      {error && <p className="error">{error}</p>}

      {/* Response & Dropdown */}
      {response && (
        <div>
          <h3>Filter Response:</h3>
          <Select
            isMulti
            options={dropdownOptions}
            placeholder="Select options to filter..."
            onChange={(selected) => setSelectedOptions(selected || [])}
            styles={{
              menu: (provided) => ({
                ...provided,
                color:"black",
                zIndex: 9999, // Ensures dropdown is visible above other elements
              }),
            }}
          />
          {/* Render Filtered Response */}
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
