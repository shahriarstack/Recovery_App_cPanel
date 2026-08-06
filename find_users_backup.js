const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (file.endsWith('.json') || file.endsWith('.jsonl') || file.endsWith('.txt')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('officer_name') || content.includes('officerName') || content.includes('password')) {
                    console.log('Found match in:', fullPath);
                    const lines = content.split('\n');
                    for (const line of lines) {
                        if ((line.includes('officer_name') || line.includes('officerName')) && line.length < 5000) {
                            console.log('Line snippet:', line.substring(0, 300));
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

searchDir('C:\\Users\\shahriar.imon\\.gemini\\antigravity\\brain\\b7f4184a-0553-48b6-956a-aa9e0338a7b0');
