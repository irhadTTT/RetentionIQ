import { useState, useEffect } from "react";

import {
  checkHealth,
  compareModels,
  type CustomerData,
  type ModelComparisonResult
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [apiOnline, setApiOnline] = useState(false);

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

    try {
      const result = await compareModels(customer);
      setComparison(result);
    } catch {
      setError(
        "Unable to connect to the prediction API. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              RetentionIQ
            </h1>

            <p className="text-sm text-slate-500">
              Customer Retention Intelligence
            </p>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            RetentionIQ Customer Prediction
          </h2>

          <p className="mt-2 text-slate-500">
            Enter customer information to estimate their churn probability.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Customer Information
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Gender
                </label>

                <select
                  value={customer.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              {/* Partner */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Partner
                </label>

                <select
                  value={customer.Partner}
                  onChange={(e) =>
                    updateField("Partner", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Dependents */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Dependents
                </label>

                <select
                  value={customer.Dependents}
                  onChange={(e) =>
                    updateField("Dependents", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Tenure */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Tenure (months)
                </label>

                <input
                  type="number"
                  value={customer.tenure}
                  onChange={(e) =>
                    updateField("tenure", Number(e.target.value))
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Monthly Charges */}

              <div>
                <label className="text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Total Charges */}

              <div>
                <label className="text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Contract */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Contract
                </label>

                <select
                  value={customer.Contract}
                  onChange={(e) =>
                    updateField("Contract", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option>Month-to-month</option>
                  <option>One year</option>
                  <option>Two year</option>
                </select>
              </div>

              {/* Internet */}

              <div>
                <label className="text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  <option>DSL</option>
                  <option>Fiber optic</option>
                  <option>No</option>
                </select>
              </div>

              {/* Payment */}

              <div>
                <label className="text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border px-3 py-2"
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
              className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Predict Churn"}
            </button>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Result */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
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
                  <div key={name} className="rounded-lg border p-4">
                    <h4 className="font-semibold text-slate-900">{name}</h4>

                    <p className="mt-3 text-sm text-slate-500">
                      Churn Probability
                    </p>

                    <p className="mt-1 text-4xl font-bold text-slate-900">
                      {(result.churn_probability * 100).toFixed(2)}%
                    </p>

                    <p
                      className={`mt-3 text-lg font-bold ${result.prediction === "Yes"
                          ? "text-red-600"
                          : "text-green-600"
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
      </main>
    </div>
  );
}

export default App;