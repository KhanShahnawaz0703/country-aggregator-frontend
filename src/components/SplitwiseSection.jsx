import React, { useState } from "react";
import "../App.css";

const SplitwiseSection = ({ currency }) => {

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!amount || !people) return;

    const splitAmount = parseFloat(amount) / parseInt(people);

    // 🔥 MOCK CALCULATION RESULT
    // Later replace this with your colleague’s API call

    setResult({
      description,
      total: amount,
      people,
      perPerson: splitAmount.toFixed(2)
    });
  };

  return (
    <>
      {/* Splitwise Input Card */}
      <div className="card">
        <div className="section-title">💰 Splitwise Expense Calculator</div>

        <p><strong>Currency:</strong> {currency.name} ({currency.code})</p>

        <input
          type="text"
          placeholder="Expense Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="search-input"
          style={{ marginBottom: "10px", width: "100%" }}
        />

        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="search-input"
          style={{ marginBottom: "10px", width: "100%" }}
        />

        <input
          type="number"
          placeholder="Number of People"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          className="search-input"
          style={{ marginBottom: "15px", width: "100%" }}
        />

        <button
          onClick={handleCalculate}
          className="search-button"
          style={{ width: "100%" }}
        >
          Calculate Split
        </button>
      </div>

      {/* 🔥 Result Card appears only after calculation */}
      {result && (
        <div className="card">
          <div className="section-title">📊 Expense Result</div>

          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Total:</strong> {result.total} {currency.code}</p>
          <p><strong>People:</strong> {result.people}</p>
          <p>
            <strong>Each Person Pays:</strong> {result.perPerson} {currency.code}
          </p>
        </div>
      )}
    </>
  );
};

export default SplitwiseSection;
