export const mean = (rows, key) => {
  if (!rows.length) return 0;
  const total = rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
  return total / rows.length;
};

export const uniqueValues = (rows, key) => ['All', ...new Set(rows.map((row) => row[key]))];

export const applyFilters = (rows, filters) => rows;

export const groupRows = (rows, groupKey) => {
  const groups = new Map();
  rows.forEach((row) => {
    const key = row[groupKey];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  return groups;
};

export function pearsonCorrelation(rows, xKey, yKey) {
  if (!rows.length) return 0;

  const n = rows.length;
  const xMean = mean(rows, xKey);
  const yMean = mean(rows, yKey);

  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  for (let i = 0; i < n; i += 1) {
    const xDiff = rows[i][xKey] - xMean;
    const yDiff = rows[i][yKey] - yMean;
    numerator += xDiff * yDiff;
    xVariance += xDiff ** 2;
    yVariance += yDiff ** 2;
  }

  if (xVariance === 0 || yVariance === 0) return 0;
  return numerator / Math.sqrt(xVariance * yVariance);
}

export const toCsv = (rows) => {
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  const header = columns.join(',');
  const values = rows.map((row) =>
    columns
      .map((column) => {
        const raw = row[column];
        const value = raw === null || raw === undefined ? '' : String(raw);
        return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
      })
      .join(',')
  );
  return [header, ...values].join('\n');
};
