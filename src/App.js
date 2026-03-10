// import React, { useState } from "react";
// import "./App.css";
// import CountryCard from "./components/CountryCard";
// import SplitwiseSection from "./components/SplitwiseSection";
// import { getCountrySummary } from "./services/CountryService";

// function App() {
//   const [countryName, setCountryName] = useState("");
//   const [countryData, setCountryData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!countryName) return;

//     setLoading(true);
//     const data = await getCountrySummary(countryName);
//     setCountryData(data);
//     setLoading(false);
//   };

//   return (
//     <div className="app-container">
//       <div className="title">
//         🌍 Country Information & Expense Dashboard for Itenary Planning
//       </div>

//       <form
//   className="search-section"
//   onSubmit={(e) => {
//     e.preventDefault(); // prevents page reload
//     handleSearch();
//   }}
// >
//   <input
//     type="text"
//     placeholder="Enter country name..."
//     value={countryName}
//     onChange={(e) => setCountryName(e.target.value)}
//     className="search-input"
//   />

//   <button type="submit" className="search-button">
//     Search
//   </button>
// </form>


//       {loading && <p>Loading...</p>}

//       {/* 🔥 Only show dashboard after search */}
//       {countryData && (
//         <div className="dashboard">
//           <CountryCard data={countryData} />
//           <SplitwiseSection currency={countryData.currency} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState } from "react";
import "./App.css";
import CountryCard from "./components/CountryCard";
import SplitwiseSection from "./components/SplitwiseSection";
import MapSection from "./components/MapSection";
import { getCountrySummary } from "./services/CountryService";

function App() {
  const [countryName, setCountryName] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW: shared location state (Splitwise -> Google Map)
  const [locationName, setLocationName] = useState("");

  const handleSearch = async () => {
    if (!countryName) return;

    setLoading(true);
    const data = await getCountrySummary(countryName);
    setCountryData(data);

    // optional: prefill location with country name on search
    setLocationName(data?.country || countryName);

    setLoading(false);
  };

  const handleBack = () => {
    setCountryData(null);
    setCountryName("");
    setLocationName("");
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="title">
        🌍 Country Information & Expense Dashboard for Itenary Planning
      </div>

      {/* When no country selected: show search.
          When a country is selected: show a small Back button instead (to save space). */}
      {!countryData ? (
        <form
          className="search-section"
          onSubmit={(e) => {
            e.preventDefault();
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

          <button type="submit" className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      ) : (
        <div className="search-section" style={{ justifyContent: "flex-start" }}>
          <button
            type="button"
            className="search-button"
            onClick={handleBack}
            style={{ width: "auto", padding: "10px 12px" }}
          >
            ← Back
          </button>
        </div>
      )}

      {loading && !countryData && <p>Loading...</p>}

      {/* Dashboard (3 sections now): Country + Splitwise + Google Maps */}
      {countryData && (
        <div className="dashboard">
          <CountryCard data={countryData} />

          <SplitwiseSection
            currency={countryData.currency}
            locationName={locationName}
            setLocationName={setLocationName}
          />

          <MapSection locationName={locationName} />
        </div>
      )}
    </div>
  );
}

export default App;