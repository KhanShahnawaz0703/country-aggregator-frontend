import React, { useState } from "react";
import "./App.css";
import CountryCard from "./components/CountryCard";
import SplitwiseSection from "./components/SplitwiseSection";
import { getCountrySummary } from "./services/CountryService";

function App() {
  const [countryName, setCountryName] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!countryName) return;

    setLoading(true);
    const data = await getCountrySummary(countryName);
    setCountryData(data);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="title">
        🌍 Country Information & Expense Dashboard
      </div>

      <form
  className="search-section"
  onSubmit={(e) => {
    e.preventDefault(); // prevents page reload
    handleSearch();
  }}
>
  <input
    type="text"
    placeholder="Enter country name..."
    value={countryName}
    onChange={(e) => setCountryName(e.target.value)}
    className="search-input"
  />

  <button type="submit" className="search-button">
    Search
  </button>
</form>


      {loading && <p>Loading...</p>}

      {/* 🔥 Only show dashboard after search */}
      {countryData && (
        <div className="dashboard">
          <CountryCard data={countryData} />
          <SplitwiseSection currency={countryData.currency} />
        </div>
      )}
    </div>
  );
}

export default App;
