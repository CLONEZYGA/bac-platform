const fs = require('fs');
const path = require('path');

const directories = [
    'assets',
    'components',
    'constants',
    'context',
    'navigation',
    'screens/student',
    'screens/admin',
    'screens/shared',
    'services',
    'utils',
    'hooks',
    'db'
];

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

const adminDirectories = [
    'admin',
    'admin/screens',
    'admin/navigation',
];
adminDirectories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create placeholder files
const files = [
    'components/index.ts',
    'constants/colors.ts',
    'constants/theme.ts',
    'context/AuthContext.tsx',
    'navigation/AppNavigator.tsx',
    'navigation/StudentNavigator.tsx',
    'navigation/AdminNavigator.tsx',
    'services/firebase.ts',
    'utils/validation.ts',
    'utils/formatters.ts',
    'hooks/useAuth.ts',
    'hooks/useForm.ts',
    'db/schema.ts'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '// Placeholder file\n');
        console.log(`Created file: ${file}`);
    }
});

console.log('Directory structure setup complete!'); 