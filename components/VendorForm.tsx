"use client";

import { useCallback, useMemo, useState } from "react";

type ApiResponse = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export default function VendorForm() {
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Basic client-side validation
    const firstName = String(formData.get("firstName") || "").trim();
    const minBudget = Number(formData.get("minBudget"));
    const maxBudget = Number(formData.get("maxBudget"));

    const errors: Record<string, string> = {};
    if (!firstName) errors.firstName = "First name is required";
    if (Number.isNaN(minBudget)) errors.minBudget = "Min budget must be a number";
    if (Number.isNaN(maxBudget)) errors.maxBudget = "Max budget must be a number";
    if (!Number.isNaN(minBudget) && !Number.isNaN(maxBudget) && minBudget > maxBudget) {
      errors.maxBudget = "Max budget must be greater than or equal to min budget";
    }

    if (Object.keys(errors).length > 0) {
      setResponse({ ok: false, message: "Please correct the highlighted fields.", errors });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/vendors", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || !data.ok) {
        setResponse({ ok: false, message: data.message || "Submission failed", errors: data.errors });
      } else {
        setResponse({ ok: true, message: data.message });
        form.reset();
      }
    } catch (err) {
      setResponse({ ok: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }, []);

  const errorFor = useCallback((field: string) => response?.errors?.[field], [response]);
  const hasError = useCallback((field: string) => Boolean(errorFor(field)), [errorFor]);

  const [currency, setCurrency] = useState("USD");
  const currencies = useMemo(() => ["USD", "EUR", "GBP", "INR"], []);

  return (
    <form onSubmit={onSubmit} noValidate>
      {response && (
        <div className={`alert ${response.ok ? "success" : "error"}`}>
          {response.message}
        </div>
      )}

      <div className="form-row">
        <div>
          <label className="label" htmlFor="firstName">First name<span className="required">*</span></label>
          <input id="firstName" name="firstName" className="input" placeholder="Jane" aria-invalid={hasError("firstName")}
                 required />
          {hasError("firstName") && <div className="help">{errorFor("firstName")}</div>}
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" className="input" placeholder="Doe" />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label className="label" htmlFor="company">Company</label>
          <input id="company" name="company" className="input" placeholder="Acme Vendors Ltd" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" placeholder="jane@example.com" />
          <div className="help small">Optional, helps us follow up.</div>
        </div>
      </div>

      <div className="form-row single">
        <div>
          <label className="label" htmlFor="resourceList">Resource list</label>
          <textarea id="resourceList" name="resourceList" className="textarea" placeholder="e.g. 2x Frontend (React), 1x Backend (Node), 1x QA" />
          <div className="help small">List roles/resources or attach in rate card.</div>
        </div>
      </div>

      <div className="form-row">
        <div>
          <label className="label" htmlFor="minBudget">Minimum budget<span className="required">*</span></label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="select" name="currency" aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ flex: '0 0 120px' }}>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input id="minBudget" name="minBudget" type="number" step="0.01" min="0" className="input" placeholder="1000" aria-invalid={hasError("minBudget")} required />
          </div>
          {hasError("minBudget") && <div className="help">{errorFor("minBudget")}</div>}
        </div>
        <div>
          <label className="label" htmlFor="maxBudget">Maximum budget<span className="required">*</span></label>
          <input id="maxBudget" name="maxBudget" type="number" step="0.01" min="0" className="input" placeholder="5000" aria-invalid={hasError("maxBudget")} required />
          {hasError("maxBudget") && <div className="help">{errorFor("maxBudget")}</div>}
        </div>
      </div>

      <div className="form-row">
        <div>
          <label className="label" htmlFor="cv">Upload CV (optional)</label>
          <input id="cv" name="cv" type="file" className="file-input" accept=".pdf,.doc,.docx" />
          <div className="help small">PDF/DOC up to 10MB.</div>
        </div>
        <div>
          <label className="label" htmlFor="rateCard">Upload rate card (optional)</label>
          <input id="rateCard" name="rateCard" type="file" className="file-input" accept=".pdf,.csv,.xlsx" />
          <div className="help small">PDF/CSV/XLSX up to 10MB.</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="button" type="submit" disabled={submitting}>{submitting ? 'Submitting?' : 'Submit'}</button>
      </div>

      <p className="help small" style={{ marginTop: 12 }}>
        We respect your privacy. Files are accepted for processing, but this demo does not persist data.
      </p>
    </form>
  );
}
