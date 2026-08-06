const rawTerritories = [
    { part: 'A', name: 'Bogura' }, { part: 'A', name: 'Chapainawabgonj' }, { part: 'A', name: 'Dinajpur' },
    { part: 'A', name: 'Natore' }, { part: 'A', name: 'Rajshahi' }, { part: 'A', name: 'Rangpur' },
    { part: 'A', name: 'Nilphamari' }, { part: 'A', name: 'Jashore' }, { part: 'A', name: 'Kushtia' },
    { part: 'A', name: 'Khulna' }, { part: 'A', name: 'Manikganj' }, { part: 'A', name: 'Munshiganj 1' },
    { part: 'A', name: 'Munshiganj-2' }, { part: 'A', name: 'Narayanganj' }, { part: 'A', name: 'Narshingdi' },
    { part: 'A', name: 'Sirajganj' }, { part: 'A', name: 'Savar' }, { part: 'A', name: 'Tongi' },
    { part: 'A', name: 'Gazipur' }, { part: 'A', name: 'Dhaka' }, { part: 'A', name: 'Head Office' },
    { part: 'B', name: 'Barguna' }, { part: 'B', name: 'Barishal' }, { part: 'B', name: 'Brahmanaria' },
    { part: 'B', name: 'Chandpur-1' }, { part: 'B', name: 'Chandpur-2' }, { part: 'B', name: 'Chattogram North' },
    { part: 'B', name: 'Chattogram South' }, { part: 'B', name: "Cox'sBazar" }, { part: 'B', name: 'Cumilla-1' },
    { part: 'B', name: 'Cumilla-2' }, { part: 'B', name: 'Faridpur' }, { part: 'B', name: 'Feni' },
    { part: 'B', name: 'Gopalganj' }, { part: 'B', name: 'Hobiganj' }, { part: 'B', name: 'Jamalpur' },
    { part: 'B', name: 'Kishoreganj' }, { part: 'B', name: 'Laxmipur' }, { part: 'B', name: 'Mymensingh' },
    { part: 'B', name: 'Netrokona' }, { part: 'B', name: 'Noakhali-1' }, { part: 'B', name: 'Noakhali-2' },
    { part: 'B', name: 'Sylhet' }, { part: 'B', name: 'Tangail' }
];

const territories = rawTerritories.map((t) => ({
    id: t.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    name: t.name,
    part: t.part,
    officer: t.name
}));

const users = territories.map(t => ({
    username: t.name,
    officerName: `${t.name} Officer`,
    role: 'officer',
    password: '1234',
    territoryId: t.id
}));

fetch('https://recovery.cv-acimotors.com/api.php?route=sync-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users })
})
.then(res => res.text())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
