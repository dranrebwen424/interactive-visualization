const SelectControl = ({ label, value, onChange, options }) => (
  <label className="flex w-full flex-col gap-1">
    <span className="text-xs uppercase tracking-[0.08em] text-mute">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-white/20 bg-panel px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const GlobalControls = ({ filters, controls, onFilterChange }) => (
  <div className="flex flex-col gap-4">
    <SelectControl
      label="View Mode"
      value={filters.viewMode}
      onChange={(value) => onFilterChange('viewMode', value)}
      options={controls.viewModes}
    />
    <SelectControl
      label="X-Axis (Predictor)"
      value={filters.predictor}
      onChange={(value) => onFilterChange('predictor', value)}
      options={controls.predictors}
    />
  </div>
);

export default GlobalControls;
