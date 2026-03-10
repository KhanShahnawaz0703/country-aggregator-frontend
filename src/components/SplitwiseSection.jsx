// import React, { useMemo, useState } from "react";
// import "../App.css";

// const API_URL =
//   "http://costsplitting-app-env.eba-cpt2wyzw.eu-north-1.elasticbeanstalk.com/split/weighted";

// const SplitwiseSection = ({ currency }) => {
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");

//   // Weighted participants UI state
//   const [participants, setParticipants] = useState([
//     { name: "Hussain", weight: 6 },
//     { name: "shaan", weight: 4 },
//   ]);

//   const [result, setResult] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const totalWeight = useMemo(
//     () =>
//       participants.reduce((sum, p) => {
//         const w = Number(p.weight);
//         return sum + (Number.isFinite(w) ? w : 0);
//       }, 0),
//     [participants]
//   );

//   const addParticipant = () => {
//     setParticipants((prev) => [...prev, { name: "", weight: 1 }]);
//   };

//   const removeParticipant = (idx) => {
//     setParticipants((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const updateParticipant = (idx, field, value) => {
//     setParticipants((prev) =>
//       prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
//     );
//   };

//   const validateInputs = () => {
//     const totalAmount = Number(amount);
//     if (!amount || Number.isNaN(totalAmount) || totalAmount <= 0) {
//       return "Please enter a valid total amount.";
//     }

//     if (!participants.length) {
//       return "Please add at least one participant.";
//     }

//     for (const p of participants) {
//       if (!p.name || !p.name.trim()) return "Each participant must have a name.";
//       const w = Number(p.weight);
//       if (Number.isNaN(w) || w <= 0) return "Each participant weight must be > 0.";
//     }

//     if (totalWeight <= 0) {
//       return "Total weight must be > 0.";
//     }

//     return "";
//   };

//   const handleCalculate = async () => {
//     setError("");
//     setResult(null);

//     const validationError = validateInputs();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const totalAmount = Number(amount);

//     // Ensure the payload matches the API contract exactly
//     const payload = {
//       total_amount: totalAmount,
//       participants: participants.map((p) => ({
//         name: p.name.trim(),
//         weight: Number(p.weight),
//       })),
//     };

//     try {
//       setLoading(true);

//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         let detail = "";
//         try {
//           const body = await res.json();
//           detail = body?.detail ? ` - ${body.detail}` : "";
//         } catch {
//           // ignore
//         }
//         throw new Error(`API error (${res.status})${detail}`);
//       }

//       const data = await res.json();

//       const rawBreakdown =
//         data?.splits || data?.result || data?.participants || data;

//       const breakdownArray = Array.isArray(rawBreakdown) ? rawBreakdown : [];

//       // Fallback breakdown computed locally (in case API response is unknown)
//       const localBreakdown = participants.map((p) => {
//         const w = Number(p.weight);
//         const share = (totalAmount * w) / totalWeight;
//         return {
//           name: p.name.trim(),
//           weight: w,
//           amount: share,
//         };
//       });

//       const breakdown =
//         breakdownArray.length > 0
//           ? breakdownArray
//               .map((x) => ({
//                 name: x?.name ?? x?.participant ?? "Unknown",
//                 weight: x?.weight,
//                 amount: x?.amount ?? x?.share ?? x?.pay ?? x?.owed,
//               }))
//               .filter((x) => x.name)
//           : localBreakdown;

//       setResult({
//         description,
//         total: totalAmount,
//         totalWeight,
//         breakdown,
//         api: data,
//       });
//     } catch (e) {
//       setError(e?.message || "Failed to calculate weighted split.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatMoney = (value) => {
//     if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
//     return Number(value).toFixed(2);
//   };

//   return (
//     <>
//       {/* Splitwise Input Card */}
//       <div className="card">
//         <div className="section-title">💰 Splitwise Weighted Expense Calculator</div>

//         <p>
//           <strong>Currency:</strong> {currency.name} ({currency.code})
//         </p>

//         <input
//           type="text"
//           placeholder="Expense Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="search-input"
//           style={{ marginBottom: "10px", width: "100%" }}
//         />

//         <input
//           type="number"
//           placeholder="Total Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="split-calc-input"
//           style={{ marginBottom: "15px", width: "100%" }}
//         />

//         <div style={{ marginBottom: "10px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
//             <strong>Participants (weighted)</strong>

//             {/* Keep +Add compact so it doesn't behave like the big CTA button */}
//             <button
//               type="button"
//               onClick={addParticipant}
//               className="search-button"
//               style={{ width: "auto", padding: "10px 12px" }}
//             >
//               + Add
//             </button>
//           </div>

//           {participants.map((p, idx) => (
//             <div
//               key={idx}
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "minmax(0, 1fr) 110px 40px",
//                 gap: "8px",
//                 marginBottom: "8px",
//                 alignItems: "center",
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={p.name}
//                 onChange={(e) => updateParticipant(idx, "name", e.target.value)}
//                 className="split-calc-input"
//               />

//               <input
//                 type="number"
//                 placeholder="Weight"
//                 value={p.weight}
//                 min="1"
//                 onChange={(e) => updateParticipant(idx, "weight", e.target.value)}
//                 className="split-calc-input"
//               />

//               {/* Icon-only remove button to prevent layout overflow */}
//               <button
//                 type="button"
//                 onClick={() => removeParticipant(idx)}
//                 disabled={participants.length <= 1}
//                 title={participants.length <= 1 ? "At least one participant is required" : "Remove participant"}
//                 aria-label="Remove participant"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   borderRadius: "12px",
//                   border: "1px solid rgba(220, 38, 38, 0.35)",
//                   background: "rgba(220, 38, 38, 0.08)",
//                   color: "#dc2626",
//                   fontWeight: 900,
//                   cursor: participants.length <= 1 ? "not-allowed" : "pointer",
//                   lineHeight: "1",
//                   padding: 0,
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}

//           <p style={{ marginTop: "8px" }}>
//             <strong>Total Weight:</strong> {totalWeight}
//           </p>
//         </div>

//         <button
//           onClick={handleCalculate}
//           className="search-button"
//           style={{ width: "100%" }}
//           disabled={loading}
//         >
//           {loading ? "Calculating..." : "Calculate Weighted Split"}
//         </button>

//         {error && (
//           <p style={{ color: "red", marginTop: "10px" }}>
//             <strong>Error:</strong> {error}
//           </p>
//         )}
//       </div>

//       {/* Result Card */}
//       {result && (
//         <div className="card">
//           <div className="section-title">📊 Weighted Split Result</div>

//           <p>
//             <strong>Description:</strong> {result.description || "-"}
//           </p>
//           <p>
//             <strong>Total:</strong> {formatMoney(result.total)} {currency.code}
//           </p>
//           <p>
//             <strong>Total Weight:</strong> {result.totalWeight}
//           </p>

//           <div style={{ marginTop: "12px" }}>
//             <strong>Breakdown:</strong>
//             <div style={{ marginTop: "8px" }}>
//               {result.breakdown.map((b, i) => (
//                 <div
//                   key={`${b.name}-${i}`}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 120px 140px",
//                     gap: "8px",
//                     padding: "6px 0",
//                     borderBottom: "1px solid rgba(255,255,255,0.08)",
//                   }}
//                 >
//                   <div>{b.name}</div>
//                   <div style={{ opacity: 0.85 }}>
//                     Weight: {b.weight ?? "-"}
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     {formatMoney(b.amount)} {currency.code}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Optional: show raw API response for debugging */}
//           {/* <pre style={{ marginTop: "12px" }}>{JSON.stringify(result.api, null, 2)}</pre> */}
//         </div>
//       )}
//     </>
//   );
// };

// export default SplitwiseSection;

import React, { useMemo, useState } from "react";
import "../App.css";

const API_URL =
  "http://costsplitting-app-env.eba-cpt2wyzw.eu-north-1.elasticbeanstalk.com/split/weighted";

const SplitwiseSection = ({ currency, locationName, setLocationName }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [participants, setParticipants] = useState([
    { name: "Hussain", weight: 6 },
    { name: "shaan", weight: 4 },
  ]);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalWeight = useMemo(
    () =>
      participants.reduce((sum, p) => {
        const w = Number(p.weight);
        return sum + (Number.isFinite(w) ? w : 0);
      }, 0),
    [participants]
  );

  const addParticipant = () => {
    setParticipants((prev) => [...prev, { name: "", weight: 1 }]);
  };

  const removeParticipant = (idx) => {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateParticipant = (idx, field, value) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const validateInputs = () => {
    const totalAmount = Number(amount);
    if (!amount || Number.isNaN(totalAmount) || totalAmount <= 0) {
      return "Please enter a valid total amount.";
    }

    if (!participants.length) {
      return "Please add at least one participant.";
    }

    for (const p of participants) {
      if (!p.name || !p.name.trim()) return "Each participant must have a name.";
      const w = Number(p.weight);
      if (Number.isNaN(w) || w <= 0) return "Each participant weight must be > 0.";
    }

    if (totalWeight <= 0) {
      return "Total weight must be > 0.";
    }

    // location is optional; remove this check if you want to allow empty
    if (!locationName || !locationName.trim()) {
      return "Please enter a location to show on Google Maps.";
    }

    return "";
  };

  const handleCalculate = async () => {
    setError("");
    setResult(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const totalAmount = Number(amount);

    const payload = {
      total_amount: totalAmount,
      participants: participants.map((p) => ({
        name: p.name.trim(),
        weight: Number(p.weight),
      })),
    };

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API error (${res.status})`);
      }

      const data = await res.json();

      // local breakdown (works regardless of API response shape)
      const localBreakdown = participants.map((p) => {
        const w = Number(p.weight);
        const share = (totalAmount * w) / totalWeight;
        return { name: p.name.trim(), weight: w, amount: share };
      });

      setResult({
        description,
        total: totalAmount,
        totalWeight,
        breakdown: localBreakdown,
        api: data,
      });
    } catch (e) {
      setError(e?.message || "Failed to calculate weighted split.");
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
    return Number(value).toFixed(2);
  };

  return (
    <>
      <div className="card">
        <div className="section-title">💰 Splitwise Weighted Expense Calculator</div>

        <p>
          <strong>Currency:</strong> {currency.name} ({currency.code})
        </p>

        {/* NEW: location field (controls Google Map section) */}
        <input
          type="text"
          placeholder="Location for map (e.g., Tokyo, Japan)"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="search-input"
          style={{ marginBottom: "10px", width: "100%" }}
        />

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
          className="split-calc-input"
          style={{ marginBottom: "15px", width: "100%" }}
        />

        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong>Participants (weighted)</strong>

            <button
              type="button"
              onClick={addParticipant}
              className="search-button"
              style={{ width: "auto", padding: "10px 12px" }}
            >
              + Add
            </button>
          </div>

          {participants.map((p, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 110px 40px",
                gap: "8px",
                marginBottom: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={p.name}
                onChange={(e) => updateParticipant(idx, "name", e.target.value)}
                className="split-calc-input"
              />

              <input
                type="number"
                placeholder="Weight"
                value={p.weight}
                min="1"
                onChange={(e) => updateParticipant(idx, "weight", e.target.value)}
                className="split-calc-input"
              />

              {/* icon-only remove */}
              <button
                type="button"
                onClick={() => removeParticipant(idx)}
                disabled={participants.length <= 1}
                title={participants.length <= 1 ? "At least one participant is required" : "Remove participant"}
                aria-label="Remove participant"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: "1px solid rgba(220, 38, 38, 0.35)",
                  background: "rgba(220, 38, 38, 0.08)",
                  color: "#dc2626",
                  fontWeight: 900,
                  cursor: participants.length <= 1 ? "not-allowed" : "pointer",
                  lineHeight: "1",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <p style={{ marginTop: "8px" }}>
            <strong>Total Weight:</strong> {totalWeight}
          </p>
        </div>

        <button
          onClick={handleCalculate}
          className="search-button"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Weighted Split"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {result && (
        <div className="card">
          <div className="section-title">📊 Weighted Split Result</div>

          <p>
            <strong>Description:</strong> {result.description || "-"}
          </p>
          <p>
            <strong>Total:</strong> {formatMoney(result.total)} {currency.code}
          </p>
          <p>
            <strong>Total Weight:</strong> {result.totalWeight}
          </p>

          <div style={{ marginTop: "12px" }}>
            <strong>Breakdown:</strong>
            <div style={{ marginTop: "8px" }}>
              {result.breakdown.map((b, i) => (
                <div
                  key={`${b.name}-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 120px 140px",
                    gap: "8px",
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div>{b.name}</div>
                  <div style={{ opacity: 0.85 }}>Weight: {b.weight ?? "-"}</div>
                  <div style={{ textAlign: "right" }}>
                    {formatMoney(b.amount)} {currency.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SplitwiseSection;