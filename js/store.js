window.Store = {
            cache: null,
            apiUrl: '/api',
            clientServerDiff: 0,

            convertKeys(arr) {
                if (!arr) return;
                arr.forEach(item => {
                    for (let key in item) {
                        if (typeof item[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(item[key])) {
                            item[key] = item[key].split('T')[0];
                        }
                        if (key === 'is_lm_np') {
                            item[key] = (item[key] === true || item[key] === 1 || item[key] === '1' || item[key] === 'true');
                        }
                        if (key.includes('_')) {
                            const camel = key.replace(/_([a-z0-9])/g, g => g[1].toUpperCase());
                            if (item[camel] === undefined) {
                                item[camel] = item[key];
                            }
                        }
                    }
                });
            },

            async init() {
                let waitTimeout;
                try {
                    const loaderText = document.getElementById('loader-text');
                    if (loaderText) {
                        loaderText.innerText = "Connecting...";
                        waitTimeout = setTimeout(() => {
                            if (loaderText) loaderText.innerText = "Waking up database... this may take a few seconds";
                        }, 2000);
                    }

                    let userParam = '';
                    const storedUser = localStorage.getItem('currentUser');
                    if (storedUser) {
                        try {
                            const u = JSON.parse(storedUser);
                            userParam = `&role=${encodeURIComponent(u.role || '')}&territoryId=${encodeURIComponent(u.territoryId || '')}&username=${encodeURIComponent(u.username || '')}`;
                        } catch (e) {}
                    }

                    const res = await fetch(`${this.apiUrl}/db?t=${Date.now()}${userParam}`);
                    if (waitTimeout) clearTimeout(waitTimeout);
                    if (loaderText) loaderText.innerText = "Processing";

                    const data = await res.json();

                    if (data.error) {
                        console.error("Backend Error:", data.error);
                        return null;
                    }

                    // Calculate client-server clock difference if serverTime is provided
                    if (data.serverTime) {
                        const serverMs = new Date(data.serverTime.replace(' ', 'T') + '+06:00').getTime();
                        if (!isNaN(serverMs)) {
                            Store.clientServerDiff = serverMs - Date.now();
                        }
                    }

                    // If DB is empty (based on territories), seed it
                    if (data.territories && data.territories.length === 0) {
                        console.log("Database empty, seeding initial data...");
                        await this.seed();
                        return await this.init();
                    }

                    // Bridge database snake_case keys to UI camelCase dynamically
                    ['users', 'targets', 'projections', 'collections', 'offroad_vehicles', 'settlements', 'vehicle_performance', 'customers'].forEach(collection => {
                        if (data[collection]) this.convertKeys(data[collection]);
                    });

                    this.cache = data;

                    // Auto-migration for entries submitted today physically but saved as May 31st under old date-capping rules,
                    // and for entries submitted on extended days that are missing an active_month field:
                    (async () => {
                        try {
                            const activeMonth = data.system_settings?.find(s => s.key === 'active_month')?.value;
                            if (activeMonth === '2026-05') {
                                // Today is June 1st physically, which starts at 1780250400000 ms local epoch
                                const startOfTodayLocal = new Date();
                                startOfTodayLocal.setHours(0,0,0,0);
                                const startOfTodayTimestamp = startOfTodayLocal.getTime();

                                let migrated = false;

                                // 1. Migrate collections entered physically today that got saved as May 31st
                                if (data.collections) {
                                    for (const c of data.collections) {
                                        if (c.timestamp >= startOfTodayTimestamp && c.date === '2026-05-31') {
                                            c.date = '2026-06-01';
                                            c.active_month = '2026-05';
                                            c.activeMonth = '2026-05';
                                            console.log("Auto-migrating collection date:", c.receipt);
                                            await fetch(`${this.apiUrl}/update`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ collection: 'collections', item: {
                                                    id: c.id,
                                                    date: '2026-06-01',
                                                    active_month: '2026-05'
                                                }})
                                            });
                                            migrated = true;
                                        }
                                    }
                                }

                                // 2. Migrate existing collections saved on June 1st/2nd physically without active_month
                                if (data.collections) {
                                    for (const c of data.collections) {
                                        if (c.date.startsWith('2026-06') && !c.active_month && !c.activeMonth) {
                                            c.active_month = '2026-05';
                                            c.activeMonth = '2026-05';
                                            console.log("Auto-migrating collection active_month:", c.receipt);
                                            await fetch(`${this.apiUrl}/update`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ collection: 'collections', item: {
                                                    id: c.id,
                                                    active_month: '2026-05'
                                                }})
                                            });
                                            migrated = true;
                                        }
                                    }
                                }

                                // 3. Migrate existing projections saved on June 1st/2nd physically without active_month
                                if (data.projections) {
                                    for (const p of data.projections) {
                                        if (p.date.startsWith('2026-06') && !p.active_month && !p.activeMonth) {
                                            p.active_month = '2026-05';
                                            p.activeMonth = '2026-05';
                                            console.log("Auto-migrating projection active_month for territory:", p.territoryId || p.territory_id);
                                            await fetch(`${this.apiUrl}/update`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ collection: 'projections', item: {
                                                    id: p.id,
                                                    active_month: '2026-05'
                                                }})
                                            });
                                            migrated = true;
                                        }
                                    }
                                }

                                // 4. If a territory has collections on June 1st but projection is on May 31st:
                                if (data.projections && data.collections) {
                                    const activeTIds = new Set(data.collections.filter(c => c.date === '2026-06-01').map(c => c.territoryId || c.territory_id));
                                    for (const tId of activeTIds) {
                                        const projJune1 = data.projections.find(p => (p.territoryId === tId || p.territory_id === tId) && p.date === '2026-06-01');
                                        if (!projJune1) {
                                            const projMay31 = data.projections.find(p => (p.territoryId === tId || p.territory_id === tId) && p.date === '2026-05-31');
                                            if (projMay31) {
                                                console.log("Auto-migrating projection for territory:", tId);
                                                await fetch(`${this.apiUrl}/update`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ collection: 'projections', item: {
                                                        territory_id: tId,
                                                        date: '2026-06-01',
                                                        regular_amount: projMay31.regularAmount || projMay31.amount || 0,
                                                        advance_amount: projMay31.advanceAmount || 0,
                                                        amount: projMay31.amount || 0,
                                                        file_count: projMay31.fileCount || 0,
                                                        active_month: '2026-05'
                                                    }})
                                                });
                                                migrated = true;
                                            }
                                        }
                                    }
                                }

                                if (migrated) {
                                    console.log("Auto-migration complete. Refreshing UI cache...");
                                    const refreshRes = await fetch(`${this.apiUrl}/db?t=${Date.now()}`);
                                    const refreshData = await refreshRes.json();
                                    ['users', 'targets', 'projections', 'collections', 'offroad_vehicles', 'settlements', 'vehicle_performance'].forEach(collection => {
                                        if (refreshData[collection]) this.convertKeys(refreshData[collection]);
                                    });
                                    this.cache = refreshData;
                                    
                                    setTimeout(() => {
                                        if (document.getElementById('officer-dashboard-panel')) {
                                            UI.renderOfficerDashboard();
                                        } else if (document.getElementById('views-container').innerHTML.includes('Admin Intelligence Dashboard')) {
                                            UI.renderAdminDashboard();
                                        }
                                    }, 100);
                                }
                            }
                        } catch (err) {
                            console.error("Auto-migration error:", err);
                        }
                    })();

                    return data;
                } catch (err) {
                    if (typeof waitTimeout !== 'undefined') clearTimeout(waitTimeout);
                    console.error("Failed to connect to Backend:", err);
                    return null;
                }
            },

            async seed() {
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

                const users = [
                    { username: 'admin', officerName: 'System Admin', role: 'admin', password: 'Admin@4321' },
                    ...territories.map(t => ({
                        username: t.name,
                        officerName: `${t.name} Officer`,
                        role: 'officer',
                        password: '1234',
                        territoryId: t.id
                    }))
                ];

                await fetch(`${this.apiUrl}/sync-targets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ territories, targets: [] })
                });

                await fetch(`${this.apiUrl}/sync-users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ users })
                });
            },

            get() {
                return this.cache;
            },

            async update(collection, item) {
                // Remove redundant property if it's new
                if (String(item.id).startsWith('new_')) delete item.id;

                const res = await fetch(`${this.apiUrl}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ collection, item })
                });
                const updatedItem = await res.json();
                if (updatedItem.error) throw new Error(updatedItem.error);
                this.convertKeys([updatedItem]);

                // Update local cache for performance
                const idx = this.cache[collection].findIndex(x => String(x.id) === String(updatedItem.id));
                if (idx !== -1) this.cache[collection][idx] = updatedItem;
                else this.cache[collection].push(updatedItem);

                return updatedItem;
            },

            async delete(collection, id) {
                await fetch(`${this.apiUrl}/delete`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ collection, id })
                });
                this.cache[collection] = this.cache[collection].filter(x => x.id !== id);
            },

            async deleteMany(collection, ids) {
                for (const id of ids) {
                    await this.delete(collection, id);
                }
            }
        };

        /**
         * 2. CALCULATION ENGINE
         */
