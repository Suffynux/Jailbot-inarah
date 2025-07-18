import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to jailedUsers.json
const dataFilePath = path.join(__dirname, '../data/jailedUsers.json');

// Helper: Load jailed users data safely
function loadJailedData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '{}'); // create empty JSON file if not exist
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return data.trim() === '' ? {} : JSON.parse(data);
  } catch (err) {
    console.error('Error loading jailed data:', err);
    return {};
  }
}

// Save jailed roles for a user
export function saveJailedData(userId, roles) {
  const data = loadJailedData();
  data[userId] = roles;
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Optional: Load saved roles for a user
export function getJailedData(userId) {
  const data = loadJailedData();
  return data[userId] || [];
}
