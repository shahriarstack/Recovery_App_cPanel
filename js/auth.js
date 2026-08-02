window.Auth = {
            currentUser: null,

            async login(username, password, requiredRole = 'officer') {
                UI.toggleLoader(true);
                try {
                    const db = await Store.init();
                    if (!db) return;

                    // Username acts as Territory for officer, Password acts as Employee ID
                    let user = db.users.find(u => u.username === username && u.password === password);

                    // Fallback for default Admin password as requested
                    if (!user && requiredRole === 'admin' && password === 'Admin@4321') {
                        user = { id: 'admin_sys', username: username, role: 'admin', territoryId: null, officerName: 'System Admin' };
                    }

                    if (user) {
                        if (user.role !== requiredRole) {
                            alert(`Access Denied: You are trying to login as ${user.role} from the ${requiredRole === 'admin' ? 'Admin' : 'Officer'} tab.`);
                            UI.toggleLoader(false);
                            return;
                        }
                        this.currentUser = user;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        await Store.init(); // Fetch dynamically filtered customers for this user
                        UI.initApp();
                    } else {
                        alert('Invalid credentials');
                    }
                } finally {
                    UI.toggleLoader(false);
                }
            },

            async checkSession() {
                const stored = localStorage.getItem('currentUser');
                if (stored) {
                    this.currentUser = JSON.parse(stored);
                    // Store.init is already handled in window.onload
                    UI.initApp();
                    return true;
                }
                return false;
            },

            logout() {
                this.currentUser = null;
                localStorage.removeItem('currentUser');
                location.reload();
            }
        };

        /**
         * 4. UI RENDERING & LOGIC
         */
