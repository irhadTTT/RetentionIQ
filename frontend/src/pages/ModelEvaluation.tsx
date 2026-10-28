import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getModelEvaluation,
  type EvaluationResult,
} from "../services/api";

const metrics = [
  { key: "accuracy", label: "Accuracy" },
  { key: "precision", label: "Precision" },
  { key: "recall", label: "Recall" },
  { key: "f1_score", label: "F1-score" },
  { key: "roc_auc", label: "ROC-AUC" },
] as const;

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function ConfusionMatrix({
  title,
  matrix,
}: {
  title: string;
  matrix: number[][];
}) {
  const cells = [
    { value: matrix[0][0], label: "True Negative", color: "bg-emerald-500/20" },
    { value: matrix[0][1], label: "False Positive", color: "bg-rose-500/20" },
    { value: matrix[1][0], label: "False Negative", color: "bg-rose-500/20" },
    { value: matrix[1][1], label: "True Positive", color: "bg-emerald-500/20" },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111E32] p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">
        Rows: actual class · Columns: predicted class
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={`rounded-xl border border-slate-700 p-4 ${cell.color}`}
          >
            <p className="text-2xl font-bold text-white">
              {cell.value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-300">{cell.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs text-slate-400">
        <p>Predicted: No churn</p>
        <p>Predicted: Churn</p>
      </div>
    </section>
  );
}

export default function ModelEvaluation() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getModelEvaluation()
      .then(setEvaluation)
      .catch(() => setError("Unable to load evaluation results from the API."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#111E32] p-10 text-slate-300">
        Loading model evaluation...
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="rounded-2xl border border-rose-900 bg-[#111E32] p-6 text-rose-300">
        {error || "No evaluation data available."}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const lr = evaluation.models.logistic_regression;
  const xgb = evaluation.models.xgboost;

  const chartData = metrics.map((metric) => ({
    metric: metric.label,
    "Logistic Regression": lr[metric.key],
    XGBoost: xgb[metric.key],
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-300">
          Model Performance
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Model Evaluation
        </h2>
        <p className="mt-2 text-slate-300">
          Evaluation on {evaluation.test_samples.toLocaleString()} held-out
          customer records. Positive class: {evaluation.positive_class}.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const lrValue = lr[metric.key];
          const xgbValue = xgb[metric.key];
          const best = Math.max(lrValue, xgbValue);

          return (
            <div
              key={metric.key}
              className="rounded-2xl border border-slate-800 bg-[#111E32] p-5"
            >
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {formatPercent(lrValue)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Logistic Regression
              </p>
              <div className="mt-4 border-t border-slate-700 pt-3">
                <p className="text-lg font-semibold text-emerald-300">
                  {formatPercent(xgbValue)}
                </p>
                <p className="text-xs text-slate-400">XGBoost</p>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Best: {formatPercent(best)}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#111E32] p-6">
        <h3 className="text-lg font-semibold text-white">
          Model Metrics Comparison
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Higher values indicate better performance for these metrics.
        </p>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="metric" stroke="#94A3B8" />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
                stroke="#94A3B8"
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? formatPercent(value) : value
                }
                contentStyle={{
                  backgroundColor: "#0B1220",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#F1F5F9",
                }}
              />
              <Legend />
              <Bar dataKey="Logistic Regression" fill="#34D399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="XGBoost" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ConfusionMatrix
          title="Logistic Regression — Confusion Matrix"
          matrix={lr.confusion_matrix}
        />
        <ConfusionMatrix
          title="XGBoost — Confusion Matrix"
          matrix={xgb.confusion_matrix}
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#111E32] p-6">
        <h3 className="text-lg font-semibold text-white">Key Findings</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Logistic Regression achieves {formatPercent(lr.accuracy)} accuracy
            compared with {formatPercent(xgb.accuracy)} for XGBoost.
          </li>
          <li>
            Logistic Regression has {formatPercent(lr.recall)} recall, compared
            with {formatPercent(xgb.recall)} for XGBoost.
          </li>
          <li>
            ROC-AUC is {formatPercent(lr.roc_auc)} for Logistic Regression and{" "}
            {formatPercent(xgb.roc_auc)} for XGBoost.
          </li>
        </ul>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Metrics are calculated by the backend from the saved evaluation
          dataset and trained models. They reflect the current prediction
          threshold and evaluation split.
        </p>
      </section>
    </div>
  );
}
