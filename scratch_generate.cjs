const fs = require('fs');

const targetCorrelation = [
  [1, -.159, .866, -.402, -.221, .308, -.280, -.511],
  [-.159, 1, -.561, .419, -.615, .689, .295, -.423],
  [.866, -.561, 1, -.710, .048, .064, -.181, -.389],
  [-.402, .419, -.710, 1, .157, -.313, -.167, .474],
  [-.221, -.615, .048, .157, 1, -.896, .242, .373],
  [.308, .689, .064, -.313, -.896, 1, .161, -.734],
  [-.280, .295, -.181, -.167, .242, .161, 1, -.578],
  [-.511, -.423, -.389, .474, .373, -.734, -.578, 1]
];

// 8 variables, 5 points each
let X = Array.from({ length: 8 }, () => Array.from({ length: 5 }, () => Math.random() * 4 + 1));

const learningRate = 0.01;
const iterations = 100000;

function computeCorrelation(X) {
  let cor = Array.from({ length: 8 }, () => Array(8).fill(0));
  for (let i = 0; i < 8; i++) {
    let meanI = X[i].reduce((a, b) => a + b) / 5;
    let varI = X[i].reduce((a, b) => a + Math.pow(b - meanI, 2), 0);
    for (let j = 0; j < 8; j++) {
      let meanJ = X[j].reduce((a, b) => a + b) / 5;
      let varJ = X[j].reduce((a, b) => a + Math.pow(b - meanJ, 2), 0);
      let cov = 0;
      for (let k = 0; k < 5; k++) {
        cov += (X[i][k] - meanI) * (X[j][k] - meanJ);
      }
      cor[i][j] = cov / Math.sqrt(varI * varJ);
    }
  }
  return cor;
}

function getLoss(X) {
  let cor = computeCorrelation(X);
  let loss = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      loss += Math.pow(cor[i][j] - targetCorrelation[i][j], 2);
    }
  }
  return loss;
}

// Gradient descent
for (let iter = 0; iter < iterations; iter++) {
  let loss = getLoss(X);
  if (loss < 1e-6) break;
  
  let grad = Array.from({ length: 8 }, () => Array(5).fill(0));
  let h = 1e-5;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 5; j++) {
      X[i][j] += h;
      let lossPlus = getLoss(X);
      X[i][j] -= h;
      grad[i][j] = (lossPlus - loss) / h;
    }
  }
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 5; j++) {
      X[i][j] -= learningRate * grad[i][j];
    }
  }
}

let finalLoss = getLoss(X);
console.log('Final Loss:', finalLoss);

let rows = [];
for (let k = 0; k < 5; k++) {
  rows.push({
    id: k + 1,
    studentCode: `S-00${k + 1}`,
    strand: ['STEM', 'ABM', 'HUMSS', 'STEM', 'ABM'][k],
    sex: ['Female', 'Male', 'Female', 'Male', 'Female'][k],
    communicationAnxiety: X[0][k],
    fearOfNegativeEvaluation: X[1][k],
    testAnxiety: X[2][k],
    englishClassAnxiety: X[3][k],
    selfConfidence: X[4][k],
    languageProficiency: X[5][k],
    peerInfluence: X[6][k],
    classroomEnvironment: X[7][k]
  });
}

fs.writeFileSync('generated_rows.json', JSON.stringify(rows, null, 2));
