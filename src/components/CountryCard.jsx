import React from "react";
import "../App.css";

const CountryCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card">
      <h2>{data.country}</h2>

      <p><strong>Capital:</strong> {data.capital}</p>
      <p><strong>Region:</strong> {data.region}</p>
      <p><strong>Subregion:</strong> {data.subregion}</p>
      <p><strong>Population:</strong> {data.population.toLocaleString()}</p>

      <p>
        <strong>Currency:</strong> {data.currency.name} 
        ({data.currency.code}) {data.currency.symbol}
      </p>

      <div>
        <strong>Time Zones:</strong>
        <ul>
          {data.timezones.map((tz, index) => (
            <li key={index}>{tz}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CountryCard;
