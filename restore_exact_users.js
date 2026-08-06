const fs = require('fs');
const path = require('path');

const responseAdminPath = 'C:/Users/shahriar.imon/.gemini/antigravity/brain/b7f4184a-0553-48b6-956a-aa9e0338a7b0/response_admin.json';
const rawData = fs.readFileSync(responseAdminPath, 'utf8');
const data = JSON.parse(rawData);

const users = data.users.map(u => ({
    username: u.username,
    officerName: u.officer_name || u.officerName || '',
    role: u.role,
    password: u.password,
    territoryId: u.territory_id || u.territoryId || ''
}));

console.log(`Found ${users.length} users to restore!`);

fetch('https://recovery.cv-acimotors.com/api.php?route=sync-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users })
})
.then(res => res.json())
.then(resData => console.log('Restore Result:', resData))
.catch(err => console.error('Restore Error:', err));
