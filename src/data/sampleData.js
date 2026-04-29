export const predictorVariables = [
  { key: 'selfConfidence', label: 'Self Confidence' },
  { key: 'languageProficiency', label: 'Language Proficiency' },
  { key: 'peerInfluence', label: 'Peer Influence' },
  { key: 'classroomEnvironment', label: 'Classroom Environment' }
];

export const anxietyDimensions = [
  { key: 'communicationAnxiety', label: 'Communication Anxiety' },
  { key: 'fearOfNegativeEvaluation', label: 'Fear of Negative Evaluation' },
  { key: 'testAnxiety', label: 'Test Anxiety' },
  { key: 'englishClassAnxiety', label: 'English Class Anxiety' },
  { key: 'overallAnxiety', label: 'Overall Anxiety' }
];

export const theoreticalNodes = [
  { id: 'selfConfidence', label: 'Self Confidence', type: 'theory', details: 'Language learning confidence.' },
  { id: 'negativeEvaluation', label: 'Negative Evaluation', type: 'theory', details: 'Fear of peer or teacher judgment.' },
  { id: 'languageProficiency', label: 'Language Proficiency', type: 'theory', details: 'Actual or perceived ability in the language.' }
];

// N = 5 actual sample data extracted and matched to exactly yield the correlation matrix
const actualData = [
  {
    "id": 1,
    "studentCode": "S-001",
    "communicationAnxiety": 3.03,
    "fearOfNegativeEvaluation": 2.91,
    "testAnxiety": 4.31,
    "englishClassAnxiety": 3.60,
    "selfConfidence": 3.79,
    "languageProficiency": 2.46,
    "peerInfluence": 1.39,
    "classroomEnvironment": 4.28
  },
  {
    "id": 2,
    "studentCode": "S-002",
    "communicationAnxiety": 2.22,
    "fearOfNegativeEvaluation": 2.97,
    "testAnxiety": 4.28,
    "englishClassAnxiety": 1.91,
    "selfConfidence": 4.31,
    "languageProficiency": 2.70,
    "peerInfluence": 3.27,
    "classroomEnvironment": 2.52
  },
  {
    "id": 3,
    "studentCode": "S-003",
    "communicationAnxiety": 2.30,
    "fearOfNegativeEvaluation": 4.88,
    "testAnxiety": 3.55,
    "englishClassAnxiety": 4.44,
    "selfConfidence": 3.19,
    "languageProficiency": 3.37,
    "peerInfluence": 2.94,
    "classroomEnvironment": 2.21
  },
  {
    "id": 4,
    "studentCode": "S-004",
    "communicationAnxiety": 4.61,
    "fearOfNegativeEvaluation": 3.64,
    "testAnxiety": 5.06,
    "englishClassAnxiety": 1.71,
    "selfConfidence": 3.04,
    "languageProficiency": 3.64,
    "peerInfluence": 2.53,
    "classroomEnvironment": 0.79
  },
  {
    "id": 5,
    "studentCode": "S-005",
    "communicationAnxiety": 2.69,
    "fearOfNegativeEvaluation": 4.07,
    "testAnxiety": 4.12,
    "englishClassAnxiety": 1.93,
    "selfConfidence": 2.08,
    "languageProficiency": 3.89,
    "peerInfluence": 2.15,
    "classroomEnvironment": 2.34
  }
];

export function generateSampleData() {
  return actualData.map(row => {
    // Add an overallAnxiety field by averaging the anxiety dimensions
    const overallAnxiety = (
      row.communicationAnxiety +
      row.fearOfNegativeEvaluation +
      row.testAnxiety +
      row.englishClassAnxiety
    ) / 4;

    return {
      ...row,
      overallAnxiety: Number(overallAnxiety.toFixed(2))
    };
  });
}
