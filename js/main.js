// GLOBAL FETCH INTERCEPTOR: Generic Retry Mechanism
        const originalFetch = window.fetch;
        window.fetch = async function(url, options) {
            let retries = 5;
            let lastError = null;
            for (let i = 0; i < retries; i++) {
                try {
                    const res = await originalFetch(url, options);
                    
                    if (typeof url === 'string' && url.includes('/api')) {
                        if (!res.ok) {
                            throw new Error("Server error " + res.status);
                        }
                    }
                    return res;
                } catch (err) {
                    lastError = err;
                    console.warn(`Fetch attempt ${i + 1} failed for ${url}:`, err.message);
                    if (i < retries - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
                    }
                }
            }
            throw lastError;
        };

        window.filterPerformanceAnalytics = function() {
            const searchVal = (document.getElementById('perf-search')?.value || '').toLowerCase();
            const minAch = parseFloat(document.getElementById('perf-min-ach')?.value || 0);
            
            const minAchValSpan = document.getElementById('perf-min-ach-val');
            if (minAchValSpan) minAchValSpan.innerText = minAch + '%';
            
            const activeBtn = document.querySelector('.preset-btn.active');
            const preset = activeBtn ? activeBtn.getAttribute('data-preset') : 'all';
            
            const rows = document.querySelectorAll('#perf-analytics-table-body tr');
            let visibleCount = 0;
            rows.forEach(row => {
                if (row.id === 'perf-no-results') return;
                
                const name = (row.getAttribute('data-name') || '').toLowerCase();
                const officer = (row.getAttribute('data-officer') || '').toLowerCase();
                const ach = parseFloat(row.getAttribute('data-ach') || 0);
                
                const matchesSearch = name.includes(searchVal) || officer.includes(searchVal);
                let matchesPreset = true;
                if (preset === 'excellent') matchesPreset = ach >= 90;
                else if (preset === 'good') matchesPreset = ach >= 70 && ach < 90;
                else if (preset === 'warning') matchesPreset = ach >= 40 && ach < 70;
                else if (preset === 'critical') matchesPreset = ach < 40;
                
                const matchesSlider = ach >= minAch;
                
                if (matchesSearch && matchesPreset && matchesSlider) {
                    row.classList.remove('hidden');
                    visibleCount++;
                } else {
                    row.classList.add('hidden');
                }
            });
            
            const noResultsRow = document.getElementById('perf-no-results');
            if (noResultsRow) {
                if (visibleCount === 0) noResultsRow.classList.remove('hidden');
                else noResultsRow.classList.add('hidden');
            }
        };

        window.setPerfPreset = function(presetType, btn) {
            document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('active', 'bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20');
                b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
            });
            btn.classList.add('active', 'bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20');
            btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
            
            const slider = document.getElementById('perf-min-ach');
            if (slider) {
                if (presetType === 'excellent') slider.value = 90;
                else if (presetType === 'good') slider.value = 70;
                else if (presetType === 'warning') slider.value = 40;
                else if (presetType === 'critical') slider.value = 0;
                else slider.value = 0;
            }
            
            window.filterPerformanceAnalytics();
        };


        const ParticleEngine = {
            canvas: null, ctx: null, width: 0, height: 0, particles: [],
            init() {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'particle-canvas';
                this.canvas.style.position = 'fixed';
                this.canvas.style.top = '0';
                this.canvas.style.left = '0';
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';
                this.canvas.style.zIndex = '-1';
                this.canvas.style.pointerEvents = 'none';
                this.canvas.style.transform = 'translateZ(0)';
                this.canvas.style.willChange = 'transform';
                document.body.appendChild(this.canvas);
                this.ctx = this.canvas.getContext('2d');
                this.resize();
                window.addEventListener('resize', () => this.resize());
                this.createParticles();
                this.animate();
            },
            resize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            },
            createParticles() {
                for (let i = 0; i < 50; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height,
                        speed: Math.random() * 0.5 + 0.1,
                        size: Math.random() * 2 + 0.5,
                        opacity: Math.random() * 0.5 + 0.1
                    });
                }
            },
            animate() {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = '#10b981';
                this.particles.forEach(p => {
                    p.y -= p.speed;
                    if (p.y < 0) p.y = this.height;
                    this.ctx.globalAlpha = p.opacity;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                });
                requestAnimationFrame(() => this.animate());
            }
        };

        // Initialize
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const role = UI.currentLoginRole;
            const username = role === 'officer' ? document.getElementById('officer-select').value :
                (role === 'area_head' ? document.getElementById('area-head-select').value :
                    document.getElementById('username').value);
            const password = document.getElementById('password').value;
            Auth.login(username, password, role);
        });

        (async () => {
            const hasSession = !!localStorage.getItem('currentUser');
            if (hasSession) {
                // If we have a session, keep login hidden and show generic loader
                UI.toggleLoader(true);
            } else {
                // No session, show login immediately
                document.getElementById('login-view').classList.remove('hidden');
            }

            // Load data from backend
            const dbState = await Store.init();
            if (dbState === null) {
                UI.toggleLoader(false);
                const loginView = document.getElementById('login-view');
                loginView.innerHTML = `
                    <div class="relative z-10 w-full max-w-[450px] px-4 sm:p-6 animate-entry">
                        <div class="bg-white dark:bg-[#202124] sm:border sm:border-slate-200 sm:dark:border-[#3c4043] rounded-xl p-8 sm:shadow-md text-center">
                            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                                <i class="fas fa-exclamation-triangle text-2xl"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Connection Failed</h2>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Unable to connect to the server. This may happen if the database is asleep or your connection is unstable.</p>
                            <button onclick="location.reload()" class="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-3 font-medium transition-colors">
                                Retry Connection
                            </button>
                        </div>
                    </div>
                `;
                loginView.classList.remove('hidden');
                loginView.classList.add('flex');
                return;
            }

            // Validate session and init UI
            const loggedIn = await Auth.checkSession();

            if (!loggedIn) {
                document.getElementById('login-view').classList.remove('hidden');
                UI.setLoginTab('officer');
            }

            ParticleEngine.init();
            UI.toggleLoader(false);
        })();
