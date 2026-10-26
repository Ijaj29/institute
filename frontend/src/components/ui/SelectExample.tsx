import React, { useState } from 'react';
import Select from './Select';

const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
];

export default function SelectExample() {
  // Single select
  const [country, setCountry] = useState<string | undefined>();

  // Multi select
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Bump this to force-clear both selects from outside
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <div>
        <label className="mb-1 block font-medium text-slate-700">Country (single)</label>
        <Select
          options={countries}
          labelKey="name"
          labelKey2="code"
          valueKey="code"
          placeholder="Select a country"
          value={country}
          onChange={(value) => setCountry(value)}
          resetTrigger={resetKey}
        />
      </div>

      <div>
        <label className="mb-1 block font-medium text-slate-700">Countries (multi, max 3)</label>
        <Select
          multiple
          options={countries}
          labelKey="name"
          labelKey2="code"
          valueKey="code"
          placeholder="Select countries"
          value={selectedCountries}
          onChange={(values) => setSelectedCountries(values)}
          maxSelection={3}
          showSelectAll
          resetTrigger={resetKey}
        />
      </div>

      <button
        type="button"
        onClick={() => setResetKey((k) => k + 1)}
        className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
      >
        Reset both
      </button>

      <pre className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">
        {JSON.stringify({ country, selectedCountries }, null, 2)}
      </pre>
    </div>
  );
}
