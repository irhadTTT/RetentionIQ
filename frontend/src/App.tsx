import { useState, useEffect } from "react";
import ModelEvaluation from "./pages/ModelEvaluation";
import {
  checkHealth,
  compareModels,
  explainPrediction,
  type CustomerData,
  type ModelComparisonResult,
  type ExplanationResult,
} from "./services/api";

const initialCustomer: CustomerData = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "No",
  Dependents: "No",
  tenure: 2,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 70.7,
  TotalCharges: 151.65,
};

function App() {
  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);
  const [comparison, setComparison] = useState<ModelComparisonResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState<"prediction" | "evaluation">("prediction");
  const [apiOnline, setApiOnline] = useState(false);
  const totalAbsoluteShap = explanation?.explanations.reduce(
    (sum, factor) => sum + Math.abs(factor.shap_value),
    0
  ) ?? 0;
  useEffect(() => {
    checkHealth()
      .then((data) => {
        setApiOnline(data);
      })
      .catch(() => setError("Failed to load health endpoint"))
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof CustomerData>(
    field: K,
    value: CustomerData[K]
  ) {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handlePredict() {
    setLoading(true);
    setError("");
    setComparison(null);
    setExplanation(null);

    try {
      const [comparisonResult, explanationResult] = await Promise.all([
        compareModels(customer),
        explainPrediction(customer)
      ]);
      setComparison(comparisonResult);
      setExplanation(explanationResult);
    } catch {
      setError(
        "Unable to connect to the prediction API. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#496354] text-slate-100">

      <header className="border-b border-emerald-800/50 bg-[#203B32] shadow-lg shadow-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-white">
              RetentionIQ
            </h1>

            <p className="text-sm text-slate-200">
              Customer Retention Intelligence
            </p>
            <nav className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActivePage("prediction")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activePage === "prediction"
                  ? "bg-emerald-400 text-[#10251D]"
                  : "text-slate-200 hover:bg-white/10"
                  }`}
              >
                Customer Prediction
              </button>

              <button
                onClick={() => setActivePage("evaluation")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activePage === "evaluation"
                  ? "bg-emerald-400 text-[#10251D]"
                  : "text-slate-200 hover:bg-white/10"
                  }`}
              >
                Model Evaluation
              </button>
            </nav>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${apiOnline
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${apiOnline ? "animate-pulse bg-green-500" : "bg-red-500"
                }`}
            />

            {apiOnline ? "API Online" : "API Offline"}
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {activePage === "prediction" ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">
                RetentionIQ Customer Prediction
              </h2>

              <p className="mt-2 text-slate-200">
                Enter customer information to estimate their churn probability.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-[#111E32] p-6 shadow-xl shadow-black/10 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white">
                  Customer Information
                </h3>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Gender
                    </label>

                    <select
                      value={customer.gender}
                      onChange={(e) =>
                        updateField("gender", e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>Female</option>
                      <option>Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Senior Citizen
                    </label>

                    <select
                      value={customer.SeniorCitizen}
                      onChange={(e) =>
                        updateField(
                          "SeniorCitizen",
                          Number(e.target.value)
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>

                  {/* Partner */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Partner
                    </label>

                    <select
                      value={customer.Partner}
                      onChange={(e) =>
                        updateField("Partner", e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  {/* Dependents */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Dependents
                    </label>

                    <select
                      value={customer.Dependents}
                      onChange={(e) =>
                        updateField("Dependents", e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  {/* Tenure */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Tenure (months)
                    </label>

                    <input
                      type="number"
                      value={customer.tenure}
                      onChange={(e) =>
                        updateField("tenure", Number(e.target.value))
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  {/* Monthly Charges */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Monthly Charges
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      value={customer.MonthlyCharges}
                      onChange={(e) =>
                        updateField(
                          "MonthlyCharges",
                          Number(e.target.value)
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  {/* Total Charges */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Total Charges
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      value={customer.TotalCharges}
                      onChange={(e) =>
                        updateField(
                          "TotalCharges",
                          Number(e.target.value)
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  {/* Contract */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Contract
                    </label>

                    <select
                      value={customer.Contract}
                      onChange={(e) =>
                        updateField("Contract", e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>Month-to-month</option>
                      <option>One year</option>
                      <option>Two year</option>
                    </select>
                  </div>

                  {/* Internet */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Internet Service
                    </label>

                    <select
                      value={customer.InternetService}
                      onChange={(e) =>
                        updateField(
                          "InternetService",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>DSL</option>
                      <option>Fiber optic</option>
                      <option>No</option>
                    </select>
                  </div>

                  {/* Payment */}

                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Payment Method
                    </label>

                    <select
                      value={customer.PaymentMethod}
                      onChange={(e) =>
                        updateField(
                          "PaymentMethod",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option>Electronic check</option>
                      <option>Mailed check</option>
                      <option>Bank transfer (automatic)</option>
                      <option>Credit card (automatic)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="mt-8 w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-[#10251D] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Predict Churn"}
                </button>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-rose-400">
                    {error}
                  </p>
                )}
              </div>

              {/* Result */}

              <div className="rounded-2xl border border-slate-800 bg-[#111E32] p-6 shadow-xl shadow-black/10">
                <h3 className="text-lg font-semibold text-white">
                  Model Comparison
                </h3>

                {!comparison && (
                  <div className="flex min-h-80 items-center justify-center text-center">
                    <div>
                      <p className="text-slate-400">No prediction yet</p>
                      <p className="mt-2 text-sm text-slate-400">
                        Enter customer information and click Predict Churn.
                      </p>
                    </div>
                  </div>
                )}

                {comparison && (
                  <div className="mt-6 space-y-6">
                    {(
                      [
                        {
                          name: "Logistic Regression",
                          result: comparison.logistic_regression,
                        },
                        {
                          name: "XGBoost",
                          result: comparison.xgboost,
                        },
                      ] as const
                    ).map(({ name, result }) => (
                      <div key={name} className="rounded-xl border border-slate-700 bg-[#0B1220] p-4">
                        <h4 className="font-semibold text-white">{name}</h4>

                        <p className="mt-3 text-sm text-slate-500">
                          Churn Probability
                        </p>

                        <p className="mt-1 text-4xl font-bold text-white">
                          {(result.churn_probability * 100).toFixed(2)}%
                        </p>

                        <p
                          className={`mt-3 text-lg font-bold ${result.prediction === "Yes"
                            ? "text-rose-400"
                            : "text-emerald-400"
                            }`}
                        >
                          {result.prediction === "Yes" ? "HIGH RISK" : "LOW RISK"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Prediction: {result.prediction}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
            {/* SHAP Explanation */}
            <div className="mt-8 w-full rounded-2xl border border-slate-800 bg-[#111E32] p-6 shadow-xl shadow-black/10">
              <h3 className="text-lg font-semibold text-white">
                Why this prediction?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Relative influence of the most important factors on the XGBoost prediction.
              </p>

              {!explanation && (
                <p className="mt-5 text-sm text-slate-400">
                  Run a prediction to see the explanation.
                </p>
              )}

              {explanation && (
                <div className="mt-6 space-y-5">
                  {explanation.explanations.map((factor) => {
                    const relativeImpact =
                      totalAbsoluteShap > 0
                        ? (Math.abs(factor.shap_value) / totalAbsoluteShap) * 100
                        : 0;

                    const increasesRisk = factor.shap_value > 0;

                    return (
                      <div key={factor.feature} className="space-y-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium text-slate-200">
                            {factor.feature
                              .replace(/^(cat__|num__)/, "")
                              .replaceAll("_", " ")}
                          </p>

                          <span
                            className={`text-sm font-semibold ${increasesRisk ? "text-rose-400" : "text-emerald-600"
                              }`}
                          >
                            {relativeImpact.toFixed(1)}% relative impact
                          </span>
                        </div>

                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${increasesRisk ? "bg-red-500" : "bg-emerald-500"
                              }`}
                            style={{ width: `${relativeImpact}%` }}
                          />
                        </div>

                        <p
                          className={`text-sm ${increasesRisk ? "text-rose-400" : "text-emerald-600"
                            }`}
                        >
                          {factor.impact}
                        </p>
                      </div>
                    );
                  })}

                  <p className="border-t border-slate-700 pt-4 text-xs leading-5 text-slate-400">
                    Relative impact is calculated from the absolute SHAP values of the
                    factors displayed above. It represents their relative contribution,
                    not the probability of customer churn. Red indicates increased churn
                    risk; green indicates decreased churn risk.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ModelEvaluation />
        )}
      </main >
    </div >
  );
}

export default App;