window.UI = {
            charts: {},
            currentLoginRole: 'officer',
            showDailyReqColumn: false,
            showOdColumns: false,

            togglePasswordVisibility() {
                const passwordInput = document.getElementById('password');
                const toggleIcon = document.getElementById('password-toggle-icon');
                if (passwordInput && toggleIcon) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        toggleIcon.classList.remove('fa-eye');
                        toggleIcon.classList.add('fa-eye-slash');
                    } else {
                        passwordInput.type = 'password';
                        toggleIcon.classList.remove('fa-eye-slash');
                        toggleIcon.classList.add('fa-eye');
                    }
                }
            },

            updateHeader(title, subtitle, rightHtml = '') {
                const titleContainer = document.getElementById('header-title-container');
                const rightContainer = document.getElementById('header-right-custom');
                
                if (titleContainer) {
                    if (title) {
                        titleContainer.innerHTML = `
                            <h1 class="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-800 dark:text-white leading-tight animate-fade-in">${title}</h1>
                            ${subtitle ? `<p class="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase mt-0.5 animate-fade-in">${subtitle}</p>` : ''}
                        `;
                    } else {
                        titleContainer.innerHTML = '';
                    }
                }
                
                if (rightContainer) {
                    rightContainer.innerHTML = rightHtml;
                }
            },

            showAppUseModal(territoryId) {
                const data = Calc.getAppUseDetails(territoryId);
                const tName = Store.get()?.territories?.find(t => t.id === territoryId)?.name || territoryId;
                
                let html = `
                <div class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in" id="app-use-modal" onclick="if(event.target.id === 'app-use-modal') this.remove()">
                    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-[90%] max-w-lg overflow-hidden animate-entry flex flex-col max-h-[85vh]">
                        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-brand-900/20 dark:to-emerald-900/20 relative overflow-hidden">
                            <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(circle at 100% 0%, var(--tw-gradient-from) 0%, transparent 50%);"></div>
                            <div>
                                <h2 class="text-xl font-bold text-slate-800 dark:text-white relative z-10">${tName}</h2>
                                <p class="text-xs font-medium text-brand-600 dark:text-brand-400 mt-0.5 tracking-wider uppercase relative z-10">App Use Rating Overview</p>
                            </div>
                            <div class="flex items-center gap-3 relative z-10">
                                <div class="px-3 py-1 rounded-full ${Calc.getRPIBg(data.pct)} font-bold text-lg border">
                                    ${data.pct}%
                                </div>
                                <button onclick="document.getElementById('app-use-modal').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                    <i class="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div class="space-y-3">
                `;
                
                if (data.details.length === 0) {
                    html += `<div class="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">No valid working days recorded yet.</div>`;
                } else {
                    [...data.details].reverse().forEach(d => {
                        const dateObj = new Date(d.date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        
                        const projIcon = d.hasProj ? '<i class="fa-solid fa-check-circle text-emerald-500"></i>' : '<i class="fa-solid fa-times-circle text-rose-500"></i>';
                        const timeIcon = d.isOnTime ? '<i class="fa-solid fa-check-circle text-emerald-500"></i>' : (d.hasProj ? '<i class="fa-solid fa-times-circle text-amber-500"></i>' : '<i class="fa-solid fa-minus-circle text-slate-300 dark:text-slate-600"></i>');
                        const collIcon = d.hasColl ? '<i class="fa-solid fa-check-circle text-emerald-500"></i>' : '<i class="fa-solid fa-times-circle text-rose-500"></i>';
                        
                        let scoreColor = 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
                        if (d.dayScore === 100) scoreColor = 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
                        else if (d.dayScore >= 60) scoreColor = 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
                        
                        html += `
                            <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 text-center">
                                        <div class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">${dayName}</div>
                                        <div class="text-sm font-bold text-slate-700 dark:text-slate-200">${dateStr}</div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="flex flex-col items-center gap-1" title="Projection Submitted">
                                            <div class="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Proj</div>
                                            ${projIcon}
                                        </div>
                                        <div class="flex flex-col items-center gap-1" title="On-Time Before 10AM">
                                            <div class="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Time</div>
                                            ${timeIcon}
                                        </div>
                                        <div class="flex flex-col items-center gap-1" title="Collection Submitted">
                                            <div class="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Coll</div>
                                            ${collIcon}
                                        </div>
                                    </div>
                                </div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-black border ${scoreColor}">
                                    ${d.dayScore}%
                                </div>
                            </div>
                        `;
                    });
                }
                
                html += `
                            </div>
                        </div>
                    </div>
                </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', html);
            },

            // --- LOADER ---
            toggleLoader(show) {
                const loader = document.getElementById('global-loader');
                if (show) {
                    loader.classList.remove('hidden');
                    void loader.offsetWidth;
                    loader.classList.remove('opacity-0');
                } else {
                    loader.classList.add('opacity-0');
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 300);
                }
            },

            initCollectionLottie() {
                if (!UI.collectionLottieAnim && window.lottie && window.MONEY_LOTTIE_DATA) {
                    UI.collectionLottieAnim = window.lottie.loadAnimation({
                        container: document.getElementById('collection-lottie-container'),
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: window.MONEY_LOTTIE_DATA
                    });
                } else if (UI.collectionLottieAnim) {
                    UI.collectionLottieAnim.goToAndPlay(0, true);
                }
            },

            toggleCollectionLoader(show, text = 'Saving Collection...', subtext = 'Transmitting to secure server...') {
                const loader = document.getElementById('collection-loader');
                const textEl = document.getElementById('collection-loader-text');
                const subtextEl = document.getElementById('collection-loader-subtext');
                const progressEl = document.getElementById('collection-loader-progress');
                
                if (show) {
                    if (textEl) textEl.innerText = text;
                    if (subtextEl) subtextEl.innerText = subtext;
                    if (progressEl) progressEl.style.width = '10%';
                    
                    loader.classList.remove('hidden');
                    void loader.offsetWidth;
                    loader.classList.remove('opacity-0');
                    
                    this.initCollectionLottie();
                    
                    let prog = 10;
                    if (UI._collectionLoaderInterval) clearInterval(UI._collectionLoaderInterval);
                    UI._collectionLoaderInterval = setInterval(() => {
                        if (prog < 90) {
                            prog += Math.random() * 15;
                            if (prog > 90) prog = 90;
                            if (progressEl) progressEl.style.width = `${prog}%`;
                        }
                    }, 200);
                } else {
                    if (UI._collectionLoaderInterval) clearInterval(UI._collectionLoaderInterval);
                    if (progressEl) progressEl.style.width = '100%';
                    
                    setTimeout(() => {
                        if (loader) loader.classList.add('opacity-0');
                        setTimeout(() => {
                            if (loader) loader.classList.add('hidden');
                            if (UI.collectionLottieAnim) {
                                UI.collectionLottieAnim.stop();
                            }
                        }, 300);
                    }, 400);
                }
            },

            setLoginTab(role) {
                this.currentLoginRole = role;
                const indicator = document.getElementById('login-tab-indicator');
                const btnOfficer = document.getElementById('btn-officer');
                const btnAreaHead = document.getElementById('btn-areahead');
                const btnAdmin = document.getElementById('btn-admin');
                const lblUsername = document.getElementById('lbl-username');
                const lblAdmin = document.getElementById('lbl-username-admin');
                const inpUsername = document.getElementById('username');
                const selOfficer = document.getElementById('officer-select');
                const selAreaHead = document.getElementById('area-head-select');
                const arrow = document.getElementById('officer-dropdown-arrow');

                if (btnOfficer) {
                    btnOfficer.className = "w-1/3 pb-3 text-[14px] focus:outline-none transition-colors " + (role === 'officer' ? "font-bold text-[#1a73e8] dark:text-[#8ab4f8]" : "font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-50 dark:hover:bg-[#3c4043]/30");
                }
                if (btnAreaHead) {
                    btnAreaHead.className = "w-1/3 pb-3 text-[14px] focus:outline-none transition-colors " + (role === 'area_head' ? "font-bold text-[#1a73e8] dark:text-[#8ab4f8]" : "font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-50 dark:hover:bg-[#3c4043]/30");
                }
                if (btnAdmin) {
                    btnAdmin.className = "w-1/3 pb-3 text-[14px] focus:outline-none transition-colors " + (role === 'admin' ? "font-bold text-[#1a73e8] dark:text-[#8ab4f8]" : "font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-50 dark:hover:bg-[#3c4043]/30");
                }

                inpUsername.classList.add('hidden');
                selOfficer.classList.add('hidden');
                if (selAreaHead) selAreaHead.classList.add('hidden');
                lblAdmin.classList.add('hidden');
                lblUsername.classList.add('hidden');
                arrow.classList.add('hidden');

                if (role === 'officer') {
                    indicator.style.transform = 'translateX(0%)';
                    lblUsername.innerText = 'Select Territory';
                    lblUsername.classList.remove('hidden');
                    selOfficer.classList.remove('hidden');
                    arrow.classList.remove('hidden');
                    this.populateLoginDropdown();
                } else if (role === 'area_head') {
                    indicator.style.transform = 'translateX(100%)';
                    lblUsername.innerText = 'Select Area Head';
                    lblUsername.classList.remove('hidden');
                    if (selAreaHead) selAreaHead.classList.remove('hidden');
                    arrow.classList.remove('hidden');
                    this.populateAreaHeadDropdown();
                } else {
                    indicator.style.transform = 'translateX(200%)';
                    lblAdmin.classList.remove('hidden');
                    inpUsername.classList.remove('hidden');
                    inpUsername.placeholder = '';
                }
            },

            openSystemSettingsModal() {
                const db = Store.get();
                let activeMonth = db.system_settings?.find(s => s.key === 'active_month')?.value || Utils.getLocalDate().slice(0, 7);
                let cutoffHours = parseInt(db.system_settings?.find(s => s.key === 'cutoff_extension_hours')?.value || 0);
                let holidaysStr = db.system_settings?.find(s => s.key === 'holidays')?.value || '';
                let systemHold = db.system_settings?.find(s => s.key === 'system_hold')?.value === 'true';
                
                window.tempHolidays = holidaysStr ? holidaysStr.split(',').map(s=>s.trim()).filter(Boolean) : [];

                const getCutoffLabel = (h) => {
                    if (h === 0) return "Midnight (12:00 AM)";
                    return `0${h}:00 AM`.slice(-8); // Simple formatting for AM
                };

                const content = `
                    <div class="mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 class="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                            <i class="fa-solid fa-gears mr-2 text-brand-500"></i> System Control Panel
                        </h2>
                        <p class="text-xs text-slate-500 font-medium">Manage global operations and calendars</p>
                    </div>

                    <!-- TABS HEADER -->
                    <div class="flex space-x-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button type="button" onclick="UI.switchSettingsTab('general')" id="tab-btn-general" class="flex-1 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-brand-600 transition-all">General Settings</button>
                        <button type="button" onclick="UI.switchSettingsTab('access')" id="tab-btn-access" class="flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Access Control</button>
                        <button type="button" onclick="UI.switchSettingsTab('holidays')" id="tab-btn-holidays" class="flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Holiday Manager</button>
                    </div>

                    <!-- TAB: GENERAL SETTINGS -->
                    <div id="tab-content-general" class="block animate-entry">
                        <!-- CURRENT STATUS CARD -->
                        <div class="mb-4 p-4 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 overflow-hidden relative group">
                            <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                                <i class="fa-solid fa-microchip text-7xl"></i>
                            </div>
                            <div class="relative z-10">
                                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> 
                                    Current Live Configuration
                                </p>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cutoff Rule</p>
                                        <p class="text-sm font-black ${cutoffHours > 0 ? 'text-amber-400' : 'text-emerald-400'} flex items-center">
                                            <i class="fa-solid ${cutoffHours > 0 ? 'fa-clock-rotate-left' : 'fa-check-circle'} mr-2"></i>
                                            ${cutoffHours > 0 ? `Extended (+${cutoffHours}H)` : 'Standard (12AM)'}
                                        </p>
                                    </div>
                                    <div class="border-l border-slate-800 pl-4">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Month</p>
                                        <p class="text-sm font-black text-brand-400 flex items-center">
                                            <i class="fa-solid fa-calendar-check mr-2"></i>
                                            ${activeMonth}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onsubmit="event.preventDefault(); UI.saveSystemSettings(this);" class="space-y-6">
                            <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Active Operational Month</label>
                                <input type="month" name="active_month" value="${activeMonth}" required class="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-bold shadow-sm">
                                <p class="text-[10px] text-slate-400 mt-2 italic font-medium"><i class="fa-solid fa-circle-info mr-1"></i> Dashboard and reporting will strictly follow this month.</p>
                            </div>

                            <div class="p-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/20">
                                <div class="flex justify-between items-center mb-4">
                                    <label class="block text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">Cutoff Extension</label>
                                    <span id="cutoff-time-display" class="px-3 py-1 bg-brand-600 text-white text-[10px] font-black rounded-full shadow-md shadow-brand-500/30">${getCutoffLabel(cutoffHours)}</span>
                                </div>
                                
                                <div class="px-2">
                                    <input type="range" name="cutoff_extension_hours" value="${cutoffHours}" min="0" max="12" step="1" 
                                        oninput="const val = parseInt(this.value); document.getElementById('cutoff-time-display').innerText = val === 0 ? 'Midnight (12:00 AM)' : (val < 10 ? '0' + val : val) + ':00 AM';" 
                                        class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600">
                                    <div class="flex justify-between mt-2 text-[9px] font-bold text-slate-400 px-1">
                                        <span>STANDARD (0H)</span>
                                        <span>+6 HOURS</span>
                                        <span>MAX (+12H)</span>
                                    </div>
                                </div>
                                
                                <p class="text-[10px] text-slate-500 mt-4 leading-relaxed">
                                    <span class="font-bold text-brand-600 dark:text-brand-400">Pro Tip:</span> 
                                    Collection entries made before this time will be recorded as part of the <span class="underline">previous calendar day</span>.
                                </p>
                            </div>

                            <div class="flex justify-end space-x-3 pt-2">
                                <button type="button" onclick="UI.closeModal('generic-modal')" class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cancel</button>
                                <button type="submit" class="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 hover-lift">
                                    <i class="fa-solid fa-floppy-disk mr-2"></i> Save General Settings
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- TAB: ACCESS CONTROL -->
                    <div id="tab-content-access" class="hidden animate-entry">
                        <form onsubmit="event.preventDefault(); UI.saveAccessSettings(this);" class="space-y-6">
                            <div class="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 mb-4">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="block text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center">
                                        <i class="fa-solid fa-shield-halved mr-2"></i> System Hold (Lockdown)
                                    </label>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="system_hold" class="sr-only peer" ${systemHold ? 'checked' : ''}>
                                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
                                    </label>
                                </div>
                                <p class="text-[10px] text-slate-500 leading-relaxed">
                                    <span class="font-bold text-red-600 dark:text-red-400">Warning:</span> Enabling this will pause ALL new collection and projection entries system-wide until disabled.
                                </p>
                            </div>

                            <div class="flex justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-700 mt-4">
                                <button type="button" onclick="UI.closeModal('generic-modal')" class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cancel</button>
                                <button type="submit" class="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 hover-lift">
                                    <i class="fa-solid fa-floppy-disk mr-2"></i> Save Access Settings
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- TAB: HOLIDAYS -->
                    <div id="tab-content-holidays" class="hidden animate-entry">
                        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Add New Holiday</label>
                            <div class="flex space-x-2">
                                <input type="date" id="holiday-input-date" class="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-bold shadow-sm">
                                <button type="button" onclick="UI.addHolidayToList()" class="bg-brand-100 hover:bg-brand-200 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-400 px-4 rounded-xl font-bold text-sm transition-colors">
                                    <i class="fa-solid fa-plus"></i> Add
                                </button>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-2 italic font-medium"><i class="fa-solid fa-circle-info mr-1"></i> Added dates will automatically be skipped in App Use % calculation.</p>
                        </div>
                        
                        <div class="mb-4">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Active Holidays</h3>
                            <div id="holiday-badges-container" class="flex flex-wrap gap-2">
                                <!-- Injected by JS -->
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-700 mt-4">
                            <button type="button" onclick="UI.closeModal('generic-modal')" class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cancel</button>
                            <button type="button" onclick="UI.saveHolidaySettings(this)" class="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 hover-lift">
                                <i class="fa-solid fa-floppy-disk mr-2"></i> Save Holidays
                            </button>
                        </div>
                    </div>
                `;
                document.getElementById('modal-content').innerHTML = content;
                document.getElementById('generic-modal').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('generic-modal').classList.remove('opacity-0');
                    document.getElementById('modal-content').classList.remove('scale-95', 'opacity-0');
                    UI.renderHolidayBadges();
                }, 10);
            },
            async saveSystemSettings(form) {
                const active_month = form.active_month.value;
                const cutoff_extension_hours = form.cutoff_extension_hours.value;

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnHtml = submitBtn.innerHTML;

                UI.toggleLoader(true);
                try {
                    // Save Active Month
                    const res1 = await fetch(Store.apiUrl + '/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'active_month', value: active_month })
                    });
                    const out1 = await res1.json();
                    if (!res1.ok) throw new Error(out1.error || 'Month save failed');

                    // Save Cutoff Extension
                    const res2 = await fetch(Store.apiUrl + '/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'cutoff_extension_hours', value: cutoff_extension_hours })
                    });
                    const out2 = await res2.json();
                    if (!res2.ok) throw new Error(out2.error || 'Cutoff save failed');

                    await Store.init();

                    // Creative Feedback
                    submitBtn.innerHTML = '<i class="fa-solid fa-check-double mr-2"></i> Saved Successfully!';
                    submitBtn.className = submitBtn.className.replace('bg-brand-600', 'bg-emerald-600');

                    setTimeout(() => {
                        UI.closeModal('generic-modal');
                        Router.navigate('admin-dashboard');
                    }, 800);

                } catch (e) {
                    console.error(e);
                    alert('Error saving settings: ' + e.message);
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.className = submitBtn.className.replace('bg-emerald-600', 'bg-brand-600');
                } finally {
                    UI.toggleLoader(false);
                }
            },

            async saveAccessSettings(form) {
                const system_hold = form.system_hold.checked ? 'true' : 'false';

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnHtml = submitBtn.innerHTML;

                UI.toggleLoader(true);
                try {
                    const res = await fetch(Store.apiUrl + '/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'system_hold', value: system_hold })
                    });
                    const out = await res.json();
                    if (!res.ok) throw new Error(out.error || 'System hold save failed');

                    await Store.init();

                    submitBtn.innerHTML = '<i class="fa-solid fa-check-double mr-2"></i> Saved Successfully!';
                    submitBtn.className = submitBtn.className.replace('bg-brand-600', 'bg-emerald-600');

                    setTimeout(() => {
                        UI.closeModal('generic-modal');
                        Router.navigate('admin-dashboard');
                    }, 800);

                } catch (e) {
                    console.error(e);
                    alert('Error saving settings: ' + e.message);
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.className = submitBtn.className.replace('bg-emerald-600', 'bg-brand-600');
                } finally {
                    UI.toggleLoader(false);
                }
            },

            switchSettingsTab(tabId) {
                const tabs = ['general', 'access', 'holidays'];
                
                tabs.forEach(id => {
                    const btn = document.getElementById(`tab-btn-${id}`);
                    const content = document.getElementById(`tab-content-${id}`);
                    
                    if (id === tabId) {
                        if(btn) btn.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-brand-600 transition-all";
                        if(content) {
                            content.classList.remove('hidden');
                            content.classList.add('block');
                        }
                    } else {
                        if(btn) btn.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all";
                        if(content) {
                            content.classList.remove('block');
                            content.classList.add('hidden');
                        }
                    }
                });
            },

            renderHolidayBadges() {
                const container = document.getElementById('holiday-badges-container');
                if (!window.tempHolidays || window.tempHolidays.length === 0) {
                    container.innerHTML = `<span class="text-xs text-slate-400 italic font-medium p-2">No holidays configured yet.</span>`;
                    return;
                }
                
                window.tempHolidays.sort();
                
                container.innerHTML = window.tempHolidays.map(date => `
                    <div class="flex items-center bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm animate-entry">
                        <i class="fa-solid fa-umbrella-beach mr-2 opacity-70"></i>
                        ${date}
                        <button type="button" onclick="UI.removeHolidayFromList('${date}')" class="ml-2 hover:text-red-500 transition-colors focus:outline-none">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `).join('');
            },
            
            addHolidayToList() {
                const input = document.getElementById('holiday-input-date');
                const date = input.value;
                if (!date) return;
                
                if (!window.tempHolidays.includes(date)) {
                    window.tempHolidays.push(date);
                    UI.renderHolidayBadges();
                }
                input.value = '';
            },
            
            removeHolidayFromList(date) {
                window.tempHolidays = window.tempHolidays.filter(d => d !== date);
                UI.renderHolidayBadges();
            },
            
            async saveHolidaySettings(btn) {
                const holidaysStr = window.tempHolidays.join(',');
                const originalHtml = btn.innerHTML;
                
                UI.toggleLoader(true);
                try {
                    const res = await fetch(Store.apiUrl + '/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'holidays', value: holidaysStr })
                    });
                    const out = await res.json();
                    if (!res.ok) throw new Error(out.error || 'Holidays save failed');
                    
                    await Store.init();
                    
                    btn.innerHTML = '<i class="fa-solid fa-check-double mr-2"></i> Saved Successfully!';
                    btn.className = btn.className.replace('bg-brand-600', 'bg-emerald-600');
                    
                    setTimeout(() => {
                        UI.closeModal('generic-modal');
                    }, 800);
                } catch (e) {
                    console.error(e);
                    alert('Error saving holidays: ' + e.message);
                    btn.innerHTML = originalHtml;
                    btn.className = btn.className.replace('bg-emerald-600', 'bg-brand-600');
                } finally {
                    UI.toggleLoader(false);
                }
            },


            updateMomentumChart() {
                const db = Store.get();
                const tid = document.getElementById('momentum-territory')?.value || '';
                const startDateVal = document.getElementById('momentum-start')?.value;
                const endDateVal = document.getElementById('momentum-end')?.value;

                let start, end;
                if (startDateVal) {
                    const [y, m, d] = startDateVal.split('-').map(Number);
                    start = new Date(Date.UTC(y, m - 1, d));
                } else {
                    const todayStr = Utils.getLocalDate();
                    const [y, m, d] = todayStr.split('-').map(Number);
                    start = new Date(Date.UTC(y, m - 1, d));
                    start.setUTCDate(start.getUTCDate() - 29);
                }

                if (endDateVal) {
                    const [y, m, d] = endDateVal.split('-').map(Number);
                    end = new Date(Date.UTC(y, m - 1, d));
                } else {
                    const todayStr = Utils.getLocalDate();
                    const [y, m, d] = todayStr.split('-').map(Number);
                    end = new Date(Date.UTC(y, m - 1, d));
                }

                if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

                const labels = [];
                const data = [];

                let current = new Date(start);
                const endVal = end.getTime();

                while (current.getTime() <= endVal) {
                    const dateStr = current.toISOString().split('T')[0];
                    const day = String(current.getUTCDate()).padStart(2, '0');
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const month = monthNames[current.getUTCMonth()];
                    labels.push(`${day} ${month}`);

                    const dailySum = db.collections.filter(c => {
                        const matchesDate = c.date === dateStr;
                        const matchesTid = !tid || c.territoryId === tid || c.territory_id === tid;
                        return matchesDate && matchesTid;
                    }).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                    data.push(dailySum);
                    current.setUTCDate(current.getUTCDate() + 1);
                }

                Charts.renderLine('admin-global-trend', labels, data);
            },

            downloadPerformanceCSV() {
                const db = Store.get();
                const data = db.territories.map(t => {
                    const m = Calc.getMetrics(t.id);
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    return {
                        Territory: t.name,
                        Officer: t.officer || 'N/A',
                        Part: t.part,
                        'Total Projection': m.presetProjTotal,
                        'Till Date Collection': m.mtdColl,
                        'Achievement %': m.tillDayAchievement,
                        'Last Day Projection': m.yestProjAmt,
                        'Last Day Collection': m.yestCollAmt,
                        'Last Day Ach %': ldAch
                    };
                });

                if (data.length === 0) return;

                const headers = Object.keys(data[0]);
                const csvRows = [headers.join(',')];
                for (const row of data) {
                    csvRows.push(headers.map(header => JSON.stringify(row[header])).join(','));
                }
                const csvContent = csvRows.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `Performance_Analytics_${Utils.getLocalDate()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            populateLoginDropdown() {
                const db = Store.get();
                if (!db) return;
                const select = document.getElementById('officer-select');
                select.innerHTML = '<option value="">-- Select Your Territory --</option>';

                const officers = db.users.filter(u => u.role === 'officer').sort((a, b) => a.username.localeCompare(b.username));

                officers.forEach(u => {
                    const opt = document.createElement('option');
                    opt.value = u.username;
                    opt.text = `${u.username}`;
                    select.appendChild(opt);
                });
            },

            populateAreaHeadDropdown() {
                const db = Store.get();
                if (!db) return;
                const select = document.getElementById('area-head-select');
                if (!select) return;
                select.innerHTML = '<option value="">-- Select Area Head --</option>';

                const areaHeads = db.users.filter(u => u.role === 'area_head').sort((a, b) => (a.officerName || a.username).localeCompare(b.officerName || b.username));

                areaHeads.forEach(u => {
                    const opt = document.createElement('option');
                    opt.value = u.username;
                    opt.text = `${u.officerName || u.username}`;
                    select.appendChild(opt);
                });
            },

            initApp() {
                document.getElementById('login-view').classList.add('hidden');
                document.getElementById('app-layout').classList.remove('hidden');

                document.getElementById('user-name').innerText = Auth.currentUser.officerName || Auth.currentUser.username;
                document.getElementById('user-avatar').innerText = Auth.currentUser.username.charAt(0).toUpperCase();
                document.getElementById('current-date-display').innerText = new Date(Date.now() + (Store.clientServerDiff || 0)).toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', weekday: 'short', month: 'long', day: 'numeric' });

                if (Auth.currentUser.role === 'admin') {
                    document.getElementById('admin-nav').classList.remove('hidden');
                    const ahNav = document.getElementById('areahead-nav');
                    if (ahNav) ahNav.classList.add('hidden');
                    document.getElementById('officer-nav').classList.add('hidden');
                    const saved = localStorage.getItem('currentView_admin');
                    Router.navigate(saved || 'admin-dashboard');
                } else if (Auth.currentUser.role === 'area_head') {
                    const ahNav = document.getElementById('areahead-nav');
                    if (ahNav) ahNav.classList.remove('hidden');
                    document.getElementById('admin-nav').classList.add('hidden');
                    document.getElementById('officer-nav').classList.add('hidden');
                    const saved = localStorage.getItem('currentView_area_head');
                    Router.navigate(saved || 'area-head-dashboard');
                } else {
                    document.getElementById('officer-nav').classList.remove('hidden');
                    document.getElementById('admin-nav').classList.add('hidden');
                    const ahNav = document.getElementById('areahead-nav');
                    if (ahNav) ahNav.classList.add('hidden');
                    const saved = localStorage.getItem('currentView_officer');
                    Router.navigate(saved || 'officer-dashboard');
                }

                this.loadDarkMode();
            },

            toggleDarkMode() {
                const html = document.documentElement;
                if (html.classList.contains('dark')) {
                    html.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                } else {
                    html.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                }
            },

            loadDarkMode() {
                if (localStorage.getItem('theme') === 'dark') {
                    document.documentElement.classList.add('dark');
                }
            },

            // SIDEBAR LOGIC
            toggleSidebar() {
                const sb = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                const isOpen = !sb.classList.contains('-translate-x-full');

                if (isOpen) {
                    this.closeSidebar();
                } else {
                    this.openSidebar();
                }
            },

            openSidebar() {
                const sb = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                sb.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            },

            closeSidebar() {
                const sb = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                sb.classList.add('-translate-x-full');
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            },

            // --- AREA HEAD VIEWS & MANAGEMENT ---
            renderAdminAreaHeads() {
                const db = Store.get();
                if (!db.users) db.users = [];
                const areaHeads = db.users.filter(u => u.role === 'area_head');

                const pendingAreaHeads = areaHeads.filter(u => (u.requestedTerritories || '').trim().length > 0);

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry space-y-6">
                        <div class="flex justify-end items-center mb-2">
                            <button onclick="UI.openAreaHeadModal()" class="px-4 py-2 bg-brand-600 text-white rounded-lg shadow-md hover:bg-brand-700 transition-all font-bold text-sm">
                                <i class="fa-solid fa-plus mr-2"></i> Add Area Head
                            </button>
                        </div>

                        <!-- PENDING APPROVAL QUEUE -->
                        ${pendingAreaHeads.length > 0 ? `
                            <div class="glass-panel rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 overflow-hidden shadow-md">
                                <div class="px-3 py-2.5 border-b border-amber-500/20 bg-amber-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h3 class="text-base font-black text-amber-800 dark:text-amber-400 flex items-center gap-2">
                                            <i class="fa-solid fa-hourglass-half animate-pulse"></i> Pending Territory Requests
                                        </h3>
                                        <p class="text-xs text-amber-700/70 dark:text-amber-400/70 mt-0.5">Review requested territories from Area Heads before formal inclusion.</p>
                                    </div>
                                    <button onclick="UI.approveAllTerritoryRequests()" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow text-xs hover-lift transform active:scale-95">
                                        <i class="fa-solid fa-check-double mr-1.5"></i> Approve All Requests
                                    </button>
                                </div>

                                <div class="divide-y divide-amber-500/10 text-sm">
                                    ${pendingAreaHeads.map(ah => {
                    const req = (ah.requestedTerritories || '').split(',').filter(Boolean);
                    const reqNames = req.map(id => {
                        const t = db.territories.find(ter => ter.id === id);
                        return t ? t.name : id;
                    }).join(', ');

                    return `
                                            <div class="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition">
                                                <div>
                                                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                                        <span>${ah.officerName || ah.username}</span>
                                                        <span class="text-[10px] font-medium text-slate-400 italic font-mono">(${ah.username})</span>
                                                    </h4>
                                                    <div class="flex flex-wrap gap-1.5 mt-2">
                                                        <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded">Requesting:</span>
                                                        ${req.map(id => {
                        const t = db.territories.find(ter => ter.id === id);
                        const name = t ? t.name : id;
                        return `<span class="text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md shadow-sm">${name}</span>`;
                    }).join('')}
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 self-end sm:self-center">
                                                    <button onclick="UI.approveTerritoryRequest('${ah.id}', true)" class="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-xs border border-slate-200 dark:border-slate-700 transition shadow-sm">
                                                        <i class="fa-solid fa-pen mr-1"></i> Edit
                                                    </button>
                                                    <button onclick="UI.approveTerritoryRequest('${ah.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md transition transform active:scale-95">
                                                        <i class="fa-solid fa-check mr-1"></i> Approve
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                }).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 uppercase font-bold">
                                        <tr>
                                            <th class="px-3 py-2.5">Area Head Name</th>
                                            <th class="px-3 py-2.5">Username</th>
                                            <th class="px-3 py-2.5">Password</th>
                                            <th class="px-3 py-2.5">Assigned Territories</th>
                                            <th class="px-3 py-2.5 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                                        ${areaHeads.map(ah => {
                    const territories = (ah.territoryId || ah.territory_id || '').split(',').filter(Boolean);
                    const names = territories.map(tId => {
                        const t = db.territories.find(ter => ter.id === tId);
                        return t ? t.name : tId;
                    }).join(', ');
                    return `
                                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                    <td class="px-3 py-2.5 font-bold">${ah.officerName || '-'}</td>
                                                    <td class="px-3 py-2.5 font-mono">${ah.username}</td>
                                                    <td class="px-3 py-2.5 font-mono">${ah.password}</td>
                                                    <td class="px-3 py-2.5 text-xs italic">${names || 'None'}</td>
                                                    <td class="px-3 py-2.5 text-center">
                                                        <div class="flex justify-center items-center gap-2">
                                                            <button onclick="UI.openAreaHeadModal('${ah.id}')" class="text-blue-500 hover:text-blue-600 transition" title="Edit">
                                                                <i class="fa-solid fa-pen-to-square"></i>
                                                            </button>
                                                            <button onclick="UI.deleteUser('${ah.id}')" class="text-red-500 hover:text-red-600 transition" title="Delete">
                                                                <i class="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                }).join('')}
                                        ${areaHeads.length === 0 ? '<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">No Area Heads registered yet.</td></tr>' : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },

            selectedAhTerritories: [],

            renderAhTerritoryTags() {
                const db = Store.get();
                const container = document.getElementById('ah-territory-tags');
                if (!container) return;

                if (this.selectedAhTerritories.length === 0) {
                    container.innerHTML = '<span class="text-xs italic text-slate-400 select-none">No territories selected yet.</span>';
                } else {
                    container.innerHTML = this.selectedAhTerritories.map(tId => {
                        const t = db.territories.find(ter => ter.id === tId);
                        const name = t ? t.name : tId;
                        return `
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold border border-brand-200/50 dark:border-brand-800/30 animate-fade-in">
                                ${name}
                                <button type="button" onclick="UI.removeAhTerritory('${tId}')" class="text-brand-500 hover:text-brand-700 focus:outline-none ml-0.5">
                                    <i class="fa-solid fa-xmark text-[10px]"></i>
                                </button>
                            </span>
                        `;
                    }).join('');
                }

                const input = document.getElementById('ah-territories-input');
                if (input) input.value = this.selectedAhTerritories.join(',');
            },

            addAhTerritory() {
                const picker = document.getElementById('ah-territory-picker');
                if (!picker) return;
                const val = picker.value;
                if (!val) return;

                if (!this.selectedAhTerritories.includes(val)) {
                    this.selectedAhTerritories.push(val);
                    this.renderAhTerritoryTags();
                }
                picker.value = '';
            },

            removeAhTerritory(id) {
                this.selectedAhTerritories = this.selectedAhTerritories.filter(tId => tId !== id);
                this.renderAhTerritoryTags();
            },

            openAreaHeadModal(userId = null) {
                const db = Store.get();
                let user = { id: '', username: '', password: '', officerName: '', territoryId: '' };
                if (userId) {
                    const found = db.users.find(u => String(u.id) === String(userId));
                    if (found) user = found;
                }

                this.selectedAhTerritories = (user.territoryId || user.territory_id || '').split(',').filter(Boolean);

                const html = `
                    <h3 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">${userId ? 'Edit' : 'Add'} Area Head</h3>
                    <form onsubmit="UI.saveAreaHead(event, '${userId || ''}')" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Name</label>
                            <input type="text" name="officerName" value="${user.officerName}" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 text-sm focus:ring-2 focus:ring-brand-500" required>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Username / Code</label>
                            <input type="text" name="username" value="${user.username}" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 text-sm focus:ring-2 focus:ring-brand-500" required ${userId ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password / Employee ID</label>
                            <input type="text" name="password" value="${user.password}" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 text-sm focus:ring-2 focus:ring-brand-500" required>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Assign Territories</label>
                            <div class="flex gap-2 mb-2">
                                <select id="ah-territory-picker" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 text-sm focus:ring-2 focus:ring-brand-500">
                                    <option value="">-- Select Territory to Add --</option>
                                    ${db.territories.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                                </select>
                                <button type="button" onclick="UI.addAhTerritory()" class="px-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-bold text-sm flex items-center justify-center shadow-sm">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div id="ah-territory-tags" class="flex flex-wrap gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 min-h-[48px] shadow-inner">
                                <!-- Pills injected here via JS -->
                            </div>
                            <input type="hidden" name="assignedTerritories" id="ah-territories-input" value="${user.territoryId || user.territory_id || ''}">
                        </div>
                        <div class="flex justify-end space-x-2 pt-2">
                            <button type="button" onclick="document.getElementById('generic-modal').classList.add('hidden')" class="px-4 py-2 text-slate-500 hover:text-slate-700 transition text-sm font-bold">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-md font-bold text-sm">Save</button>
                        </div>
                    </form>
                `;
                this.renderHtmlModal(html);
                setTimeout(() => this.renderAhTerritoryTags(), 50);
            },

            saveAreaHead(e, userId) {
                e.preventDefault();
                const formData = new FormData(e.target);

                const officerName = formData.get('officerName');
                const username = formData.get('username');
                const password = formData.get('password');
                const territoryId = formData.get('assignedTerritories');

                const payload = {
                    officer_name: officerName,
                    username,
                    password,
                    role: 'area_head',
                    territory_id: territoryId
                };

                if (userId) {
                    payload.id = userId;
                } else {
                    payload.id = 'new_' + Date.now();
                }

                UI.toggleLoader(true);
                Store.update('users', payload).then(() => {
                    UI.toggleLoader(false);
                    document.getElementById('generic-modal').classList.add('hidden');
                    UI.renderAdminAreaHeads();
                }).catch(err => {
                    UI.toggleLoader(false);
                    alert('Failed to save Area Head: ' + err.message);
                });
            },

            deleteUser(id) {
                if (!confirm('Are you sure you want to delete this user?')) return;
                UI.toggleLoader(true);
                Store.delete('users', id).then(() => {
                    UI.toggleLoader(false);
                    UI.renderAdminAreaHeads();
                }).catch(err => {
                    UI.toggleLoader(false);
                    alert('Failed to delete user: ' + err.message);
                });
            },

            // --- NEW AREA HEAD SELF-SERVICE REQUESTS ---
            openRequestTerritoryModal() {
                const db = Store.get();
                const currentAh = Auth.currentUser;

                // Get current state
                const currentAssigned = (currentAh.territoryId || currentAh.territory_id || '').split(',').filter(Boolean);
                const currentRequested = (currentAh.requestedTerritories || '').split(',').filter(Boolean);

                let html = `
                    <div class="p-2">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="fa-solid fa-circle-nodes text-brand-500"></i> Manage My Territories
                            </h3>
                            <button onclick="UI.closeModal()" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Select or modify the regions you want to manage. Your requests will go into the admin review queue.</p>
                        
                        <div class="max-h-[40vh] overflow-y-auto pr-2 space-y-2 border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 shadow-inner mb-5">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                `;

                db.territories.forEach(t => {
                    const isAssigned = currentAssigned.includes(t.id);
                    const isRequested = currentRequested.includes(t.id);
                    const isChecked = isAssigned || isRequested;

                    html += `
                        <label class="flex items-center gap-3 p-3 rounded-xl border bg-white dark:bg-dark-card hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition ${isAssigned ? 'border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5' : isRequested ? 'border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5' : 'border-slate-200 dark:border-slate-700/50'}">
                            <input type="checkbox" value="${t.id}" ${isChecked ? 'checked' : ''} class="w-4 h-4 text-brand-600 border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded focus:ring-brand-500">
                            <div class="flex flex-col text-left">
                                <span class="text-sm font-bold text-slate-800 dark:text-slate-200">${t.name}</span>
                                <span class="text-[10px] text-slate-400 font-normal italic">Part ${t.part}</span>
                            </div>
                        </label>
                    `;
                });

                html += `
                            </div>
                        </div>

                        <div class="flex justify-end space-x-2">
                            <button onclick="UI.closeModal()" class="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-bold">Cancel</button>
                            <button onclick="UI.saveTerritoryRequest()" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-md text-xs transition transform active:scale-95">
                                Submit Request
                            </button>
                        </div>
                    </div>
                `;

                this.renderHtmlModal(html);
            },

            async saveTerritoryRequest() {
                const modal = document.getElementById('modal-content');
                const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
                const selected = Array.from(checkboxes).map(c => c.value).join(',');

                const db = Store.get();
                const currentAh = Auth.currentUser;

                // Save existing assignments, everything else selected becomes a request
                const existing = (currentAh.territoryId || currentAh.territory_id || '').split(',').filter(Boolean);
                const newRequests = Array.from(checkboxes).map(c => c.value).filter(id => !existing.includes(id)).join(',');

                currentAh.requestedTerritories = newRequests;

                UI.toggleLoader(true);
                try {
                    await Store.update('users', currentAh);
                    UI.closeModal();
                    UI.showSuccess('Territory additions requested successfully!');
                    UI.renderAreaHeadDashboard();
                } catch (err) {
                    alert('Request failed: ' + err.message);
                } finally {
                    UI.toggleLoader(false);
                }
            },

            async approveTerritoryRequest(userId, edit = false) {
                const db = Store.get();
                const user = db.users.find(u => String(u.id) === String(userId));
                if (!user) return;

                if (edit) {
                    this.openAreaHeadModal(userId);
                    return;
                }

                const assigned = (user.territoryId || user.territory_id || '').split(',').filter(Boolean);
                const requested = (user.requestedTerritories || '').split(',').filter(Boolean);

                // Merge
                const merged = Array.from(new Set([...assigned, ...requested])).join(',');
                user.territoryId = merged;
                user.territory_id = merged;
                user.requestedTerritories = '';

                UI.toggleLoader(true);
                try {
                    await Store.update('users', user);
                    UI.showSuccess(`Approved territories for ${user.officerName || user.username}`);
                    UI.renderAdminAreaHeads();
                } catch (err) {
                    alert('Approval failed: ' + err.message);
                } finally {
                    UI.toggleLoader(false);
                }
            },

            async approveAllTerritoryRequests() {
                const db = Store.get();
                const areaHeads = db.users.filter(u => u.role === 'area_head' && (u.requestedTerritories || '').trim().length > 0);

                if (areaHeads.length === 0) return;

                UI.toggleLoader(true);
                try {
                    for (const user of areaHeads) {
                        const assigned = (user.territoryId || user.territory_id || '').split(',').filter(Boolean);
                        const requested = (user.requestedTerritories || '').split(',').filter(Boolean);
                        const merged = Array.from(new Set([...assigned, ...requested])).join(',');
                        user.territoryId = merged;
                        user.territory_id = merged;
                        user.requestedTerritories = '';
                        await Store.update('users', user);
                    }
                    UI.showSuccess('Successfully approved all pending territory requests!');
                    UI.renderAdminAreaHeads();
                } catch (err) {
                    alert('Bulk approval failed: ' + err.message);
                } finally {
                    UI.toggleLoader(false);
                }
            },

            renderAreaHeadDashboard() {
                const db = Store.get();
                const currentAh = Auth.currentUser;
                const ahTerritories = (currentAh.territoryId || currentAh.territory_id || '').split(',').filter(Boolean);
                const currentRequested = (currentAh.requestedTerritories || '').split(',').filter(Boolean);

                if (ahTerritories.length === 0) {
                    document.getElementById('views-container').innerHTML = `
                        <div class="animate-entry flex flex-col items-center justify-center h-full p-10 text-slate-400">
                            <i class="fa-solid fa-circle-nodes text-6xl mb-4 text-slate-300"></i>
                            <h3 class="text-xl font-bold mb-1 text-slate-800 dark:text-white">No Territories Assigned</h3>
                            <p class="text-sm text-slate-500 text-center max-w-md mb-4">You currently don't have active territories under your area.</p>
                            
                            <button onclick="UI.openRequestTerritoryModal()" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md hover-lift text-sm transition">
                                <i class="fa-solid fa-plus mr-2"></i> Request Territories
                            </button>

                            ${currentRequested.length > 0 ? `
                                <div class="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold flex items-center">
                                    <i class="fa-solid fa-hourglass-half mr-2 animate-spin"></i> Pending request for ${currentRequested.length} regions
                                </div>
                            ` : ''}
                        </div>
                    `;
                    return;
                }

                const metrics = Calc.getMetrics(ahTerritories);
                const todayAch = metrics.todayProj > 0 ? ((metrics.todayColl / metrics.todayProj) * 100).toFixed(1) : (metrics.todayColl > 0 ? '100+' : '0.0');

                const assignedTerritoryData = db.territories.filter(t => ahTerritories.includes(t.id)).map(t => {
                    const m = Calc.getMetrics(t.id);
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    const tdAch = m.todayProj > 0 ? ((m.todayColl / m.todayProj) * 100).toFixed(1) : (m.todayColl > 0 ? '100+' : '0.0');
                    return { ...t, ...m, lastDayAch: ldAch, todayAch: tdAch };
                }).sort((a, b) => parseFloat(b.rpi) - parseFloat(a.rpi));

                UI.updateHeader('Area Head Dashboard', `Welcome, ${currentAh.officerName || currentAh.username}`);

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry max-w-6xl mx-auto space-y-6">
                        <div class="flex justify-between items-center mb-2">
                            <div>
                                <button onclick="UI.openRequestTerritoryModal()" class="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition flex items-center font-bold text-xs border border-brand-500/20 shadow-sm">
                                    <i class="fa-solid fa-circle-nodes mr-1.5"></i> Manage Regions
                                </button>
                            </div>
                            <div class="flex items-center gap-3">
                                ${currentRequested.length > 0 ? `
                                    <div class="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold rounded-xl flex items-center shadow-sm animate-pulse">
                                        <i class="fa-solid fa-hourglass-half mr-1.5"></i> ${currentRequested.length} Pending Review
                                    </div>
                                ` : ''}
                                <div class="px-4 py-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl font-bold text-xs border border-brand-500/20 flex items-center shadow-sm">
                                    <i class="fa-solid fa-user-tie mr-2"></i> Area Head
                                </div>
                            </div>
                        </div>

                        <!-- Aggregate Overview Categories -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            <!-- Category 1: Financial Totals -->
                            <div class="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md relative overflow-hidden group hover-lift">
                                <div class="absolute right-0 top-0 opacity-5 text-emerald-600 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-sack-dollar text-9xl"></i>
                                </div>
                                <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4 flex items-center">
                                    <i class="fa-solid fa-chart-line mr-2"></i> Area Financial Totals
                                </h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Total Target (Proj):</span>
                                        <span class="font-mono font-bold text-slate-900 dark:text-white">৳${parseInt(metrics.presetProjTotal).toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Till Date Collection:</span>
                                        <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">৳${parseInt(metrics.mtdColl).toLocaleString()}</span>
                                    </div>
                                    <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                        <span class="text-slate-700 dark:text-slate-300 font-semibold">Collection Ach%:</span>
                                        <span class="text-lg font-black ${parseFloat(metrics.tillDayAchievement) >= 90 ? 'text-emerald-600' : parseFloat(metrics.tillDayAchievement) >= 70 ? 'text-amber-600' : 'text-rose-600'}">${metrics.tillDayAchievement}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Category 2: File Coverage -->
                            <div class="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md relative overflow-hidden group hover-lift">
                                <div class="absolute right-0 top-0 opacity-5 text-blue-600 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-folder-open text-9xl"></i>
                                </div>
                                <h3 class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 flex items-center">
                                    <i class="fa-solid fa-percent mr-2"></i> Area File Coverage
                                </h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Total Files:</span>
                                        <span class="font-mono font-bold text-slate-900 dark:text-white">${metrics.targetFiles}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Collected Files:</span>
                                        <span class="font-mono font-bold text-blue-600 dark:text-blue-400">${metrics.uniquePaidCodes}</span>
                                    </div>
                                    <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                        <span class="text-slate-700 dark:text-slate-300 font-semibold">Uncollected Files:</span>
                                        <span class="font-mono font-bold text-slate-400">${Math.max(0, metrics.targetFiles - metrics.uniquePaidCodes)}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Category 3: Daily Operations -->
                            <div class="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md relative overflow-hidden group hover-lift">
                                <div class="absolute right-0 top-0 opacity-5 text-purple-600 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-calendar-day text-9xl"></i>
                                </div>
                                <h3 class="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4 flex items-center">
                                    <i class="fa-solid fa-bolt mr-2"></i> Area Daily Operations
                                </h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Today's Projection:</span>
                                        <span class="font-mono font-bold text-slate-900 dark:text-white">৳${parseInt(metrics.todayProj).toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500 dark:text-slate-400">Today's Collection:</span>
                                        <span class="font-mono font-bold text-purple-600 dark:text-purple-400">৳${parseInt(metrics.todayColl).toLocaleString()}</span>
                                    </div>
                                    <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                        <span class="text-slate-700 dark:text-slate-300 font-semibold">Today's Ach%:</span>
                                        <span class="text-lg font-black ${parseFloat(todayAch) >= 100 ? 'text-emerald-600' : 'text-amber-600'}">${todayAch}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop View Table (hidden on mobile) -->
                        <div class="hidden md:block glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700 mt-5 animate-entry">
                            <div class="px-3 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                <h3 class="text-base font-bold text-slate-800 dark:text-white flex items-center">
                                    <i class="fa-solid fa-map-location-dot text-brand-500 mr-2"></i> Territory Performance Breakdown
                                </h3>
                                <span class="text-xs font-bold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800 shadow-sm">${assignedTerritoryData.length} Active Regions</span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left whitespace-nowrap">
                                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                                        <tr class="divide-x divide-slate-200 dark:divide-slate-700">
                                            <th class="px-3 py-2.5" rowspan="2">Territory</th>
                                            <th class="px-3 py-2.5 text-center bg-emerald-50/40 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400" colspan="3">Financial Totals</th>
                                            <th class="px-3 py-2.5 text-center bg-blue-50/40 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400" colspan="3">File Coverage</th>
                                            <th class="px-3 py-2.5 text-center bg-purple-50/40 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400" colspan="3">Daily Operations</th>
                                        </tr>
                                        <tr class="divide-x divide-slate-200 dark:divide-slate-700 border-t border-slate-200 dark:border-slate-700 text-[10px]">
                                            <th class="px-4 py-2 text-right bg-emerald-50/20 dark:bg-emerald-900/5">Target (Proj)</th>
                                            <th class="px-4 py-2 text-right bg-emerald-50/20 dark:bg-emerald-900/5">MTD Coll</th>
                                            <th class="px-4 py-2 text-center bg-emerald-50/20 dark:bg-emerald-900/5">Ach%</th>
                                            <th class="px-4 py-2 text-center bg-blue-50/20 dark:bg-blue-900/5">Total</th>
                                            <th class="px-4 py-2 text-center bg-blue-50/20 dark:bg-blue-900/5">Coll</th>
                                            <th class="px-4 py-2 text-center bg-blue-50/20 dark:bg-blue-900/5">Uncoll</th>
                                            <th class="px-4 py-2 text-right bg-purple-50/20 dark:bg-purple-900/5">Today Proj</th>
                                            <th class="px-4 py-2 text-right bg-purple-50/20 dark:bg-purple-900/5">Collection</th>
                                            <th class="px-4 py-2 text-center bg-purple-50/20 dark:bg-purple-900/5">Ach%</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs">
                                        ${assignedTerritoryData.map(t => {
                    const finAch = t.presetProjTotal > 0 ? ((t.mtdColl / t.presetProjTotal) * 100).toFixed(1) : '0.0';
                    const uncoll = Math.max(0, t.targetFiles - t.uniquePaidCodes);
                    const isDoingBad = parseFloat(finAch) < 60 || (t.rpi && parseFloat(t.rpi) < 60);
                    const missingProj = parseInt(t.todayProj) === 0;

                    return `
                                                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition divide-x divide-slate-100 dark:divide-slate-700 ${isDoingBad ? 'bg-rose-500/5 dark:bg-rose-500/10' : ''}">
                                                    <td class="px-3 py-2.5 font-bold text-slate-900 dark:text-white">
                                                        <div class="flex flex-col gap-1">
                                                            <div class="flex items-center gap-1.5 flex-wrap">
                                                                <span>${t.name}</span>
                                                                ${isDoingBad ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse"><i class="fa-solid fa-triangle-exclamation text-[8px]"></i> CRITICAL</span>` : ''}
                                                                ${missingProj ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><i class="fa-solid fa-pencil text-[8px]"></i> NO PROJECTION</span>` : ''}
                                                            </div>
                                                            <span class="text-[10px] font-normal text-slate-400 italic">${t.officer || 'No Officer'}</span>
                                                        </div>
                                                    </td>
                                                    <td class="px-4 py-4 text-right font-mono">৳${parseInt(t.presetProjTotal).toLocaleString()}</td>
                                                    <td class="px-4 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳${parseInt(t.mtdColl).toLocaleString()}</td>
                                                    <td class="px-4 py-4 text-center">
                                                        <span class="px-2 py-1 rounded-md font-bold ${parseFloat(finAch) >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : parseFloat(finAch) >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse'}">
                                                            ${finAch}%
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-4 text-center tabular-nums">${t.targetFiles}</td>
                                                    <td class="px-4 py-4 text-center font-mono text-blue-600 dark:text-blue-400 font-bold">${t.uniquePaidCodes}</td>
                                                    <td class="px-4 py-4 text-center font-mono text-slate-400">${uncoll}</td>
                                                    <td class="px-4 py-4 text-right font-mono ${missingProj ? 'text-rose-500 bg-rose-500/5' : ''}">৳${parseInt(t.todayProj).toLocaleString()}</td>
                                                    <td class="px-4 py-4 text-right font-mono font-bold text-purple-600 dark:text-purple-400">৳${parseInt(t.todayColl).toLocaleString()}</td>
                                                    <td class="px-4 py-4 text-center">
                                                        <span class="px-2 py-1 rounded-md font-bold ${parseFloat(t.todayAch) >= 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}">
                                                            ${t.todayAch}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Mobile View Stacked Cards (hidden on desktop) -->
                        <div class="grid grid-cols-1 gap-4 md:hidden mt-4 animate-entry">
                            ${assignedTerritoryData.map(t => {
                    const finAch = t.presetProjTotal > 0 ? ((t.mtdColl / t.presetProjTotal) * 100).toFixed(1) : '0.0';
                    const uncoll = Math.max(0, t.targetFiles - t.uniquePaidCodes);
                    const isDoingBad = parseFloat(finAch) < 60 || (t.rpi && parseFloat(t.rpi) < 60);
                    const missingProj = parseInt(t.todayProj) === 0;

                    return `
                                    <div class="glass-panel p-3.5 rounded-xl border relative overflow-hidden bg-white dark:bg-dark-card shadow-md ${isDoingBad ? 'border-rose-300 dark:border-rose-800/60 bg-rose-500/5' : 'border-slate-200 dark:border-slate-700/50'}">
                                        <div class="flex justify-between items-start gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                                            <div>
                                                <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                                                    <span>${t.name}</span>
                                                    ${isDoingBad ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse"><i class="fa-solid fa-triangle-exclamation text-[8px]"></i> CRITICAL</span>` : ''}
                                                    ${missingProj ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><i class="fa-solid fa-pencil text-[8px]"></i> NO PROJ</span>` : ''}
                                                </h4>
                                                <span class="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5"><i class="fa-solid fa-user-tie text-[10px]"></i> ${t.officer || 'No Officer'}</span>
                                            </div>
                                        </div>

                                        <div class="space-y-4">
                                            <div class="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10">
                                                <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                                    <i class="fa-solid fa-chart-line text-[11px]"></i> Financial Totals
                                                </span>
                                                <div class="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                    <div>Target: <span class="font-mono font-bold text-slate-800 dark:text-white">৳${parseInt(t.presetProjTotal).toLocaleString()}</span></div>
                                                    <div>Coll: <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">৳${parseInt(t.mtdColl).toLocaleString()}</span></div>
                                                    <div class="col-span-2 mt-1 pt-1 border-t border-emerald-500/10 flex justify-between items-center">
                                                        <span>Achievement:</span>
                                                        <span class="font-bold text-sm text-emerald-600 dark:text-emerald-400">${finAch}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-500/10">
                                                <span class="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                                    <i class="fa-solid fa-percent text-[11px]"></i> File Coverage
                                                </span>
                                                <div class="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                                    <div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                                        <div class="text-slate-400 text-[9px] uppercase font-bold mb-0.5">Total</div>
                                                        <div class="font-mono font-bold text-slate-800 dark:text-white">${t.targetFiles}</div>
                                                    </div>
                                                    <div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                                        <div class="text-slate-400 text-[9px] uppercase font-bold mb-0.5">Coll</div>
                                                        <div class="font-mono font-bold text-blue-600 dark:text-blue-400">${t.uniquePaidCodes}</div>
                                                    </div>
                                                    <div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                                        <div class="text-slate-400 text-[9px] uppercase font-bold mb-0.5">Uncoll</div>
                                                        <div class="font-mono font-bold text-slate-400">${uncoll}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="bg-purple-500/5 dark:bg-purple-500/10 p-3 rounded-xl border border-purple-500/10">
                                                <span class="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                                    <i class="fa-solid fa-bolt text-[11px]"></i> Daily Operations
                                                </span>
                                                <div class="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                    <div>Proj: <span class="font-mono font-bold text-slate-800 dark:text-white ${missingProj ? 'text-rose-500' : ''}">৳${parseInt(t.todayProj).toLocaleString()}</span></div>
                                                    <div>Coll: <span class="font-mono font-bold text-purple-600 dark:text-purple-400">৳${parseInt(t.todayColl).toLocaleString()}</span></div>
                                                    <div class="col-span-2 mt-1 pt-1 border-t border-purple-500/10 flex justify-between items-center">
                                                        <span>Today Ach%:</span>
                                                        <span class="font-bold text-sm text-purple-600 dark:text-purple-400">${t.todayAch}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>
                    </div>
                `;
            },

            // --- ADMIN PERFORMANCE ANALYTICS ---
            renderAdminPerformance() {
                const db = Store.get();
                const allTerritoryData = db.territories.map(t => {
                    const m = Calc.getMetrics(t.id);
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    const tdAch = m.todayProj > 0 ? ((m.todayColl / m.todayProj) * 100).toFixed(1) : (m.todayColl > 0 ? '100+' : '0.0');
                    return { ...t, ...m, lastDayAch: ldAch, todayAch: tdAch };
                });

                // Top Performers - Highest Collected
                const topCollected = [...allTerritoryData].sort((a, b) => b.mtdColl - a.mtdColl).slice(0, 5);
                // Top Performers - Highest Achievement %
                const topAchievement = [...allTerritoryData].sort((a, b) => b.tillDayAchievement - a.tillDayAchievement).slice(0, 5);
                // Top Performers - Last Day Ach%
                const topLastDayAch = [...allTerritoryData].sort((a, b) => b.lastDayAch - a.lastDayAch).slice(0, 5);
                // Below Performers - Lowest Achievement %
                const belowPerformers = [...allTerritoryData].sort((a, b) => a.tillDayAchievement - b.tillDayAchievement).slice(0, 5);

                const container = document.getElementById('views-container');
                container.innerHTML = `
                    <div class="animate-entry space-y-4">
                        <div class="flex justify-end items-center mb-2">
                            <button onclick="UI.downloadPerformanceCSV()" class="flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all font-bold text-xs shadow-md shadow-emerald-500/10 hover-lift">
                                <i class="fa-solid fa-file-csv mr-1.5"></i> Download CSV
                            </button>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- TOP COLLECTORS -->
                            <div class="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md hover-lift">
                                <div class="px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                        <i class="fa-solid fa-crown text-emerald-500"></i> Top Collectors (MTD)
                                    </h3>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Revenue Leaders</span>
                                </div>
                                <div class="p-2.5 space-y-2">
                                    ${topCollected.map((t, i) => `
                                        <div class="flex flex-col p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition hover:scale-[1.005]">
                                            <div class="flex items-center gap-2 mb-1">
                                                <div class="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-emerald-500/20">
                                                    ${i + 1}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${t.name}</h4>
                                                    <p class="text-[8px] text-slate-400 font-medium truncate">${t.officer || 'No Officer'}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-xs font-black text-emerald-600 dark:text-emerald-400">৳${parseInt(t.mtdColl).toLocaleString()}</p>
                                                    <p class="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Collected</p>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/30">
                                                <div>
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Projection</p>
                                                    <p class="text-[9px] font-bold text-slate-600 dark:text-slate-300">৳${parseInt(t.presetProjTotal).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Achievement %</p>
                                                    <p class="text-[9px] font-black text-emerald-600 dark:text-emerald-400">${t.tillDayAchievement}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- TOP ACHIEVEMENT % -->
                            <div class="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md hover-lift">
                                <div class="px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-transparent border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                        <i class="fa-solid fa-bolt-lightning text-blue-500"></i> Efficiency Leaders (Ach %)
                                    </h3>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">Target Masters</span>
                                </div>
                                <div class="p-2.5 space-y-2">
                                    ${topAchievement.map((t, i) => `
                                        <div class="flex flex-col p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition hover:scale-[1.005]">
                                            <div class="flex items-center gap-2 mb-1">
                                                <div class="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
                                                    ${i + 1}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${t.name}</h4>
                                                    <p class="text-[9px] text-slate-400 font-medium truncate">${t.officer || 'No Officer'}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-xs font-black text-blue-600 dark:text-blue-400">${t.tillDayAchievement}%</p>
                                                    <div class="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-0.5 ml-auto overflow-hidden">
                                                        <div class="h-full bg-blue-500" style="width: ${Math.min(100, t.tillDayAchievement)}%"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/30">
                                                <div>
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Projection</p>
                                                    <p class="text-[9px] font-bold text-slate-600 dark:text-slate-300">৳${parseInt(t.presetProjTotal).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Collection</p>
                                                    <p class="text-[9px] font-black text-blue-600 dark:text-blue-400">৳${parseInt(t.mtdColl).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- LAST DAY PERFORMANCE -->
                            <div class="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md hover-lift">
                                <div class="px-4 py-2.5 bg-gradient-to-r from-purple-500/10 to-transparent border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                        <i class="fa-solid fa-fire text-purple-500"></i> Yesterday's Momentum
                                    </h3>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">Last Day Ach%</span>
                                </div>
                                <div class="p-2.5 space-y-2">
                                    ${topLastDayAch.map((t, i) => `
                                        <div class="flex flex-col p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition hover:scale-[1.005]">
                                            <div class="flex items-center gap-2 mb-1">
                                                <div class="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-purple-500/20">
                                                    ${i + 1}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${t.name}</h4>
                                                    <p class="text-[9px] text-slate-400 font-medium truncate">${t.officer || 'No Officer'}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-xs font-black text-purple-600 dark:text-purple-400">${t.lastDayAch}%</p>
                                                    <p class="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Achievement</p>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/30">
                                                <div>
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Yesterday Proj</p>
                                                    <p class="text-[9px] font-bold text-slate-600 dark:text-slate-300">৳${parseInt(t.yestProjAmt).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Yesterday Coll</p>
                                                    <p class="text-[9px] font-black text-purple-600 dark:text-purple-400">৳${parseInt(t.yestCollAmt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- BELOW PERFORMERS -->
                            <div class="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-md hover-lift border-rose-100 dark:border-rose-900/30">
                                <div class="px-4 py-2.5 bg-gradient-to-r from-rose-500/10 to-transparent border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
                                    <h3 class="text-xs font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                                        <i class="fa-solid fa-triangle-exclamation text-rose-500"></i> Attention Required
                                    </h3>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full animate-pulse">Below Benchmark</span>
                                </div>
                                <div class="p-2.5 space-y-2">
                                    ${belowPerformers.map((t, i) => `
                                        <div class="flex flex-col p-2 rounded-xl bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/40 transition hover:scale-[1.005]">
                                            <div class="flex items-center gap-2 mb-1">
                                                <div class="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-rose-500/20">
                                                    ${i + 1}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h4 class="text-xs font-bold text-slate-800 dark:text-white truncate">${t.name}</h4>
                                                    <p class="text-[9px] text-slate-400 font-medium truncate">${t.officer || 'No Officer'}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-xs font-black text-rose-600 dark:text-rose-400">${t.tillDayAchievement}%</p>
                                                    <div class="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-0.5 ml-auto overflow-hidden">
                                                        <div class="h-full bg-rose-500" style="width: ${Math.min(100, t.tillDayAchievement)}%"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200 dark:border-rose-800/40">
                                                <div>
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Projection</p>
                                                    <p class="text-[9px] font-bold text-slate-600 dark:text-slate-300">৳${parseInt(t.presetProjTotal).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Collection</p>
                                                    <p class="text-[9px] font-black text-rose-600 dark:text-rose-400">৳${parseInt(t.mtdColl).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- ALL TERRITORIES PERFORMANCE LEDGER -->
                        <div class="glass-panel p-4 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card shadow-xl mt-5 space-y-6">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                                <div>
                                    <h3 class="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                                        <i class="fa-solid fa-ranking-star text-brand-500"></i> All Territories Performance Ledger
                                    </h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time leaderboard sorted by MTD achievement percentage, dynamic green-to-red visualization.</p>
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800/30">
                                        Active: ${allTerritoryData.length} Territories
                                    </span>
                                </div>
                            </div>

                            <!-- INTERACTIVE CONTROL DECK -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <!-- Search Input -->
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <i class="fa-solid fa-magnifying-glass text-xs"></i>
                                    </span>
                                    <input type="text" id="perf-search" oninput="window.filterPerformanceAnalytics()" 
                                        placeholder="Search territory or officer..." 
                                        class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold placeholder:text-slate-400 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm">
                                </div>

                                <!-- Preset Chips -->
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <button onclick="window.setPerfPreset('all', this)" data-preset="all" class="preset-btn active px-3 py-2 text-[10px] font-black rounded-lg border transition-all bg-brand-600 text-white shadow-md shadow-brand-500/20">
                                        ALL
                                    </button>
                                    <button onclick="window.setPerfPreset('excellent', this)" data-preset="excellent" class="preset-btn px-3 py-2 text-[10px] font-black rounded-lg border transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        🏆 EXC (≥90%)
                                    </button>
                                    <button onclick="window.setPerfPreset('good', this)" data-preset="good" class="preset-btn px-3 py-2 text-[10px] font-black rounded-lg border transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        📈 GOOD (70%-90%)
                                    </button>
                                    <button onclick="window.setPerfPreset('warning', this)" data-preset="warning" class="preset-btn px-3 py-2 text-[10px] font-black rounded-lg border transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        ⚠️ WARN (40%-70%)
                                    </button>
                                    <button onclick="window.setPerfPreset('critical', this)" data-preset="critical" class="preset-btn px-3 py-2 text-[10px] font-black rounded-lg border transition-all bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        🚨 CRIT (<40%)
                                    </button>
                                </div>

                                <!-- Slider Filter -->
                                <div class="flex flex-col justify-center px-2">
                                    <div class="flex justify-between items-center mb-1.5">
                                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min MTD Achievement</span>
                                        <span id="perf-min-ach-val" class="text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded border border-brand-200/50 dark:border-brand-800/30">0%</span>
                                    </div>
                                    <input type="range" id="perf-min-ach" min="0" max="120" value="0" oninput="window.filterPerformanceAnalytics()" 
                                        class="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer">
                                </div>
                            </div>

                            <!-- LEADERBOARD TABLE -->
                            <div class="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                <table class="w-full text-left border-collapse whitespace-nowrap">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                        <tr class="divide-x divide-slate-100 dark:divide-slate-700">
                                            <th class="p-3 text-center">Rank</th>
                                            <th class="p-3 text-center">Part</th>
                                            <th class="p-3">Territory & Officer</th>
                                            <th class="p-3 text-center">Customers</th>
                                            <th class="p-3 text-center">Non-Pay</th>
                                            <th class="p-3 text-right">Target Proj</th>
                                            <th class="p-3 text-right">MTD Collection</th>
                                            <th class="p-3 text-right">Remaining Amt</th>
                                            <th class="p-3 text-center">Achievement %</th>
                                            <th class="p-3 text-center">Performance Indicator</th>
                                        </tr>
                                    </thead>
                                    <tbody id="perf-analytics-table-body" class="divide-y divide-slate-100 dark:divide-slate-800">
                                        ${[...allTerritoryData].sort((a, b) => parseFloat(b.tillDayAchievement) - parseFloat(a.tillDayAchievement)).map((t, index) => {
                                            const rank = index + 1;
                                            const totalProj = parseFloat(t.presetProjTotal) || 0;
                                            const mtdColl = parseFloat(t.mtdColl) || 0;
                                            const achPct = parseFloat(t.tillDayAchievement) || 0;
                                            const remaining = Math.max(0, totalProj - mtdColl);
                                            
                                            // Hue goes from 0 (red) to 120 (green) based on achPct
                                            const hue = Math.min(120, Math.max(0, (achPct / 100) * 120));
                                            
                                            let statusText = 'Critical';
                                            if (achPct >= 90) statusText = 'Excellent';
                                            else if (achPct >= 70) statusText = 'Good';
                                            else if (achPct >= 40) statusText = 'Warning';
                                            
                                            return `
                                                <tr data-name="${t.name}" data-officer="${t.officer || ''}" data-ach="${achPct}" data-part="${t.part}"
                                                    class="divide-x divide-slate-100 dark:divide-slate-800 transition"
                                                    style="border-left: 4px solid hsl(${hue}, 80%, 45%); background: linear-gradient(90deg, hsla(${hue}, 85%, 45%, 0.03) 0%, transparent 100%);">
                                                    <td class="p-2.5 text-center font-bold">
                                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg font-black text-xs
                                                            ${rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse' : 
                                                              rank === 2 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700' : 
                                                              rank === 3 ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800' : 
                                                              'bg-slate-50 dark:bg-slate-900 text-slate-500'}">
                                                            ${rank}
                                                        </span>
                                                    </td>
                                                    <td class="p-2.5 text-center font-black">
                                                        <span class="px-2 py-0.5 rounded text-[10px] ${t.part === 'A' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'}">
                                                            ${t.part}
                                                        </span>
                                                    </td>
                                                    <td class="p-2.5 font-bold text-slate-800 dark:text-white">
                                                        <div class="flex flex-col">
                                                            <span class="text-xs">${t.name}</span>
                                                            <span class="text-[9px] font-medium text-slate-400">${t.officer || 'No Officer Assigned'}</span>
                                                        </div>
                                                    </td>
                                                    <td class="p-2.5 text-center font-mono font-medium">${t.targetFiles}</td>
                                                    <td class="p-2.5 text-center font-mono font-medium text-rose-500">${t.tillDateNonPayFiles}</td>
                                                    <td class="p-2.5 text-right font-mono font-medium">৳${parseInt(totalProj).toLocaleString()}</td>
                                                    <td class="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">৳${parseInt(mtdColl).toLocaleString()}</td>
                                                    <td class="p-2.5 text-right font-mono font-medium text-slate-500">৳${parseInt(remaining).toLocaleString()}</td>
                                                    <td class="p-2.5 text-center">
                                                        <span class="inline-block px-2.5 py-1 rounded-lg font-black text-xs shadow-sm border"
                                                            style="background-color: hsla(${hue}, 85%, 45%, 0.1); color: hsl(${hue}, 85%, 35%); border-color: hsla(${hue}, 85%, 45%, 0.2);">
                                                            ${achPct}%
                                                        </span>
                                                    </td>
                                                    <td class="p-2.5 text-center">
                                                        <div class="flex items-center justify-center gap-2">
                                                            <div class="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" style="background-color: hsl(${hue}, 85%, 45%);"></div>
                                                            <span class="font-extrabold text-[10px] uppercase tracking-wider" style="color: hsl(${hue}, 85%, 38%);">${statusText}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                        
                                        <!-- Empty State Row -->
                                        <tr id="perf-no-results" class="hidden">
                                            <td colspan="10" class="p-12 text-center text-slate-400 italic">
                                                <div class="flex flex-col items-center justify-center gap-2">
                                                    <i class="fa-solid fa-triangle-exclamation text-3xl text-slate-300 dark:text-slate-700 animate-bounce"></i>
                                                    <p class="font-bold text-sm">No territories match your filter settings</p>
                                                    <p class="text-xs text-slate-400">Try adjusting the search query or MTD achievement slider</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },

            downloadAdminSummaryCSV() {
                const db = Store.get();
                
                const allTerritoryData = db.territories.map(t => {
                    const m = Calc.getMetrics(t.id);
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    const tdAch = m.todayProj > 0 ? ((m.todayColl / m.todayProj) * 100).toFixed(1) : (m.todayColl > 0 ? '100+' : '0.0');
                    const appUsePct = Calc.getAppUsePercentage(t.id);
                    return { ...t, ...m, lastDayAch: ldAch, todayAch: tdAch, appUsePct };
                });

                // Sort by ach% from high to low
                allTerritoryData.sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));

                let csvContent = "Rank,Part,Territory Name,Total Files,Proj Files (MTD),Paid Files,Non-Pay Files,Total EMI,Target Proj (Reg),Target Proj (Adv),Total Proj,Till Day Coll,Ach %,Today's Proj,Today's Coll,Today Ach %,Last Day Proj Amt,Last Day Proj Files,Last Day Coll Amt,Last Day Coll Files,Last Day Ach %,LM NP Amount,LM NP Files,LM NP Rec (Amt),LM NP Rec (Files),App Use %,Remaining Amount\n";

                allTerritoryData.forEach((t, index) => {
                    const rank = index + 1;
                    const part = t.part || '';
                    const name = t.name || '';
                    const targetFiles = t.targetFiles || 0;
                    const mtdProjFiles = t.mtdProjFiles || 0;
                    const uniquePaidCodes = t.uniquePaidCodes || 0;
                    const tillDateNonPayFiles = t.tillDateNonPayFiles || 0;
                    const targetAmt = parseFloat(t.targetAmt) || 0;
                    const presetProjReg = parseFloat(t.presetProjReg) || 0;
                    const presetProjAdv = parseFloat(t.presetProjAdv) || 0;
                    const presetProjTotal = parseFloat(t.presetProjTotal) || 0;
                    const mtdColl = parseFloat(t.mtdColl) || 0;
                    const tillDayAchievement = parseFloat(t.tillDayAchievement) || 0;
                    const todayProj = parseFloat(t.todayProj) || 0;
                    const todayColl = parseFloat(t.todayColl) || 0;
                    const todayAch = t.todayAch || '0.0';
                    const yestProjAmt = parseFloat(t.yestProjAmt) || 0;
                    const yestProjFiles = t.yestProjFiles || 0;
                    const yestCollAmt = parseFloat(t.yestCollAmt) || 0;
                    const yestCollFiles = t.yestCollFiles || 0;
                    const lastDayAch = t.lastDayAch || '0.0';
                    const lmNpTargetAmt = parseFloat(t.lmNpTargetAmt) || 0;
                    const lmNpTargetFiles = t.lmNpTargetFiles || 0;
                    const mtdLmNpColl = parseFloat(t.mtdLmNpColl) || 0;
                    const mtdLmNpFiles = t.mtdLmNpFiles || 0;
                    const appUsePct = t.appUsePct || 0;
                    const remaining = Math.max(0, presetProjTotal - mtdColl);

                    csvContent += `${rank},${part},"${name}",${targetFiles},${mtdProjFiles},${uniquePaidCodes},${tillDateNonPayFiles},${targetAmt},${presetProjReg},${presetProjAdv},${presetProjTotal},${mtdColl},${tillDayAchievement}%,${todayProj},${todayColl},${todayAch}%,${yestProjAmt},${yestProjFiles},${yestCollAmt},${yestCollFiles},${lastDayAch}%,${lmNpTargetAmt},${lmNpTargetFiles},${mtdLmNpColl},${mtdLmNpFiles},${appUsePct}%,${remaining}\n`;
                });

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `Admin_Performance_Summary_${Utils.getActiveMonth()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                UI.showSuccess('Summary Report Downloaded!');
            },

            // Helper to apply preset chips in Analytics
            applyAnalyticsPreset(preset) {
                const searchEl = document.getElementById('analytics-filter-search');
                const partEl = document.getElementById('analytics-filter-part');
                const terrEl = document.getElementById('analytics-filter-territory');
                const upzEl = document.getElementById('analytics-filter-upazila');
                const riskEl = document.getElementById('analytics-filter-risk');
                const payEl = document.getElementById('analytics-filter-paystatus');
                const odEl = document.getElementById('analytics-filter-odamount');
                const sortEl = document.getElementById('analytics-filter-sort');

                if (searchEl) searchEl.value = '';
                if (partEl) partEl.value = 'All';
                if (terrEl) terrEl.value = 'All';
                if (upzEl) upzEl.value = 'All';
                if (riskEl) riskEl.value = 'All';
                if (payEl) payEl.value = 'All';
                if (odEl) odEl.value = 'All';
                if (sortEl) sortEl.value = 'default';

                if (preset === 'critical') {
                    if (riskEl) riskEl.value = 'Critical';
                    if (sortEl) sortEl.value = 'odinst_desc';
                } else if (preset === 'high_overdue') {
                    if (odEl) odEl.value = 'gt100k';
                    if (sortEl) sortEl.value = 'overdue_desc';
                } else if (preset === 'zero_mtd') {
                    if (payEl) payEl.value = 'Zero';
                    if (sortEl) sortEl.value = 'overdue_desc';
                } else if (preset === 'paid_mtd') {
                    if (payEl) payEl.value = 'Paid';
                    if (sortEl) sortEl.value = 'mtd_desc';
                }

                UI.renderAdminInDepthAnalytics();
            },

            // --- IN-DEPTH ANALYTICS ---
            renderAdminInDepthAnalytics() {
                const db = Store.get();
                const customers = db.customers || [];
                const territories = db.territories || [];

                // Advanced Filter States
                const filterSearch = (document.getElementById('analytics-filter-search')?.value || '').toLowerCase().trim();
                const filterPart = document.getElementById('analytics-filter-part')?.value || 'All';
                const filterTerritory = document.getElementById('analytics-filter-territory')?.value || 'All';
                const filterUpazila = document.getElementById('analytics-filter-upazila')?.value || 'All';
                const filterRisk = document.getElementById('analytics-filter-risk')?.value || 'All';
                const filterPayStatus = document.getElementById('analytics-filter-paystatus')?.value || 'All';
                const filterOdAmount = document.getElementById('analytics-filter-odamount')?.value || 'All';
                const filterSort = document.getElementById('analytics-filter-sort')?.value || 'default';

                // We want to calculate analytics on customers.
                let analyticsData = customers.map(c => {
                    const parseCleanFloat = (val) => {
                        if (val === undefined || val === null) return 0;
                        const cleanStr = String(val).replace(/[^0-9.-]/g, '');
                        const num = parseFloat(cleanStr);
                        return isNaN(num) ? 0 : num;
                    };

                    const parseCleanDate = (val) => {
                        if (!val || val === '-') return '-';
                        let str = String(val).trim();
                        if (!str || str === '-') return '-';
                        if (/^\d{5}$/.test(str)) {
                            const excelNum = parseInt(str);
                            const dateObj = new Date((excelNum - (25567 + 2)) * 86400 * 1000);
                            if (!isNaN(dateObj.getTime())) {
                                return dateObj.toISOString().split('T')[0];
                            }
                        }
                        if (str.includes('T')) str = str.split('T')[0];
                        if (str.includes(' ')) str = str.split(' ')[0];
                        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
                            const parts = str.split(/[\/\-]/);
                            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        }
                        return str;
                    };
                    
                    const overdueAmt = parseCleanFloat(c.overdueTaka || c.overdue_taka);
                    const overdueInst = parseInt(parseCleanFloat(c.overdueInstNo || c.overdue_inst_no)) || 0;
                    const outstanding = parseCleanFloat(c.totalOutstanding || c.total_outstanding);
                    const instSize = parseCleanFloat(c.instSize || c.inst_size);
                    const collectedMTD = parseCleanFloat(c.collectedMTD || c.collected_mtd);
                    const m1 = parseCleanFloat(c.last3Month1 || c.last_3_month_1 || c.pay_m1 || c.payM1);
                    const m2 = parseCleanFloat(c.last3Month2 || c.last_3_month_2 || c.pay_m2 || c.payM2);
                    const m3 = parseCleanFloat(c.last3Month3 || c.last_3_month_3 || c.pay_m3 || c.payM3);
                    const lastPayDate = parseCleanDate(c.lastPaymentDate || c.last_payment_date || c.lastPayDate || c.last_pay_date);
                    const firstInstDate = parseCleanDate(c.firstInstDate || c.first_inst_date);

                    const upazilaText = c.upazilaName || c.upazila_name || '';
                    const upazilaCodeText = c.upazilaCode || c.upazila_code || '';
                    const displayUpazila = upazilaText ? (upazilaCodeText ? `${upazilaText} (${upazilaCodeText})` : upazilaText) : (upazilaCodeText || '-');

                    // Risk category
                    let riskCategory = 'Safe';
                    if (overdueInst > 2) riskCategory = 'Critical';
                    else if (overdueInst > 0 || overdueAmt > 0) riskCategory = 'At-Risk';
                    
                    // territory Name and Part
                    let tName = c.territoryName || c.territory_name || 'Unknown';
                    let tPart = 'Unknown';
                    
                    if (tName && /^\d+$/.test(String(tName).trim())) {
                        const tMatch = territories.find(t => String(t.id) === String(tName).trim());
                        if (tMatch) {
                            tName = tMatch.name;
                            tPart = tMatch.part || 'Unknown';
                        }
                    } else {
                        const tMatch = territories.find(t => String(t.name).toLowerCase() === String(tName).toLowerCase().trim());
                        if (tMatch) {
                            tPart = tMatch.part || 'Unknown';
                        }
                    }

                    return {
                        ...c,
                        overdueAmt, overdueInst, outstanding, instSize, collectedMTD,
                        m1, m2, m3, lastPayDate, firstInstDate, displayUpazila,
                        riskCategory,
                        territoryName: tName,
                        part: tPart
                    };
                });

                // Extract all unique Upazilas for dropdown
                const uniqueUpazilas = Array.from(new Set(analyticsData.map(c => c.displayUpazila))).filter(u => u && u !== '-').sort();

                // Apply Advanced Filters
                let filteredData = analyticsData;

                if (filterSearch) {
                    filteredData = filteredData.filter(c => 
                        String(c.customerId || '').toLowerCase().includes(filterSearch) ||
                        String(c.customerName || '').toLowerCase().includes(filterSearch) ||
                        String(c.phone || '').toLowerCase().includes(filterSearch) ||
                        String(c.vehicleRegNo || c.vehicle_reg_no || '').toLowerCase().includes(filterSearch)
                    );
                }

                if (filterPart !== 'All') filteredData = filteredData.filter(c => c.part === filterPart);
                if (filterTerritory !== 'All') filteredData = filteredData.filter(c => c.territoryName === filterTerritory);
                if (filterUpazila !== 'All') filteredData = filteredData.filter(c => c.displayUpazila === filterUpazila);
                if (filterRisk !== 'All') filteredData = filteredData.filter(c => c.riskCategory === filterRisk);

                if (filterPayStatus === 'Paid') filteredData = filteredData.filter(c => c.collectedMTD >= c.instSize && c.instSize > 0);
                else if (filterPayStatus === 'Partial') filteredData = filteredData.filter(c => c.collectedMTD > 0 && c.collectedMTD < c.instSize);
                else if (filterPayStatus === 'Zero') filteredData = filteredData.filter(c => c.collectedMTD === 0);

                if (filterOdAmount === 'gt0') filteredData = filteredData.filter(c => c.overdueAmt > 0);
                else if (filterOdAmount === 'gt50k') filteredData = filteredData.filter(c => c.overdueAmt >= 50000);
                else if (filterOdAmount === 'gt100k') filteredData = filteredData.filter(c => c.overdueAmt >= 100000);
                else if (filterOdAmount === 'gt500k') filteredData = filteredData.filter(c => c.overdueAmt >= 500000);

                // Advanced Sorting
                if (filterSort === 'overdue_desc') filteredData.sort((a, b) => b.overdueAmt - a.overdueAmt);
                else if (filterSort === 'outstanding_desc') filteredData.sort((a, b) => b.outstanding - a.outstanding);
                else if (filterSort === 'odinst_desc') filteredData.sort((a, b) => b.overdueInst - a.overdueInst);
                else if (filterSort === 'mtd_desc') filteredData.sort((a, b) => b.collectedMTD - a.collectedMTD);

                // Compute Metrics on Filtered Data
                const totalCust = filteredData.length;
                const totalOut = filteredData.reduce((s, c) => s + c.outstanding, 0);
                const totalOD = filteredData.reduce((s, c) => s + c.overdueAmt, 0);
                
                const safeCount = filteredData.filter(c => c.riskCategory === 'Safe').length;
                const riskCount = filteredData.filter(c => c.riskCategory === 'At-Risk').length;
                const criticalCount = filteredData.filter(c => c.riskCategory === 'Critical').length;

                const safePct = totalCust > 0 ? ((safeCount / totalCust) * 100).toFixed(1) : 0;
                const riskPct = totalCust > 0 ? ((riskCount / totalCust) * 100).toFixed(1) : 0;
                const criticalPct = totalCust > 0 ? ((criticalCount / totalCust) * 100).toFixed(1) : 0;

                // Active Filter Count
                const hasActiveFilters = Boolean(filterSearch || filterPart !== 'All' || filterTerritory !== 'All' || filterUpazila !== 'All' || filterRisk !== 'All' || filterPayStatus !== 'All' || filterOdAmount !== 'All' || filterSort !== 'default');

                // Build Part A / B metrics (only if filterPart is All)
                let partHtml = '';
                if (filterPart === 'All') {
                    const partACust = analyticsData.filter(c => c.part === 'A');
                    const partBCust = analyticsData.filter(c => c.part === 'B');
                    
                    const partAOut = partACust.reduce((s, c) => s + c.outstanding, 0);
                    const partBOut = partBCust.reduce((s, c) => s + c.outstanding, 0);
                    const totalPartsOut = partAOut + partBOut || 1;

                    const aPct = ((partAOut / totalPartsOut) * 100).toFixed(1);
                    const bPct = ((partBOut / totalPartsOut) * 100).toFixed(1);

                    partHtml = `
                    <div class="xl:col-span-3 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col justify-center">
                        <div class="flex justify-between items-center mb-1">
                            <h3 class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Part Exposure</h3>
                            <span class="text-[9px] font-bold text-slate-400">Outstanding</span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 w-9">PART A</span>
                                <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                    <div class="bg-emerald-500 h-full transition-all duration-700" style="width: ${aPct}%"></div>
                                </div>
                                <span class="text-[9px] font-mono font-bold text-slate-500 w-8 text-right">${aPct}%</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[9px] font-black text-indigo-600 dark:text-indigo-400 w-9">PART B</span>
                                <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                    <div class="bg-indigo-500 h-full transition-all duration-700" style="width: ${bPct}%"></div>
                                </div>
                                <span class="text-[9px] font-mono font-bold text-slate-500 w-8 text-right">${bPct}%</span>
                            </div>
                        </div>
                    </div>
                    `;
                }

                // Render Table rows
                const rowsHtml = filteredData.slice(0, 100).map(c => {
                    let riskBadge = '';
                    if (c.riskCategory === 'Critical') riskBadge = '<span class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 font-black text-[10px]">CRITICAL</span>';
                    else if (c.riskCategory === 'At-Risk') riskBadge = '<span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 font-black text-[10px]">AT-RISK</span>';
                    else riskBadge = '<span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black text-[10px]">SAFE</span>';

                    return `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
                            <td class="px-2.5 py-2 font-semibold text-slate-700 dark:text-slate-200">
                                <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]">${c.territoryName} (${c.part})</span>
                            </td>
                            <td class="px-2.5 py-2 text-slate-500 text-xs">${c.displayUpazila}</td>
                            <td class="px-2.5 py-2 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${c.customerId || c.customer_id || '-'}</td>
                            <td class="px-2.5 py-2 font-semibold text-slate-800 dark:text-slate-200 text-xs">${c.customerName || '-'}</td>
                            <td class="px-2.5 py-2 font-mono text-slate-500 text-xs">${c.phone || '-'}</td>
                            <td class="px-2.5 py-2 font-mono text-slate-600 dark:text-slate-300 text-xs">${c.vehicleRegNo || c.vehicle_reg_no || '-'}</td>
                            <td class="px-2.5 py-2 text-slate-500 text-xs">${c.firstInstDate}</td>
                            <td class="px-2.5 py-2 text-right font-mono text-xs">${Math.round(c.instSize).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-right font-mono font-black bg-emerald-50/50 dark:bg-emerald-950/20 ${c.collectedMTD > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">${Math.round(c.collectedMTD).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">${c.latestCollectionDate || '-'}</td>
                            <td class="px-2.5 py-2 text-center font-mono font-bold ${c.overdueInst > 2 ? 'text-rose-600' : (c.overdueInst > 0 ? 'text-amber-500' : 'text-slate-400')} text-xs">${c.overdueInst}</td>
                            <td class="px-2.5 py-2 text-right font-mono font-bold ${c.overdueAmt > 0 ? 'text-rose-500' : 'text-slate-400'} text-xs">${Math.round(c.overdueAmt).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-right font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">${Math.round(c.outstanding).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-slate-500 text-xs">${c.lastPayDate}</td>
                            <td class="px-2.5 py-2 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">${Math.round(c.m1).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">${Math.round(c.m2).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">${Math.round(c.m3).toLocaleString()}</td>
                            <td class="px-2.5 py-2 text-center">${riskBadge}</td>
                        </tr>
                    `;
                }).join('');

                const tableNote = filteredData.length > 100 ? `<div class="p-2 text-center text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/30">Showing top 100 rows out of ${filteredData.length.toLocaleString()} matches. Apply filters to narrow down.</div>` : '';

                // Build HTML
                const container = document.getElementById('views-container');
                container.innerHTML = `
                    <div class="animate-entry space-y-3 pb-8">
                        <!-- Header & Control Bar -->
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                            <div class="flex items-center gap-2">
                                <h1 class="text-base font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
                                    <i class="fa-solid fa-chart-network text-indigo-500 text-sm"></i> In-depth Analytics
                                </h1>
                            </div>

                            <!-- Live Search Input -->
                            <div class="relative flex-1 max-w-xs w-full">
                                <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input id="analytics-filter-search" type="text" value="${filterSearch}" placeholder="Search ID, Name, Phone, Reg..." oninput="UI.renderAdminInDepthAnalytics()" class="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500">
                            </div>

                            <!-- Quick Preset Chips -->
                            <div class="flex flex-wrap items-center gap-1.5">
                                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider hidden xl:inline">Presets:</span>
                                <button onclick="UI.applyAnalyticsPreset('critical')" class="px-2 py-0.5 rounded-md text-[10px] font-bold transition ${filterRisk === 'Critical' ? 'bg-rose-500 text-white shadow-sm' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'}">🔥 3+ OD</button>
                                <button onclick="UI.applyAnalyticsPreset('high_overdue')" class="px-2 py-0.5 rounded-md text-[10px] font-bold transition ${filterOdAmount === 'gt100k' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'}">⚠️ >100k OD</button>
                                <button onclick="UI.applyAnalyticsPreset('paid_mtd')" class="px-2 py-0.5 rounded-md text-[10px] font-bold transition ${filterPayStatus === 'Paid' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'}">✅ Paid MTD</button>
                                <button onclick="UI.applyAnalyticsPreset('zero_mtd')" class="px-2 py-0.5 rounded-md text-[10px] font-bold transition ${filterPayStatus === 'Zero' ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">❌ Zero MTD</button>
                            </div>

                            <button onclick="Router.navigate('admin-dashboard')" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-bold transition-all shadow-sm">
                                <i class="fa-solid fa-arrow-left mr-1"></i> Dashboard
                            </button>
                        </div>

                        <!-- Advanced Dropdown Filter Bar -->
                        <div class="flex flex-wrap items-center gap-2 bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <div class="flex items-center gap-1 mr-1">
                                <i class="fa-solid fa-sliders text-indigo-500 text-xs"></i>
                                <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">Filters:</span>
                            </div>

                            <!-- Part Filter -->
                            <select id="analytics-filter-part" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="All" ${filterPart === 'All' ? 'selected' : ''}>All Parts</option>
                                <option value="A" ${filterPart === 'A' ? 'selected' : ''}>Part A</option>
                                <option value="B" ${filterPart === 'B' ? 'selected' : ''}>Part B</option>
                            </select>
                            
                            <!-- Territory Filter -->
                            <select id="analytics-filter-territory" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 max-w-[130px]">
                                <option value="All" ${filterTerritory === 'All' ? 'selected' : ''}>All Territories</option>
                                ${Array.from(new Set(analyticsData.map(c => c.territoryName))).filter(t => t && t !== 'Unknown').sort().map(t => `<option value="${t}" ${filterTerritory === t ? 'selected' : ''}>${t}</option>`).join('')}
                            </select>

                            <!-- Upazila Filter -->
                            <select id="analytics-filter-upazila" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 max-w-[140px]">
                                <option value="All" ${filterUpazila === 'All' ? 'selected' : ''}>All Upazilas</option>
                                ${uniqueUpazilas.map(u => `<option value="${u}" ${filterUpazila === u ? 'selected' : ''}>${u}</option>`).join('')}
                            </select>

                            <!-- Risk Filter -->
                            <select id="analytics-filter-risk" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="All" ${filterRisk === 'All' ? 'selected' : ''}>All Risk Levels</option>
                                <option value="Safe" ${filterRisk === 'Safe' ? 'selected' : ''}>Safe (0 OD)</option>
                                <option value="At-Risk" ${filterRisk === 'At-Risk' ? 'selected' : ''}>At-Risk (1-2 OD)</option>
                                <option value="Critical" ${filterRisk === 'Critical' ? 'selected' : ''}>Critical (3+ OD)</option>
                            </select>

                            <!-- Payment Status Filter -->
                            <select id="analytics-filter-paystatus" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="All" ${filterPayStatus === 'All' ? 'selected' : ''}>All Pay Status</option>
                                <option value="Paid" ${filterPayStatus === 'Paid' ? 'selected' : ''}>Paid MTD</option>
                                <option value="Partial" ${filterPayStatus === 'Partial' ? 'selected' : ''}>Partial MTD</option>
                                <option value="Zero" ${filterPayStatus === 'Zero' ? 'selected' : ''}>Zero MTD</option>
                            </select>

                            <!-- Overdue Amount Range Filter -->
                            <select id="analytics-filter-odamount" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="All" ${filterOdAmount === 'All' ? 'selected' : ''}>All Overdue Tk</option>
                                <option value="gt0" ${filterOdAmount === 'gt0' ? 'selected' : ''}>> 0 Overdue</option>
                                <option value="gt50k" ${filterOdAmount === 'gt50k' ? 'selected' : ''}>> 50k Overdue</option>
                                <option value="gt100k" ${filterOdAmount === 'gt100k' ? 'selected' : ''}>> 100k Overdue</option>
                                <option value="gt500k" ${filterOdAmount === 'gt500k' ? 'selected' : ''}>> 500k Overdue</option>
                            </select>

                            <!-- Sort By Dropdown -->
                            <select id="analytics-filter-sort" onchange="UI.renderAdminInDepthAnalytics()" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 ml-auto">
                                <option value="default" ${filterSort === 'default' ? 'selected' : ''}>Sort: Default</option>
                                <option value="overdue_desc" ${filterSort === 'overdue_desc' ? 'selected' : ''}>Sort: Highest Overdue</option>
                                <option value="outstanding_desc" ${filterSort === 'outstanding_desc' ? 'selected' : ''}>Sort: Highest Outstanding</option>
                                <option value="odinst_desc" ${filterSort === 'odinst_desc' ? 'selected' : ''}>Sort: Most OD Inst</option>
                                <option value="mtd_desc" ${filterSort === 'mtd_desc' ? 'selected' : ''}>Sort: Highest MTD Coll</option>
                            </select>
                            
                            ${hasActiveFilters ? 
                                `<button onclick="UI.applyAnalyticsPreset('clear')" class="text-[9px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest px-1.5 bg-rose-50 dark:bg-rose-950/30 rounded py-0.5">Reset</button>` 
                            : ''}
                        </div>

                        <!-- Combined Single-Row Analytics Header (Stat Cards + Progress Bars in 1 Line) -->
                        <div class="grid grid-cols-1 xl:grid-cols-12 gap-2.5 items-stretch">
                            <!-- Stat Cards Grid (6 cols) -->
                            <div class="xl:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Customers</h3>
                                    <div class="text-base font-black text-slate-800 dark:text-white mt-0.5">${totalCust.toLocaleString()}</div>
                                </div>
                                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Outstanding</h3>
                                    <div class="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">৳${(totalOut / 1000000).toFixed(2)}M</div>
                                </div>
                                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Overdue</h3>
                                    <div class="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">৳${(totalOD / 1000000).toFixed(2)}M</div>
                                </div>
                                <div class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                    <h3 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">Critical Risk</h3>
                                    <div class="text-base font-black text-amber-500 mt-0.5">${criticalCount} <span class="text-[10px] text-slate-400 font-normal">accts</span></div>
                                </div>
                            </div>

                            <!-- Part Exposure Progress Bars (3 cols) -->
                            ${partHtml}

                            <!-- Risk Breakdown Progress Bar (3 cols or 6 cols) -->
                            <div class="${filterPart === 'All' ? 'xl:col-span-3' : 'xl:col-span-6'} bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col justify-center">
                                <div class="flex justify-between items-center mb-1">
                                    <h3 class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Risk Profile</h3>
                                    <span class="text-[9px] font-bold text-slate-400">Accounts</span>
                                </div>
                                <div class="w-full h-2 rounded flex overflow-hidden shadow-inner mb-1.5">
                                    <div class="bg-emerald-500 h-full" style="width: ${safePct}%" title="Safe: ${safeCount} (${safePct}%)"></div>
                                    <div class="bg-amber-400 h-full" style="width: ${riskPct}%" title="At-Risk: ${riskCount} (${riskPct}%)"></div>
                                    <div class="bg-rose-500 h-full" style="width: ${criticalPct}%" title="Critical: ${criticalCount} (${criticalPct}%)"></div>
                                </div>
                                <div class="flex justify-between items-center text-[9px] font-extrabold text-slate-600 dark:text-slate-300">
                                    <span class="text-emerald-600 dark:text-emerald-400">Safe ${safePct}%</span>
                                    <span class="text-amber-600 dark:text-amber-400">Risk ${riskPct}%</span>
                                    <span class="text-rose-600 dark:text-rose-400">Crit ${criticalPct}%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Data Table -->
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h2 class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight">Customer Analytics List</h2>
                                <span class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-black border border-indigo-100 dark:border-indigo-800/50">${filteredData.length} Matches</span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                            <th class="px-2.5 py-2">Territory</th>
                                            <th class="px-2.5 py-2">Upazila</th>
                                            <th class="px-2.5 py-2">Cust ID</th>
                                            <th class="px-2.5 py-2">Name</th>
                                            <th class="px-2.5 py-2">Phone</th>
                                            <th class="px-2.5 py-2">Vehicle Reg</th>
                                            <th class="px-2.5 py-2">First Inst</th>
                                            <th class="px-2.5 py-2 text-right">Inst Size</th>
                                            <th class="px-2.5 py-2 text-right">MTD Coll</th>
                                            <th class="px-2.5 py-2 text-center">Coll Date</th>
                                            <th class="px-2.5 py-2 text-center">OD Inst</th>
                                            <th class="px-2.5 py-2 text-right">OD Taka</th>
                                            <th class="px-2.5 py-2 text-right">Outstanding</th>
                                            <th class="px-2.5 py-2">Last Pay Date</th>
                                            <th class="px-2.5 py-2 text-right">Pay-M1</th>
                                            <th class="px-2.5 py-2 text-right">Pay-M2</th>
                                            <th class="px-2.5 py-2 text-right">Pay-M3</th>
                                            <th class="px-2.5 py-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                        ${rowsHtml || '<tr><td colspan="18" class="py-8 text-center text-xs font-medium text-slate-400">No customers match the current filters.</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                            ${tableNote}
                        </div>
                    </div>
                `;
            },

            // --- ADMIN VIEWS ---
            renderAdminDashboard(tableMode = 'compact') {
                const metrics = Calc.getMetrics();
                const db = Store.get();
                const customers = db.customers || [];
                const cutoffSetting = db.system_settings?.find(s => s.key === 'cutoff_extension_hours');
                const cutoffHours = parseInt(cutoffSetting?.value || 0);
                const activeMonth = db.system_settings?.find(s => s.key === 'active_month')?.value || 'N/A';

                // Initialize ranking filter state if not present
                UI.rankingSearchVal = UI.rankingSearchVal || '';
                UI.rankingPartVal = UI.rankingPartVal || 'All';

                // Initialize map interactive filter states if not present
                UI.mapPartFilter = UI.mapPartFilter || 'ALL';
                UI.mapTerritoryFilter = UI.mapTerritoryFilter || 'ALL';
                UI.mapMetricFilter = UI.mapMetricFilter || 'MTD';
                UI.mapViewMode = UI.mapViewMode && UI.mapViewMode !== 'UPAZILA' ? UI.mapViewMode : 'DISTRICT';
                UI.selectedTerritoryFilter = UI.selectedTerritoryFilter || null;

                // Calculate dynamic expected target achievement for the current day of the month
                const todayStr = Utils.getLocalDate();
                const [y, m, d] = todayStr.split('-').map(Number);
                const todayDate = new Date(y, m - 1, d);
                let expectedTarget = 100;
                if (activeMonth && activeMonth !== 'N/A') {
                    const activeLower = activeMonth.toLowerCase();
                    const curShortMonth = todayDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
                    const curLongMonth = todayDate.toLocaleString('en-US', { month: 'long' }).toLowerCase();
                    const curYear = todayDate.getFullYear().toString();
                    
                    if ((activeLower.includes(curShortMonth) || activeLower.includes(curLongMonth)) && activeLower.includes(curYear)) {
                        const day = todayDate.getDate();
                        const totalDays = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
                        expectedTarget = (day / totalDays) * 100;
                    }
                }

                // Calculate Today Achievement for Admin View
                const todayAch = metrics.todayProj > 0 ? ((metrics.todayColl / metrics.todayProj) * 100).toFixed(1) : (metrics.todayColl > 0 ? '100+' : '0.0');

                const allTerritoryData = db.territories.map(t => {
                    const m = Calc.getMetrics(t.id);
                    // Calculate Last Day Achievement for the new column
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    const tdAch = m.todayProj > 0 ? ((m.todayColl / m.todayProj) * 100).toFixed(1) : (m.todayColl > 0 ? '100+' : '0.0');
                    const appUsePct = Calc.getAppUsePercentage(t.id);
                    return { ...t, ...m, lastDayAch: ldAch, todayAch: tdAch, appUsePct };
                });

                // Helper to calculate totals
                const calculateTotals = (data) => {
                    const sums = {
                        targetFiles: 0, mtdProjFiles: 0, uniquePaidCodes: 0, tillDateNonPayFiles: 0,
                        targetAmt: 0, mtdProjRegular: 0, mtdProjAdvance: 0, mtdProjTotal: 0, mtdColl: 0,
                        presetProjReg: 0, presetProjAdv: 0, presetProjTotal: 0,
                        yestProjAmt: 0, yestProjFiles: 0, yestCollAmt: 0, yestCollFiles: 0,
                        lmNpTargetAmt: 0, lmNpTargetFiles: 0, mtdLmNpColl: 0, mtdLmNpFiles: 0,
                        todayProj: 0, todayColl: 0, appUsePct: 0
                    };

                    data.forEach(t => {
                        sums.targetFiles += parseInt(t.targetFiles) || 0;
                        sums.mtdProjFiles += parseInt(t.mtdProjFiles) || 0;
                        sums.uniquePaidCodes += parseInt(t.uniquePaidCodes) || 0;
                        sums.tillDateNonPayFiles += parseInt(t.tillDateNonPayFiles) || 0;
                        sums.targetAmt += parseFloat(t.targetAmt) || 0;
                        sums.mtdProjRegular += parseFloat(t.mtdProjRegular) || 0;
                        sums.mtdProjAdvance += parseFloat(t.mtdProjAdvance) || 0;
                        sums.mtdProjTotal += parseFloat(t.mtdProjTotal) || 0;
                        sums.mtdColl += parseFloat(t.mtdColl) || 0;
                        sums.yestProjAmt += parseFloat(t.yestProjAmt) || 0;
                        sums.yestProjFiles += parseInt(t.yestProjFiles) || 0;
                        sums.yestCollAmt += parseFloat(t.yestCollAmt) || 0;
                        sums.yestCollFiles += parseInt(t.yestCollFiles) || 0;
                        sums.lmNpTargetAmt += parseFloat(t.lmNpTargetAmt) || 0;
                        sums.lmNpTargetFiles += parseInt(t.lmNpTargetFiles) || 0;
                        sums.mtdLmNpColl += parseFloat(t.mtdLmNpColl) || 0;
                        sums.mtdLmNpFiles += parseInt(t.mtdLmNpFiles) || 0;
                        sums.todayProj += parseFloat(t.todayProj) || 0;
                        sums.todayColl += parseFloat(t.todayColl) || 0;
                        sums.presetProjReg += parseFloat(t.presetProjReg) || 0;
                        sums.presetProjAdv += parseFloat(t.presetProjAdv) || 0;
                        sums.presetProjTotal += parseFloat(t.presetProjTotal) || 0;
                    });

                    // Derived Metrics for Totals
                    sums.tillDayAchievement = sums.presetProjTotal > 0 ? ((sums.mtdColl / sums.presetProjTotal) * 100).toFixed(1) : '0.0';
                    sums.achievement = sums.tillDayAchievement;
                    sums.emiAchievement = sums.targetAmt > 0 ? ((sums.mtdColl / sums.targetAmt) * 100).toFixed(1) : '0.0';
                    sums.lastDayAch = sums.yestProjAmt > 0 ? ((sums.yestCollAmt / sums.yestProjAmt) * 100).toFixed(1) : '0.0';
                    sums.todayAch = sums.todayProj > 0 ? ((sums.todayColl / sums.todayProj) * 100).toFixed(1) : (sums.todayColl > 0 ? '100+' : '0.0');

                    const cureRate = sums.targetFiles > 0 ? (sums.uniquePaidCodes / sums.targetFiles) * 100 : 0;
                    const lmNpRecPct = sums.lmNpTargetAmt > 0 ? (sums.mtdLmNpColl / sums.lmNpTargetAmt) * 100 : 0;

                    let projAcc = 0;
                    if (sums.todayProj > 0) {
                        const diff = Math.abs(sums.todayProj - sums.todayColl);
                        projAcc = Math.max(0, (1 - (diff / sums.todayProj)) * 100);
                    } else if (sums.todayColl > 0) {
                        projAcc = 0;
                    } else {
                        projAcc = 100;
                    }

                    // Weighted RPI for Group
                    sums.rpi = Math.min(100, (parseFloat(sums.achievement) * 0.7) + (projAcc * 0.1) + (lmNpRecPct * 0.1) + (cureRate * 0.1)).toFixed(1);
                    
                    // App Use Group Average
                    sums.appUsePct = data.length > 0 ? Number((data.reduce((sum, item) => sum + (parseFloat(item.appUsePct) || 0), 0) / data.length).toFixed(1)) : 0;

                    return sums;
                };

                // Calculate global ranks for dynamic top/middle/bottom groups across ALL territories
                const sortedAll = [...allTerritoryData].sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));
                const totalCount = sortedAll.length;
                sortedAll.forEach((t, i) => {
                    if (i < Math.ceil(totalCount / 3)) {
                        t.globalGroup = 'top';
                    } else if (i < Math.ceil(totalCount * 2 / 3)) {
                        t.globalGroup = 'middle';
                    } else {
                        t.globalGroup = 'bottom';
                    }
                });

                // Group Data sorted by MTD Achievement % from top to bottom
                const partAData = allTerritoryData.filter(t => t.part === 'A').sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));
                const partBData = allTerritoryData.filter(t => t.part === 'B').sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));

                const totalA = calculateTotals(partAData);
                const totalB = calculateTotals(partBData);

                // Split all territories into top and bottom halves based on till date collection ach%
                const sortedAllPerformers = [...allTerritoryData].sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));
                const halfCount = Math.ceil(sortedAllPerformers.length / 2);
                
                const topHalf = sortedAllPerformers.slice(0, halfCount);
                const bottomHalf = sortedAllPerformers.slice(halfCount);
                
                // Sort bottom half ascending (worst performer first) for Critical list
                const bottomHalfSorted = [...bottomHalf].sort((a, b) => parseFloat(a.tillDayAchievement || 0) - parseFloat(b.tillDayAchievement || 0));

                const today = new Date();

                const modes = ['Bank Transfer', 'bKash', 'Cheque', 'Cash'];
                const modeData = modes.map(m => db.collections.filter(c => (c.activeMonth || c.active_month || c.date.slice(0, 7)) === Utils.getActiveMonth() && c.mode === m).reduce((s, c) => s + parseFloat(c.amount), 0));

                const container = document.getElementById('views-container');
                const isCompact = tableMode === 'compact';

                container.innerHTML = `
                    <div class="animate-entry space-y-4"> 
                        
                        <!-- DASHBOARD HEADER ACTIONS -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                            <div class="flex flex-wrap items-center gap-2">
                                    ${cutoffHours > 0 ? `
                                        <div class="flex items-center px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg text-amber-700 dark:text-amber-400 text-[10px] font-black tracking-wide shadow-sm">
                                            <span class="relative flex h-2 w-2 mr-2">
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                            EXTENDED CUTOFF: +${cutoffHours}H
                                        </div>
                                    ` : ''}
                                    <div class="flex items-center px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/30 rounded-lg text-brand-700 dark:text-brand-400 text-[10px] font-black tracking-wide shadow-sm">
                                        <i class="fa-solid fa-calendar-day mr-2 opacity-70"></i>
                                        ACTIVE MONTH: ${activeMonth}
                                    </div>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <button onclick="UI.openSystemSettingsModal()" class="flex items-center h-8 px-3 bg-white/45 dark:bg-slate-900/30 backdrop-blur-sm border border-white/10 dark:border-slate-700/30 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all font-semibold text-xs shadow-sm hover-lift">
                                    <i class="fa-solid fa-gear mr-1.5 opacity-80"></i> Settings
                                </button>
                                <button onclick="UI.captureDashboard()" class="flex items-center h-8 px-3 bg-white/45 dark:bg-slate-900/30 backdrop-blur-sm border border-white/10 dark:border-slate-700/30 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all font-semibold text-xs shadow-sm hover-lift hidden md:flex">
                                    <i class="fa-solid fa-camera-retro mr-1.5 opacity-80"></i> Capture
                                </button>
                                <button onclick="UI.downloadAdminSummaryCSV()" class="flex items-center h-8 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold text-xs shadow-sm hover-lift relative overflow-hidden group">
                                    <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <i class="fa-solid fa-cloud-arrow-down mr-1.5 relative z-10 opacity-90"></i> <span class="relative z-10">Summary Data</span>
                                </button>
                                <button onclick="Router.navigate('admin-in-depth-analytics')" class="flex items-center h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-semibold text-xs shadow-sm hover-lift relative overflow-hidden group border border-indigo-500/30">
                                    <div class="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <i class="fa-solid fa-chart-network mr-1.5 relative z-10 text-indigo-100"></i>
                                    <span class="relative z-10 font-bold">In-depth Analytics</span>
                                </button>
                                <button onclick="Router.navigate('admin-performance')" class="flex items-center h-8 px-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all font-semibold text-xs shadow-sm hover-lift">
                                    <i class="fa-solid fa-chart-line mr-1.5 opacity-90"></i> Performance Analytics
                                </button>
                            </div>
                        </div>
                        
                        <!-- UNIFIED EXECUTIVE CONTROL CENTER (LEFT: SUMMARY & RPI, RIGHT: MAP) -->
                        <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
                            <!-- LEFT COLUMN: RPI BANNER, METRIC TABLE & PART CARDS (8 Cols) -->
                            <div class="xl:col-span-9 flex flex-col gap-3.5">
                                <!-- GLOBAL RPI BANNER -->
                                <div onclick="UI.showRPICriteriaModal()" class="py-2.5 px-4 rounded-2xl border ${Calc.getRPIBg(metrics.rpi)} shadow-xs hover-lift relative overflow-hidden group cursor-pointer" title="Click to view marking criteria">
                                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>

                                    <div class="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">Global Recovery Index (RPI)</h3>
                                            <p class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black leading-none mt-0.5">Aggregate Performance across all territories</p>
                                        </div>
                                        <div class="text-xl font-black ${Calc.getRPIColor(metrics.rpi)} leading-none">${metrics.rpi}</div>
                                    </div>
                                    
                                    <div class="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700/30 flex items-center justify-between gap-3">
                                        <div class="flex items-center gap-1.5 leading-none">
                                            <span class="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Till Date Achievement</span>
                                            <span class="text-[10px] font-black text-brand-600 dark:text-brand-400">${metrics.tillDayAchievement}%</span>
                                        </div>
                                        <div class="flex-1 max-w-[160px] sm:max-w-[200px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200/20 dark:border-slate-700/20">
                                            <div class="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" style="width: ${Math.min(100, Math.max(0, parseFloat(metrics.tillDayAchievement)))}%"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- COMPACT METRIC TABLE -->
                                <div class="overflow-hidden rounded-2xl shadow-sm border border-white/20 bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 text-white relative group">
                                    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-25 pointer-events-none"></div>
                                    
                                    <table class="w-full text-xs text-left border-collapse relative z-10">
                                        <tbody class="divide-y divide-white/20">
                                            <!-- Row 1 -->
                                            <tr class="hover:bg-white/10 transition duration-300">
                                                <td class="px-2.5 py-1.5 border-r border-white/20 w-1/4">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Total Target (proj)</span>
                                                        <span class="font-black text-white">${parseInt(metrics.presetProjTotal).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20 w-1/4">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Total Files</span>
                                                        <span class="font-black text-white">${metrics.targetFiles}</span>
                                                    </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20 w-1/4">
                                                     <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Today Proj</span>
                                                        <span class="font-black text-white">${parseInt(metrics.todayProj).toLocaleString()}</span>
                                                     </div>
                                                </td>
                                                <td class="p-2.5 w-1/4">
                                                     <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Remaining</span>
                                                        <span class="font-black text-amber-200">${parseInt(metrics.remainingAmt).toLocaleString()}</span>
                                                     </div>
                                                </td>
                                            </tr>
                                            <!-- Row 2 -->
                                            <tr class="hover:bg-white/10 transition duration-300">
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Till Date Coll</span>
                                                        <span class="font-black text-green-200">${parseInt(metrics.mtdColl).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Coll Files</span>
                                                        <span class="font-black text-green-200">${metrics.uniquePaidCodes}</span>
                                                    </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Collection</span>
                                                        <span class="font-black text-green-200">${parseInt(metrics.todayColl).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td class="p-2.5">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Daily Req</span>
                                                        <span class="font-black text-red-200">${parseInt(Math.round(metrics.rdrr)).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <!-- Row 3 -->
                                            <tr class="hover:bg-white/10 transition duration-300">
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Ach % (MTD)</span>
                                                        <span class="font-black text-blue-100">${metrics.tillDayAchievement}%</span>
                                                    </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                     <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Uncollected</span>
                                                        <span class="font-black text-red-200">${metrics.tillDateNonPayFiles}</span>
                                                     </div>
                                                </td>
                                                <td class="px-2.5 py-1.5 border-r border-white/20">
                                                     <div class="flex justify-between items-center">
                                                        <span class="text-white/80 font-bold uppercase tracking-widest text-[10px]">Ach % (Today)</span>
                                                        <span class="font-black text-fuchsia-200">${todayAch}%</span>
                                                     </div>
                                                </td>
                                                <td class="p-2.5 flex justify-center items-center opacity-90">
                                                    <div class="h-1.5 w-16 bg-white/25 rounded-full overflow-hidden border border-white/25 mt-1">
                                                        <div class="h-full bg-white rounded-full" style="width: ${Math.min(100, Math.max(0, todayAch))}%"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- PART A & PART B CARDS SIDE-BY-SIDE -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <!-- Part A Card -->
                                    <div class="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-card/70 backdrop-blur-sm border border-emerald-100/90 dark:border-emerald-950/60 shadow-xs group hover-lift transition-all">
                                         <div class="absolute -right-4 -top-4 opacity-5 transform rotate-12 transition-transform group-hover:scale-110 group-hover:opacity-10">
                                            <span class="text-7xl font-black text-emerald-900">A</span>
                                         </div>
                                         <div class="p-3.5 relative z-10">
                                            <div class="flex items-center justify-between mb-2.5">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shadow-2xs border border-emerald-500/20">A</div>
                                                    <div>
                                                        <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">Part A Recovery</h3>
                                                        <p class="text-[8px] text-slate-400 font-medium">North & Central Portfolio</p>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[7px] uppercase font-bold text-slate-400 tracking-wider">RPI Score</p>
                                                    <p class="text-xs font-black text-emerald-600 dark:text-emerald-400">${totalA.rpi}</p>
                                                </div>
                                            </div>
                                            
                                            <div class="grid grid-cols-2 gap-x-2 gap-y-1 mb-2.5 p-2 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 text-[11px]">
                                                <div>
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Target Amt</p>
                                                    <p class="font-bold text-slate-700 dark:text-slate-200">৳${parseInt(totalA.presetProjTotal).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Coll Amt</p>
                                                    <p class="font-bold text-emerald-600 dark:text-emerald-400">৳${parseInt(totalA.mtdColl).toLocaleString()}</p>
                                                </div>
                                                <div class="border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Today Proj</p>
                                                    <p class="font-semibold text-slate-600 dark:text-slate-300">৳${parseInt(totalA.todayProj).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Today Coll</p>
                                                    <p class="font-semibold text-emerald-600 dark:text-emerald-400">৳${parseInt(totalA.todayColl).toLocaleString()}</p>
                                                </div>
                                                <div class="border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Last Day Proj</p>
                                                    <p class="font-semibold text-slate-600 dark:text-slate-300">৳${parseInt(totalA.yestProjAmt).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Last Day Coll</p>
                                                    <p class="font-semibold text-emerald-600 dark:text-emerald-400">৳${parseInt(totalA.yestCollAmt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            
                                            <div class="space-y-0.5">
                                                <div class="flex justify-between text-[9px] font-semibold">
                                                    <span class="text-slate-500 dark:text-slate-400">Achievement</span>
                                                    <span class="text-emerald-600 dark:text-emerald-400">${totalA.tillDayAchievement}%</span>
                                                </div>
                                                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min(parseFloat(totalA.tillDayAchievement), 100)}%"></div>
                                                </div>
                                            </div>
                                         </div>
                                    </div>

                                    <!-- Part B Card -->
                                    <div class="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-card/70 backdrop-blur-sm border border-blue-100/90 dark:border-blue-950/60 shadow-xs group hover-lift transition-all">
                                         <div class="absolute -right-4 -top-4 opacity-5 transform rotate-12 transition-transform group-hover:scale-110 group-hover:opacity-10">
                                            <span class="text-7xl font-black text-blue-900">B</span>
                                         </div>
                                         <div class="p-3.5 relative z-10">
                                            <div class="flex items-center justify-between mb-2.5">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shadow-2xs border border-blue-500/20">B</div>
                                                    <div>
                                                        <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">Part B Recovery</h3>
                                                        <p class="text-[8px] text-slate-400 font-medium">South & East Portfolio</p>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[7px] uppercase font-bold text-slate-400 tracking-wider">RPI Score</p>
                                                    <p class="text-xs font-black text-blue-600 dark:text-blue-400">${totalB.rpi}</p>
                                                </div>
                                            </div>
                                            
                                            <div class="grid grid-cols-2 gap-x-2 gap-y-1 mb-2.5 p-2 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 text-[11px]">
                                                <div>
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Target Amt</p>
                                                    <p class="font-bold text-slate-700 dark:text-slate-200">৳${parseInt(totalB.presetProjTotal).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Coll Amt</p>
                                                    <p class="font-bold text-blue-600 dark:text-blue-400">৳${parseInt(totalB.mtdColl).toLocaleString()}</p>
                                                </div>
                                                <div class="border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Today Proj</p>
                                                    <p class="font-semibold text-slate-600 dark:text-slate-300">৳${parseInt(totalB.todayProj).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Today Coll</p>
                                                    <p class="font-semibold text-blue-600 dark:text-blue-400">৳${parseInt(totalB.todayColl).toLocaleString()}</p>
                                                </div>
                                                <div class="border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Last Day Proj</p>
                                                    <p class="font-semibold text-slate-600 dark:text-slate-300">৳${parseInt(totalB.yestProjAmt).toLocaleString()}</p>
                                                </div>
                                                <div class="text-right border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                                                    <p class="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Last Day Coll</p>
                                                    <p class="font-semibold text-blue-600 dark:text-blue-400">৳${parseInt(totalB.yestCollAmt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            
                                            <div class="space-y-0.5">
                                                <div class="flex justify-between text-[9px] font-semibold">
                                                    <span class="text-slate-500 dark:text-slate-400">Achievement</span>
                                                    <span class="text-blue-600 dark:text-blue-400">${totalB.tillDayAchievement}%</span>
                                                </div>
                                                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div class="bg-blue-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min(parseFloat(totalB.tillDayAchievement), 100)}%"></div>
                                                </div>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div> <!-- END LEFT COLUMN -->

                            <!-- RIGHT COLUMN: FULL-HEIGHT EXECUTIVE MAP CARD (3 Cols) -->
                            <div class="xl:col-span-3 self-start relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[420px]">
                                <!-- Neck to neck Map Canvas Box -->
                                <div class="w-full h-full flex-1 overflow-hidden relative flex flex-col bg-white dark:bg-slate-950">
                                    
                                    <!-- Floating Top-Left Controls: Removed as requested -->
                                    <div class="absolute top-3.5 left-3.5 z-[999] flex flex-wrap items-center gap-1.5 pointer-events-auto">
                                    </div>

                                    <!-- Floating Top-Right Controls: Metric Switcher -->
                                    <div class="absolute top-3.5 right-3.5 z-[999] flex flex-col items-end gap-2 pointer-events-auto">
                                        <div class="flex items-center gap-1.5">
                                            <!-- MTD vs Overdue Metric Filter Toggle -->
                                            <div class="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm gap-0.5">
                                                <button onclick="UI.toggleMapMetric('MTD')" class="px-2.5 py-0.5 text-[9px] font-black rounded-full transition-all duration-200 ${UI.mapMetricFilter === 'MTD' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}">MTD</button>
                                                <button onclick="UI.toggleMapMetric('OVERDUE')" class="px-2.5 py-0.5 text-[9px] font-black rounded-full transition-all duration-200 ${UI.mapMetricFilter === 'OVERDUE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}">OVERDUE</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Floating Legend Panel (Right Middle Vertical) -->
                                    <div class="absolute top-1/2 -translate-y-1/2 right-2.5 z-[999] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center gap-1.5 pointer-events-auto transition-all duration-300 hover:scale-105">
                                        <div class="font-black text-slate-500 dark:text-slate-400 text-[6px] tracking-tighter uppercase text-center leading-none" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                                            ${UI.mapMetricFilter === 'OVERDUE' ? 'OVERDUE' : 'COLLECTION'}
                                        </div>
                                        <div class="font-bold text-[6px] text-slate-400 mt-0.5">HIGH</div>
                                        <div class="w-1.5 h-16 rounded-full shadow-inner opacity-90" style="background: linear-gradient(to top, ${UI.mapMetricFilter === 'OVERDUE' ? 'hsl(140, 85%, 52%), hsl(70, 85%, 52%), hsl(0, 85%, 52%)' : 'hsl(0, 85%, 52%), hsl(70, 85%, 52%), hsl(140, 85%, 52%)'});"></div>
                                        <div class="font-bold text-[6px] text-slate-400 mb-0.5">LOW</div>
                                    </div>

                                    <!-- Selected Territory Indicator Badge Overlay -->
                                    <div id="map-territory-indicator" class="absolute top-16 left-3.5 z-[999] hidden pointer-events-auto"></div>

                                    <div id="admin-bd-map" class="w-full h-full min-h-[400px] flex-1 relative z-0" style="background: #ffffff !important;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel p-4 rounded-xl shadow-md dark:bg-dark-card border-t-4 border-brand-500">
                            <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                <div>
                                    <h3 class="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        Territory Performance Ranking
                                    </h3>
                                    <div class="text-xs text-slate-500 italic">Sorted by achievement from top to bottom. Color indicates status relative to current daily target.</div>
                                </div>
                                <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                    <!-- Overdue Toggle Button (Minimal & Animated) -->
                                    <button type="button" onclick="UI.toggleOdColumns()" id="toggle-od-btn" class="group relative px-2.5 py-0.5 h-7 text-[11px] font-bold rounded-lg border transition-all duration-350 ease-out flex items-center gap-1.5 shadow-sm overflow-hidden backdrop-blur-sm ${UI.showOdColumns ? 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'border-white/10 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/30 text-slate-650 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/40'}" title="Toggle Overdue Columns (Start of Month values)">
                                        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span class="relative flex h-1.5 w-1.5 shrink-0">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${UI.showOdColumns ? 'bg-emerald-400' : 'bg-slate-400 opacity-75'}"></span>
                                            <span class="relative inline-flex rounded-full h-1.5 w-1.5 ${UI.showOdColumns ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
                                        </span>
                                        <i class="fa-solid ${UI.showOdColumns ? 'fa-eye' : 'fa-eye-slash'} transition-transform duration-300 group-hover:scale-110"></i>
                                        <span class="relative">SOM Overdue</span>
                                    </button>

                                    <!-- Daily Req Toggle Button -->
                                    <button type="button" onclick="UI.toggleDailyReqColumn()" id="toggle-daily-req-btn" class="px-2.5 py-0.5 h-7 text-[11px] font-bold rounded-lg border transition-all duration-200 flex items-center gap-1.5 shadow-sm backdrop-blur-sm ${UI.showDailyReqColumn ? 'border-brand-500/30 bg-brand-500/10 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400' : 'border-white/10 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/30 text-slate-650 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/40'}" title="Toggle Daily Req Column">
                                        <i class="fa-solid ${UI.showDailyReqColumn ? 'fa-eye' : 'fa-eye-slash'}"></i>
                                        <span>Daily Req</span>
                                    </button>
                                    
                                    <!-- Search Input -->
                                    <div class="relative w-full sm:w-44">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                                            <i class="fa-solid fa-magnifying-glass text-[9px]"></i>
                                        </span>
                                        <input type="text" id="ranking-search" oninput="UI.filterRankingTable()" placeholder="Filter territory..." value="${UI.rankingSearchVal || ''}" class="w-full pl-7 pr-2.5 py-0.5 h-7 rounded-lg border border-white/10 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/30 text-[11px] font-medium text-slate-700 dark:text-slate-200 shadow-sm outline-none focus:border-brand-500/60 dark:focus:border-brand-500/60 transition-all backdrop-blur-sm">
                                    </div>
                                    
                                    <!-- Part Filter -->
                                    <div class="relative w-full sm:w-24">
                                        <select id="ranking-part-filter" onchange="UI.filterRankingTable()" class="w-full pl-2 pr-6 py-0.5 h-7 rounded-lg border border-white/10 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/30 text-[11px] font-bold text-slate-700 dark:text-slate-200 appearance-none shadow-sm cursor-pointer focus:border-brand-500/60 dark:focus:border-brand-500/60 transition-all backdrop-blur-sm">
                                            <option value="All" ${UI.rankingPartVal === 'All' ? 'selected' : ''}>All Parts</option>
                                            <option value="A" ${UI.rankingPartVal === 'A' ? 'selected' : ''}>Part A</option>
                                            <option value="B" ${UI.rankingPartVal === 'B' ? 'selected' : ''}>Part B</option>
                                        </select>
                                        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400 text-[9px]">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    
                                    <div class="flex items-center space-x-0.5 bg-white/30 dark:bg-slate-900/30 border border-white/10 dark:border-slate-700/30 p-0.5 rounded-lg backdrop-blur-sm">
                                        <button onclick="UI.renderAdminDashboard('compact')" class="px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${isCompact ? 'bg-white/80 dark:bg-slate-700/80 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                            <i class="fa-solid fa-compress mr-1"></i> Focused
                                        </button>
                                        <button onclick="UI.renderAdminDashboard('full')" class="px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${!isCompact ? 'bg-white/80 dark:bg-slate-700/80 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                            <i class="fa-solid fa-expand mr-1"></i> Detailed
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="overflow-auto max-h-[600px] border border-slate-200 dark:border-slate-700 rounded-xl relative shadow-inner scrollbar-thin">
                                <table class="w-full text-xs text-left border-collapse whitespace-nowrap">
                                    <thead class="text-slate-600 dark:text-slate-200 uppercase tracking-wider font-bold text-[11px]">
                                        <tr class="bg-slate-100 dark:bg-slate-700">
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 sticky top-0 left-0 bg-slate-100 dark:bg-slate-700 z-30 shadow-sm text-center">Part</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 sticky top-0 left-10 bg-slate-100 dark:bg-slate-700 z-30 shadow-sm">Territory</th>
                                            <th class="od-col ${UI.showOdColumns ? '' : 'hidden'} p-2 border border-red-800 dark:border-red-950 bg-red-800 dark:bg-red-950 text-white font-bold sticky top-0 z-20 text-center" title="Start of Month Per File Overdue">Per File OD <span class="text-[8px] font-medium text-red-200 block normal-case tracking-tight">SOM</span></th>
                                            <th class="od-col ${UI.showOdColumns ? '' : 'hidden'} p-2 border border-red-800 dark:border-red-950 bg-red-800 dark:bg-red-950 text-white font-bold sticky top-0 z-20 text-center" title="Start of Month Total Overdue">Total Overdue <span class="text-[8px] font-medium text-red-200 block normal-case tracking-tight">SOM</span></th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-blue-50 dark:bg-slate-800 sticky top-0 z-20">Total Files</th>
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-blue-50 dark:bg-slate-800 sticky top-0 z-20">Proj Files (MTD)</th>` : ''}
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-blue-50 dark:bg-slate-800 sticky top-0 z-20">Paid Files</th>
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-blue-50 dark:bg-slate-800 sticky top-0 z-20">Non-Pay Files</th>` : ''}
                                            
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 sticky top-0 z-20">Total EMI</th>
                                            
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 sticky top-0 z-20">Target Proj (Reg)</th>` : ''}
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 sticky top-0 z-20">Target Proj (Adv)</th>` : ''}
                                            
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 sticky top-0 z-20 font-bold">Total Proj</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-green-50 dark:bg-green-900 sticky top-0 z-20">Till Day Coll</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-blue-50 dark:bg-blue-900 sticky top-0 z-20">Ach %</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-rose-50 dark:bg-rose-950/60 sticky top-0 z-20 text-rose-600 dark:text-rose-400 font-bold">Remaining Tar.</th>
                                            <th class="daily-req-col ${UI.showDailyReqColumn ? '' : 'hidden'} p-2 border dark:border-slate-600 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold sticky top-0 z-20">Daily Req</th>
                                            
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 sticky top-0 z-20">Today's Proj</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-green-50 dark:bg-green-900 sticky top-0 z-20">Today's Coll</th>
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 font-bold sticky top-0 z-20">Today Ach %</th>
                                            
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-orange-50 dark:bg-orange-900 border-l-2 border-slate-200 dark:border-slate-600 sticky top-0 z-20">Last Day Proj Amt</th>
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-orange-50 dark:bg-orange-900 sticky top-0 z-20">Last Day Proj Files</th>` : ''}
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-orange-50 dark:bg-orange-900 sticky top-0 z-20">Last Day Coll Amt</th>
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-orange-50 dark:bg-orange-900 sticky top-0 z-20">Last Day Coll Files</th>` : ''}
                                            <th class="px-2.5 py-1.5 border dark:border-slate-600 bg-orange-100 dark:bg-orange-900 font-bold text-orange-700 sticky top-0 z-20">Last Day Ach%</th>
 
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-rose-50 dark:bg-rose-900 border-l-2 border-slate-200 dark:border-slate-600 sticky top-0 z-20">LM NP Amount</th>` : ''}
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-rose-50 dark:bg-rose-900 sticky top-0 z-20">LM NP Files</th>` : ''}
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-rose-50 dark:bg-rose-900 sticky top-0 z-20">LM NP Rec (Amt)</th>` : ''}
                                            ${!isCompact ? `<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-rose-50 dark:bg-rose-900 sticky top-0 z-20">LM NP Rec (Files)</th>` : ''}
<th class="px-2.5 py-1.5 border dark:border-slate-600 bg-violet-100 dark:bg-violet-900 text-violet-700 font-bold border-l-2 border-slate-200 dark:border-slate-600 text-center sticky top-0 z-20">App Use %</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ranking-table-body"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="mt-4">
                            <div class="glass-panel p-4 rounded-xl shadow-md dark:bg-dark-card hover-lift">
                                <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center">
                                    <i class="fa-solid fa-file-export mr-2 text-brand-500"></i> Reports & Exports
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition hover:border-brand-200 dark:hover:border-brand-800">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shadow-sm">
                                                <i class="fa-solid fa-chart-simple"></i>
                                            </div>
                                            <div>
                                                <p class="font-bold text-slate-700 dark:text-slate-200 text-sm">Performance Summary</p>
                                                <p class="text-xs text-slate-500">Current Month Territory Ranking</p>
                                            </div>
                                        </div>
                                        <button onclick="UI.exportCSV()" class="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-500 transition-all shadow-sm">
                                            Download
                                        </button>
                                    </div>

                                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition hover:border-brand-200 dark:hover:border-brand-800">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-4 shadow-sm">
                                                <i class="fa-solid fa-database"></i>
                                            </div>
                                            <div>
                                                <p class="font-bold text-slate-700 dark:text-slate-200 text-sm">Raw Collection Data</p>
                                                <p class="text-xs text-slate-500">Customer-wise Detailed Report</p>
                                            </div>
                                        </div>
                                        <button onclick="UI.openRawExportModal()" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-brand-500/20">
                                            Select Period
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                            <!-- Top Performing Card -->
                            <div class="glass-panel p-3.5 rounded-xl shadow-md dark:bg-dark-card border-l-4 border-emerald-500 hover-lift">
                                <div class="flex items-center justify-between mb-3.5">
                                    <h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center">
                                        <i class="fa-solid fa-trophy text-amber-500 mr-2 text-lg"></i> Top Performing Territories
                                    </h3>
                                    <span class="text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Top Half</span>
                                </div>
                                
                                <div class="overflow-y-auto max-h-[275px] scrollbar-thin space-y-1.5 pr-1">
                                    ${topHalf.map((t, idx) => {
                                        let medal = '';
                                        if (idx === 0) medal = '<span class="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-black shadow-sm border border-amber-200/50"><i class="fa-solid fa-medal text-[10px]"></i></span>';
                                        else if (idx === 1) medal = '<span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-black shadow-sm border border-slate-200/50"><i class="fa-solid fa-medal text-[10px]"></i></span>';
                                        else if (idx === 2) medal = '<span class="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-655 dark:text-orange-400 flex items-center justify-center text-xs font-black shadow-sm border border-orange-200/30"><i class="fa-solid fa-medal text-[10px]"></i></span>';
                                        else medal = `<span class="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-black border border-slate-100/50 dark:border-slate-750/30">${idx + 1}</span>`;
                                        
                                        return `
                                        <div class="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-slate-850/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-lg transition border border-slate-100/50 dark:border-slate-750/30">
                                            <div class="flex items-center gap-2.5">
                                                ${medal}
                                                <div>
                                                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200">${t.name}</div>
                                                    <div class="text-[9px] text-slate-450 dark:text-slate-500">${t.officer}</div>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-xs font-black text-emerald-600 dark:text-emerald-400">${t.tillDayAchievement}%</div>
                                                <div class="text-[9px] font-bold text-slate-455 dark:text-slate-505">RPI: ${t.rpi}</div>
                                            </div>
                                        </div>
                                        `;
                                    }).join('')}
                                    ${topHalf.length === 0 ? '<div class="text-center py-4 text-xs text-slate-400">No data available</div>' : ''}
                                </div>
                            </div>

                            <!-- Critical Card -->
                            <div class="glass-panel p-3.5 rounded-xl shadow-md dark:bg-dark-card border-l-4 border-rose-500 hover-lift">
                                <div class="flex items-center justify-between mb-3.5">
                                    <h3 class="text-base font-extrabold text-slate-800 dark:text-white flex items-center">
                                        <i class="fa-solid fa-triangle-exclamation text-rose-505 mr-2 text-lg animate-pulse"></i> Critical Attention Needed
                                    </h3>
                                    <span class="text-[9px] font-black bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Bottom Half</span>
                                </div>
                                
                                <div class="overflow-y-auto max-h-[275px] scrollbar-thin space-y-1.5 pr-1">
                                    ${bottomHalfSorted.map((t, idx) => `
                                        <div class="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-slate-850/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-lg transition border border-slate-100/50 dark:border-slate-750/30">
                                            <div class="flex items-center gap-2.5">
                                                <span class="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-455 flex items-center justify-center text-[10px] font-black border border-rose-200/40 dark:border-rose-800/20">#${idx + 1}</span>
                                                <div>
                                                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200">${t.name}</div>
                                                    <div class="text-[9px] text-slate-450 dark:text-slate-500">${t.officer}</div>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-xs font-black text-rose-600 dark:text-rose-400">${t.tillDayAchievement}%</div>
                                                <div class="text-[9px] font-bold text-slate-455 dark:text-slate-505">RPI: ${t.rpi}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                    ${bottomHalfSorted.length === 0 ? '<div class="text-center py-4 text-xs text-slate-400">No data available</div>' : ''}
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center">
                                <i class="fa-solid fa-brain text-brand-500 mr-2"></i> Strategic Analytics
                            </h3>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div class="glass-panel p-4 rounded-xl shadow-md dark:bg-dark-card lg:col-span-2 hover-lift">
                                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                        <h4 class="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center">
                                            <i class="fa-solid fa-arrow-trend-up mr-2 text-brand-500"></i> Collection Momentum
                                        </h4>
                                        <div class="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div class="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                <i class="fa-solid fa-map-location-dot text-[10px] text-brand-500 opacity-70"></i>
                                                <select id="momentum-territory" onchange="UI.updateMomentumChart()" class="bg-transparent border-none text-[10px] font-black outline-none cursor-pointer">
                                                    <option value="">GLOBAL MOMENTUM</option>
                                                    ${db.territories.map(t => `<option value="${t.id}">${t.name.toUpperCase()}</option>`).join('')}
                                                </select>
                                            </div>
                                            <div class="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                <i class="fa-solid fa-calendar-range text-[10px] text-brand-500 opacity-70"></i>
                                                <input type="date" id="momentum-start" onchange="UI.updateMomentumChart()" value="${Utils.getMonthBounds().startOfMonth}" class="bg-transparent border-none text-[9px] font-black outline-none cursor-pointer">
                                                <span class="text-[9px] text-slate-300 font-black px-1">/</span>
                                                <input type="date" id="momentum-end" onchange="UI.updateMomentumChart()" value="${Utils.getMonthBounds().endOfMonth}" class="bg-transparent border-none text-[9px] font-black outline-none cursor-pointer">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="relative h-64">
                                        <canvas id="admin-global-trend"></canvas>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <div class="glass-panel p-4 rounded-xl shadow-md dark:bg-dark-card hover-lift">
                                        <h4 class="font-bold mb-4 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            <i class="fa-solid fa-wallet mr-2 text-blue-500"></i> Channel Mix (MTD)
                                        </h4>
                                        <div class="relative h-48">
                                            <canvas id="admin-mode-chart"></canvas>
                                        </div>
                                    </div>

                                    <div class="glass-panel p-4 rounded-xl shadow-md dark:bg-dark-card hover-lift border-l-4 border-rose-500">
                                        <h4 class="font-bold mb-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            LMNP Efficiency
                                        </h4>
                                        ${(() => {
                                            const pct = parseFloat(metrics.lmNpRecPct) || 0;
                                            const clamped = Math.min(100, pct);
                                            const overflow = pct > 100 ? (pct - 100).toFixed(1) : 0;
                                            let barClass = "bg-rose-500";
                                            let badge = "";
                                            if (pct > 100) {
                                                barClass = "bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 animate-overflow";
                                                badge = `<span class="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse"><i class="fa-solid fa-fire text-xs"></i> +${overflow}%</span>`;
                                            }
                                            return `
                                                <div class="flex justify-between items-end mb-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-3xl font-bold text-slate-800 dark:text-white">${metrics.lmNpRecPct}%</span>
                                                        ${badge}
                                                    </div>
                                                    <span class="text-xs text-rose-500 font-medium">Rec. of Last Month NP</span>
                                                </div>
                                                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                                                    <div class="${barClass} h-2 rounded-full transition-all duration-1000" style="width: ${clamped}%"></div>
                                                </div>
                                            `;
                                        })()}
                                        <p class="text-xs text-slate-400">Target: <span class="font-medium text-slate-600 dark:text-slate-300">${parseInt(metrics.lmNpTargetAmt).toLocaleString()}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 `;

                // Populate the ranking table based on active filters
                this.populateRankingTable(tableMode);

                setTimeout(() => {
                    UI.updateMomentumChart();
                    Charts.renderDoughnut('admin-mode-chart', modes, modeData);
                    if (document.getElementById('admin-bd-map')) {
                        UI.initAdminMap();
                    }
                }, 200);
            },

            populateRankingTable(tableMode) {
                const db = Store.get();
                const metrics = Calc.getMetrics();
                
                const searchVal = (UI.rankingSearchVal || '').toLowerCase().trim();
                const partVal = UI.rankingPartVal || 'All';
                const isCompact = tableMode === 'compact';
                
                const allTerritoryData = db.territories.map(t => {
                    const m = Calc.getMetrics(t.id);
                    const ldAch = m.yestProjAmt > 0 ? ((m.yestCollAmt / m.yestProjAmt) * 100).toFixed(1) : '0.0';
                    const tdAch = m.todayProj > 0 ? ((m.todayColl / m.todayProj) * 100).toFixed(1) : (m.todayColl > 0 ? '100+' : '0.0');
                    const appUsePct = Calc.getAppUsePercentage(t.id);
                    
                    const targetObj = m.rawTargets[0] || {};
                    const totalOd = parseFloat(targetObj.totalOd || targetObj.total_od) || 0;
                    const perFileOd = parseFloat(targetObj.perFileOd || targetObj.per_file_od) || 0;
                    
                    return { ...t, ...m, lastDayAch: ldAch, todayAch: tdAch, appUsePct, totalOd, perFileOd };
                });

                // Calculate global ranks for dynamic top/middle/bottom groups across ALL territories
                const sortedAll = [...allTerritoryData].sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));
                const totalCount = sortedAll.length;
                sortedAll.forEach((t, i) => {
                    if (i < Math.ceil(totalCount / 3)) {
                        t.globalGroup = 'top';
                    } else if (i < Math.ceil(totalCount * 2 / 3)) {
                        t.globalGroup = 'middle';
                    } else {
                        t.globalGroup = 'bottom';
                    }
                });

                // Helper to calculate totals
                const calculateTotals = (data) => {
                    const sums = {
                        targetFiles: 0, mtdProjFiles: 0, uniquePaidCodes: 0, tillDateNonPayFiles: 0,
                        targetAmt: 0, mtdProjRegular: 0, mtdProjAdvance: 0, mtdProjTotal: 0, mtdColl: 0,
                        presetProjReg: 0, presetProjAdv: 0, presetProjTotal: 0,
                        yestProjAmt: 0, yestProjFiles: 0, yestCollAmt: 0, yestCollFiles: 0,
                        lmNpTargetAmt: 0, lmNpTargetFiles: 0, mtdLmNpColl: 0, mtdLmNpFiles: 0,
                        todayProj: 0, todayColl: 0, appUsePct: 0, remainingAmt: 0, rdrr: 0,
                        totalOd: 0
                    };

                    data.forEach(t => {
                        sums.targetFiles += parseInt(t.targetFiles) || 0;
                        sums.mtdProjFiles += parseInt(t.mtdProjFiles) || 0;
                        sums.uniquePaidCodes += parseInt(t.uniquePaidCodes) || 0;
                        sums.tillDateNonPayFiles += parseInt(t.tillDateNonPayFiles) || 0;
                        sums.targetAmt += parseFloat(t.targetAmt) || 0;
                        sums.mtdProjRegular += parseFloat(t.mtdProjRegular) || 0;
                        sums.mtdProjAdvance += parseFloat(t.mtdProjAdvance) || 0;
                        sums.mtdProjTotal += parseFloat(t.mtdProjTotal) || 0;
                        sums.mtdColl += parseFloat(t.mtdColl) || 0;
                        sums.yestProjAmt += parseFloat(t.yestProjAmt) || 0;
                        sums.yestProjFiles += parseInt(t.yestProjFiles) || 0;
                        sums.yestCollAmt += parseFloat(t.yestCollAmt) || 0;
                        sums.yestCollFiles += parseInt(t.yestCollFiles) || 0;
                        sums.lmNpTargetAmt += parseFloat(t.lmNpTargetAmt) || 0;
                        sums.lmNpTargetFiles += parseInt(t.lmNpTargetFiles) || 0;
                        sums.mtdLmNpColl += parseFloat(t.mtdLmNpColl) || 0;
                        sums.mtdLmNpFiles += parseInt(t.mtdLmNpFiles) || 0;
                        sums.todayProj += parseFloat(t.todayProj) || 0;
                        sums.todayColl += parseFloat(t.todayColl) || 0;
                        sums.presetProjReg += parseFloat(t.presetProjReg) || 0;
                        sums.presetProjAdv += parseFloat(t.presetProjAdv) || 0;
                        sums.presetProjTotal += parseFloat(t.presetProjTotal) || 0;
                        sums.remainingAmt += parseFloat(t.remainingAmt) || 0;
                        sums.rdrr += parseFloat(t.rdrr) || 0;
                        sums.totalOd += parseFloat(t.totalOd) || 0;
                    });

                    // Derived Metrics for Totals
                    sums.perFileOd = sums.targetFiles > 0 ? (sums.totalOd / sums.targetFiles) : 0;
                    sums.tillDayAchievement = sums.presetProjTotal > 0 ? ((sums.mtdColl / sums.presetProjTotal) * 100).toFixed(1) : '0.0';
                    sums.achievement = sums.tillDayAchievement;
                    sums.emiAchievement = sums.targetAmt > 0 ? ((sums.mtdColl / sums.targetAmt) * 100).toFixed(1) : '0.0';
                    sums.lastDayAch = sums.yestProjAmt > 0 ? ((sums.yestCollAmt / sums.yestProjAmt) * 100).toFixed(1) : '0.0';
                    sums.todayAch = sums.todayProj > 0 ? ((sums.todayColl / sums.todayProj) * 100).toFixed(1) : (sums.todayColl > 0 ? '100+' : '0.0');

                    const cureRate = sums.targetFiles > 0 ? (sums.uniquePaidCodes / sums.targetFiles) * 100 : 0;
                    const lmNpRecPct = sums.lmNpTargetAmt > 0 ? (sums.mtdLmNpColl / sums.lmNpTargetAmt) * 100 : 0;

                    let projAcc = 0;
                    if (sums.todayProj > 0) {
                        const diff = Math.abs(sums.todayProj - sums.todayColl);
                        projAcc = Math.max(0, (1 - (diff / sums.todayProj)) * 100);
                    } else if (sums.todayColl > 0) {
                        projAcc = 0;
                    } else {
                        projAcc = 100;
                    }

                    sums.rpi = Math.min(100, (parseFloat(sums.achievement) * 0.7) + (projAcc * 0.1) + (lmNpRecPct * 0.1) + (cureRate * 0.1)).toFixed(1);
                    sums.appUsePct = data.length > 0 ? Number((data.reduce((sum, item) => sum + (parseFloat(item.appUsePct) || 0), 0) / data.length).toFixed(1)) : 0;

                    return sums;
                };

                const totalGrand = calculateTotals(allTerritoryData);

                // Filter data
                let filteredA = allTerritoryData.filter(t => t.part === 'A');
                let filteredB = allTerritoryData.filter(t => t.part === 'B');

                if (partVal === 'A') {
                    filteredB = [];
                } else if (partVal === 'B') {
                    filteredA = [];
                }

                if (searchVal) {
                    filteredA = filteredA.filter(t => t.name.toLowerCase().includes(searchVal) || t.officer.toLowerCase().includes(searchVal));
                    filteredB = filteredB.filter(t => t.name.toLowerCase().includes(searchVal) || t.officer.toLowerCase().includes(searchVal));
                }

                // Sort
                filteredA.sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));
                filteredB.sort((a, b) => parseFloat(b.tillDayAchievement || 0) - parseFloat(a.tillDayAchievement || 0));

                const totalA = calculateTotals(filteredA);
                const totalB = calculateTotals(filteredB);
                const totalGrandFiltered = calculateTotals([...filteredA, ...filteredB]);

                const createRow = (t, isTotal = false, label = '') => {
                    let achColorStyle = '';
                    if (!isTotal) {
                        if (t.globalGroup === 'top') {
                            achColorStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border-l-2 border-emerald-500 transition-colors duration-300 hover:bg-emerald-500/20';
                        } else if (t.globalGroup === 'middle') {
                            achColorStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold border-l-2 border-amber-500 transition-colors duration-300 hover:bg-amber-500/20';
                        } else {
                            achColorStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold border-l-2 border-rose-500 transition-colors duration-300 hover:bg-rose-500/20';
                        }
                    } else {
                        achColorStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold';
                    }

                    const lastAchColorClass = (!isTotal && parseFloat(t.lastDayAch) < parseFloat(totalGrand.lastDayAch)) ? 'text-red-650 font-semibold' : 'text-orange-500 font-semibold';
                    
                    const remAmt = Math.round(t.remainingAmt || 0);
                    let remColor = '';
                    if (isTotal) {
                        remColor = remAmt === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold';
                    } else {
                        if (remAmt === 0) {
                            remColor = 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5';
                        } else if (remAmt >= 50000) {
                            remColor = 'text-rose-600 dark:text-rose-400 font-bold bg-rose-500/5';
                        } else {
                            remColor = 'text-slate-500 dark:text-slate-400 font-normal';
                        }
                    }

                    // Determine Per File OD color (smaller to large -> green to red)
                    let perFileOdColorClass = '';
                    if (isTotal) {
                        perFileOdColorClass = 'text-slate-900 dark:text-slate-100 font-bold';
                    } else {
                        const val = t.perFileOd || 0;
                        if (val < 1500) {
                            perFileOdColorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
                        } else if (val <= 4000) {
                            perFileOdColorClass = 'text-amber-500 dark:text-amber-450 font-semibold';
                        } else {
                            perFileOdColorClass = 'text-rose-600 dark:text-rose-400 font-semibold';
                        }
                    }

                    // Determine Total Overdue color (smaller to large -> green to red)
                    let totalOdColorClass = '';
                    if (isTotal) {
                        totalOdColorClass = 'text-slate-900 dark:text-slate-100 font-bold';
                    } else {
                        const val = t.totalOd || 0;
                        if (val < 80000) {
                            totalOdColorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
                        } else if (val <= 250000) {
                            totalOdColorClass = 'text-amber-500 dark:text-amber-450 font-semibold';
                        } else {
                            totalOdColorClass = 'text-rose-600 dark:text-rose-400 font-semibold';
                        }
                    }

                    return `
                    <tr class="${isTotal ? 'bg-slate-100 dark:bg-slate-800/90 font-bold border-y border-slate-350 dark:border-slate-700' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors interactive-row border-b border-slate-100 dark:border-slate-800/60'} text-slate-700 dark:text-slate-300 text-[11px]">
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 ${isTotal ? '' : 'sticky left-0 bg-white dark:bg-dark-card'} text-center">${isTotal ? '' : t.part}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 ${isTotal ? 'text-right' : 'sticky left-10 bg-white dark:bg-dark-card shadow-sm'} font-medium">
                            ${isTotal ? label : t.name}
                        </td>
                        <td class="od-col ${UI.showOdColumns ? '' : 'hidden'} py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${perFileOdColorClass}">${Math.round(t.perFileOd).toLocaleString()}</td>
                        <td class="od-col ${UI.showOdColumns ? '' : 'hidden'} py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${totalOdColorClass}">${Math.round(t.totalOd).toLocaleString()}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums">${t.targetFiles}</td>
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums">${t.mtdProjFiles}</td>` : ''}
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums ${!isTotal ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}">${t.uniquePaidCodes}</td>
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums ${!isTotal ? 'text-red-500 font-semibold' : ''}">${t.tillDateNonPayFiles}</td>` : ''}
                        
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums font-medium">${parseInt(t.targetAmt).toLocaleString()}</td>
                        
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''}">${parseInt(t.presetProjReg).toLocaleString()}</td>` : ''}
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''}">${parseInt(t.presetProjAdv).toLocaleString()}</td>` : ''}
                        
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums font-bold ${!isTotal ? 'text-brand-600 dark:text-brand-400' : ''}">${parseInt(t.presetProjTotal).toLocaleString()}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums font-bold ${!isTotal ? 'text-green-600 dark:text-green-400' : ''}">${parseInt(t.mtdColl).toLocaleString()}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums font-bold ${achColorStyle}">
                            <div class="flex items-center justify-center gap-1.5">
                                <span>${t.tillDayAchievement}%</span>
                            </div>
                        </td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${isTotal ? 'bg-rose-50/30 dark:bg-rose-950/20' : 'bg-rose-50/10 dark:bg-rose-950/5'} ${remColor}">
                            ${remAmt.toLocaleString()}
                        </td>
                        <td class="daily-req-col ${UI.showDailyReqColumn ? '' : 'hidden'} py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${isTotal ? 'font-bold bg-amber-50/30 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100' : 'font-medium bg-amber-50/10 dark:bg-amber-950/5 text-slate-700 dark:text-slate-300'}">
                            ${Math.round(t.rdrr || 0).toLocaleString()}
                        </td>
                        
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'font-medium text-slate-700 dark:text-slate-300' : ''}">${parseInt(t.todayProj).toLocaleString()}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums font-bold ${!isTotal ? 'text-green-600 dark:text-green-400' : ''}">${parseInt(t.todayColl).toLocaleString()}</td>
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums font-bold text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/10">${t.todayAch}%</td>
 
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''} border-l-2 border-slate-200 dark:border-slate-700/60">${parseInt(t.yestProjAmt).toLocaleString()}</td>
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''}">${t.yestProjFiles}</td>` : ''}
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''}">${parseInt(t.yestCollAmt).toLocaleString()}</td>
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums ${!isTotal ? 'text-slate-400 dark:text-slate-500' : ''}">${t.yestCollFiles}</td>` : ''}
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums font-bold ${lastAchColorClass}">${t.lastDayAch}%</td>
                        
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums ${!isTotal ? 'text-rose-800 bg-rose-50 dark:bg-rose-900/20' : ''} border-l-2 border-slate-200 dark:border-slate-700/60">${parseInt(t.lmNpTargetAmt).toLocaleString()}</td>` : ''}
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center tabular-nums ${!isTotal ? 'text-rose-850 bg-rose-50 dark:bg-rose-900/20' : ''}">${t.lmNpTargetFiles}</td>` : ''}
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-right tabular-nums font-bold ${!isTotal ? 'text-rose-600' : ''}">${parseInt(t.mtdLmNpColl).toLocaleString()}</td>` : ''}
                        ${!isCompact ? `<td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center font-bold ${!isTotal ? 'text-rose-600' : ''}">${t.mtdLmNpFiles}</td>` : ''}
                        <td class="py-0.5 px-1.5 border border-slate-200/50 dark:border-slate-700/40 text-center font-bold border-l-2 border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40">
                            <span onclick="UI.showAppUseModal('${t.id}')" class="cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                t.appUsePct >= 90 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                t.appUsePct >= 70 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }">
                                <i class="fa-solid ${t.appUsePct >= 90 ? 'fa-circle-check' : t.appUsePct >= 70 ? 'fa-triangle-exclamation' : 'fa-circle-xmark'} mr-1 opacity-80"></i>
                                ${t.appUsePct}%
                            </span>
                        </td>
                    </tr>`;
                };

                const tbody = document.getElementById('ranking-table-body');
                if (tbody) {
                    tbody.innerHTML = '';
                    if (filteredA.length === 0 && filteredB.length === 0) {
                        let extra = 0;
                        if (UI.showDailyReqColumn) extra += 1;
                        if (UI.showOdColumns) extra += 2;
                        tbody.innerHTML = `<tr><td colspan="${(isCompact ? 16 : 26) + extra}" class="px-6 py-8 text-center text-slate-400 italic">No matching records found.</td></tr>`;
                    } else {
                        if (filteredA.length > 0) {
                            filteredA.forEach(t => tbody.innerHTML += createRow(t));
                            tbody.innerHTML += createRow(totalA, true, 'Total Part A');
                        }
                        if (filteredB.length > 0) {
                            filteredB.forEach(t => tbody.innerHTML += createRow(t));
                            tbody.innerHTML += createRow(totalB, true, 'Total Part B');
                        }
                        tbody.innerHTML += createRow(totalGrandFiltered, true, 'Grand Total');
                    }
                }
            },

            initAdminMap(mapCustomers) {
                if (window.adminMapInstance) {
                    window.adminMapInstance.remove();
                }

                // Initialize Leaflet Map (Static, No tiles)
                const map = L.map('admin-bd-map', {
                    zoomControl: false,
                    attributionControl: false,
                    dragging: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    touchZoom: false,
                    boxZoom: false,
                    keyboard: false
                }).setView([23.8859, 90.2736], 6); // Centered on Bangladesh
                
                window.adminMapInstance = map;

                const isDark = document.documentElement.classList.contains('dark');

                // Load Custom Bangladesh Districts GeoJSON
                fetch('js/bd_districts.json')
                    .then(res => res.json())
                    .then(geojsonData => {
                        const db = Store.get();
                        const customers = mapCustomers || db.customers || Store.cache.customers || [];
                        const allCollections = db.collections || Store.cache.collections || [];
                        const activeMonth = (typeof Utils !== 'undefined' && Utils.getActiveMonth) ? Utils.getActiveMonth() : (new Date().toISOString().slice(0, 7));

                        const parseNum = (val) => {
                            if (val === undefined || val === null) return 0;
                            const cleanStr = String(val).replace(/[^0-9.-]/g, '');
                            const num = parseFloat(cleanStr);
                            return isNaN(num) ? 0 : num;
                        };

                        // Helper function to normalize district spellings dynamically with intelligent fuzzy mapping
                        const normalizeDistrictName = (name) => {
                            if (!name) return "";
                            let clean = name.trim().toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[^a-z0-9]/g, '');
                            
                            const corrections = {
                                'jashore': 'jessore',
                                'comilla': 'comilla',
                                'cumilla': 'comilla',
                                'cumulla': 'comilla',
                                'brahamnbaria': 'brahmanbaria',
                                'brahandbaria': 'brahmanbaria',
                                'brahandnaria': 'brahmanbaria',
                                'jhalokhati': 'jhalokati',
                                'jhalkhati': 'jhalokati',
                                'jhalkati': 'jhalokati',
                                'barishal': 'barisal',
                                'meharpur': 'meherpur',
                                'chittagong': 'chattogram',
                                'bogra': 'bogura',
                                'coxsbazar': "cox's bazar"
                            };
                            if (corrections[clean]) return corrections[clean];

                            // List of 64 official district names (normalized for search)
                            const officialDistricts = [
                                "bagerhat", "bandarban", "barguna", "barisal", "bhola", "bogura", "brahmanbaria", "chandpur", 
                                "chattogram", "chuadanga", "comilla", "coxsbazar", "dhaka", "dinajpur", "faridpur", "feni", 
                                "gaibandha", "gazipur", "gopalganj", "habiganj", "jamalpur", "jessore", "jhalokati", "jhenaidah", 
                                "joypurhat", "khagrachhari", "khulna", "kishoreganj", "kurigram", "kushtia", "lakshmipur", 
                                "lalmonirhat", "madaripur", "magura", "manikganj", "moulvibazar", "meherpur", "munshiganj", 
                                "mymensingh", "naogaon", "narail", "narayanganj", "narsingdi", "natore", "chapainawabganj", 
                                "netrokona", "nilphamari", "noakhali", "pabna", "panchagarh", "patuakhali", "pirojpur", "rajbari", 
                                "rajshahi", "rangamati", "rangpur", "satkhira", "shariatpur", "sherpur", "sirajganj", "sunamganj", 
                                "sylhet", "tangail", "thakurgaon"
                            ];

                            // 1. Direct match check
                            for (const official of officialDistricts) {
                                if (official === clean) return official === 'coxsbazar' ? "cox's bazar" : official;
                            }

                            // 2. Intelligent spelling match using Levenshtein distance
                            const levenshtein = (a, b) => {
                                const matrix = [];
                                for (let i = 0; i <= b.length; i++) matrix[i] = [i];
                                for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
                                for (let i = 1; i <= b.length; i++) {
                                    for (let j = 1; j <= a.length; j++) {
                                        if (b.charAt(i - 1) === a.charAt(j - 1)) {
                                            matrix[i][j] = matrix[i - 1][j - 1];
                                        } else {
                                            matrix[i][j] = Math.min(
                                                matrix[i - 1][j - 1] + 1, // substitution
                                                matrix[i][j - 1] + 1,     // insertion
                                                matrix[i - 1][j] + 1      // deletion
                                            );
                                        }
                                    }
                                }
                                return matrix[b.length][a.length];
                            };

                            let bestMatch = null;
                            let minDistance = Infinity;

                            for (const official of officialDistricts) {
                                const dist = levenshtein(clean, official);
                                if (dist < minDistance) {
                                    minDistance = dist;
                                    bestMatch = official;
                                }
                            }

                            // If distance is very small relative to length, trust the correction
                            const maxAllowedDistance = Math.min(3, Math.floor(clean.length / 3) + 1);
                            if (minDistance <= maxAllowedDistance && bestMatch) {
                                return bestMatch === 'coxsbazar' ? "cox's bazar" : bestMatch;
                            }

                            return clean;
                        };

                        // Retrieve active map filters
                        const mapMetricFilter = UI.mapMetricFilter || 'MTD';

                        // Filter customers based on Part filter
                        const filteredCustomers = customers.filter(c => {
                            if (UI.mapPartFilter && UI.mapPartFilter !== 'ALL') {
                                const cPart = String(c.part || '').trim().toUpperCase();
                                if (cPart !== UI.mapPartFilter) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        
                        // 1. Group customer metrics at the selected view level
                        const statsGroup = {};
                        const mapViewMode = UI.mapViewMode || 'DISTRICT';

                        // Construct lookup maps for mapping district to territory dynamically
                        const distToTerritory = {};
                        customers.forEach(c => {
                            const tName = String(c.territoryName || c.territory_name || c.territory || '').trim().toLowerCase();
                            if (!tName) return;

                            let dName = String(c.district || c.districtName || c.district_name || '').trim().toLowerCase();
                            dName = normalizeDistrictName(dName);
                            if (dName) distToTerritory[dName] = tName;
                        });
                        
                        filteredCustomers.forEach(c => {
                            // Find aggregation key
                            let groupKey = '';
                            if (mapViewMode === 'TERRITORY') {
                                groupKey = String(c.territoryName || c.territory_name || c.territory || '').trim().toLowerCase();
                            } else {
                                // Default: DISTRICT (No upazila)
                                let dName = String(c.district || c.districtName || c.district_name || '').trim().toLowerCase();
                                groupKey = normalizeDistrictName(dName);
                                if (!groupKey && c.territoryName) {
                                    groupKey = String(c.territoryName).trim().toLowerCase();
                                }
                            }

                            if (!groupKey) return;

                            // Overdue amount
                            const od = parseNum(c.overdueTaka || c.overdue_taka || c.totalOverdue || c['Total OD'] || c.totalOd || c.overdue);
                            
                            // MTD Collection amount
                            let mtd = parseNum(c.collectedMTD || c.mtdCollection || c['MTD Collection'] || c.collected_mtd || c.mtdColl);
                            if (mtd === 0 && allCollections.length > 0) {
                                const cleanId = String(c.customerId || c.customer_id || c.id || '').trim().toLowerCase();
                                if (cleanId) {
                                    const custColls = allCollections.filter(coll => {
                                        const code = String(coll.customerCode || coll.customer_code || '').trim().toLowerCase();
                                        const m = coll.activeMonth || coll.active_month || (coll.date ? coll.date.slice(0, 7) : '');
                                        return code === cleanId && m === activeMonth;
                                    });
                                    mtd = custColls.reduce((sum, coll) => sum + parseNum(coll.amount), 0);
                                }
                            }

                            const inst = parseNum(c.instSize || c.inst_size || c.installmentSize || c['Installment Size'] || c.emi);

                            if (!statsGroup[groupKey]) {
                                statsGroup[groupKey] = {
                                    count: 0,
                                    totalOd: 0,
                                    totalMtd: 0,
                                    totalInst: 0,
                                    originalName: groupKey
                                };
                            }
                            statsGroup[groupKey].count++;
                            statsGroup[groupKey].totalOd += od;
                            statsGroup[groupKey].totalMtd += mtd;
                            statsGroup[groupKey].totalInst += inst;
                        });

                        const getGroupStats = (key) => {
                            if (!key) return null;
                            const normKey = normalizeDistrictName(key);
                            if (statsGroup[normKey]) return statsGroup[normKey];
                            for (const k in statsGroup) {
                                if (normKey.includes(k) || k.includes(normKey)) return statsGroup[k];
                            }
                            return null;
                        };

                        let minAvgOd = Infinity, maxAvgOd = -Infinity;
                        let minCollPct = Infinity, maxCollPct = -Infinity;

                        for (const k in statsGroup) {
                            const s = statsGroup[k];
                            if (s.count > 0) {
                                const avgOd = s.totalOd / s.count;
                                if (avgOd < minAvgOd) minAvgOd = avgOd;
                                if (avgOd > maxAvgOd) maxAvgOd = avgOd;
                                
                                const pct = (s.totalInst > 0) ? (s.totalMtd / s.totalInst) : 0;
                                if (pct < minCollPct) minCollPct = pct;
                                if (pct > maxCollPct) maxCollPct = pct;
                                s.collPct = pct;
                            }
                        }
                        if (minAvgOd === Infinity) { minAvgOd = 0; maxAvgOd = 1; }
                        if (minCollPct === Infinity) { minCollPct = 0; maxCollPct = 1; }

                        let geojsonLayer;

                        geojsonLayer = L.geoJSON(geojsonData, {
                            style: function(feature) {
                                const p = feature.properties || {};
                                const distName = normalizeDistrictName(p.ADM2_EN || '');
                                
                                // Get the territory for this district
                                let tName = distToTerritory[distName];
                                if (!tName) {
                                    const matchedDistKey = Object.keys(distToTerritory).find(dk => {
                                        return dk.includes(distName) || distName.includes(dk);
                                    });
                                    if (matchedDistKey) {
                                        tName = distToTerritory[matchedDistKey];
                                    }
                                }

                                // If a territory filter is active, hide districts that don't belong to it
                                if (UI.selectedTerritoryFilter && tName !== UI.selectedTerritoryFilter) {
                                    return {
                                        fillColor: 'transparent',
                                        fillOpacity: 0,
                                        color: isDark ? '#334155' : '#cbd5e1',
                                        weight: 0.1,
                                        opacity: 0.1,
                                        interactive: false
                                    };
                                }

                                let stats = null;

                                if (mapViewMode === 'TERRITORY') {
                                    if (tName) {
                                        stats = statsGroup[tName];
                                    }
                                } else {
                                    stats = getGroupStats(distName);
                                }

                                let fillColor = isDark ? '#0f172a' : '#f8fafc';
                                let fillOpacity = 0.4;
                                let weight = 0.5;
                                let color = isDark ? '#334155' : '#cbd5e1';

                                if (stats && stats.count > 0) {
                                    fillOpacity = 0.85;
                                    weight = 0.8;
                                    color = isDark ? '#475569' : '#94a3b8';
                                    
                                    let ratio = 0;
                                    if (mapMetricFilter === 'OVERDUE') {
                                        let range = maxAvgOd - minAvgOd;
                                        let val = stats.totalOd / stats.count;
                                        ratio = range === 0 ? 0.5 : (val - minAvgOd) / range;
                                        // Overdue per file: High -> Red (ratio=1 -> Hue 0), Low -> Green (ratio=0 -> Hue 140)
                                        ratio = 1 - ratio; // Invert: so high becomes 0 (Red), low becomes 1 (Green)
                                    } else {
                                        let range = maxCollPct - minCollPct;
                                        let val = stats.collPct;
                                        ratio = range === 0 ? 0.5 : (val - minCollPct) / range;
                                        // MTD: High is Green (ratio=1 -> Hue 140), Low is Red (ratio=0 -> Hue 0)
                                    }
                                    
                                    // Hue from 0 (Red) to 140 (Green)
                                    const hue = Math.floor(ratio * 140);
                                    fillColor = `hsl(${hue}, 85%, 52%)`;
                                }

                                return {
                                    fillColor: fillColor,
                                    fillOpacity: fillOpacity,
                                    color: color,
                                    weight: weight,
                                    opacity: 1,
                                    interactive: true
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                const p = feature.properties || {};
                                const distName = normalizeDistrictName(p.ADM2_EN || '');
                                
                                let stats = null;
                                let mappedGroupName = '';
                                let subLabel = '';

                                // Find territory key
                                let tName = distToTerritory[distName];
                                if (!tName) {
                                    const matchedDistKey = Object.keys(distToTerritory).find(dk => {
                                        return dk.includes(distName) || distName.includes(dk);
                                    });
                                    if (matchedDistKey) {
                                        tName = distToTerritory[matchedDistKey];
                                    }
                                }

                                if (mapViewMode === 'TERRITORY') {
                                    if (tName) {
                                        stats = statsGroup[tName];
                                        mappedGroupName = tName.toUpperCase();
                                    }
                                    subLabel = `District: ${p.ADM2_EN || 'Unknown'}`;
                                } else {
                                    stats = getGroupStats(distName);
                                    mappedGroupName = (p.ADM2_EN || 'Unknown').toUpperCase();
                                    subLabel = p.ADM1_EN ? `Division: ${p.ADM1_EN}` : '';
                                }

                                // Construct Ultra-Minimal Premium Tooltip structure with small fonts
                                let tooltipContent = `<div class="font-sans min-w-[105px]">`;
                                tooltipContent += `
                                    <div class="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800/60 pb-1 mb-1 font-bold text-[9px] uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        <i class="fa-solid fa-location-dot text-indigo-500"></i>
                                        <span>${mappedGroupName}</span>
                                    </div>
                                `;
                                
                                if (stats && stats.count > 0) {
                                    tooltipContent += `
                                        <div class="text-[8px] font-black space-y-0.5 text-slate-600 dark:text-slate-300">
                                            <div class="flex justify-between gap-3"><span>CUSTOMERS</span> <strong class="text-slate-800 dark:text-white">${stats.count}</strong></div>
                                            <div class="flex justify-between gap-3"><span>MTD COLL.</span> <strong class="text-emerald-500">৳${stats.totalMtd.toLocaleString()}</strong></div>
                                            <div class="flex justify-between gap-3"><span>OVERDUE</span> <strong class="text-rose-500">৳${stats.totalOd.toLocaleString()}</strong></div>
                                        </div>
                                    `;
                                } else {
                                    tooltipContent += `<div class="text-[8px] font-bold text-slate-400 dark:text-slate-500 italic">NO ACTIVE CUSTOMERS</div>`;
                                }
                                tooltipContent += `</div>`;

                                // Inject Premium map custom styles into document head
                                if (!document.getElementById('map-tooltip-styles')) {
                                    const style = document.createElement('style');
                                    style.id = 'map-tooltip-styles';
                                    style.innerHTML = `
                                        .premium-map-tooltip {
                                            background: rgba(255, 255, 255, 0.95) !important;
                                            backdrop-filter: blur(8px) !important;
                                            border: 1px solid rgba(226, 232, 240, 0.8) !important;
                                            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
                                            border-radius: 8px !important;
                                            padding: 6px 10px !important;
                                            color: #1e293b !important;
                                            font-family: inherit !important;
                                        }
                                        .dark .premium-map-tooltip {
                                            background: rgba(15, 23, 42, 0.96) !important;
                                            backdrop-filter: blur(8px) !important;
                                            border: 1px solid rgba(51, 65, 85, 0.7) !important;
                                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
                                            color: #f8fafc !important;
                                        }
                                        .leaflet-tooltip-pane .premium-map-tooltip::before {
                                            display: none !important;
                                        }
                                    `;
                                    document.head.appendChild(style);
                                }

                                layer.bindTooltip(tooltipContent, {
                                    sticky: true,
                                    className: 'premium-map-tooltip shadow-xs border-0'
                                });
                                
                                layer.on({
                                    click: function(e) {
                                        if (tName) {
                                            UI.selectedTerritoryFilter = tName;
                                            // Reapply styling to hide unrelated districts
                                            geojsonLayer.setStyle(geojsonLayer.options.style);

                                            // Fit map boundary to the visible districts of this territory
                                            const subGroup = [];
                                            geojsonLayer.eachLayer(l => {
                                                const dNm = normalizeDistrictName(l.feature.properties.ADM2_EN || '');
                                                let layerTer = distToTerritory[dNm];
                                                if (!layerTer) {
                                                    const matchedDK = Object.keys(distToTerritory).find(dk => dk.includes(dNm) || dNm.includes(dk));
                                                    if (matchedDK) layerTer = distToTerritory[matchedDK];
                                                }
                                                if (layerTer === tName) {
                                                    subGroup.push(l);
                                                }
                                            });
                                            if (subGroup.length > 0) {
                                                const group = L.featureGroup(subGroup);
                                                map.fitBounds(group.getBounds(), { padding: [15, 15] });
                                            }

                                            // Render visual indicator overlay in top-left
                                            const indicator = document.getElementById('map-territory-indicator');
                                            if (indicator) {
                                                indicator.innerHTML = `
                                                    <span class="flex items-center gap-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-2xs">
                                                        <span>Territory: ${tName}</span>
                                                        <button onclick="UI.clearMapTerritoryFilter(event)" class="hover:text-red-300 font-bold ml-1 text-xs">×</button>
                                                    </span>
                                                `;
                                                indicator.classList.remove('hidden');
                                            }
                                        }
                                    },
                                    mouseover: function(e) {
                                        if (UI.selectedTerritoryFilter && tName !== UI.selectedTerritoryFilter) return;
                                        e.target.setStyle({ weight: 2.5, fillOpacity: 0.95, color: '#6366f1' });
                                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                            e.target.bringToFront();
                                        }
                                    },
                                    mouseout: function(e) {
                                        if (UI.selectedTerritoryFilter && tName !== UI.selectedTerritoryFilter) return;
                                        geojsonLayer.resetStyle(e.target);
                                    }
                                });
                            }
                        }).addTo(map);

                        // Save GeoJSON layer ref globally for external search operations
                        window.adminMapGeojsonLayer = geojsonLayer;

                        // Auto-fit map tightly to polygons with minimal padding
                        if (geojsonLayer && Object.keys(geojsonLayer._layers).length > 0) {
                            if (UI.selectedTerritoryFilter) {
                                const subGroup = [];
                                geojsonLayer.eachLayer(l => {
                                    const dNm = normalizeDistrictName(l.feature.properties.ADM2_EN || '');
                                    let layerTer = distToTerritory[dNm];
                                    if (!layerTer) {
                                        const matchedDK = Object.keys(distToTerritory).find(dk => dk.includes(dNm) || dNm.includes(dk));
                                        if (matchedDK) layerTer = distToTerritory[matchedDK];
                                    }
                                    if (layerTer === UI.selectedTerritoryFilter) {
                                        subGroup.push(l);
                                    }
                                });
                                if (subGroup.length > 0) {
                                    const group = L.featureGroup(subGroup);
                                    map.fitBounds(group.getBounds(), { padding: [15, 15] });
                                    
                                    // Make sure indicator badge is shown
                                    const indicator = document.getElementById('map-territory-indicator');
                                    if (indicator) {
                                        indicator.innerHTML = `
                                            <span class="flex items-center gap-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-2xs">
                                                <span>Territory: ${UI.selectedTerritoryFilter}</span>
                                                <button onclick="UI.clearMapTerritoryFilter(event)" class="hover:text-red-300 font-bold ml-1 text-xs">×</button>
                                            </span>
                                        `;
                                        indicator.classList.remove('hidden');
                                    }
                                } else {
                                    map.fitBounds(geojsonLayer.getBounds(), { padding: [5, 5] });
                                }
                            } else {
                                map.fitBounds(geojsonLayer.getBounds(), { padding: [5, 5] });
                            }
                        }
                    })
                    .catch(err => console.error("Error loading GeoJSON Map:", err));
            },

            filterRankingTable() {
                const searchInput = document.getElementById('ranking-search');
                const partSelect = document.getElementById('ranking-part-filter');
                
                UI.rankingSearchVal = searchInput ? searchInput.value : '';
                UI.rankingPartVal = partSelect ? partSelect.value : 'All';

                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.populateRankingTable(isCompact ? 'compact' : 'full');
            },

            toggleMapPart(part) {
                UI.mapPartFilter = part;
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            changeMapTerritory(ter) {
                UI.mapTerritoryFilter = ter;
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            toggleMapMetric(metric) {
                UI.mapMetricFilter = metric;
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            toggleMapViewMode(mode) {
                UI.mapViewMode = mode;
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            selectSpecificMapTerritory(val) {
                if (val === 'ALL') {
                    UI.selectedTerritoryFilter = null;
                } else {
                    UI.selectedTerritoryFilter = val.toLowerCase();
                }
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            clearMapTerritoryFilter(e) {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                UI.selectedTerritoryFilter = null;
                const indicator = document.getElementById('map-territory-indicator');
                if (indicator) {
                    indicator.classList.add('hidden');
                }
                const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                this.renderAdminDashboard(isCompact ? 'compact' : 'full');
            },

            searchAndHighlightMapDistrict(searchVal) {
                if (!window.adminMapInstance || !window.adminMapGeojsonLayer) return;
                const query = (searchVal || '').trim().toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/[^a-z0-9]/g, '');

                const corrections = {
                    'jashore': 'jessore',
                    'cumilla': 'comilla',
                    'cumulla': 'comilla',
                    'brahamnbaria': 'brahmanbaria',
                    'jhalokhati': 'jhalokati',
                    'barishal': 'barisal',
                    'meharpur': 'meherpur',
                    'chittagong': 'chattogram',
                    'bogra': 'bogura'
                };
                const normQuery = corrections[query] || query;

                window.adminMapGeojsonLayer.eachLayer(layer => {
                    const p = layer.feature.properties || {};
                    const distName = (p.ADM2_EN || '').toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9]/g, '');

                    if (!normQuery) {
                        // Reset to original heatmap styling if search query is empty
                        window.adminMapGeojsonLayer.resetStyle(layer);
                    } else if (distName.includes(normQuery) || normQuery.includes(distName)) {
                        // Highlight the target district
                        layer.setStyle({
                            weight: 3.5,
                            color: '#6366f1', // Indigo glow border
                            fillOpacity: 0.95
                        });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            layer.bringToFront();
                        }
                        // Soft zoom to this district feature
                        window.adminMapInstance.fitBounds(layer.getBounds(), { maxZoom: 8 });
                    } else {
                        // Fade out unrelated districts for high-contrast focus
                        layer.setStyle({
                            fillOpacity: 0.15,
                            weight: 0.5,
                            color: '#cbd5e1'
                        });
                    }
                });
            },

            renderAdminOffroadView(viewMode = 'active') {
                const db = Store.get();
                // Get filter values (handle potential nulls/undefined)
                const fTerritory = document.getElementById('offroad-filter-territory')?.value || '';
                const fMonth = document.getElementById('offroad-filter-month')?.value || '';
                const fReason = document.getElementById('offroad-filter-reason')?.value || '';

                // Flatten data with territory names and apply filters
                const allCases = db.offroad_vehicles.map(v => {
                    const t = db.territories.find(ter => ter.id === v.territoryId);
                    return { ...v, territoryName: t ? t.name : 'Unknown' };
                }).filter(v => {
                    const matchesStatus = v.status === (viewMode === 'active' ? 'Active' : 'Solved');
                    const matchesTerritory = !fTerritory || v.territoryId === fTerritory;
                    const matchesMonth = !fMonth || v.inDate.startsWith(fMonth);
                    const matchesReason = !fReason || v.reason === fReason;
                    return matchesStatus && matchesTerritory && matchesMonth && matchesReason;
                }).sort((a, b) => new Date(b.inDate) - new Date(a.inDate));

                // Global Stats for toggle counts
                const activeCount = db.offroad_vehicles.filter(v => v.status === 'Active').length;
                const resolvedCount = db.offroad_vehicles.filter(v => v.status === 'Solved').length;

                // Dashboard Stats (based on filtered list)
                const totalFiltered = allCases.length;
                const captured = allCases.filter(v => v.reason === 'Capture').length;
                const accident = allCases.filter(v => v.reason === 'Accident').length;
                const thana = allCases.filter(v => v.reason === 'Thana/Police station').length;
                const others = allCases.filter(v => v.reason === 'Lost or untraceable').length;

                const allIds = allCases.map(d => d.id);

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry">
                        <div class="mb-4 flex flex-col md:flex-row justify-end items-stretch md:items-center gap-3">
                            <div class="flex flex-wrap items-center gap-3 justify-end">
                                <button onclick="UI.openOffroadModal()" class="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition flex items-center font-bold text-sm">
                                    <i class="fa-solid fa-plus mr-2"></i> New Report
                                </button>
                                
                                <div class="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg inline-flex">
                                    <button onclick="UI.renderAdminOffroadView('active')" class="px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'active' ? 'bg-white dark:bg-slate-600 text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                        Active (${activeCount})
                                    </button>
                                    <button onclick="UI.renderAdminOffroadView('archive')" class="px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'archive' ? 'bg-white dark:bg-slate-600 text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                        Archive (${resolvedCount})
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Admin Offroad Dashboard -->
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div class="glass-panel p-3.5 rounded-xl border-b-4 border-slate-500 shadow-sm hover-lift bg-slate-100/50 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-clipboard-list text-6xl"></i>
                                </div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Result</p>
                                <p class="text-3xl font-black text-slate-800 dark:text-white">${totalFiltered}</p>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-orange-500 shadow-sm hover-lift bg-orange-50/20 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform text-orange-600">
                                    <i class="fa-solid fa-truck-pickup text-6xl"></i>
                                </div>
                                <p class="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Captured</p>
                                <p class="text-3xl font-black text-slate-800 dark:text-white">${captured}</p>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-blue-500 shadow-sm hover-lift bg-blue-50/20 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform text-blue-600">
                                    <i class="fa-solid fa-car-burst text-6xl"></i>
                                </div>
                                <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Accident</p>
                                <p class="text-3xl font-black text-slate-800 dark:text-white">${accident}</p>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-indigo-500 shadow-sm hover-lift bg-indigo-50/20 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform text-indigo-600">
                                    <i class="fa-solid fa-building-shield text-6xl"></i>
                                </div>
                                <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Thana</p>
                                <p class="text-3xl font-black text-slate-800 dark:text-white">${thana}</p>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-rose-500 shadow-sm hover-lift bg-rose-50/20 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform text-rose-600">
                                    <i class="fa-solid fa-magnifying-glass-location text-6xl"></i>
                                </div>
                                <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Others</p>
                                <p class="text-3xl font-black text-slate-800 dark:text-white">${others}</p>
                            </div>
                        </div>

                        <!-- Filter Bar -->
                        <div class="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex flex-wrap gap-4 items-end bg-slate-50/50">
                            <div class="flex-1 min-w-[200px]">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Territory</label>
                                <select id="offroad-filter-territory" onchange="UI.renderAdminOffroadView('${viewMode}')" class="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 shadow-sm">
                                    <option value="">All Territories</option>
                                    ${db.territories.map(t => `<option value="${t.id}" ${fTerritory === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex-1 min-w-[150px]">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Month</label>
                                <input type="month" id="offroad-filter-month" value="${fMonth}" onchange="UI.renderAdminOffroadView('${viewMode}')" class="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 shadow-sm">
                            </div>
                            <div class="flex-1 min-w-[180px]">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Reason</label>
                                <select id="offroad-filter-reason" onchange="UI.renderAdminOffroadView('${viewMode}')" class="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 shadow-sm">
                                    <option value="">All Reasons</option>
                                    <option value="Accident" ${fReason === 'Accident' ? 'selected' : ''}>Accident</option>
                                    <option value="Capture" ${fReason === 'Capture' ? 'selected' : ''}>Capture</option>
                                    <option value="Thana/Police station" ${fReason === 'Thana/Police station' ? 'selected' : ''}>Thana/Police station</option>
                                    <option value="Lost or untraceable" ${fReason === 'Lost or untraceable' ? 'selected' : ''}>Lost or untraceable</option>
                                </select>
                            </div>
                            <button onclick="UI.exportOffroadCSV('${viewMode}')" class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all flex items-center shadow-sm">
                                <i class="fa-solid fa-file-csv mr-2 text-emerald-500"></i> <span class="text-xs font-bold uppercase">Export</span>
                            </button>
                        </div>

                        <!-- Data List (Table View) -->
                        <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b dark:border-slate-700">
                                        <tr>
                                            <th class="px-3 py-2.5">In Date</th>
                                            ${viewMode === 'archive' ? '<th class="px-3 py-2.5">Release</th>' : ''}
                                            <th class="px-3 py-2.5">Customer Code</th>
                                            <th class="px-3 py-2.5 w-40">Reason</th>
                                            <th class="px-3 py-2.5">Territory</th>
                                            <th class="px-3 py-2.5">Location</th>
                                            <th class="px-3 py-2.5">Remarks</th>
                                            <th class="px-3 py-2.5 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${allCases.map(v => `
                                            <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition cursor-pointer group" onclick="if(!event.target.closest('button')) UI.openOffroadModal('${v.id}')">
                                                <td class="px-3 py-2.5 font-mono text-xs text-slate-500">${v.inDate}</td>
                                                ${viewMode === 'archive' ? `<td class="px-3 py-2.5 font-mono text-xs text-green-600 font-bold">${v.solveDate || '-'}</td>` : ''}
                                                <td class="px-3 py-2.5">
                                                    <span class="font-black text-slate-800 dark:text-white font-mono group-hover:text-brand-600 transition-colors uppercase">${v.customerCode || v.customer_code || 'N/A'}</span>
                                                </td>
                                                <td class="px-3 py-2.5">
                                                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${UI.getOffroadBadgeColor(v.reason)}">
                                                        <i class="fa-solid ${UI.getOffroadIcon(v.reason)} mr-1"></i> ${v.reason}
                                                    </span>
                                                </td>
                                                <td class="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400">${v.territoryName}</td>
                                                <td class="px-3 py-2.5 text-xs max-w-xs truncate">${v.location || 'N/A'}</td>
                                                <td class="px-3 py-2.5 text-xs italic text-slate-400 max-w-xs truncate">"${v.remarks || ''}"</td>
                                                <td class="px-3 py-2.5 text-center">
                                                    <div class="flex items-center justify-center gap-2">
                                                        ${viewMode === 'active' ? `
                                                            <button onclick="event.stopPropagation(); UI.resolveOffroad('${v.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-200" title="Release">
                                                                <i class="fa-solid fa-check"></i>
                                                            </button>` : ''}
                                                        <button onclick="event.stopPropagation(); UI.openOffroadModal('${v.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-200" title="Edit">
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button onclick="event.stopPropagation(); UI.deleteOffroad('${v.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-200" title="Delete">
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                        ${allCases.length === 0 ? `<tr><td colspan="${viewMode === 'active' ? 7 : 8}" class="px-6 py-12 text-center text-slate-400 italic">No matching ${viewMode} records found.</td></tr>` : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },
            renderAdminProjections(targetDate) {
                const db = Store.get();
                const today = targetDate || Utils.getLocalDate();
                UI.projectionMonitorDate = today;

                // Initialize sorting state if not present
                if (UI.projectionSortCol === undefined) {
                    UI.projectionSortCol = 'territory';
                    UI.projectionSortOrder = 'asc';
                }

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry max-w-6xl mx-auto">
                        <!-- Redundant header title removed -->

                        <!-- FILTER BAR -->
                        <div class="mb-4 flex flex-col xl:flex-row gap-3 items-center justify-between bg-white dark:bg-dark-card p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto flex-1">
                                <!-- Search Input -->
                                <div class="relative w-full sm:w-56">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                        <i class="fa-solid fa-magnifying-glass text-xs"></i>
                                    </span>
                                    <input type="text" id="proj-search" oninput="UI.filterProjections()" placeholder="Search region or officer..." class="w-full pl-9 pr-3 py-1.5 h-9 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm outline-none">
                                </div>
                                
                                <!-- Part Filter -->
                                <div class="relative w-full sm:w-28">
                                    <select id="proj-part-filter" onchange="UI.filterProjections()" class="w-full pl-3 pr-8 py-1.5 h-9 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none shadow-sm cursor-pointer">
                                        <option value="All">All Parts</option>
                                        <option value="A">Part A</option>
                                        <option value="B">Part B</option>
                                    </select>
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>

                                <!-- Lock Status Filter -->
                                <div class="relative w-full sm:w-32">
                                    <select id="proj-lock-filter" onchange="UI.filterProjections()" class="w-full pl-3 pr-8 py-1.5 h-9 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none shadow-sm cursor-pointer">
                                        <option value="All">All Statuses</option>
                                        <option value="Unlocked">Unlocked Only</option>
                                        <option value="Locked">Locked Only</option>
                                    </select>
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>

                                <!-- Remaining Target Filter -->
                                <div class="relative w-full sm:w-36">
                                    <select id="proj-remaining-filter" onchange="UI.filterProjections()" class="w-full pl-3 pr-8 py-1.5 h-9 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none shadow-sm cursor-pointer">
                                        <option value="All">All Remaining</option>
                                        <option value="Zero">Fully Collected (0)</option>
                                        <option value="Under50k">Remaining &lt; 50k</option>
                                        <option value="50kTo200k">Remaining 50k-200k</option>
                                        <option value="Over200k">Remaining &gt; 200k</option>
                                    </select>
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>

                                <!-- Daily Req Filter -->
                                <div class="relative w-full sm:w-36">
                                    <select id="proj-rdrr-filter" onchange="UI.filterProjections()" class="w-full pl-3 pr-8 py-1.5 h-9 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none shadow-sm cursor-pointer">
                                        <option value="All">All Daily Req</option>
                                        <option value="Under5k">&le; 5,000 / day</option>
                                        <option value="5kTo15k">5,000 - 15,000 / day</option>
                                        <option value="Over15k">&gt; 15,000 / day</option>
                                    </select>
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-[10px]">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>
                            </div>

                            <!-- Date selector -->
                            <div class="flex items-center w-full xl:w-auto bg-slate-50/80 dark:bg-slate-800/80 px-3 py-1.5 h-9 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                <i class="fa-regular fa-calendar text-slate-400 mr-2 text-xs"></i>
                                <span class="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-wider shrink-0">Viewing Date:</span>
                                <input type="date" value="${today}" onchange="UI.renderAdminProjections(this.value)" class="bg-transparent border-none text-xs font-bold text-brand-600 dark:text-brand-400 focus:ring-0 outline-none cursor-pointer p-0 h-auto w-28">
                            </div>
                        </div>

                        <!-- STATS SUMMARY CARDS -->
                        <div id="proj-monitor-stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <!-- Populated dynamically -->
                        </div>

                        <div class="space-y-6">
                            <!-- 1. MISSING SUBMISSIONS SECTION -->
                            <div class="space-y-3">
                                <div class="flex justify-between items-center px-1">
                                    <h3 class="font-bold text-red-500 uppercase tracking-wider text-xs">Missing Submissions (<span id="missing-count">0</span>)</h3>
                                    <div class="flex items-center space-x-2">
                                        <button onclick="UI.unlockAllProjections()" class="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition" title="Unlock All for 30m">
                                            <i class="fa-solid fa-key mr-1"></i> Unlock All
                                        </button>
                                        <button onclick="UI.downloadMissingSubmissions()" class="text-[10px] bg-slate-800 hover:bg-slate-900 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition" title="Download List">
                                            <i class="fa-solid fa-download mr-1"></i> Snapshot
                                        </button>
                                    </div>
                                </div>
                                
                                <div id="missing-submissions-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    <!-- Populated dynamically -->
                                </div>
                            </div>

                            <!-- 2. SUBMITTED PROJECTIONS TABLE SECTION -->
                            <div class="space-y-3">
                                <div class="flex justify-between items-center px-1">
                                    <h3 class="font-bold text-emerald-500 uppercase tracking-wider text-xs">Submitted Projections (<span id="submitted-count">0</span>)</h3>
                                    <span class="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30 font-bold">Today</span>
                                </div>

                                <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <div class="overflow-x-auto">
                                        <table class="w-full text-sm text-left">
                                            <thead id="submitted-projections-thead" class="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                <!-- Populated dynamically -->
                                            </thead>
                                            <tbody id="submitted-projections-tbody" class="divide-y divide-slate-100 dark:divide-slate-700">
                                                <!-- Populated dynamically -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Run filters once to load content
                this.filterProjections();
            },

            getSortIcon(col) {
                if (UI.projectionSortCol !== col) return '<i class="fa-solid fa-sort opacity-35 ml-1 text-[8px]"></i>';
                return UI.projectionSortOrder === 'asc' 
                    ? '<i class="fa-solid fa-sort-up text-brand-500 ml-1"></i>' 
                    : '<i class="fa-solid fa-sort-down text-brand-500 ml-1"></i>';
            },

            sortProjections(col) {
                if (UI.projectionSortCol === col) {
                    UI.projectionSortOrder = UI.projectionSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    UI.projectionSortCol = col;
                    UI.projectionSortOrder = 'asc';
                }
                this.filterProjections();
            },

            filterProjections() {
                const db = Store.get();
                const today = UI.projectionMonitorDate || Utils.getLocalDate();
                
                const searchVal = (document.getElementById('proj-search')?.value || '').toLowerCase().trim();
                const partVal = document.getElementById('proj-part-filter')?.value || 'All';
                const lockVal = document.getElementById('proj-lock-filter')?.value || 'All';
                const remainingFilterVal = document.getElementById('proj-remaining-filter')?.value || 'All';
                const rdrrFilterVal = document.getElementById('proj-rdrr-filter')?.value || 'All';

                const submitted = [];
                const missing = [];

                db.territories.forEach(t => {
                    const proj = db.projections.find(p => (p.territoryId === t.id || p.territory_id === t.id) && p.date === today);
                    const isUnlocked = db.unlocks && db.unlocks[t.id] && db.unlocks[t.id] > Date.now();
                    const metrics = Calc.getMetrics(t.id);

                    const matchesSearch = t.name.toLowerCase().includes(searchVal) || t.officer.toLowerCase().includes(searchVal);
                    const matchesPart = partVal === 'All' || t.part === partVal;
                    const matchesLock = lockVal === 'All' || (lockVal === 'Unlocked' && isUnlocked) || (lockVal === 'Locked' && !isUnlocked);

                    // Remaining Target filter matches
                    let matchesRemaining = true;
                    if (remainingFilterVal === 'Zero') {
                        matchesRemaining = metrics.remainingAmt <= 0;
                    } else if (remainingFilterVal === 'Under50k') {
                        matchesRemaining = metrics.remainingAmt > 0 && metrics.remainingAmt < 50000;
                    } else if (remainingFilterVal === '50kTo200k') {
                        matchesRemaining = metrics.remainingAmt >= 50000 && metrics.remainingAmt <= 200000;
                    } else if (remainingFilterVal === 'Over200k') {
                        matchesRemaining = metrics.remainingAmt > 200000;
                    }

                    // Daily Required Filter matches
                    let matchesRdrr = true;
                    if (rdrrFilterVal === 'Under5k') {
                        matchesRdrr = metrics.rdrr <= 5000;
                    } else if (rdrrFilterVal === '5kTo15k') {
                        matchesRdrr = metrics.rdrr > 5000 && metrics.rdrr <= 15000;
                    } else if (rdrrFilterVal === 'Over15k') {
                        matchesRdrr = metrics.rdrr > 15000;
                    }

                    if (matchesSearch && matchesPart && matchesLock && matchesRemaining && matchesRdrr) {
                        if (proj) {
                            submitted.push({ ...t, proj, isUnlocked });
                        } else {
                            missing.push({ ...t, isUnlocked });
                        }
                    }
                });

                // Calculate Live Stats
                let totalProjSum = 0;
                let totalTodayCollSum = 0;
                let totalRemainingAmtSum = 0;
                let totalRdrrSum = 0;

                submitted.forEach(item => {
                    const metrics = Calc.getMetrics(item.id);
                    const regVal = parseFloat(item.proj.regularAmount || item.proj.regular_amount || 0);
                    const advVal = parseFloat(item.proj.advanceAmount || item.proj.advance_amount || 0);
                    totalProjSum += (regVal + advVal);
                    totalTodayCollSum += (parseFloat(metrics.todayColl) || 0);
                    totalRemainingAmtSum += (parseFloat(metrics.remainingAmt) || 0);
                    totalRdrrSum += (parseFloat(metrics.rdrr) || 0);
                });

                // Update Stats UI
                const statsContainer = document.getElementById('proj-monitor-stats');
                if (statsContainer) {
                    statsContainer.innerHTML = `
                        <div class="glass-panel p-4 rounded-xl border-l-4 border-brand-500 shadow-sm relative overflow-hidden group">
                            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Today's Proj. (Filtered)</p>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white font-mono">৳${Math.round(totalProjSum).toLocaleString()}</h3>
                            <div class="text-[9px] text-slate-500 mt-1">
                                Active submissions: ${submitted.length}
                            </div>
                        </div>
                        <div class="glass-panel p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm relative overflow-hidden group">
                            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Today's Collection</p>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white font-mono">৳${Math.round(totalTodayCollSum).toLocaleString()}</h3>
                            <div class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                Achievement: ${totalProjSum > 0 ? ((totalTodayCollSum / totalProjSum) * 100).toFixed(1) : '0.0'}%
                            </div>
                        </div>
                        <div class="glass-panel p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm relative overflow-hidden group">
                            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Remaining Target</p>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white font-mono">৳${Math.round(totalRemainingAmtSum).toLocaleString()}</h3>
                            <div class="text-[9px] text-slate-500 mt-1">
                                Month-end target gap
                            </div>
                        </div>
                        <div class="glass-panel p-4 rounded-xl border-l-4 border-amber-500 shadow-sm relative overflow-hidden group">
                            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Per Day Required Approx</p>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white font-mono">৳${Math.round(totalRdrrSum).toLocaleString()}</h3>
                            <div class="text-[9px] text-slate-500 mt-1">
                                MTD average required
                            </div>
                        </div>
                    `;
                }

                // Render Missing List
                const missingCountSpan = document.getElementById('missing-count');
                if (missingCountSpan) missingCountSpan.innerText = missing.length;

                const missingContainer = document.getElementById('missing-submissions-list');
                if (missingContainer) {
                    if (missing.length === 0) {
                        missingContainer.innerHTML = `<div class="col-span-full p-6 text-center text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200/50 dark:border-slate-700/50">All matching territories have submitted! 🎉</div>`;
                    } else {
                        missingContainer.innerHTML = missing.map(t => {
                            return `
                            <div class="p-3 bg-red-50/20 dark:bg-red-950/5 border border-red-100/50 dark:border-red-900/10 rounded-xl flex items-center justify-between hover:bg-red-50/40 dark:hover:bg-red-950/10 transition">
                                <div class="min-w-0 pr-2">
                                    <p class="font-bold text-slate-700 dark:text-slate-200 text-xs truncate">${t.name} <span class="text-[9px] font-black bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded">${t.part}</span></p>
                                    <p class="text-[10px] text-slate-500 truncate">${t.officer}</p>
                                </div>
                                <div class="flex items-center space-x-1.5 shrink-0">
                                    <button onclick="UI.modalEditProjection('${t.id}', 0, 0, 0, '${today}')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition" title="Add Projection">
                                        <i class="fa-solid fa-plus-circle text-xs"></i>
                                    </button>
                                    <button onclick="UI.openCollectionModal(null, '${t.id}')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition" title="Add Collection">
                                        <i class="fa-solid fa-money-bill-1-wave text-xs"></i>
                                    </button>
                                    ${t.isUnlocked ?
                                        `<span class="w-7 h-7 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/30 text-green-600" title="Unlocked">
                                            <i class="fa-solid fa-lock-open text-xs"></i>
                                        </span>` :
                                        `<button onclick="UI.unlockProjection('${t.id}')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition" title="Unlock for 30m">
                                            <i class="fa-solid fa-key text-xs"></i>
                                        </button>`
                                    }
                                </div>
                            </div>
                            `;
                        }).join('');
                    }
                }

                // Render Submitted List Table Headers
                const thead = document.getElementById('submitted-projections-thead');
                if (thead) {
                    thead.innerHTML = `
                        <tr>
                            <th onclick="UI.sortProjections('territory')" class="px-5 py-3 select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
                                Territory ${UI.getSortIcon('territory')}
                            </th>
                            <th onclick="UI.sortProjections('officer')" class="px-5 py-3 select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
                                Officer ${UI.getSortIcon('officer')}
                            </th>
                            <th onclick="UI.sortProjections('total')" class="px-5 py-3 text-right select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
                                Total Proj ${UI.getSortIcon('total')}
                            </th>
                            <th onclick="UI.sortProjections('files')" class="px-5 py-3 text-center select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
                                Files ${UI.getSortIcon('files')}
                            </th>
                            <th onclick="UI.sortProjections('todayColl')" class="px-5 py-3 text-right select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-emerald-600 dark:text-emerald-400">
                                Today Coll ${UI.getSortIcon('todayColl')}
                            </th>
                            <th onclick="UI.sortProjections('remaining')" class="px-5 py-3 text-right select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-slate-800 dark:text-white">
                                Remaining Target ${UI.getSortIcon('remaining')}
                            </th>
                            <th onclick="UI.sortProjections('rdrr')" class="px-5 py-3 text-right select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-brand-600 dark:text-brand-400">
                                Per Day Req ${UI.getSortIcon('rdrr')}
                            </th>
                            <th class="px-5 py-3 text-center cursor-default">Actions</th>
                        </tr>
                    `;
                }

                // Apply sorting on submitted array
                const sortCol = UI.projectionSortCol || 'territory';
                const sortOrder = UI.projectionSortOrder || 'asc';
                
                submitted.sort((a, b) => {
                    let valA, valB;
                    
                    const metricsA = Calc.getMetrics(a.id);
                    const metricsB = Calc.getMetrics(b.id);
                    
                    const regValA = parseFloat(a.proj.regularAmount || a.proj.regular_amount || 0);
                    const advValA = parseFloat(a.proj.advanceAmount || a.proj.advance_amount || 0);
                    const totalProjA = regValA + advValA;
                    
                    const regValB = parseFloat(b.proj.regularAmount || b.proj.regular_amount || 0);
                    const advValB = parseFloat(b.proj.advanceAmount || b.proj.advance_amount || 0);
                    const totalProjB = regValB + advValB;

                    if (sortCol === 'territory') {
                        valA = a.name;
                        valB = b.name;
                    } else if (sortCol === 'officer') {
                        valA = a.officer;
                        valB = b.officer;
                    } else if (sortCol === 'regular') {
                        valA = regValA;
                        valB = regValB;
                    } else if (sortCol === 'advance') {
                        valA = advValA;
                        valB = advValB;
                    } else if (sortCol === 'total') {
                        valA = totalProjA;
                        valB = totalProjB;
                    } else if (sortCol === 'files') {
                        valA = parseInt(a.proj.fileCount || a.proj.file_count || 0);
                        valB = parseInt(b.proj.fileCount || b.proj.file_count || 0);
                    } else if (sortCol === 'remaining') {
                        valA = metricsA.remainingAmt;
                        valB = metricsB.remainingAmt;
                    } else if (sortCol === 'rdrr') {
                        valA = metricsA.rdrr;
                        valB = metricsB.rdrr;
                    } else if (sortCol === 'todayColl') {
                        valA = parseFloat(metricsA.todayColl) || 0;
                        valB = parseFloat(metricsB.todayColl) || 0;
                    } else {
                        valA = a.name;
                        valB = b.name;
                    }

                    if (typeof valA === 'string') {
                        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                    } else {
                        return sortOrder === 'asc' ? valA - valB : valB - valA;
                    }
                });

                // Render Submitted List Table
                const submittedCountSpan = document.getElementById('submitted-count');
                if (submittedCountSpan) submittedCountSpan.innerText = submitted.length;

                const submittedTbody = document.getElementById('submitted-projections-tbody');
                if (submittedTbody) {
                    if (submitted.length === 0) {
                        submittedTbody.innerHTML = `<tr><td colspan="10" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500 italic">No submitted projections match the criteria.</td></tr>`;
                    } else {
                        submittedTbody.innerHTML = submitted.map(item => {
                            const metrics = Calc.getMetrics(item.id);

                            const regVal = item.proj.regularAmount || item.proj.regular_amount || 0;
                            const advVal = item.proj.advanceAmount || item.proj.advance_amount || 0;
                            const totalProj = parseFloat(regVal) + parseFloat(advVal);
                            const files = item.proj.fileCount || item.proj.file_count || 0;
                            const todayCollVal = parseFloat(metrics.todayColl) || 0;
                            const todayAchPct = totalProj > 0 ? (todayCollVal / totalProj) * 100 : 0;
                            
                            let achBadgeClass = "text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50";
                            if (todayCollVal > 0) {
                                if (todayAchPct >= 100) {
                                    achBadgeClass = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30";
                                } else if (todayAchPct >= 50) {
                                    achBadgeClass = "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30";
                                } else {
                                    achBadgeClass = "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/30";
                                }
                            }

                            let rdrrClass = "text-brand-600 dark:text-brand-400 font-bold";
                            if (metrics.rdrr > 15000) {
                                rdrrClass = "text-rose-600 dark:text-rose-400 font-extrabold";
                            } else if (metrics.rdrr > 5000) {
                                rdrrClass = "text-amber-650 dark:text-amber-500 font-bold";
                            }

                            return `
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td class="px-5 py-3.5">
                                    <div class="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1.5">
                                        ${item.name}
                                        <span class="text-[9px] font-black bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded border border-brand-100/50 dark:border-brand-900/20">${item.part}</span>
                                    </div>
                                </td>
                                <td class="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">${item.officer}</td>
                                <td class="px-5 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-white text-xs">${totalProj.toLocaleString()}</td>
                                <td class="px-5 py-3.5 text-center font-mono text-xs text-slate-500">${files}</td>
                                <td class="px-5 py-3.5 text-right font-mono text-xs">
                                    <div class="font-bold text-slate-800 dark:text-white">৳ ${Math.round(todayCollVal).toLocaleString()}</div>
                                    <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold mt-1 ${achBadgeClass}">
                                        ${todayAchPct.toFixed(0)}%
                                    </span>
                                </td>
                                <td class="px-5 py-3.5 text-right font-mono text-slate-800 dark:text-white text-xs font-semibold">
                                    <div>৳ ${Math.round(metrics.remainingAmt).toLocaleString()}</div>
                                    <div class="text-[9px] text-slate-400 font-normal">MTD: ৳${Math.round(metrics.mtdColl).toLocaleString()}</div>
                                </td>
                                <td class="px-5 py-3.5 text-right font-mono text-xs ${rdrrClass}">৳ ${Math.round(metrics.rdrr).toLocaleString()}</td>
                                <td class="px-5 py-3.5 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        ${item.isUnlocked ? `
                                            <span class="text-[9px] font-black text-green-600 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-lg border border-green-200/50" title="Unlocked for Editing">
                                                <i class="fa-solid fa-lock-open mr-0.5"></i> UNLOCKED
                                            </span>` : `
                                            <button onclick="UI.unlockProjection('${item.id}')" class="text-[10px] bg-slate-800 hover:bg-slate-900 text-white font-bold px-2 py-1 rounded shadow transition" title="Unlock for 30m Editing">
                                                <i class="fa-solid fa-key mr-0.5"></i> Unlock
                                            </button>`
                                        }
                                        <button onclick="UI.openCollectionModal(null, '${item.proj.territoryId || item.proj.territory_id}')" class="text-xs text-emerald-500 hover:text-emerald-700 font-bold p-1" title="Add Collection">
                                            <i class="fa-solid fa-plus-circle"></i>
                                        </button>
                                        <button onclick="UI.modalEditProjection('${item.proj.territoryId || item.proj.territory_id}', '${regVal}', '${advVal}', '${files}', '${today}')" class="text-xs text-blue-500 hover:text-blue-700 font-bold p-1" title="Edit Projection">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            `;
                        }).join('');
                    }
                }
            },

            unlockProjection(tId) {
                const db = Store.get();
                if (!db.unlocks) db.unlocks = {};

                const unlockUntil = Date.now() + (30 * 60 * 1000);
                db.unlocks[tId] = unlockUntil;

                fetch(`${Store.apiUrl}/unlock`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ territoryId: tId, unlockUntil: unlockUntil })
                }).then(() => {
                    this.renderAdminProjections();
                    UI.showSuccess('Unlocked for 30 minutes');
                }).catch(err => {
                    console.error('Unlock failed', err);
                    alert('Unlock failed: ' + err.message);
                });
            },

            async unlockAllProjections() {
                const db = Store.get();
                const allTerritories = db.territories;

                if (!confirm(`Are you sure you want to unlock editing and submission for all ${allTerritories.length} territories for 30 minutes?`)) return;

                UI.toggleLoader(true);
                const unlockUntil = Date.now() + (30 * 60 * 1000);
                if (!db.unlocks) db.unlocks = {};

                try {
                    for (const t of allTerritories) {
                        db.unlocks[t.id] = unlockUntil;
                        await fetch(`${Store.apiUrl}/unlock`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ territoryId: t.id, unlockUntil: unlockUntil })
                        });
                    }
                    UI.showSuccess(`Successfully unlocked editing and submission for all ${allTerritories.length} territories`);
                    this.renderAdminProjections();
                } catch (err) {
                    console.error('Bulk unlock failed', err);
                    alert('Some unlocks might have failed: ' + err.message);
                } finally {
                    UI.toggleLoader(false);
                }
            },

            downloadMissingSubmissions() {
                const db = Store.get();
                const today = Utils.getLocalDate();

                const missing = db.territories.filter(t => {
                    return !db.projections.some(p => (p.territoryId === t.id || p.territory_id === t.id) && p.date === today);
                });

                const groupA = missing.filter(t => t.part === 'A');
                const groupB = missing.filter(t => t.part === 'B');

                const content =
                    `Missing Projections Snapshot\n` +
                    `Date: ${today}\n` +
                    `===============================\n\n` +
                    `=== PART A (${groupA.length} missing) ===\n` +
                    groupA.map(t => `- ${t.name} (${t.officer})`).join('\n') + `\n\n` +
                    `=== PART B (${groupB.length} missing) ===\n` +
                    groupB.map(t => `- ${t.name} (${t.officer})`).join('\n');

                const blob = new Blob([content], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `Missing_Submissions_${today}.txt`;
                a.click();
            },

            modalEditProjection(tId, reg, adv, files, date) {
                const totalAmount = (Number(reg) || 0) + (Number(adv) || 0);
                const html = `
            <h3 class="text-xl font-bold mb-4 text-slate-800 dark:text-white" > Edit Projection</h3 >
                    <p class="text-xs text-slate-500 mb-2">Modifying projection for selected territory.</p>
                    <p class="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block mb-4">Date: ${date}</p>
                    <form onsubmit="UI.handleAdminEditProjection(event, '${tId}', '${date}')" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Today's Projection Amount (Total)</label>
                            <input type="number" name="amount" value="${totalAmount}" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Expected Collection Files</label>
                            <input type="number" name="files" value="${files}" class="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div class="flex justify-end space-x-2 pt-2">
                            <button type="button" onclick="document.getElementById('generic-modal').classList.add('hidden')" class="px-4 py-2 text-slate-500">Cancel</button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">Update</button>
                        </div>
                    </form>
        `;
                this.renderHtmlModal(html);
            },

            handleAdminEditProjection(e, tId, date) {
                e.preventDefault();
                UI.toggleLoader(true);
                const formData = new FormData(e.target);
                const db = Store.get();
                const today = date || Utils.getLocalDate();

                const existingProj = db.projections.find(p => (p.territoryId === tId || p.territory_id === tId) && p.date === today);

                const amount = parseFloat(formData.get('amount')) || 0;
                const files = parseInt(formData.get('files')) || 0;

                const payload = {
                    territory_id: tId,
                    date: today,
                    regular_amount: amount,
                    advance_amount: 0,
                    amount: amount,
                    file_count: files,
                    active_month: (existingProj && (existingProj.activeMonth || existingProj.active_month)) || (today === Utils.getLocalDate() ? Utils.getActiveMonth() : today.slice(0, 7)),
                    timestamp: (existingProj && existingProj.timestamp) ? Number(existingProj.timestamp) : Date.now()
                };

                if (existingProj && existingProj.id) {
                    payload.id = existingProj.id;
                } else {
                    payload.id = 'new_' + Date.now();
                }

                Store.update('projections', payload).then(() => {
                    UI.toggleLoader(false);
                    document.getElementById('generic-modal').classList.add('hidden');
                    UI.renderAdminProjections(today);
                }).catch(err => {
                    UI.toggleLoader(false);
                    alert("Error saving projection: " + err.message);
                });
            },

            renderAdminSettlementsView() {
                const db = Store.get();
                // Join with territory names
                const settlements = db.settlements.map(s => {
                    const t = db.territories.find(ter => ter.id === s.territoryId);
                    return { ...s, territoryName: t ? t.name : 'Unknown' };
                }).sort((a, b) => new Date(b.date) - new Date(a.date));

                const countType = (type) => settlements.filter(s => s.type === type).length;

                const allIds = settlements.map(s => s.id);

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry" >
                        <div class="mb-4 flex justify-end items-center gap-2">
                            <button onclick="UI.openSettlementModal()" class="group flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg shadow-md hover:bg-brand-700 transition hover:-translate-y-0.5">
                                <i class="fa-solid fa-plus mr-2"></i> Add New
                            </button>
                            <button onclick="UI.exportSettlementCSV()" class="group flex items-center px-4 py-2 bg-white dark:bg-dark-card border border-purple-200 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                                <i class="fa-solid fa-file-csv mr-2 group-hover:scale-110 transition-transform"></i>
                                <span class="font-bold text-xs uppercase tracking-wide">Export</span>
                            </button>
                        </div>

                        <!--Stats Cards-->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-purple-500 shadow-sm relative overflow-hidden group">
                                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <i class="fa-solid fa-hand-holding-dollar text-6xl text-purple-600"></i>
                                </div>
                                <p class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Early Settlements</p>
                                <h3 class="text-3xl font-bold text-slate-800 dark:text-white">${countType('Early Settlement')}</h3>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-blue-500 shadow-sm relative overflow-hidden group">
                                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <i class="fa-solid fa-folder-closed text-6xl text-blue-600"></i>
                                </div>
                                <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Regular Closures</p>
                                <h3 class="text-3xl font-bold text-slate-800 dark:text-white">${countType('Regular Close')}</h3>
                            </div>
                            <div class="glass-panel p-3.5 rounded-xl border-l-4 border-amber-500 shadow-sm relative overflow-hidden group">
                                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <i class="fa-solid fa-file-invoice-dollar text-6xl text-amber-600"></i>
                                </div>
                                <p class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Credit Notes</p>
                                <h3 class="text-3xl font-bold text-slate-800 dark:text-white">${countType('Credit Note')}</h3>
                            </div>
                        </div>

                        <!--Data Table-->
            <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                            <tr>
                                <th class="px-3 py-2.5 w-10 text-center">
                                    <input type="checkbox" id="select-all-settlements" onchange="UI.selectAll('settlements', ['${allIds.join("','")}'])" class="rounded border-slate-300 cursor-pointer">
                                </th>
                                <th class="px-3 py-2.5">Date</th>
                                <th class="px-3 py-2.5">Territory</th>
                                <th class="px-3 py-2.5">Customer Code</th>
                                <th class="px-3 py-2.5">Type</th>
                                <th class="px-3 py-2.5 text-right">Amount</th>
                                <th class="px-3 py-2.5">Remarks</th>
                                <th class="px-3 py-2.5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                            ${settlements.map(s => {
                    let badgeClass = '';
                    if (s.type === 'Early Settlement') badgeClass = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
                    else if (s.type === 'Credit Note') badgeClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
                    else badgeClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';

                    return `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                <td class="px-3 py-2.5 text-center">
                                                     <input type="checkbox" onchange="UI.toggleSelect('settlements', '${s.id}')" data-select-type="settlements" data-id="${s.id}" class="rounded border-slate-300 cursor-pointer">
                                                </td>
                                                <td class="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">${s.date}</td>
                                                <td class="px-3 py-2.5 font-medium text-slate-800 dark:text-white">${s.territoryName}</td>
                                                <td class="px-3 py-2.5 font-mono font-bold">${s.customerCode}</td>
                                                <td class="px-3 py-2.5">
                                                    <span class="px-2 py-1 rounded text-xs font-bold ${badgeClass}">${s.type}</span>
                                                </td>
                                                <td class="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    ৳${Number(s.amount || 0).toLocaleString()}
                                                </td>
                                                <td class="px-3 py-2.5 text-slate-500 italic truncate max-w-xs">${s.remarks || '-'}</td>
                                                <td class="px-3 py-2.5 text-center">
                                                    <button onclick="UI.openSettlementModal('${s.id}')" class="text-slate-400 hover:text-brand-600 transition">
                                                        <i class="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                }).join('')}
                            ${settlements.length === 0 ? '<tr><td colspan="8" class="px-6 py-12 text-center text-slate-400 italic">No records found in the vault.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
                    </div>
            `;
            },

            exportSettlementCSV() {
                const db = Store.get();
                if (db.settlements.length === 0) {
                    alert('No settlement data to export.');
                    return;
                }

                let csv = "Date,Territory,CustomerCode,Type,Amount,Remarks\n";
                db.settlements.forEach(s => {
                    const t = db.territories.find(ter => ter.id === s.territoryId);
                    const tName = t ? t.name : 'Unknown';
                    csv += `${s.date}, "${tName}", "${s.customerCode}", "${s.type}", ${s.amount}, "${s.remarks || ''}"\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Settlement_Closures_${Utils.getLocalDate()}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            },

            renderAdminHistory() {
                const { startOfMonth, endOfMonth } = Utils.getMonthBounds();

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry max-w-6xl mx-auto" >
                        <div class="mb-4 flex flex-col md:flex-row justify-end items-end md:items-center gap-4">
                            <form onsubmit="UI.updateAdminHistory(event)" class="flex items-center bg-white dark:bg-dark-card p-1.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full md:w-auto">
                                <div class="px-2 border-r border-slate-100 dark:border-slate-700 mr-2">
                                    <input type="text" name="territorySearch" placeholder="Territory..." oninput="UI.updateAdminHistory()" class="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 w-24 sm:w-32 outline-none">
                                </div>
                                <div class="px-2 border-r border-slate-100 dark:border-slate-700 mr-2">
                                    <input type="text" name="customerSearch" placeholder="ID, Name, Receipt..." oninput="UI.updateAdminHistory()" class="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 w-32 sm:w-40 outline-none" title="Search by Customer ID, Name, or Receipt. Use commas for multiple.">
                                </div>
                                <div class="flex items-center px-2">
                                    <i class="fa-regular fa-calendar text-slate-400 mr-2"></i>
                                    <input type="date" name="startDate" value="${startOfMonth}" onchange="UI.updateAdminHistory()" class="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 w-28 outline-none">
                                </div>
                                <span class="text-slate-300">-</span>
                                <div class="flex items-center px-2">
                                    <input type="date" name="endDate" value="${endOfMonth}" onchange="UI.updateAdminHistory()" class="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 w-28 outline-none">
                                </div>
                                <button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-lg transition shadow-md hover-lift">
                                    <i class="fa-solid fa-filter"></i>
                                </button>
                                <button type="button" onclick="UI.openCollectionModal()" class="ml-2 bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-900 transition shadow-md" title="Add Manual Collection">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </form>
                        </div>

                        <!--Summary Cards-->
                        <div id="admin-history-summary" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <!-- Injected by JS -->
                        </div>

                        <!--Table -->
            <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 uppercase font-bold">
                            <tr>
                                <th class="px-3 py-2 w-10 text-center">
                                    <input type="checkbox" id="select-all-history" class="rounded border-slate-300 cursor-pointer">
                                </th>
                                <th class="px-3 py-2">Date</th>
                                <th class="px-3 py-2">Territory</th>
                                <th class="px-3 py-2">Receipt</th>
                                <th class="px-3 py-2">Customer</th>
                                <th class="px-3 py-2">Mode</th>
                                <th class="px-3 py-2 text-right text-slate-400">Regular</th>
                                <th class="px-3 py-2 text-right text-brand-500">Advance</th>
                                <th class="px-3 py-2 text-right">Total</th>
                                <th class="px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="admin-history-table-body" class="divide-y divide-slate-100 dark:divide-slate-700">
                            <!-- Rows -->
                        </tbody>
                    </table>
                </div>
            </div>
                    </div>
            `;

                this.updateAdminHistory(null, startOfMonth, endOfMonth, '', '');
            },

            updateAdminHistory(e, startOverride, endOverride, searchOverride, customerSearchOverride) {
                if (e) e.preventDefault();

                let start = startOverride;
                let end = endOverride;
                let search = searchOverride || '';
                let customerSearch = customerSearchOverride || '';

                const startInput = document.querySelector('input[name="startDate"]');
                const endInput = document.querySelector('input[name="endDate"]');
                const territoryInput = document.querySelector('input[name="territorySearch"]');
                const customerInput = document.querySelector('input[name="customerSearch"]');

                if (startInput && endInput && startOverride === undefined) {
                    start = startInput.value;
                    end = endInput.value;
                    search = territoryInput ? territoryInput.value : '';
                    customerSearch = customerInput ? customerInput.value : '';
                }

                const db = Store.get();
                const searchTerms = customerSearch.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

                // Get all collections joined with territory name
                let filtered = db.collections.map(c => {
                    const t = db.territories.find(ter => ter.id === c.territoryId);
                    return { ...c, territoryName: t ? t.name : 'Unknown' };
                }).filter(c => {
                    const matchesDate = c.date >= start && c.date <= end;
                    const matchesTerritory = search === '' || (c.territoryName && c.territoryName.toLowerCase().includes(search.toLowerCase()));

                    let matchesCustomer = true;
                    if (searchTerms.length > 0) {
                        matchesCustomer = searchTerms.some(term => {
                            const cCode = String(c.customerCode || c.customer_code || '').toLowerCase();
                            const cName = String(c.customerName || c.customer_name || '').toLowerCase();
                            const cReceipt = String(c.receipt || '').toLowerCase();
                            const cFile = String(c.fileId || c.file_id || '').toLowerCase();

                            return cCode.includes(term) || cName.includes(term) || cReceipt.includes(term) || cFile.includes(term);
                        });
                    }

                    return matchesDate && matchesTerritory && matchesCustomer;
                }).sort((a, b) => new Date(b.date) - new Date(a.date));

                // Calc Totals
                const totalAmt = filtered.reduce((s, c) => s + parseFloat(c.amount), 0);
                const count = filtered.length;
                const bankAmt = filtered.filter(c => c.mode === 'Bank Transfer').reduce((s, c) => s + parseFloat(c.amount), 0);

                // Update Summary
                // Update Summary
                document.getElementById('admin-history-summary').innerHTML = `
                    <div class="glass-panel p-3.5 rounded-xl border-l-4 border-brand-500 shadow-sm relative overflow-hidden group hover-lift">
                        <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <i class="fa-solid fa-sack-dollar text-6xl text-brand-600"></i>
                         </div>
                        <p class="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">Total Collection</p>
                        <h3 class="text-3xl font-bold text-slate-800 dark:text-white">৳ ${Math.round(totalAmt).toLocaleString()}</h3>
                    </div>

                    <div class="glass-panel p-3.5 rounded-xl border-l-4 border-blue-500 shadow-sm relative overflow-hidden group hover-lift">
                        <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <i class="fa-solid fa-receipt text-6xl text-blue-600"></i>
                        </div>
                        <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Transactions</p>
                        <h3 class="text-3xl font-bold text-slate-800 dark:text-white">${count}</h3>
                    </div>

                    <div class="glass-panel p-3.5 rounded-xl border-l-4 border-purple-500 shadow-sm relative overflow-hidden group hover-lift">
                        <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                             <i class="fa-solid fa-building-columns text-6xl text-purple-600"></i>
                        </div>
                        <p class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Bank Deposit</p>
                        <h3 class="text-3xl font-bold text-slate-800 dark:text-white">৳ ${Math.round(bankAmt).toLocaleString()}</h3>
                    </div>
        `;

                // Update Table
                const tbody = document.getElementById('admin-history-table-body');
                const allIds = filtered.map(c => c.id);

                // Bind Select All event
                const selectAllCheck = document.getElementById('select-all-history');
                if (selectAllCheck) {
                    selectAllCheck.onclick = () => UI.selectAll('history', allIds);
                    selectAllCheck.checked = false; // Reset on re-render
                }

                if (filtered.length === 0) {
                    tbody.innerHTML = `<tr > <td colspan="10" class="px-6 py-12 text-center text-slate-400 italic">No collections found matching criteria.</td></tr > `;
                } else {
                    tbody.innerHTML = filtered.map(c => {
                        const reg = c.regularAmount || (c.advanceAmount ? 0 : c.amount);
                        const adv = c.advanceAmount || 0;
                        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition" >
                            <td class="px-3 py-2 text-center">
                                 <input type="checkbox" onchange="UI.toggleSelect('history', '${c.id}')" data-select-type="history" data-id="${c.id}" class="rounded border-slate-300 cursor-pointer">
                            </td>
                            <td class="px-3 py-2 font-mono text-slate-600 dark:text-slate-400 text-xs">${c.date}</td>
                            <td class="px-3 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs">${c.territoryName}</td>
                            <td class="px-3 py-2 font-medium text-slate-800 dark:text-white">#${c.receipt}</td>
                            <td class="px-3 py-2 font-mono text-xs text-brand-600">${c.customerCode || c.customer_code || 'N/A'}</td>
                            <td class="px-3 py-2">
                                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">${c.mode}</span>
                            </td>
                            <td class="px-3 py-2 text-right font-mono text-slate-500 text-xs">${parseFloat(reg).toLocaleString()}</td>
                            <td class="px-3 py-2 text-right font-mono text-brand-500 text-xs">${parseFloat(adv).toLocaleString()}</td>
                            <td class="px-3 py-2 text-right font-mono font-bold text-slate-800 dark:text-white">${parseFloat(c.amount).toLocaleString()}</td>
                            <td class="px-3 py-2 text-center space-x-2">
                                <button onclick="UI.openCollectionModal('${c.id}', '${c.territoryId}')" class="text-blue-500 hover:text-blue-700 p-1 transition" title="Edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="UI.deleteCollection('${c.id}')" class="text-red-500 hover:text-red-700 p-1 transition" title="Delete">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
            `}).join('');
                }
            },

            // --- OFFICER VIEWS ---
            renderOfficerDashboard() {
                const db = Store.get();
                const linkedTId = this.getCurrentTerritoryId();

                if (!linkedTId) {
                    document.getElementById('views-container').innerHTML = `<div class="p-8 text-center text-slate-500" > Your account is not linked to any Territory Data. Please contact Admin.</div> `;
                    return;
                }

                const metrics = Calc.getMetrics(linkedTId);
                const currentMonth = Utils.getActiveMonth();
                const targetData = db.targets.find(t => t.territoryId === linkedTId && t.month === currentMonth) || {};

                // Calculate Today Achievement for the new layout
                const todayAch = metrics.todayProj > 0 ? ((metrics.todayColl / metrics.todayProj) * 100).toFixed(1) : (metrics.todayColl > 0 ? '100+' : '0.0');

                // Calculate today's collection customer count
                const todayStr = Utils.getLocalDate();
                const todayCollEntries = metrics.rawCollections.filter(c => c.date === todayStr);
                const todayCollCustCount = new Set(todayCollEntries.map(c => c.customerCode)).size;

                // Calculate Regular vs Advance Split (MTD)
                const mtdCollReg = metrics.rawCollections.reduce((sum, c) => sum + (parseFloat(c.regularAmount) || (parseFloat(c.advanceAmount) ? 0 : parseFloat(c.amount)) || 0), 0);
                const mtdCollAdv = metrics.rawCollections.reduce((sum, c) => sum + (parseFloat(c.advanceAmount) || 0), 0);
                const totalCollSplit = mtdCollReg + mtdCollAdv;
                const regPct = totalCollSplit > 0 ? Math.round((mtdCollReg / totalCollSplit) * 100) : 0;
                const advPct = totalCollSplit > 0 ? Math.round((mtdCollAdv / totalCollSplit) * 100) : 0;

                // Calculate File Touch Percentage
                const fileTouchPct = metrics.targetFiles > 0 ? ((metrics.uniquePaidCodes / metrics.targetFiles) * 100).toFixed(1) : 0;

                const appUsePct = Calc.getAppUsePercentage(linkedTId);

                UI.updateHeader('Dashboard', `Territory: ${linkedTId}`, `
                    <div onclick="UI.showAppUseModal('${linkedTId}')" class="cursor-pointer relative flex items-center justify-center py-1 px-2 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover-lift group mr-2">
                        <div class="absolute inset-0 rounded-xl bg-gradient-to-tr ${
                            appUsePct >= 90 ? 'from-emerald-500/10 to-teal-500/5' :
                            appUsePct >= 70 ? 'from-amber-500/10 to-orange-500/5' :
                            'from-rose-500/10 to-red-500/5'
                        } opacity-100 group-hover:scale-105 transition-transform duration-500"></div>
                        
                        <div class="flex items-center gap-1.5 relative z-10">
                            <div class="flex items-center justify-center w-5 h-5 rounded-lg ${
                                appUsePct >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                                appUsePct >= 70 ? 'bg-amber-500/10 text-amber-500' :
                                'bg-rose-500/10 text-rose-500'
                            } text-[9px] font-black transition-transform duration-300 group-hover:rotate-12">
                                <i class="fa-solid fa-gauge-high"></i>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="hidden sm:inline text-[8px] uppercase tracking-wider font-black text-slate-400 leading-none">App Use</span>
                                <span class="text-xs font-black ${
                                    appUsePct >= 90 ? 'text-emerald-500' :
                                    appUsePct >= 70 ? 'text-amber-500' :
                                    'text-rose-500'
                                } leading-none">${appUsePct}%</span>
                            </div>
                        </div>
                    </div>
                `);

                document.getElementById('views-container').innerHTML = `
            <div id="officer-dashboard-panel" class="animate-entry mb-4 sm:mb-4" >
                    
                    <!--Portfolio Health Strip(Green Theme)-->
                    <div class="animate-entry mb-4 sm:mb-4 rounded-lg bg-gradient-to-r from-brand-600 to-blue-500 shadow-md text-white hover-lift overflow-hidden">
                        <div class="grid grid-cols-2 md:grid-cols-5 md:divide-x divide-white/20 bg-white/10 backdrop-blur-sm">
                            <div class="p-3 bg-black/10 md:bg-transparent col-span-2 md:col-span-1 border-b md:border-b-0 border-white/20">
                                <p class="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">Month Start Total OD</p>
                                <p class="text-xl font-bold font-mono">${parseInt(targetData.totalOd || 0).toLocaleString()}</p>
                            </div>
                            <div class="p-2.5 sm:p-3 border-r md:border-r-0 border-white/20">
                                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-80 mb-0.5">OD Growth(SPLY)</p>
                                <p class="text-base sm:text-lg font-bold leading-tight ${parseFloat(targetData.odGrowthSply) > 0 ? 'text-red-200' : 'text-green-200'}">
                                    ${targetData.odGrowthSply || 0}% <i class="fa-solid fa-arrow-${parseFloat(targetData.odGrowthSply) > 0 ? 'up' : 'down'} text-[10px]"></i>
                                </p>
                            </div>
                            <div class="p-2.5 sm:p-3 border-b md:border-b-0 border-white/20">
                                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-80 mb-0.5">Per File OD</p>
                                <p class="text-base sm:text-lg font-bold font-mono leading-tight">${parseInt(targetData.perFileOd || 0).toLocaleString()}</p>
                            </div>
                            <div class="p-2.5 sm:p-3 border-r md:border-r-0 border-white/20">
                                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-80 mb-0.5">6+ OD Files</p>
                                <p class="text-base sm:text-lg font-bold leading-tight">${targetData.sixPlusOdFiles || 0}</p>
                            </div>
                            <div class="p-2.5 sm:p-3">
                                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-80 mb-0.5">6+ Growth(SPLM)</p>
                                <p class="text-base sm:text-lg font-bold leading-tight ${parseFloat(targetData.sixPlusOdGrowthSplm) > 0 ? 'text-red-200' : 'text-green-200'}">
                                    ${targetData.sixPlusOdGrowthSplm || 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <!--RPI & OFFROAD STATUS BANNER - COMPRESSED FOR MOBILE -->
                    <div class="animate-entry mb-4 sm:mb-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-dark-card shadow-sm overflow-hidden flex flex-row divide-x divide-slate-100 dark:divide-slate-700/50">
                        <!-- Collection History Button (Left) -->
                        <div onclick="Router.navigate('officer-history')" class="flex-1 py-2 px-2 flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-all active:scale-95 duration-100 group text-slate-600 dark:text-slate-300">
                            <i class="fa-solid fa-clock-rotate-left text-[10px] sm:text-xs text-brand-500 group-hover:rotate-[-15deg] group-hover:scale-110 transition-transform"></i>
                            <span class="text-[9px] sm:text-xs font-black uppercase tracking-wider group-hover:text-brand-500 transition-colors">History</span>
                            <i class="fa-solid fa-chevron-right text-[6px] text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform"></i>
                        </div>

                        <!-- RPI Card (Center) -->
                        <div onclick="UI.showRPICriteriaModal()" class="flex-1 py-2 px-2 flex items-center justify-center gap-1.5 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Click to view marking criteria">
                            <i class="fa-solid fa-bolt-lightning text-[10px] sm:text-xs ${Calc.getRPIColor(metrics.rpi)}"></i>
                            <span class="text-[9px] sm:text-xs font-black uppercase tracking-wider ${Calc.getRPIColor(metrics.rpi)}">${metrics.rpi} RPI</span>
                        </div>

                        <!-- Active Offroad Card (Right) -->
                        <div onclick="Router.navigate('offroad-monitor')" class="flex-1 py-2 px-2 flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-all active:scale-95 duration-100 group text-rose-600 dark:text-rose-400 hover:bg-rose-50/5">
                            <i class="fa-solid fa-car-burst text-[10px] sm:text-xs group-hover:rotate-12 group-hover:scale-110 transition-transform"></i>
                            <span class="text-[9px] sm:text-xs font-black uppercase tracking-wider">${db.offroad_vehicles.filter(v => v.territoryId === linkedTId && v.status === 'Active').length} Offroad</span>
                            <i class="fa-solid fa-chevron-right text-[6px] text-rose-300 dark:text-rose-900/30 group-hover:translate-x-0.5 transition-transform"></i>
                        </div>
                    </div>

                    <!--COMPACT METRIC TABLE-->
                    <div class="animate-entry mb-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card">
                        <div class="overflow-x-auto scrollbar-hide">
                            <table class="w-full text-left border-collapse">
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                <!-- Row 1 -->
                                <tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 w-1/4 bg-blue-50/20 dark:bg-blue-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Target</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${parseInt(metrics.presetProjTotal).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 w-1/4 bg-slate-50/10 dark:bg-slate-800/5">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Files</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${metrics.targetFiles}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 w-1/4 bg-emerald-50/20 dark:bg-emerald-900/10">
                                         <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Today Pr</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${parseInt(metrics.todayProj).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 w-1/4 bg-rose-50/20 dark:bg-rose-900/10">
                                         <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Remain</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${parseInt(metrics.remainingAmt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Row 2 -->
                                <tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">TD Coll</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-0">${parseInt(metrics.mtdColl).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-slate-50/10 dark:bg-slate-800/5">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">C. Files</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-0">${metrics.uniquePaidCodes}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-emerald-50/20 dark:bg-emerald-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Today C.</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-0">${parseInt(metrics.todayColl).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 bg-rose-50/20 dark:bg-rose-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Daily Rq</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-red-600 mt-0.5 sm:mt-0">${parseInt(Math.round(metrics.rdrr)).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Row 3 -->
                                <tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Ach (M)</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-indigo-600 mt-0.5 sm:mt-0">${metrics.tillDayAchievement}%</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-slate-50/10 dark:bg-slate-800/5">
                                         <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Uncoll</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-rose-600 mt-0.5 sm:mt-0">${metrics.tillDateNonPayFiles}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-slate-100 dark:border-slate-700 bg-emerald-50/20 dark:bg-emerald-900/10">
                                         <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Ach (T)</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-fuchsia-600 mt-0.5 sm:mt-0">${todayAch}%</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 bg-rose-50/20 dark:bg-rose-900/10">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-slate-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">Run Rate</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-brand-600 mt-0.5 sm:mt-0">${metrics.rpi}</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Gap Spacer -->
                                <tr class="border-t-0 bg-transparent">
                                    <td colspan="4" class="h-3 sm:h-4 p-0 border-none"></td>
                                </tr>
                                <!-- Row 4 (LMNP Recovery) -->
                                <tr class="group hover:bg-amber-100/50 dark:hover:bg-amber-900/40 transition bg-amber-50/40 dark:bg-amber-900/20 border-[3px] border-dashed border-amber-400 dark:border-amber-600 shadow-sm relative">
                                    <td class="p-1.5 sm:p-2 border-r border-amber-200 dark:border-amber-800/30">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-amber-800 dark:text-amber-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">LM NP</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${parseInt(metrics.lmNpTargetAmt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-amber-200 dark:border-amber-800/30">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-amber-800 dark:text-amber-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">NP Rec</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-0">${parseInt(metrics.mtdLmNpColl).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2 border-r border-amber-200 dark:border-amber-800/30">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-amber-800 dark:text-amber-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">NP F(T)</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-slate-800 dark:text-white mt-0.5 sm:mt-0">${metrics.lmNpTargetFiles}</span>
                                        </div>
                                    </td>
                                    <td class="p-1.5 sm:p-2">
                                        <div class="flex flex-col sm:flex-row justify-between items-center">
                                            <span class="text-amber-800 dark:text-amber-500 font-bold uppercase tracking-tighter text-[8px] sm:text-[10px]">NP F(R)</span>
                                            <span class="font-bold text-[10px] sm:text-xs text-emerald-600 mt-0.5 sm:mt-0">${metrics.mtdLmNpFiles}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <!--COLLECTION MIX(Regular vs Advance) - NEW CREATIVE SECTION-->
                    <div class="animate-entry mb-4 sm:mb-4 p-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 shadow-sm mt-3">
                        <div class="flex justify-between items-end mb-1.5 px-1">
                            <div class="flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-slate-500"></span>
                                <div class="leading-none">
                                    <p class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Regular</p>
                                    <p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">${parseInt(mtdCollReg).toLocaleString()}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 text-right">
                                <div class="leading-none">
                                    <p class="text-[9px] sm:text-[10px] uppercase font-bold text-brand-500">Advance</p>
                                    <p class="text-xs sm:text-sm font-bold text-brand-600">${parseInt(mtdCollAdv).toLocaleString()}</p>
                                </div>
                                <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                            </div>
                        </div>
                        
                        <div class="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            <div class="h-full bg-slate-500 relative group transition-all duration-700" style="width: ${regPct}%"></div>
                            <div class="h-full bg-brand-500 relative group transition-all duration-700" style="width: ${advPct}%"></div>
                        </div>
                    </div>

                    <!--UNIFIED PROGRESS STATS CARD (File Touch & Collection Achievement)-->
                    <div class="animate-entry mb-4 sm:mb-4 p-3 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 shadow-sm mt-3 hover-lift">
                        <!-- File Touch Row -->
                        <div class="mb-3">
                            <div class="flex justify-between items-center mb-1.5 px-0.5">
                                <div class="flex items-center gap-2">
                                    <div class="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                        <i class="fa-solid fa-file-signature text-[10px]"></i>
                                    </div>
                                    <div class="leading-none">
                                        <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">File Touch %</span>
                                        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-1.5">(${metrics.uniquePaidCodes}/${metrics.targetFiles} Files)</span>
                                    </div>
                                </div>
                                <div class="text-right leading-none">
                                    <span class="text-xs font-bold text-emerald-600">${fileTouchPct}%</span>
                                </div>
                            </div>
                            <div class="relative h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500 relative transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]" style="width: ${Math.min(fileTouchPct, 100)}%"></div>
                            </div>
                        </div>

                        <!-- Collection Ach% Row -->
                        <div>
                            <div class="flex justify-between items-center mb-1.5 px-0.5">
                                <div class="flex items-center gap-2">
                                    <div class="w-5 h-5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                                        <i class="fa-solid fa-bullseye text-[10px]"></i>
                                    </div>
                                    <div class="leading-none">
                                        <span class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Collection Ach%</span>
                                        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-1.5">(${parseInt(metrics.mtdColl).toLocaleString()}/${parseInt(metrics.presetProjTotal).toLocaleString()})</span>
                                    </div>
                                </div>
                                <div class="text-right leading-none">
                                    <span class="text-xs font-bold text-violet-600">${metrics.tillDayAchievement}%</span>
                                </div>
                            </div>
                            <div class="relative h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-violet-500 to-indigo-500 relative transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(139,92,246,0.3)]" style="width: ${Math.min(100, Math.max(0, parseFloat(metrics.tillDayAchievement)))}%"></div>
                            </div>
                        </div>
                    </div>

                    <!--RECENT TRANSACTIONS-->
            <div class="animate-entry rounded-lg shadow border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sm:hidden">
                    <h3 class="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                        Today's Collections
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black shadow-sm" title="Unique Customers Collected Today">
                            <i class="fa-solid fa-users mr-0.5 opacity-85"></i>${todayCollCustCount}
                        </span>
                    </h3>
                    <button onclick="Router.navigate('officer-collection')" class="text-[10px] bg-brand-600 text-white px-2 py-1 rounded hover:bg-brand-700"><i class="fa-solid fa-plus"></i> Add</button>
                </div>
                <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700 hidden sm:flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        Today's Collections
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black shadow-sm" title="Unique Customers Collected Today">
                            <i class="fa-solid fa-users mr-0.5 opacity-85"></i>${todayCollCustCount}
                        </span>
                    </h3>
                    <button onclick="Router.navigate('officer-collection')" class="text-xs bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700 hover-lift"><i class="fa-solid fa-plus mr-1"></i> New Entry</button>
                </div>
                <div class="overflow-x-auto scrollbar-hide">
                    <table class="w-full text-xs sm:text-sm text-left min-w-[500px]">
                    <thead class="bg-slate-50 dark:bg-slate-800/80 text-[10px] sm:text-xs text-slate-500 uppercase">
                        <tr>
                            <th class="px-4 pb-2 pt-2 sm:px-6 sm:py-3">Receipt / Code</th>
                            <th class="px-4 pb-2 pt-2 sm:px-6 sm:py-3 w-1/4">Breakdown</th>
                            <th class="px-4 pb-2 pt-2 sm:px-6 sm:py-3 text-center">Mode</th>
                            <th class="px-4 pb-2 pt-2 sm:px-6 sm:py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        ${todayCollEntries.map(c => {
                            const isDup = metrics.rawCollections.some(other => other.id !== c.id && other.customerCode === c.customerCode && parseFloat(other.amount) === parseFloat(c.amount));
                            return `
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 ${isDup ? 'bg-yellow-50/40 dark:bg-yellow-900/10' : ''} relative transition-colors duration-300">
                                        <td class="px-4 py-2 sm:px-6 sm:py-3 relative">
                                            ${isDup ? '<div class="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-yellow-400 rounded-r shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse"></div>' : ''}
                                            <div class="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 flex-wrap">
                                                #${c.receipt}
                                                ${isDup ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest ring-1 ring-yellow-400/30 animate-pulse" title="Possible Duplicate Entry in this month"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Suspect</span>' : ''}
                                            </div>
                                            <div class="text-[10px] sm:text-xs text-slate-400 font-mono">${c.customerCode || 'N/A'}</div>
                                        </td>
                                        <td class="px-4 py-2 sm:px-6 sm:py-3">
                                            <div class="text-[10px] sm:text-xs">
                                                <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300"></span> <span class="text-slate-500 hidden sm:inline">Reg:</span><span class="sm:hidden w-6 text-slate-400 inline-block font-mono">Rg:</span> <span class="font-bold text-slate-700 dark:text-slate-300">${c.regularAmount ? parseFloat(c.regularAmount).toLocaleString() : '-'}</span></div>
                                                <div class="flex items-center gap-1 mt-0.5"><span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-400"></span> <span class="text-slate-500 hidden sm:inline">Adv:</span><span class="sm:hidden w-6 text-slate-400 inline-block font-mono">Ad:</span> <span class="font-bold text-brand-600">${c.advanceAmount ? parseFloat(c.advanceAmount).toLocaleString() : '-'}</span></div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-2 sm:px-6 sm:py-3 text-center">
                                            <span class="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[9px] sm:text-xs bg-slate-100 dark:bg-slate-700 font-medium">${c.mode === 'Cash' || c.mode.toLowerCase().includes('cash') ? '<i class="fa-solid fa-money-bill text-green-500 mr-1"></i>' : c.mode === 'Cheque' ? '<i class="fa-solid fa-money-check text-blue-500 mr-1"></i>' : '<i class="fa-solid fa-building-columns text-yellow-500 mr-1"></i>'} 
                                            ${c.mode}</span>
                                        </td>
                                            <td class="px-4 py-2 sm:px-6 sm:py-3 text-right">
                                                <div class="font-bold tracking-tight ${isDup ? 'text-yellow-600 dark:text-yellow-500' : ''}">${parseFloat(c.amount).toLocaleString()}</div>
                                                <div class="flex justify-end gap-2 mt-1">
                                                    <button onclick="UI.openCollectionModal('${c.id}', '${c.territoryId}')" class="text-[10px] text-brand-600 font-bold hover:underline transition flex items-center">
                                                        <i class="fa-solid fa-pen-to-square mr-1"></i> Edit
                                                    </button>
                                                    <button onclick="UI.deleteCollection('${c.id}')" class="text-[10px] text-rose-600 font-bold hover:underline transition flex items-center">
                                                        <i class="fa-solid fa-trash-can mr-1"></i> Delete
                                                    </button>
                                                </div>
                                            </td>
                                    </tr>
                            `;
                        }).join('')}
                        ${todayCollEntries.length === 0 ? '<tr><td colspan="4" class="px-6 py-6 text-center text-slate-400 text-sm">No collections today</td></tr>' : ''}
                    </tbody>
                </table>
                </div>
            </div>
        `;
            },

            renderOfficerOffroadTracker(viewMode = 'active') {
                const db = Store.get();
                const linkedTId = this.getCurrentTerritoryId();

                if (!linkedTId) {
                    document.getElementById('views-container').innerHTML = `<div class="p-8 text-center text-slate-500">Your account is not linked to any Territory Data. Please contact Admin.</div>`;
                    return;
                }

                // Get Filter
                const fReason = document.getElementById('officer-offroad-filter-reason')?.value || '';

                const offroadData = db.offroad_vehicles.filter(v => v.territoryId === linkedTId);

                // Filter for Display
                const displayData = (viewMode === 'active'
                    ? offroadData.filter(v => v.status === 'Active')
                    : offroadData.filter(v => v.status === 'Solved'))
                    .filter(v => !fReason || v.reason === fReason)
                    .sort((a, b) => {
                        if (viewMode === 'active') return new Date(b.inDate) - new Date(a.inDate);
                        return new Date(b.solveDate) - new Date(a.solveDate);
                    });

                // Dashboard Counts (based on filtered data)
                const total = displayData.length;
                const captured = displayData.filter(v => v.reason === 'Capture').length;
                const accident = displayData.filter(v => v.reason === 'Accident').length;
                const thana = displayData.filter(v => v.reason === 'Thana/Police station').length;
                const others = displayData.filter(v => v.reason === 'Lost or untraceable').length;

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry max-w-6xl mx-auto">
                        <div class="mb-4 flex flex-col md:flex-row justify-end items-stretch md:items-center gap-4">
                            <div class="flex flex-wrap items-center gap-3 justify-end">
                                <div class="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg inline-flex mr-2">
                                    <button onclick="UI.renderOfficerOffroadTracker('active')" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'active' ? 'bg-white dark:bg-slate-600 text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                        Active
                                    </button>
                                    <button onclick="UI.renderOfficerOffroadTracker('archive')" class="px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'archive' ? 'bg-white dark:bg-slate-600 text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}">
                                        Archive
                                    </button>
                                </div>

                                <button onclick="UI.openOffroadModal()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md font-bold transition flex items-center text-sm">
                                    <i class="fa-solid fa-plus mr-2"></i> Report New
                                </button>
                            </div>
                        </div>

                        <!-- Mini Dashboard -->
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div class="glass-panel p-4 rounded-xl border-b-4 border-slate-500/50 hover-lift">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total ${viewMode === 'active' ? 'Active' : 'Solved'}</p>
                                <p class="text-2xl font-black text-slate-800 dark:text-white">${total}</p>
                            </div>
                            <div class="glass-panel p-4 rounded-xl border-l-4 border-orange-500 hover-lift bg-orange-50/10">
                                <p class="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Captured</p>
                                <p class="text-2xl font-black text-slate-800 dark:text-white">${captured}</p>
                            </div>
                            <div class="glass-panel p-4 rounded-xl border-l-4 border-blue-500 hover-lift bg-blue-50/10">
                                <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Accident</p>
                                <p class="text-2xl font-black text-slate-800 dark:text-white">${accident}</p>
                            </div>
                            <div class="glass-panel p-4 rounded-xl border-l-4 border-indigo-500 hover-lift bg-indigo-50/10">
                                <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Thana</p>
                                <p class="text-2xl font-black text-slate-800 dark:text-white">${thana}</p>
                            </div>
                            <div class="glass-panel p-4 rounded-xl border-l-4 border-rose-500 hover-lift bg-rose-50/10">
                                <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Others</p>
                                <p class="text-2xl font-black text-slate-800 dark:text-white">${others}</p>
                            </div>
                        </div>

                        <!-- Search & Filter -->
                        <div class="mb-4 flex gap-4">
                            <div class="flex-1 relative">
                                <i class="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <select id="officer-offroad-filter-reason" onchange="UI.renderOfficerOffroadTracker('${viewMode}')" class="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-brand-500 shadow-sm appearance-none">
                                    <option value="">Filter by Incident Reason: All</option>
                                    <option value="Accident" ${fReason === 'Accident' ? 'selected' : ''}>Accident</option>
                                    <option value="Capture" ${fReason === 'Capture' ? 'selected' : ''}>Capture</option>
                                    <option value="Thana/Police station" ${fReason === 'Thana/Police station' ? 'selected' : ''}>Thana/Police station</option>
                                    <option value="Lost or untraceable" ${fReason === 'Lost or untraceable' ? 'selected' : ''}>Others/Lost</option>
                                </select>
                            </div>
                        </div>

                        <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b dark:border-slate-700">
                                        <tr>
                                            <th class="px-3 py-2.5">In Date</th>
                                            ${viewMode === 'archive' ? '<th class="px-3 py-2.5">Release Date</th>' : ''}
                                            <th class="px-3 py-2.5">Customer Code</th>
                                            <th class="px-3 py-2.5">Incident Type</th>
                                            <th class="px-3 py-2.5">Location</th>
                                            <th class="px-3 py-2.5">Remarks</th>
                                            ${viewMode === 'active' ? '<th class="px-3 py-2.5 text-center">Action</th>' : ''}
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${displayData.map(v => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                <td class="px-3 py-2.5 font-mono text-xs text-slate-500">${v.inDate}</td>
                                                ${viewMode === 'archive' ? `<td class="px-3 py-2.5 font-mono text-xs text-green-600 dark:text-green-400 font-bold">${v.solveDate || '-'}</td>` : ''}
                                                <td class="px-3 py-2.5">
                                                    <div class="font-bold text-slate-800 dark:text-white font-mono uppercase">${v.customerCode || v.customer_code || 'N/A'}</div>
                                                </td>
                                                <td class="px-3 py-2.5">
                                                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${this.getOffroadBadgeColor(v.reason)}">
                                                        <i class="fa-solid ${this.getOffroadIcon(v.reason)} mr-1"></i> ${v.reason}
                                                    </span>
                                                </td>
                                                <td class="px-3 py-2.5 text-xs">${v.location || 'N/A'}</td>
                                                <td class="px-3 py-2.5 text-xs italic text-slate-500">"${v.remarks}"</td>
                                                ${viewMode === 'active' ? `
                                                <td class="px-3 py-2.5 text-center">
                                                    <button onclick="UI.resolveOffroad('${v.id}')" class="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-md text-xs font-bold transition-all border border-green-200">
                                                        <i class="fa-solid fa-check mr-1"></i> Release
                                                    </button>
                                                </td>` : ''}
                                            </tr>
                                        `).join('')}
                                        ${displayData.length === 0 ? `<tr><td colspan="${viewMode === 'active' ? 6 : 7}" class="px-6 py-12 text-center text-slate-400 italic">No ${viewMode} incidents found.</td></tr>` : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },

            renderProjectionForm() {
                let hour = 9; // default
                try {
                    hour = parseInt(new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Dhaka',
                        hour: 'numeric',
                        hour12: false
                    }).format(new Date(Date.now() + (Store.clientServerDiff || 0)))) || 0;
                } catch (e) {
                    hour = new Date(Date.now() + (Store.clientServerDiff || 0)).getHours();
                }
                // Check if time is >= 10:00 AM
                let isLate = hour >= 10;

                const db = Store.get();
                const today = Utils.getLocalDate();

                // Resolve tId
                const tId = this.getCurrentTerritoryId();

                // Check for Admin Unlock
                if (isLate && db.unlocks && db.unlocks[tId]) {
                    if (db.unlocks[tId] > Date.now()) {
                        isLate = false; // Override lock if unlock timestamp is in future
                    }
                }

                const existing = db.projections.find(p => p.territoryId === tId && p.date === today);
                const existingRegular = existing ? (existing.regularAmount || existing.amount) : '';
                const existingAdvance = existing ? (existing.advanceAmount || '') : '';

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry max-w-xl mx-auto mt-10" >
                <div class="glass-panel p-8 rounded-xl shadow-xl dark:bg-dark-card border-t-4 ${isLate ? 'border-red-500' : 'border-brand-500'}">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full ${isLate ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'} flex items-center justify-center text-lg mr-3">
                            <i class="fa-regular fa-clock"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold">Morning Projection</h2>
                            <p class="text-xs ${isLate ? 'text-red-500' : 'text-slate-500'}">
                                ${isLate ? 'Submission window closed' : 'Submit before 10:00 AM'}
                            </p>
                        </div>
                    </div>

                    ${isLate && !existing ? `<div class="p-4 bg-red-50 text-red-700 rounded-lg mb-4 flex items-center"><i class="fa-solid fa-lock mr-2"></i> The projection window is closed. Contact Admin to unlock.</div>` : ''}

                    <form id="projection-form" onsubmit="UI.handleProjectionSubmit(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Today's Projection Amount (Total)</label>
                                    <div class="relative group">
                                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-brand-500 group-focus-within:scale-110 transition-transform">
                                            <i class="fa-solid fa-bangladeshi-taka-sign"></i>
                                        </span>
                                        <input type="number" id="proj-amount" value="${existing ? existing.amount : ''}" 
                                            ${isLate ? 'disabled' : ''} 
                                            class="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-lg font-bold font-mono" 
                                            placeholder="Enter total amount..." required>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Expected Collection Files</label>
                                    <div class="relative group">
                                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-blue-500 group-focus-within:scale-110 transition-transform">
                                            <i class="fa-solid fa-file-invoice"></i>
                                        </span>
                                        <input type="number" id="proj-files" value="${existing ? existing.fileCount : ''}" 
                                            ${isLate ? 'disabled' : ''} 
                                            class="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-bold font-mono" 
                                            placeholder="Enter number of files..." required>
                                    </div>
                                </div>
                            </div>

                                    ${!isLate ? `
                                        <div class="pt-4">
                                            <button type="submit" class="w-full bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-md border border-brand-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
                                                <i class="fa-solid fa-paper-plane group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>
                                                ${existing ? 'Update Today\'s Projection' : 'Submit Morning Projection'}
                                            </button>
                                        </div>
                                    ` : ''}
                        </div>
                    </form>
                </div>
                    </div>
            `;
            },

            renderCollectionForm() {
                const isCustomerCardEntry = !!(UI.activeCustomerPreFill && UI.activeCustomerPreFill.singleOnly);
                if (UI.activeCustomerPreFill && UI.activeCustomerPreFill.returnTo) {
                    UI.collectionReturnTo = UI.activeCustomerPreFill.returnTo;
                }

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry max-w-xl mx-auto mt-4 w-full px-4 sm:px-0" >
                <div class="glass-panel p-3.5 sm:p-8 rounded-xl shadow-xl dark:bg-dark-card relative overflow-hidden">
                    <!-- Decorative bg element -->
                    <div class="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
                                ${isCustomerCardEntry ? 'Single Collection Entry' : 'New Collection'}
                            </h2>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 ml-3 mt-0.5">${isCustomerCardEntry ? `Individual entry for Customer Code: <strong class="text-brand-600 dark:text-brand-400 font-mono">${UI.activeCustomerPreFill.customerId}</strong>` : 'Enter daily collection details'}</p>
                        </div>
                        <button onclick="UI.closeCollectionForm()" title="Close and return" class="group w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-slate-100 dark:border-slate-600 flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:shadow-sm">
                            <i class="fa-solid fa-xmark text-slate-400 group-hover:text-rose-500 text-sm transition-colors"></i>
                        </button>
                    </div>

                    <!-- Mode Switcher (Hidden when opened from individual Customer Card) -->
                    ${!isCustomerCardEntry ? `
                    <div class="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-4 border border-slate-200/50 dark:border-slate-700/50 relative z-10">
                        <button type="button" id="tab-single" onclick="UI.toggleCollectionMode('single')" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-750 text-brand-600 dark:text-brand-400 shadow-sm flex items-center justify-center gap-2">
                            <i class="fa-solid fa-file-invoice"></i> Single Entry
                        </button>
                        <button type="button" id="tab-bulk" onclick="UI.toggleCollectionMode('bulk')" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-list-check"></i> Batch Entry
                        </button>
                    </div>
                    ` : ''}

                    <form id="collection-form" onsubmit="UI.handleCollectionSubmit(event)" class="space-y-4 relative z-10">
                        <!-- Global Shared Fields: Date & Payment Mode -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-700/50">
                            <div id="global-date-container" class="col-span-1">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                                    <span>Collection Date</span>
                                    <span id="date-badge" class="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded border border-brand-200/50 dark:border-brand-800/30">Today</span>
                                </label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                                        <i class="fa-solid fa-calendar"></i>
                                    </span>
                                    <input type="text" id="coll-date" class="w-full pl-9 pr-3 py-0 h-10 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm block m-0 font-semibold text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer">
                                </div>
                                <div class="flex items-center gap-2 mt-1.5">
                                    <button type="button" onclick="UI.quickSetCollectionDate('today')" class="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-800/40 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/30 transition flex items-center gap-1">
                                        Today
                                    </button>
                                    <button type="button" onclick="UI.quickSetCollectionDate('yesterday')" class="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-800/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 transition flex items-center gap-1">
                                        Yesterday
                                    </button>
                                </div>
                            </div>
                            <div id="global-payment-mode-container" class="col-span-1">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Payment Mode</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                                        <i class="fa-solid fa-money-bill-wave text-xs"></i>
                                    </span>
                                    <select id="coll-mode" class="w-full pl-9 pr-3 py-0 h-10 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-xs sm:text-sm appearance-none block m-0 font-semibold text-slate-700 dark:text-slate-200">
                                        <option>Bank Transfer</option>
                                        <option>bKash</option>
                                        <option>Cheque</option>
                                        <option>Cash</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- 1. SINGLE ENTRY VIEW -->
                        <div id="single-entry-fields" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Customer Code</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-user-tag text-xs"></i>
                                        </span>
                                        <input type="text" id="coll-code" oninput="UI.calcOfficerCollFormTotal()" class="w-full pl-9 pr-3 py-0 h-10 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm appearance-none block m-0 font-semibold text-slate-700 dark:text-slate-200 shadow-sm" placeholder="C-1052">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Money Receipt No</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-file-invoice text-xs"></i>
                                        </span>
                                        <input type="text" id="coll-receipt" class="w-full pl-9 pr-3 py-0 h-10 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm appearance-none block m-0 font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
                                    </div>
                                </div>
                            </div>

                            
                            <!-- AUTO CALC AMOUNT SECTION -->
                            <div class="p-2 sm:p-3 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-xl sm:rounded-2xl border border-emerald-500/20 space-y-2 mt-3 sm:mt-4">
                                <div class="flex flex-col gap-1 pb-2 sm:pb-3 border-b border-emerald-500/20">
                                    <label class="block text-[10px] sm:text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-coins text-emerald-500"></i> Total Collected (৳) *</span>
                                        <span id="officer-coll-customer-found-badge" class="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 hidden">Customer Found</span>
                                    </label>
                                    <input type="number" step="any" id="officer-coll-input-total" oninput="UI.calcOfficerCollFormTotal()" required placeholder="0.00" class="w-full h-10 sm:h-12 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl outline-none focus:border-emerald-500 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl shadow-sm">
                                </div>
                                <input type="hidden" id="coll-reg-amount" value="0">
                                <input type="hidden" id="coll-adv-amount" value="0">
                                <div class="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                                    <div class="bg-white/60 dark:bg-slate-900/40 p-1.5 sm:p-2 rounded sm:rounded-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-center">
                                        <p class="text-[8px] sm:text-[9px] font-black uppercase text-slate-500 leading-tight">Total Due</p>
                                        <p class="text-[9px] sm:text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate" id="officer-coll-display-due">৳0</p>
                                    </div>
                                    <div class="bg-indigo-50/50 dark:bg-indigo-900/20 p-1.5 sm:p-2 rounded sm:rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 flex flex-col justify-center">
                                        <p class="text-[8px] sm:text-[9px] font-black uppercase text-indigo-500 leading-tight">Regular</p>
                                        <p class="text-[9px] sm:text-[11px] font-mono font-bold text-indigo-600 mt-0.5 truncate" id="officer-coll-display-reg">৳0</p>
                                    </div>
                                    <div class="bg-amber-50/50 dark:bg-amber-900/20 p-1.5 sm:p-2 rounded sm:rounded-lg border border-amber-200/50 dark:border-amber-800/50 flex flex-col justify-center">
                                        <p class="text-[8px] sm:text-[9px] font-black uppercase text-amber-500 leading-tight">Advance</p>
                                        <p class="text-[9px] sm:text-[11px] font-mono font-bold text-amber-600 mt-0.5 truncate" id="officer-coll-display-adv">৳0</p>
                                    </div>
                                </div>
                            </div>

                            </div>

                            <div class="flex justify-end pt-1">
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" id="coll-lmnp" class="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 shadow-sm m-0">
                                    <span class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">Last Month NP Recovery?</span>
                                </label>
                            </div>

                            <button type="submit" id="coll-submit-btn" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 rounded-lg shadow-md mt-4 transition transform active:scale-95 text-sm sm:text-base flex items-center justify-center">
                                Save Entry
                            </button>
                        </div>

                        <!-- 2. BATCH/MULTIPLE ENTRY VIEW (Hidden by default) -->
                        <div id="bulk-entry-fields" class="hidden space-y-4">
                            <div id="bulk-customers-container" class="space-y-4">
                                <!-- Dynamically populated by UI.renderBulkCustomerInputs() -->
                            </div>
                            
                            <button type="button" onclick="UI.addBulkCustomer()" class="w-full py-3 border-2 border-dashed border-slate-300 hover:border-brand-500 dark:border-slate-600 dark:hover:border-brand-500 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 rounded-xl transition text-xs font-bold flex items-center justify-center gap-1.5 hover-lift">
                                <i class="fa-solid fa-plus-circle text-sm"></i> Add Another Customer
                            </button>
                            
                            <button type="button" onclick="UI.submitBulkCustomers()" id="bulk-submit-btn" class="w-full bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold h-12 rounded-lg shadow-md mt-4 transition transform active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2">
                                <i class="fa-solid fa-cloud-arrow-up"></i> Submit Batch Collections
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            `;
                const collDateInput = document.getElementById('coll-date');
                const today = Utils.getLocalDate();
                collDateInput.value = today;
                
                // Initialize Flatpickr
                flatpickr(collDateInput, {
                    maxDate: today,
                    dateFormat: "Y-m-d",
                    defaultDate: today,
                    disableMobile: "true",
                    onChange: function(selectedDates, dateStr, instance) {
                        UI.handleCollectionDateChange({ value: dateStr });
                    }
                });

                // Reset batch queue state on load
                UI.batchCustomers = [
                    { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false },
                    { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false },
                    { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false }
                ];
                UI.collectionEntryMode = 'single';

                if (UI.activeCustomerPreFill) {
                    setTimeout(() => {
                        document.getElementById('coll-code').value = UI.activeCustomerPreFill.customerId;
                        UI.activeCustomerPreFill = null; // Reset after pre-filling
                    }, 50);
                }
            },

            // --- DATA ENTRY PANEL ---
            renderDataEntry(externalData = null) {
                const db = Store.get();
                const currentMonth = Utils.getActiveMonth();
                let displayData = [];

                // Load existing data or create dummy rows if empty
                if (externalData) {
                    displayData = externalData;
                } else if (db.territories.length <= 2) {
                    for (let i = 1; i <= 20; i++) {
                        const tId = `t${100 + i} `;
                        const part = i % 2 === 0 ? 'B' : 'A';
                        const existingT = db.territories.find(t => t.name === `Territory ${i} `);
                        displayData.push({
                            id: existingT ? existingT.id : tId,
                            name: existingT ? existingT.name : `Region ${i.toString().padStart(2, '0')} `,
                            part: existingT ? existingT.part : part,
                            targetFiles: 150,
                            projFiles: 140,
                            targetAmount: 500000,
                            projReg: 450000,
                            projAdv: 50000,
                            lmNpTargetAmount: 50000,
                            lmNpTargetFiles: 20,
                            totalOd: 120000,
                            odGrowthSply: 5.2,
                            perFileOd: 2500,
                            sixPlusOdFiles: 12,
                            sixPlusOdGrowthSplm: -1.5
                        });
                    }
                } else {
                    displayData = db.territories.map(t => {
                        const target = db.targets.find(tg => tg.territoryId === t.id && tg.month === currentMonth) || {};
                        return {
                            id: t.id,
                            name: t.name,
                            part: t.part,
                            targetFiles: target.files || 0,
                            projFiles: target.projFiles || 0,
                            targetAmount: target.amount || 0,
                            projReg: target.projReg || 0,
                            projAdv: target.projAdv || 0,
                            lmNpTargetAmount: target.lmNpTargetAmount || 0,
                            lmNpTargetFiles: target.lmNpTargetFiles || 0,
                            totalOd: target.totalOd || 0,
                            odGrowthSply: target.odGrowthSply || 0,
                            perFileOd: target.perFileOd || 0,
                            sixPlusOdFiles: target.sixPlusOdFiles || 0,
                            sixPlusOdGrowthSplm: target.sixPlusOdGrowthSplm || 0
                        };
                    });
                }

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry flex flex-col h-[calc(100vh-140px)]" >
                        <div class="mb-4 flex justify-end items-center">
                            <div class="flex space-x-3">
                                <button onclick="UI.downloadTargetTemplate()" class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium hover-lift">
                                    <i class="fa-solid fa-download mr-2 text-slate-500"></i> Template
                                </button>
                                
                                <button onclick="UI.downloadCurrentDataCSV()" class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium hover-lift" title="Export Current Data as CSV">
                                    <i class="fa-solid fa-file-csv mr-2 text-emerald-500"></i> Export Current
                                </button>
                                
                                <label class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium cursor-pointer hover-lift">
                                    <i class="fa-solid fa-upload mr-2 text-brand-600"></i> Import CSV
                                    <input type="file" class="hidden" accept=".csv" onchange="UI.handleCSVUpload(event)">
                                </label>

                                <button onclick="UI.saveBulkData()" class="flex items-center px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md transition transform active:scale-95 text-sm font-bold hover-lift">
                                    <i class="fa-solid fa-save mr-2"></i> Save All Changes
                                </button>
                            </div>
                        </div>

                        <div class="flex-1 glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
                            <div class="overflow-auto flex-1">
                                <table class="w-full text-sm text-left border-collapse" id="data-entry-table">
                                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase sticky top-0 z-10 font-bold text-xs">
                                        <!-- Top Group Header -->
                                        <tr>
                                            <th class="p-3 border-b border-slate-200 dark:border-slate-700 text-center" colspan="12"></th> <!-- Spacer for existing cols -->
                                            <th class="p-3 border-b border-l border-slate-200 dark:border-slate-700 bg-brand-50 dark:bg-brand-900/30 text-center text-brand-700 dark:text-brand-300 tracking-widest" colspan="5">Month First Status</th>
                                            <th class="p-3 border-b border-slate-200 dark:border-slate-700 text-center"></th>
                                        </tr>
                                        <!-- Column Headers -->
                                        <tr>
                                            <th class="p-3 border-b dark:border-slate-700 w-12 text-center">#</th>
                                            <th class="p-3 border-b dark:border-slate-700 w-20">Part</th>
                                            <th class="p-3 border-b dark:border-slate-700 min-w-[150px]">Territory Name</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20 w-24">Total Files</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20 w-24">Proj Files</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/20 w-32">Total EMI</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/20 w-32">Proj (Reg)</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/20 w-32">Proj (Adv)</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-slate-200 dark:bg-slate-700 w-32 font-bold">Total Proj</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-rose-50 dark:bg-rose-900/20 w-32">LM NP Amt</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-rose-50 dark:bg-rose-900/20 w-24">LM NP Files</th>
                                            
                                            <!-- New Columns -->
                                            <th class="p-3 border-b border-l border-slate-200 dark:border-slate-700 bg-brand-50/50 dark:bg-brand-900/10 w-28 text-center">Total OD</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-brand-50/50 dark:bg-brand-900/10 w-28 text-center">OD Growth SPLY <span class="text-[10px] text-slate-400 font-bold ml-1">(%)</span></th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-brand-50/50 dark:bg-brand-900/10 w-28 text-center">Per File OD</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-brand-50/50 dark:bg-brand-900/10 w-24 text-center">6+ OD Files</th>
                                            <th class="p-3 border-b dark:border-slate-700 bg-brand-50/50 dark:bg-brand-900/10 w-28 text-center">6+ OD Growth SPLM <span class="text-[10px] text-slate-400 font-bold ml-1">(%)</span></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${displayData.map((row, index) => {
                    const totalProj = (parseFloat(row.projReg) || 0) + (parseFloat(row.projAdv) || 0);
                    return `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition" data-id="${row.id || 'new'}">
                                                <td class="p-2 text-center text-slate-400 text-xs">${index + 1}</td>
                                                <td class="p-1"><select name="part" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center"><option value="A" ${row.part === 'A' ? 'selected' : ''}>A</option><option value="B" ${row.part === 'B' ? 'selected' : ''}>B</option></select></td>
                                                <td class="p-1"><input type="text" name="name" value="${row.name}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-medium"></td>
                                                <td class="p-1"><input type="number" name="targetFiles" value="${row.targetFiles}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                                                <td class="p-1"><input type="number" name="projFiles" value="${row.projFiles}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                                                <td class="p-1"><input type="number" name="targetAmount" value="${row.targetAmount}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-blue-600"></td>
                                                <td class="p-1"><input type="number" name="projReg" value="${row.projReg}" oninput="UI.calcRowTotal(this)" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                                <td class="p-1"><input type="number" name="projAdv" value="${row.projAdv}" oninput="UI.calcRowTotal(this)" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                                <td class="p-1"><input type="number" name="totalProj" value="${totalProj}" readonly class="w-full p-2 bg-slate-50 dark:bg-slate-800 border-none text-right font-mono font-bold text-slate-500 cursor-default"></td>
                                                <td class="p-1"><input type="number" name="lmNpTargetAmount" value="${row.lmNpTargetAmount}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-600"></td>
                                                <td class="p-1"><input type="number" name="lmNpTargetFiles" value="${row.lmNpTargetFiles}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                                                
                                                <!-- New Inputs -->
                                                <td class="p-1 border-l border-slate-100 dark:border-slate-700"><input type="number" name="totalOd" value="${row.totalOd}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-brand-600 dark:text-brand-400"></td>
                                                <td class="p-1"><div class="relative"><input type="number" name="odGrowthSply" value="${row.odGrowthSply}" step="0.01" class="w-full p-2 pr-6 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"><span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-[10px]">%</span></div></td>
                                                <td class="p-1"><input type="number" name="perFileOd" value="${row.perFileOd}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                                <td class="p-1"><input type="number" name="sixPlusOdFiles" value="${row.sixPlusOdFiles}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                                                <td class="p-1"><div class="relative"><input type="number" name="sixPlusOdGrowthSplm" value="${row.sixPlusOdGrowthSplm}" step="0.01" class="w-full p-2 pr-6 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"><span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-[10px]">%</span></div></td>

                                                <td class="p-1 text-center"><button onclick="UI.deleteDataEntryRow(this, '${row.id || 'new'}')" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
                                            </tr>`;
                }).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 flex justify-between">
                                <button onclick="UI.addEmptyDataRow()" class="text-brand-600 hover:text-brand-700 font-bold">+ Add Row</button>
                            </div>
                        </div>
                    </div>
            `;
            },


            renderUserManagement() {
                const db = Store.get();

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry flex flex-col h-[calc(100vh-140px)]" >
                        <div class="mb-4 flex justify-end items-center">
                            <div class="flex space-x-3">
                                <button onclick="UI.downloadUserTemplate()" class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium hover-lift">
                                    <i class="fa-solid fa-download mr-2 text-slate-500"></i> Download Template
                                </button>
                                <label class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium cursor-pointer hover-lift">
                                    <i class="fa-solid fa-file-csv mr-2 text-brand-600"></i> Import Users CSV
                                    <input type="file" class="hidden" accept=".csv" onchange="UI.handleUserCSV(event)">
                                </label>
                                <button onclick="UI.restoreDefaultUsers()" class="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm font-medium hover-lift" title="Restore default territory officers">
                                    <i class="fa-solid fa-rotate-left mr-2 text-brand-600"></i> Restore Default Officers
                                </button>
                                <button onclick="UI.saveUsers()" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md font-bold hover-lift">
                                    <i class="fa-solid fa-save mr-2"></i> Save Users
                                </button>
                            </div>
                        </div>

                        <div class="flex-1 glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
                             <div class="overflow-auto flex-1">
                                <table class="w-full text-sm text-left border-collapse" id="user-mgmt-table">
                                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase sticky top-0 z-10 font-bold text-xs">
                                        <tr>
                                            <th class="p-3 border-b dark:border-slate-700 w-12 text-center">#</th>
                                            <th class="p-3 border-b dark:border-slate-700">Territory Name (Username)</th>
                                            <th class="p-3 border-b dark:border-slate-700">Officer Name</th>
                                            <th class="p-3 border-b dark:border-slate-700">Employee ID (Password)</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-center w-24">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${db.users.filter(u => u.role === 'officer').map((u, i) => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                <td class="p-2 text-center text-slate-400 text-xs">${i + 1}</td>
                                                <td class="p-1"><input type="text" name="username" value="${u.username}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-medium"></td>
                                                <td class="p-1"><input type="text" name="officerName" value="${u.officerName || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                                <td class="p-1"><input type="text" name="password" value="${u.password}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono text-slate-600 dark:text-slate-400"></td>
                                                <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 flex justify-between">
                                <button onclick="UI.addUserRow()" class="text-brand-600 hover:text-brand-700 font-bold">+ Add Officer</button>
                            </div>
                        </div>
                    </div>
            `;
            },

            // --- SELECTION & BULK ACTIONS HELPERS ---
            selection: { type: null, ids: new Set() },

            _injectFloatingDockCSS() {
                if (document.getElementById('floating-dock-style')) return;
                const style = document.createElement('style');
                style.id = 'floating-dock-style';
                style.textContent = `
                .floating-dock {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px); /* Start off-screen */
            opacity: 0;
            visibility: hidden;
            transition: transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0.3s ease-out;
            z-index: 1000;
        }
                    .floating-dock.visible {
            transform: translateX(-50%) translateY(0); /* Slide into view */
            opacity: 1;
            visibility: visible;
        }
        `;
                document.head.appendChild(style);
            },

            toggleSelect(type, id) {
                if (this.selection.type !== type) {
                    this.selection.type = type;
                    this.selection.ids.clear();
                }
                if (this.selection.ids.has(id)) this.selection.ids.delete(id);
                else this.selection.ids.add(id);
                this.renderDock();
                this.updateCheckboxes(type);
            },

            selectAll(type, allIds) {
                this.selection.type = type;
                if (this.selection.ids.size === allIds.length) {
                    this.selection.ids.clear();
                } else {
                    allIds.forEach(id => this.selection.ids.add(id));
                }
                this.renderDock();
                this.updateCheckboxes(type);
            },

            updateCheckboxes(type) {
                document.querySelectorAll(`input[data-select-type="${type}"]`).forEach(cb => {
                    const id = cb.getAttribute('data-id');
                    cb.checked = this.selection.ids.has(id);
                });
                const master = document.getElementById(`select-all-${type}`);
                if (master) master.checked = this.selection.ids.size > 0; // Simple indeterminate/checked state
            },

            renderDock() {
                this._injectFloatingDockCSS(); // Ensure CSS is injected
                let dock = document.getElementById('floating-dock');
                if (!dock) {
                    dock = document.createElement('div');
                    dock.id = 'floating-dock';
                    dock.className = 'floating-dock glass-panel px-3 py-2 rounded-xl shadow-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl';
                    document.body.appendChild(dock);
                }

                if (this.selection.ids.size === 0) {
                    dock.classList.remove('visible');
                    return;
                }

                dock.innerHTML = `
            <div class="flex items-center border-r border-slate-300 dark:border-slate-600 pr-4 mr-2" >
                        <span class="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">${this.selection.ids.size}</span>
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Selected</span>
                    </div>
                    <div class="flex items-center gap-2">
                         ${this.selection.type !== 'vehicle_performance' ? `
                        <button onclick="UI.bulkEdit('${this.selection.type}')" class="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition" title="Edit Selected">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>` : ''} 
                        <button onclick="UI.bulkDelete('${this.selection.type}')" class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Selected">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                    <button onclick="UI.clearSelection()" class="ml-2 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
        `;

                // Allow reflow
                setTimeout(() => dock.classList.add('visible'), 10);
            },

            clearSelection() {
                this.selection.ids.clear();
                this.renderDock();
                this.updateCheckboxes(this.selection.type);
            },

            async bulkDelete(type) {
                if (!confirm(`Delete ${this.selection.ids.size} items ? This cannot be undone.`)) return;

                // Map selection types to DB collections
                const map = {
                    'vehicle_performance': 'vehicle_performance',
                    'offroad': 'offroad_vehicles',
                    'settlements': 'settlements',
                    'history': 'collections',
                    'projections': 'projections'
                };

                await Store.deleteMany(map[type], Array.from(this.selection.ids));
                this.clearSelection();

                // Refresh Views
                if (type === 'vehicle_performance') UI.renderAdminVehiclePerf();
                if (type === 'offroad') UI.renderAdminOffroadView();
                if (type === 'settlements') UI.renderAdminSettlementsView();
                if (type === 'history') UI.renderAdminHistory();
                if (type === 'projections') UI.renderAdminProjections();

                UI.showSuccess('Items deleted successfully');
            },

            bulkEdit(type) {
                if (type === 'history' && this.selection.ids.size > 1) {
                    UI.openBulkDateChangeModal();
                    return;
                }
                if (this.selection.ids.size > 1) {
                    alert("Bulk edit is not supported yet. Please select one item to edit.");
                    return;
                }
                const id = Array.from(this.selection.ids)[0];
                if (type === 'offroad') UI.openOffroadModal(id);
                if (type === 'settlements') UI.openSettlementModal(id);
                if (type === 'history') UI.openCollectionModal(id); // Using existing or new modal
                if (type === 'projections') UI.openProjectionModal(id);
            },

            openBulkDateChangeModal() {
                const count = this.selection.ids.size;
                const today = Utils.getLocalDate();
                const html = `
                    <form onsubmit="UI.saveBulkDateChange(event)" class="space-y-4">
                        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-500 space-y-1">
                            <p class="font-bold text-slate-700 dark:text-slate-350">You have selected <span class="text-brand-500 font-extrabold">${count}</span> collections.</p>
                            <p>Entering a new date will update the collection date for all selected records.</p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">New Collection Date</label>
                            <input type="date" name="bulkDate" value="${today}" required class="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-semibold text-slate-750 dark:text-slate-200">
                        </div>
                        <button type="submit" class="w-full py-3 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold rounded-lg shadow-md hover-lift transition">
                            <i class="fa-solid fa-calendar-check mr-2"></i> Update ${count} Collections
                        </button>
                    </form>
                `;
                this.renderModal('Bulk Change Date', html);
            },

            saveBulkDateChange(e) {
                e.preventDefault();
                UI.toggleLoader(true);
                const formData = new FormData(e.target);
                const newDate = formData.get('bulkDate');
                const selectedIds = Array.from(this.selection.ids);

                if (!newDate) {
                    alert('Please select a valid date.');
                    UI.toggleLoader(false);
                    return;
                }

                (async () => {
                    try {
                        const db = Store.get();
                        const promises = selectedIds.map(async (id) => {
                            const item = db.collections.find(c => String(c.id) === String(id));
                            if (item) {
                                // Update date and active month
                                item.date = newDate;
                                item.active_month = newDate.slice(0, 7);
                                return Store.update('collections', item);
                            }
                        });

                        await Promise.all(promises);
                        UI.showSuccess(`Successfully updated date for ${selectedIds.length} collections!`);
                        
                        UI.closeModal('generic-modal');
                        UI.clearSelection();
                        UI.renderAdminHistory();
                    } catch (err) {
                        alert("Error updating collection dates: " + err.message);
                    } finally {
                        UI.toggleLoader(false);
                    }
                })();
            },

            // --- PAGE RENDERING ---
            handleProjectionSubmit(e) {
                e.preventDefault();
                
                const dbLocal = Store.get();
                if (dbLocal?.system_settings?.find(s => s.key === 'system_hold')?.value === 'true') {
                    alert("System is currently on hold. Submissions are paused by Admin.");
                    return;
                }
                
                UI.toggleLoader(true);
                (async () => {
                    const amountInput = document.getElementById('proj-amount');
                    const filesInput = document.getElementById('proj-files');

                    const amount = parseFloat(amountInput.value) || 0;
                    const files = filesInput.value;

                    const db = Store.get();
                    const today = Utils.getLocalDate();

                    const btn = e.target.querySelector('button[type="submit"]');
                    const originalBtnContent = btn ? btn.innerHTML : '';
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
                        btn.disabled = true;
                    }

                    try {
                        let tId = Auth.currentUser.territoryId;
                        if (!tId) {
                            const db = Store.get();
                            const t = db.territories.find(t => t.name === Auth.currentUser.username || t.officer === Auth.currentUser.username);
                            if (t) tId = t.id;
                        }

                        // Check if a projection already exists for this territory today
                        const existingProj = db.projections.find(p => (p.territoryId === tId || p.territory_id === tId) && p.date === today);

                        const payload = {
                            territory_id: tId,
                            date: today,
                            regular_amount: amount,
                            advance_amount: 0,
                            amount: amount,
                            file_count: files,
                            active_month: (existingProj && (existingProj.activeMonth || existingProj.active_month)) || (today === Utils.getLocalDate() ? Utils.getActiveMonth() : today.slice(0, 7)),
                            timestamp: (existingProj && existingProj.timestamp) ? Number(existingProj.timestamp) : Date.now()
                        };

                        if (existingProj && existingProj.id) {
                            payload.id = existingProj.id;
                        } else {
                            payload.id = 'new_' + Date.now();
                        }

                        // For the backend, we just send the update
                        await Store.update('projections', payload);

                        UI.showSuccess('Projection Submitted!');
                        Router.navigate('officer-dashboard');
                    } catch (err) {
                        alert("Error saving projection: " + err.message);
                    } finally {
                        if (btn) {
                            btn.innerHTML = originalBtnContent;
                            btn.disabled = false;
                        }
                        UI.toggleLoader(false);
                    }
                })();
            },

            quickSetCollectionDate(dateType) {
                const today = Utils.getLocalDate();
                let targetDate = today;
                if (dateType === 'yesterday') {
                    const yesterday = new Date(new Date(today) - 24 * 60 * 60 * 1000);
                    targetDate = Utils.getLocalDate(yesterday);
                }
                
                const collDateInput = document.getElementById('coll-date');
                if (collDateInput) {
                    if (collDateInput._flatpickr) {
                        collDateInput._flatpickr.setDate(targetDate, true);
                    } else {
                        collDateInput.value = targetDate;
                        UI.handleCollectionDateChange(collDateInput);
                    }
                }
            },

            handleCollectionDateChange(input) {
                const badge = document.getElementById('date-badge');
                if (!badge) return;
                
                const selected = input.value;
                const today = Utils.getLocalDate();
                
                if (!selected || selected === today) {
                    badge.innerText = 'Today';
                    badge.className = 'text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded border border-brand-200/50 dark:border-brand-800/30';
                } else {
                    const diffTime = new Date(today) - new Date(selected);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        badge.innerText = 'Yesterday';
                        badge.className = 'text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/30';
                    } else if (diffDays > 1) {
                        badge.innerText = `${diffDays} days ago`;
                        badge.className = 'text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded border border-rose-200/50 dark:border-rose-800/30';
                    } else if (diffDays < 0) {
                        badge.innerText = 'Future Date';
                        badge.className = 'text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/30';
                    } else {
                        badge.innerText = 'Today';
                        badge.className = 'text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded border border-brand-200/50 dark:border-brand-800/30';
                    }
                }
            },

            toggleCollectionMode(mode) {
                UI.collectionEntryMode = mode;
                const tabSingle = document.getElementById('tab-single');
                const tabBulk = document.getElementById('tab-bulk');
                const singleFields = document.getElementById('single-entry-fields');
                const bulkFields = document.getElementById('bulk-entry-fields');
                const dateContainer = document.getElementById('global-date-container');
                const paymentContainer = document.getElementById('global-payment-mode-container');

                if (mode === 'single') {
                    if (tabSingle) {
                        tabSingle.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-750 text-brand-600 dark:text-brand-400 shadow-sm flex items-center justify-center gap-2";
                    }
                    if (tabBulk) {
                        tabBulk.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2";
                    }
                    if (singleFields) singleFields.classList.remove('hidden');
                    if (bulkFields) bulkFields.classList.add('hidden');
                    
                    if (dateContainer) {
                        dateContainer.className = "col-span-1";
                    }
                    if (paymentContainer) {
                        paymentContainer.classList.remove('hidden');
                    }
                } else {
                    if (tabSingle) {
                        tabSingle.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2";
                    }
                    if (tabBulk) {
                        tabBulk.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-750 text-brand-600 dark:text-brand-400 shadow-sm flex items-center justify-center gap-2";
                    }
                    if (singleFields) singleFields.classList.add('hidden');
                    if (bulkFields) bulkFields.classList.remove('hidden');
                    
                    if (dateContainer) {
                        dateContainer.className = "col-span-1 sm:col-span-2";
                    }
                    if (paymentContainer) {
                        paymentContainer.classList.add('hidden');
                    }
                    
                    UI.renderBulkCustomerInputs();
                }
            },

            renderBulkCustomerInputs() {
                const container = document.getElementById('bulk-customers-container');
                if (!container) return;
                
                let html = '';
                UI.batchCustomers.forEach((item, index) => {
                    html += `
                    <div class="relative bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-3 animate-entry">
                        <!-- Card Header -->
                        <div class="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <span class="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[9px] font-bold">${index + 1}</span>
                                Customer Details
                            </span>
                            ${UI.batchCustomers.length > 1 ? `
                            <button type="button" onclick="UI.removeBulkCustomer(${index})" class="text-slate-400 hover:text-rose-505 dark:hover:text-rose-400 hover:scale-105 transition p-1 text-[10px] font-bold flex items-center gap-1">
                                <i class="fa-solid fa-trash-can text-sm"></i> Remove
                            </button>
                            ` : ''}
                        </div>

                        <!-- Inputs Grid 1: Customer Code & Money Receipt -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <!-- Customer Code -->
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Customer Code</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]">
                                        <i class="fa-solid fa-user-tag"></i>
                                    </span>
                                    <input type="text" value="${item.code || ''}" oninput="UI.updateBulkCustomerValue(${index}, 'code', this.value)" class="w-full pl-8 pr-2.5 py-0 h-9 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-semibold text-slate-750 dark:text-slate-200 shadow-sm" placeholder="C-1052">
                                </div>
                            </div>
                            <!-- Receipt No -->
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Money Receipt No</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]">
                                        <i class="fa-solid fa-file-invoice"></i>
                                    </span>
                                    <input type="text" value="${item.receipt || ''}" oninput="UI.updateBulkCustomerValue(${index}, 'receipt', this.value)" class="w-full pl-8 pr-2.5 py-0 h-9 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-semibold text-slate-750 dark:text-slate-200 shadow-sm" placeholder="Receipt No">
                                </div>
                            </div>
                        </div>

                        <!-- Inputs Grid 2: Regular & Advance Amounts -->
                        <div class="grid grid-cols-2 gap-3">
                            <!-- Regular Amount -->
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Regular Amount</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-[10px]">৳</span>
                                    <input type="number" value="${item.reg || ''}" oninput="UI.updateBulkCustomerValue(${index}, 'reg', this.value)" class="w-full pl-6 pr-2.5 py-0 h-9 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-750 dark:text-slate-200 shadow-sm" placeholder="0.00">
                                </div>
                            </div>
                            <!-- Advance Amount -->
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Advance Amount</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-[10px]">৳</span>
                                    <input type="number" value="${item.adv || ''}" oninput="UI.updateBulkCustomerValue(${index}, 'adv', this.value)" class="w-full pl-6 pr-2.5 py-0 h-9 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-bold text-slate-750 dark:text-slate-200 shadow-sm" placeholder="0.00">
                                </div>
                            </div>
                        </div>

                        <!-- Inputs Grid 3: Payment Mode & Checkbox -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <!-- Payment Mode Select -->
                            <div>
                                <label class="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Payment Mode</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]">
                                        <i class="fa-solid fa-money-bill-wave"></i>
                                    </span>
                                    <select onchange="UI.updateBulkCustomerValue(${index}, 'mode', this.value)" class="w-full pl-8 pr-6 py-0 h-9 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-1 focus:ring-brand-500 text-xs font-semibold text-slate-750 dark:text-slate-200 appearance-none shadow-sm cursor-pointer">
                                        <option ${item.mode === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
                                        <option ${item.mode === 'bKash' ? 'selected' : ''}>bKash</option>
                                        <option ${item.mode === 'Cheque' ? 'selected' : ''}>Cheque</option>
                                        <option ${item.mode === 'Cash' ? 'selected' : ''}>Cash</option>
                                    </select>
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-[9px]">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>
                            </div>
                            <!-- Checkbox LMNP -->
                            <div class="flex justify-start sm:justify-end pt-3 sm:pt-4">
                                <label class="flex items-center space-x-1.5 cursor-pointer">
                                    <input type="checkbox" ${item.lmnp ? 'checked' : ''} onchange="UI.updateBulkCustomerValue(${index}, 'lmnp', this.checked)" class="w-3.5 h-3.5 text-brand-600 rounded focus:ring-brand-500 shadow-sm m-0">
                                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-350">Last Month NP Recovery?</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    `;
                });
                container.innerHTML = html;
            },

            updateBulkCustomerValue(index, field, value) {
                if (UI.batchCustomers[index]) {
                    if (field === 'lmnp') {
                        UI.batchCustomers[index][field] = !!value;
                    } else {
                        UI.batchCustomers[index][field] = value;
                    }
                }
            },

            addBulkCustomer() {
                UI.batchCustomers.push({ code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false });
                UI.renderBulkCustomerInputs();
                
                // Focus the code input of the newly added card
                setTimeout(() => {
                    const containers = document.querySelectorAll('#bulk-customers-container > div');
                    if (containers.length > 0) {
                        const lastContainer = containers[containers.length - 1];
                        const codeInput = lastContainer.querySelector('input[type="text"]');
                        if (codeInput) codeInput.focus();
                    }
                }, 50);
            },

            removeBulkCustomer(index) {
                if (UI.batchCustomers.length > 1) {
                    UI.batchCustomers.splice(index, 1);
                    UI.renderBulkCustomerInputs();
                }
            },

            submitBulkCustomers() {
                const dbLocal = Store.get();
                if (dbLocal?.system_settings?.find(s => s.key === 'system_hold')?.value === 'true') {
                    alert("System is currently on hold. Submissions are paused by Admin.");
                    return;
                }

                const todayStr = Utils.getLocalDate();
                const selectedDate = document.getElementById('coll-date').value || todayStr;
                const territoryId = this.getCurrentTerritoryId();

                if (selectedDate > todayStr) {
                    alert("Future dates are not allowed for collection entry.");
                    return;
                }

                // Filter out entries that are completely empty
                const activeEntries = UI.batchCustomers.filter(item => {
                    return (item.code && item.code.trim() !== '') || 
                           (item.receipt && item.receipt.trim() !== '') || 
                           (item.reg && parseFloat(item.reg) > 0) || 
                           (item.adv && parseFloat(item.adv) > 0);
                });

                if (activeEntries.length === 0) {
                    alert("Please enter details for at least one customer.");
                    return;
                }

                // Validate all active entries
                for (let i = 0; i < UI.batchCustomers.length; i++) {
                    const item = UI.batchCustomers[i];
                    
                    // Skip completely empty rows
                    const isEmpty = (!item.code || item.code.trim() === '') && 
                                    (!item.receipt || item.receipt.trim() === '') && 
                                    (!item.reg || parseFloat(item.reg) === 0) && 
                                    (!item.adv || parseFloat(item.adv) === 0);
                    if (isEmpty) continue;

                    // If code is empty but other fields are filled
                    if (!item.code || item.code.trim() === '') {
                        alert(`Please enter Customer Code for Customer ${i + 1}.`);
                        // Focus the field
                        const containers = document.querySelectorAll('#bulk-customers-container > div');
                        if (containers[i]) {
                            const codeInput = containers[i].querySelector('input[type="text"]');
                            if (codeInput) codeInput.focus();
                        }
                        return;
                    }

                    // If amounts are 0 or empty
                    const regAmt = parseFloat(item.reg) || 0;
                    const advAmt = parseFloat(item.adv) || 0;
                    if (regAmt + advAmt <= 0) {
                        alert(`Please enter a valid amount (Regular or Advance) for Customer ${i + 1}.`);
                        const containers = document.querySelectorAll('#bulk-customers-container > div');
                        if (containers[i]) {
                            const regInput = containers[i].querySelector('input[placeholder="0.00"]');
                            if (regInput) regInput.focus();
                        }
                        return;
                    }
                }

                // Confirm submission
                if (!confirm(`Are you sure you want to submit collections for ${activeEntries.length} customer(s)?`)) {
                    return;
                }

                UI.toggleCollectionLoader(true, 'Submitting Batch...', 'Processing collections...');
                (async () => {
                    const bulkSubmitBtn = document.getElementById('bulk-submit-btn');
                    const originalText = bulkSubmitBtn ? bulkSubmitBtn.innerHTML : '';
                    if (bulkSubmitBtn) {
                        bulkSubmitBtn.disabled = true;
                        bulkSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting...`;
                    }

                    try {
                        const promises = activeEntries.map(item => {
                            const regAmt = parseFloat(item.reg) || 0;
                            const advAmt = parseFloat(item.adv) || 0;
                            const totalAmt = regAmt + advAmt;
                            const entry = {
                                territory_id: territoryId,
                                date: selectedDate,
                                customer_code: item.code.trim(),
                                file_id: 'N/A',
                                customer_name: 'N/A',
                                receipt: (item.receipt || '').trim(),
                                amount: totalAmt,
                                regular_amount: regAmt,
                                advance_amount: advAmt,
                                mode: item.mode || 'Bank Transfer',
                                is_lm_np: !!item.lmnp,
                                timestamp: Date.now() + Math.random(),
                                active_month: (selectedDate === todayStr ? Utils.getActiveMonth() : selectedDate.slice(0, 7))
                            };
                            return Store.update('collections', entry);
                        });

                        await Promise.all(promises);
                        UI.showSuccess(`Successfully submitted ${activeEntries.length} collections!`);
                        
                        // Reset form
                        UI.batchCustomers = [
                            { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false },
                            { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false },
                            { code: '', receipt: '', reg: '', adv: '', mode: 'Bank Transfer', lmnp: false }
                        ];
                        UI.renderBulkCustomerInputs();
                        UI.renderOfficerDashboard();
                    } catch (err) {
                        alert("Error submitting collections: " + err.message);
                    } finally {
                        if (bulkSubmitBtn) {
                            bulkSubmitBtn.disabled = false;
                            bulkSubmitBtn.innerHTML = originalText;
                        }
                        UI.toggleCollectionLoader(false);
                    }
                })();
            },

            
            calcOfficerCollFormTotal() {
                const totalColl = parseFloat(document.getElementById('officer-coll-input-total')?.value) || 0;
                const custCode = (document.getElementById('coll-code')?.value || '').trim().toLowerCase();
                
                let totalDue = 0;
                let customerFound = false;

                if (custCode) {
                    const customers = Store.cache.customers || [];
                    const customer = customers.find(c => String(c.customerId).trim().toLowerCase() === custCode);
                    if (customer) {
                        customerFound = true;
                        const overdue = parseFloat(customer.overdueTaka) || 0;
                        const emi = parseFloat(customer.instSize) || 0;
                        totalDue = overdue + emi;
                    }
                }

                const badgeEl = document.getElementById('officer-coll-customer-found-badge');
                if (badgeEl) {
                    if (customerFound) {
                        badgeEl.classList.remove('hidden');
                        badgeEl.classList.add('bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/30', 'dark:text-emerald-400');
                        badgeEl.classList.remove('bg-slate-200', 'text-slate-500');
                        badgeEl.textContent = "Data Found";
                    } else {
                        badgeEl.classList.remove('hidden');
                        badgeEl.classList.add('bg-slate-100', 'text-slate-500', 'dark:bg-slate-800');
                        badgeEl.classList.remove('bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/30', 'dark:text-emerald-400');
                        badgeEl.textContent = custCode ? "No Match" : "";
                        if (!custCode) badgeEl.classList.add('hidden');
                    }
                }

                document.getElementById('officer-coll-display-due').textContent = '৳' + totalDue.toLocaleString();

                let reg = 0;
                let adv = 0;
                
                if (customerFound && totalDue > 0) {
                    if (totalColl <= totalDue) {
                        reg = totalColl;
                    } else {
                        reg = totalDue;
                        adv = totalColl - totalDue;
                    }
                } else {
                    reg = totalColl;
                }

                const hiddenReg = document.getElementById('coll-reg-amount');
                const hiddenAdv = document.getElementById('coll-adv-amount');
                if (hiddenReg) hiddenReg.value = reg;
                if (hiddenAdv) hiddenAdv.value = adv;
                
                const dispReg = document.getElementById('officer-coll-display-reg');
                const dispAdv = document.getElementById('officer-coll-display-adv');
                if (dispReg) dispReg.textContent = '৳' + reg.toLocaleString();
                if (dispAdv) dispAdv.textContent = '৳' + adv.toLocaleString();
            },

            handleCollectionSubmit(e) {
                e.preventDefault();
                
                const dbLocal = Store.get();
                if (dbLocal?.system_settings?.find(s => s.key === 'system_hold')?.value === 'true') {
                    alert("System is currently on hold. Submissions are paused by Admin.");
                    return;
                }
                
                if (UI.collectionEntryMode === 'bulk') {
                    UI.submitBulkCustomers();
                    return;
                }

                const todayStr = Utils.getLocalDate();
                const selectedDate = document.getElementById('coll-date').value || todayStr;
                
                if (selectedDate > todayStr) {
                    alert("Future dates are not allowed for collection entry.");
                    return;
                }

                const tId = this.getCurrentTerritoryId();

                const regAmt = parseFloat(document.getElementById('coll-reg-amount').value) || 0;
                const advAmt = parseFloat(document.getElementById('coll-adv-amount').value) || 0;
                const totalAmt = regAmt + advAmt;

                if (totalAmt <= 0) {
                    alert("Please enter a valid amount (Regular or Advance).");
                    return;
                }

                const customerCode = document.getElementById('coll-code').value;
                const receipt = document.getElementById('coll-receipt').value;
                const mode = document.getElementById('coll-mode').value;
                const isLmNp = document.getElementById('coll-lmnp').checked;

                // Single Entry Mode (Existing logic)
                UI.toggleCollectionLoader(true, 'Saving Entry...', 'Transmitting details...');
                (async () => {
                    const btn = e.target.querySelector('button[type="submit"]');
                    const originalBtnContent = btn ? btn.innerHTML : '';
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
                        btn.disabled = true;
                    }

                    try {
                        const entry = {
                            territory_id: tId,
                            date: selectedDate,
                            customer_code: customerCode,
                            file_id: 'N/A',
                            customer_name: 'N/A',
                            receipt: receipt,
                            amount: totalAmt,
                            regular_amount: regAmt,
                            advance_amount: advAmt,
                            mode: mode,
                            is_lm_np: isLmNp,
                            timestamp: Date.now(),
                            active_month: (selectedDate === todayStr ? Utils.getActiveMonth() : selectedDate.slice(0, 7))
                        };

                        await Store.update('collections', entry);
                        UI.showSuccess('Collection Saved Successfully');
                        document.getElementById('collection-form').reset();
                        
                        const collDateInput = document.getElementById('coll-date');
                        collDateInput.value = todayStr;
                        if (collDateInput._flatpickr) {
                            collDateInput._flatpickr.setDate(todayStr, false);
                        }
                        const badge = document.getElementById('date-badge');
                        if (badge) {
                            badge.innerText = 'Today';
                            badge.className = 'text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded border border-brand-200/50 dark:border-brand-800/30';
                        }
                        
                        const targetView = UI.collectionReturnTo || 'officer-dashboard';
                        UI.activeCustomerPreFill = null;
                        UI.collectionReturnTo = null;
                        if (targetView === 'officer-customers') {
                            UI.renderOfficerCustomers();
                        } else {
                            UI.renderOfficerDashboard();
                        }
                    } catch (err) {
                        alert("Error saving collection: " + err.message);
                    } finally {
                        if (btn) {
                            btn.innerHTML = originalBtnContent;
                            btn.disabled = false;
                        }
                        UI.toggleCollectionLoader(false);
                    }
                })();
            },

            deleteCollection(id, timestamp) {
                const now = Date.now();
                const diffHours = (now - timestamp) / (1000 * 60 * 60);
                if (diffHours > 24) { alert('Cannot delete entries older than 24 hours.'); return; }
                if (confirm('Are you sure you want to delete this entry?')) {
                    (async () => {
                        await Store.delete('collections', id);
                        this.renderOfficerDashboard();
                    })();
                }
            },


            // --- OFFICER EXTRAS ---
            getCurrentTerritoryId() {
                const db = Store.get();
                let linkedTId = Auth.currentUser.territoryId || Auth.currentUser.territory_id;
                if (!linkedTId) {
                    const t = db.territories.find(t => t.name === Auth.currentUser.username || t.officer === Auth.currentUser.username);
                    if (t) linkedTId = t.id;
                }
                return linkedTId;
            },
            renderOfficerSettlementsView() {
                const db = Store.get();
                const linkedTId = this.getCurrentTerritoryId();

                if (!linkedTId) {
                    document.getElementById('views-container').innerHTML = `<div class="p-8 text-center text-slate-500">Your account is not linked to any Territory Data. Please contact Admin.</div>`;
                    return;
                }

                const settlements = db.settlements.filter(s => s.territoryId === linkedTId).sort((a, b) => new Date(b.date) - new Date(a.date));

                document.getElementById('views-container').innerHTML = `
                    <div class="animate-entry max-w-5xl mx-auto">
                        <div class="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Settlements & Closures</h2>
                                <p class="text-sm text-slate-500">History of early settlements and closures for your territory</p>
                            </div>
                            <button onclick="UI.openSettlementModal()" class="px-4 py-2 bg-brand-600 text-white rounded-lg shadow-md hover:bg-brand-700 transition flex items-center font-bold text-sm">
                                <i class="fa-solid fa-plus mr-2"></i> New Settlement
                            </button>
                        </div>

                        <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 uppercase font-bold">
                                        <tr>
                                            <th class="px-3 py-2.5">Date</th>
                                            <th class="px-3 py-2.5">Customer Code</th>
                                            <th class="px-3 py-2.5">Type</th>
                                            <th class="px-3 py-2.5 text-right">Amount</th>
                                            <th class="px-3 py-2.5">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${settlements.map(s => {
                    let badgeClass = s.type === 'Early Settlement' ? 'bg-purple-100 text-purple-700' : (s.type === 'Credit Note' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700');
                    return `
                                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                    <td class="px-3 py-2.5 font-mono text-xs">${s.date}</td>
                                                    <td class="px-3 py-2.5 font-bold text-slate-700 dark:text-slate-300">#${s.customerCode}</td>
                                                    <td class="px-3 py-2.5">
                                                        <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${badgeClass}">${s.type}</span>
                                                    </td>
                                                    <td class="px-3 py-2.5 text-right font-mono font-bold">৳${Number(s.amount || 0).toLocaleString()}</td>
                                                    <td class="px-3 py-2.5 text-xs italic text-slate-500 truncate max-w-xs">${s.remarks || '-'}</td>
                                                </tr>
                                            `;
                }).join('')}
                                        ${settlements.length === 0 ? '<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">No settlement records found.</td></tr>' : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },
            renderOfficerVehicleAnalytics() {
                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry max-w-2xl mx-auto mt-10" >
                        <div class="text-center mb-10">
                            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4 shadow-md hover-lift">
                                <i class="fa-solid fa-magnifying-glass-chart text-3xl"></i>
                            </div>
                            <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-2">Vehicle Performance Analytics</h2>
                            <p class="text-slate-500">Search by Customer ID to view performance data</p>
                        </div>

                        <div class="glass-panel p-2 rounded-xl shadow-xl flex items-center mb-10 border-2 border-brand-100 dark:border-brand-900/50 focus-within:border-brand-500 transition-colors">
                            <i class="fa-solid fa-search text-slate-400 ml-4 text-xl"></i>
                            <input type="text" 
                                placeholder="Enter Customer ID (e.g. C-1001)..." 
                                class="w-full p-4 bg-transparent border-none outline-none text-lg font-mono font-bold text-slate-700 dark:text-white placeholder-slate-400"
                                onkeyup="UI.searchVehiclePerf(this.value)">
                        </div>

                        <div id="vehicle-result" class="hidden animate-fade-in">
                            <!-- Results injected here -->
                        </div>
                    </div>
            `;
            },

            // --- HISTORY ---
            renderOfficerHistory() {
                const db = Store.get();
                const linkedTId = this.getCurrentTerritoryId();
                const { startOfMonth, endOfMonth } = Utils.getMonthBounds();
                const activeMonth = Utils.getActiveMonth();
                const today = Utils.getLocalDate();
                
                // Auto-detect earliest collection date globally for the active month
                const globalCollectionsThisMonth = db.collections.filter(c => 
                    (c.activeMonth || c.active_month || c.date.slice(0, 7)) === activeMonth
                );
                
                let defaultStartDate = startOfMonth;
                if (globalCollectionsThisMonth.length > 0) {
                    const earliestDate = globalCollectionsThisMonth.reduce((min, c) => c.date < min ? c.date : min, globalCollectionsThisMonth[0].date);
                    defaultStartDate = earliestDate;
                }
                
                let defaultEndDate = today;

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry max-w-5xl mx-auto" >
                        <div class="mb-4 flex flex-col md:flex-row justify-end items-stretch md:items-end gap-4">
                            <div class="flex flex-col gap-2 w-full md:w-auto items-stretch md:items-end">
                                <input type="hidden" id="history-start-date" value="${defaultStartDate}">
                                <input type="hidden" id="history-end-date" value="${defaultEndDate}">

                                <!-- Date Range Inputs (Always shown) -->
                                <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 w-full sm:w-auto">
                                    <div class="flex items-center px-2.5 py-1 bg-white dark:bg-dark-card rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mr-1.5">From</span>
                                        <input type="date" id="history-start-picker" onchange="UI.handleHistoryCustomDateChange()" value="${defaultStartDate}" class="bg-transparent border-none text-[10px] font-black text-slate-700 dark:text-slate-300 focus:ring-0 outline-none cursor-pointer p-0 h-6 w-24">
                                    </div>
                                    <div class="flex items-center px-2.5 py-1 bg-white dark:bg-dark-card rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mr-1.5">To</span>
                                        <input type="date" id="history-end-picker" onchange="UI.handleHistoryCustomDateChange()" value="${defaultEndDate}" class="bg-transparent border-none text-[10px] font-black text-slate-700 dark:text-slate-300 focus:ring-0 outline-none cursor-pointer p-0 h-6 w-24">
                                    </div>
                                </div>

                                <!-- Quick Selector Pills (Underneath Date Inputs) -->
                                <div class="flex flex-wrap items-center gap-1.5 justify-start">
                                    <button id="btn-hist-month" onclick="UI.setOfficerHistoryRange('month')" class="px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-brand-500 text-white transition shadow-sm border border-brand-500">Active Month</button>
                                    <button id="btn-hist-today" onclick="UI.setOfficerHistoryRange('today')" class="px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition shadow-sm border border-slate-200/50 dark:border-slate-700/50">Today</button>
                                    <button id="btn-hist-yesterday" onclick="UI.setOfficerHistoryRange('yesterday')" class="px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition shadow-sm border border-slate-200/50 dark:border-slate-700/50">Yesterday</button>
                                    <button id="btn-hist-week" onclick="UI.setOfficerHistoryRange('week')" class="px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition shadow-sm border border-slate-200/50 dark:border-slate-700/50">Last 7 Days</button>
                                </div>
                            </div>
                        </div>

                        <!--Summary Cards-->
                        <div id="history-summary" class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-4">
                            <!-- Injected by JS -->
                        </div>

                        <!--Table-->
            <div class="glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden border border-slate-200 dark:border-slate-700">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 uppercase font-bold">
                            <tr>
                                <th class="px-3 py-2">Date</th>
                                <th class="px-3 py-2">Receipt</th>
                                <th class="px-3 py-2">Customer</th>
                                <th class="px-3 py-2">Mode</th>
                                <th class="px-3 py-2 text-right text-slate-400">Regular</th>
                                <th class="px-3 py-2 text-right text-brand-500">Advance</th>
                                <th class="px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody id="history-table-body" class="divide-y divide-slate-100 dark:divide-slate-700">
                            <!-- Rows -->
                        </tbody>
                    </table>
                </div>
            </div>
                    </div>
            `;

                // Trigger initial load
                this.updateOfficerHistory(null, defaultStartDate, defaultEndDate);
            },

            updateOfficerHistory(e, startOverride, endOverride) {
                if (e) e.preventDefault();

                let start, end;
                if (startOverride && endOverride) {
                    start = startOverride;
                    end = endOverride;
                } else {
                    start = document.getElementById('history-start-date')?.value || Utils.getMonthBounds().startOfMonth;
                    end = document.getElementById('history-end-date')?.value || Utils.getLocalDate();
                }

                const db = Store.get();
                const linkedTId = this.getCurrentTerritoryId();

                const filtered = db.collections.filter(c =>
                    c.territoryId === linkedTId &&
                    c.date >= start &&
                    c.date <= end
                ).sort((a, b) => new Date(b.date) - new Date(a.date));

                // Calc Totals
                const totalAmt = filtered.reduce((s, c) => s + parseFloat(c.amount), 0);
                const count = filtered.length;
                const bankAmt = filtered.filter(c => c.mode === 'Bank Transfer').reduce((s, c) => s + parseFloat(c.amount), 0);

                // Update Summary
                document.getElementById('history-summary').innerHTML = `
            <div class="p-3 sm:p-4 rounded-xl sm:rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-md relative overflow-hidden group">
                         <div class="absolute right-0 top-0 p-1.5 sm:p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <i class="fa-solid fa-sack-dollar text-2xl sm:text-5xl"></i>
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold opacity-80 uppercase tracking-wide mb-0.5 sm:mb-1">Total Collected</p>
                        <p class="text-sm sm:text-2xl font-bold font-mono leading-none">${totalAmt.toLocaleString()}</p>
                        <p class="text-[8px] sm:text-xs opacity-75 mt-0.5 sm:mt-1">${start} to ${end}</p>
                    </div>
                    <div class="p-3 sm:p-4 rounded-xl sm:rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                         <div class="absolute right-0 top-0 p-1.5 sm:p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <i class="fa-solid fa-receipt text-2xl sm:text-5xl text-slate-400"></i>
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5 sm:mb-1">Transactions</p>
                        <p class="text-sm sm:text-2xl font-bold font-mono text-slate-800 dark:text-white leading-none">${count}</p>
                        <p class="text-[8px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Records Found</p>
                    </div>
        `;

                // Update Table
                const tbody = document.getElementById('history-table-body');
                
                if (filtered.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-400 italic">No collections found for this period.</td></tr>`;
                } else {
                    let tableHtml = '';
                    
                    filtered.forEach(c => {
                        const reg = c.regularAmount || (c.advanceAmount ? 0 : c.amount); // Fallback for old data
                        const adv = c.advanceAmount || 0;
                        const total = parseFloat(c.amount);
                        
                        tableHtml += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                            <td class="px-3 py-2 font-mono text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">${c.date}</td>
                            <td class="px-3 py-2 font-medium text-slate-800 dark:text-white whitespace-nowrap">#${c.receipt}</td>
                            <td class="px-3 py-2 font-bold text-brand-600 whitespace-nowrap">${c.customerCode || 'N/A'}</td>
                            <td class="px-3 py-2">
                                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 whitespace-nowrap">${c.mode}</span>
                            </td>
                            <td class="px-3 py-2 text-right font-mono text-slate-500 text-xs">${parseFloat(reg).toLocaleString()}</td>
                            <td class="px-3 py-2 text-right font-mono text-brand-500 text-xs">${parseFloat(adv).toLocaleString()}</td>
                            <td class="px-3 py-2 text-right font-mono font-bold text-slate-800 dark:text-white">${total.toLocaleString()}</td>
                        </tr>
            `;
                    });
                    
                    tbody.innerHTML = tableHtml;
                }
            },

            setOfficerHistoryRange(type) {
                const today = Utils.getLocalDate();
                let startStr = today;
                let endStr = today;

                // Update active button state styling
                const btnIds = ['month', 'today', 'yesterday', 'week'];
                btnIds.forEach(id => {
                    const btn = document.getElementById('btn-hist-' + id);
                    if (!btn) return;
                    if (id === type) {
                        btn.className = "px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-brand-500 text-white transition shadow-sm border border-brand-500";
                    } else {
                        btn.className = "px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition shadow-sm border border-slate-200/50 dark:border-slate-700/50";
                    }
                });

                if (type === 'yesterday') {
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    startStr = Utils.getLocalDate(yesterday);
                    endStr = startStr;
                } else if (type === 'week') {
                    const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
                    startStr = Utils.getLocalDate(weekAgo);
                    endStr = today;
                } else if (type === 'month') {
                    const bounds = Utils.getMonthBounds();
                    startStr = bounds.startOfMonth;
                    endStr = bounds.endOfMonth;
                }

                // Update the visible date inputs
                const startPicker = document.getElementById('history-start-picker');
                const endPicker = document.getElementById('history-end-picker');
                if (startPicker) startPicker.value = startStr;
                if (endPicker) endPicker.value = endStr;

                document.getElementById('history-start-date').value = startStr;
                document.getElementById('history-end-date').value = endStr;
                this.updateOfficerHistory(null, startStr, endStr);
            },

            handleHistoryCustomDateChange() {
                const startStr = document.getElementById('history-start-picker').value;
                const endStr = document.getElementById('history-end-picker').value;
                document.getElementById('history-start-date').value = startStr;
                document.getElementById('history-end-date').value = endStr;
                
                // Clear active styling from preset buttons
                const btnIds = ['month', 'today', 'yesterday', 'week'];
                btnIds.forEach(id => {
                    const btn = document.getElementById('btn-hist-' + id);
                    if (btn) {
                        btn.className = "px-2.5 py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition shadow-sm border border-slate-200/50 dark:border-slate-700/50";
                    }
                });
                
                this.updateOfficerHistory(null, startStr, endStr);
            },

            // --- EXPORTS & MODALS ---
            
            downloadCustomerTemplateCSV(withData = false) {
                const headers = ["Territory_Name", "District", "Upazila_Name", "Upazila_Code", "Customer_ID", "Customer_Name", "Phone_Number", "Vehicle_Reg_Number", "First_Installment_Date", "Installment_Size", "Overdue_Inst_No", "Overdue_Taka", "Total_Outstanding", "Last_Payment_Date", "Last_3_Month_Payment_1", "Last_3_Month_Payment_2", "Last_3_Month_Payment_3"];
                let csvRows = [headers.join(',')];
                
                if (withData) {
                    const db = Store.get();
                    const customers = db.customers || Store.cache.customers || [];
                    customers.forEach(c => {
                        const row = [
                            c.territoryName || c.territory_name || '',
                            c.district || c.districtName || c.district_name || '',
                            c.upazilaName || c.upazila_name || c.upazila || '',
                            c.upazilaCode || c.upazila_code || '',
                            c.customerId || c.customer_id || '',
                            c.customerName || c.customer_name || '',
                            c.phone || '',
                            c.vehicleRegNo || c.vehicle_reg_no || '',
                            c.firstInstDate || c.first_inst_date || '',
                            c.instSize || c.inst_size || 0,
                            c.overdueInstNo || c.overdue_inst_no || 0,
                            c.overdueTaka || c.overdue_taka || 0,
                            c.totalOutstanding || c.total_outstanding || 0,
                            c.lastPaymentDate || c.last_payment_date || '',
                            c.last3Month1 || c.last_3_month_1 || 0,
                            c.last3Month2 || c.last_3_month_2 || 0,
                            c.last3Month3 || c.last_3_month_3 || 0
                        ];
                        const escapedRow = row.map(val => {
                            const str = String(val === undefined || val === null ? '' : val).trim();
                            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                                return `"${str.replace(/"/g, '""')}"`;
                            }
                            return str;
                        });
                        csvRows.push(escapedRow.join(','));
                    });
                }

                const csvContent = csvRows.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                const filename = withData ? `customer_data_export_${Utils.getLocalDate()}.csv` : "customer_upload_template.csv";
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            async handleCustomerCSV(e) {
                const file = e.target.files[0];
                if (!file) return;

                UI.toggleLoader(true);
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        let csvText = event.target.result || '';
                        // Strip UTF-8 BOM if present
                        csvText = csvText.replace(/^\ufeff/, '');
                        
                        const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
                        if (lines.length < 2) throw new Error("CSV is empty or missing data.");
                        
                        const parseCSVLine = (text) => {
                            const result = [];
                            let cell = '';
                            let inQuotes = false;
                            for (let i = 0; i < text.length; i++) {
                                const c = text[i];
                                if (c === '"') {
                                    inQuotes = !inQuotes;
                                } else if (c === ',' && !inQuotes) {
                                    result.push(cell.trim().replace(/^"|"$/g, ''));
                                    cell = '';
                                } else {
                                    cell += c;
                                }
                            }
                            result.push(cell.trim().replace(/^"|"$/g, ''));
                            return result;
                        };

                        const rawHeaders = parseCSVLine(lines[0]);
                        // Normalize headers: strip quotes, spaces, symbols to pure lowercase alphanumeric
                        const normalizedHeaders = rawHeaders.map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

                        // Determine default index mapping layout if headers fail to match
                        // Check if row 1 at index 0 looks like a Customer ID (contains digits/code)
                        const sampleRow = parseCSVLine(lines[1]);
                        const isTableOrderLayout = !(sampleRow[0] && /^cust/i.test(sampleRow[0]));

                        const defaults = isTableOrderLayout ? {
                            territoryName: 0,
                            district: 1,
                            upazilaName: 2,
                            upazilaCode: 3,
                            customerId: 4,
                            customerName: 5,
                            phone: 6,
                            vehicleRegNo: 7,
                            firstInstDate: 8,
                            instSize: 9,
                            overdueInstNo: 10,
                            overdueTaka: 11,
                            totalOutstanding: 12,
                            lastPaymentDate: 13,
                            last3Month1: 14,
                            last3Month2: 15,
                            last3Month3: 16
                        } : {
                            customerId: 0,
                            customerName: 1,
                            vehicleRegNo: 2,
                            phone: 3,
                            firstInstDate: 4,
                            instSize: 5,
                            overdueInstNo: 6,
                            overdueTaka: 7,
                            totalOutstanding: 8,
                            lastPaymentDate: 9,
                            last3Month1: 10,
                            last3Month2: 11,
                            last3Month3: 12,
                            upazilaCode: 13,
                            upazilaName: 14,
                            territoryName: 15,
                            district: 16
                        };

                        const parseCleanFloat = (val) => {
                            if (val === undefined || val === null) return 0;
                            const cleanStr = String(val).replace(/[^0-9.-]/g, '');
                            const num = parseFloat(cleanStr);
                            return isNaN(num) ? 0 : num;
                        };

                        const parseCleanDate = (val) => {
                            if (!val || val === '-') return '-';
                            let str = String(val).trim();
                            if (!str || str === '-') return '-';
                            if (/^\d{5}$/.test(str)) {
                                const excelNum = parseInt(str);
                                const dateObj = new Date((excelNum - (25567 + 2)) * 86400 * 1000);
                                if (!isNaN(dateObj.getTime())) {
                                    return dateObj.toISOString().split('T')[0];
                                }
                            }
                            if (str.includes('T')) str = str.split('T')[0];
                            if (str.includes(' ')) str = str.split(' ')[0];
                            if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
                                const parts = str.split(/[\/\-]/);
                                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                            }
                            return str;
                        };

                        const getVal = (row, variants, defaultIdx) => {
                            for (const v of variants) {
                                const normV = v.toLowerCase().replace(/[^a-z0-9]/g, '');
                                let idx = normalizedHeaders.indexOf(normV);
                                if (idx !== -1 && row[idx] !== undefined && row[idx] !== '') return row[idx];
                                
                                idx = normalizedHeaders.findIndex(h => h && (h.includes(normV) || normV.includes(h)));
                                if (idx !== -1 && row[idx] !== undefined && row[idx] !== '') return row[idx];
                            }
                            return row[defaultIdx] !== undefined ? row[defaultIdx] : '';
                        };
                        
                        const territories = Store.cache.territories || [];
                        const data = [];

                        for (let i = 1; i < lines.length; i++) {
                            const cleanRow = parseCSVLine(lines[i]);
                            if (cleanRow.length < 2) continue; // Skip empty rows
                            
                            const customerId = getVal(cleanRow, ['customer_id', 'customer id', 'customerid', 'customer_code', 'customer code', 'customercode', 'code', 'id', 'cust_id', 'cust id'], defaults.customerId);
                            const customerName = getVal(cleanRow, ['customer_name', 'customer name', 'customername', 'name', 'cust_name', 'cust name', 'client_name', 'client name'], defaults.customerName);
                            const vehicleRegNo = getVal(cleanRow, ['vehicle_reg_number', 'vehicle reg number', 'vehicle_reg_no', 'vehicle reg no', 'vehicle reg', 'vehicleregnumber', 'reg_no', 'reg no', 'registration', 'registration_no', 'registration no', 'regno', 'vehicle_no', 'vehicle no'], defaults.vehicleRegNo);
                            const phone = getVal(cleanRow, ['phone_number', 'phone number', 'phone', 'mobile', 'mobile_number', 'mobile number', 'contact', 'contact_no', 'contact no', 'phone_no', 'phone no', 'mobile_no', 'mobile no'], defaults.phone);
                            const firstInstDate = parseCleanDate(getVal(cleanRow, ['first_installment_date', 'first installment date', 'firstinstdate', 'first_inst_date', 'first inst date', 'start_date', 'start date', 'issue_date', 'issue date'], defaults.firstInstDate));
                            const instSize = parseCleanFloat(getVal(cleanRow, ['installment_size', 'installment size', 'instsize', 'inst_size', 'inst size', 'emi', 'emi_amount', 'emi amount', 'installment_amount', 'installment amount'], defaults.instSize));
                            const overdueInstNo = parseInt(parseCleanFloat(getVal(cleanRow, ['overdue_inst_no', 'overdueinstno', 'overdue inst no', 'overdue_inst', 'overdue inst', 'overdue_nos', 'od_inst_no', 'od inst no', 'od_inst', 'od inst'], defaults.overdueInstNo))) || 0;
                            const overdueTaka = parseCleanFloat(getVal(cleanRow, ['overdue_taka', 'overduetaka', 'overdue taka', 'overdue_amount', 'overdue amount', 'od_taka', 'od taka', 'od_amount', 'od amount', 'overdue'], defaults.overdueTaka));
                            const totalOutstanding = parseCleanFloat(getVal(cleanRow, ['total_outstanding', 'total outstanding', 'outstanding', 'total_out', 'total out', 'out_standing', 'out standing', 'balance', 'total_balance', 'total balance'], defaults.totalOutstanding));
                            const lastPaymentDate = parseCleanDate(getVal(cleanRow, ['last_payment_date', 'last payment date', 'last_pay_date', 'last pay date', 'last_payment', 'last payment', 'last_pay_dt', 'last pay dt', 'last_payment_dt', 'last_collection_date', 'last collection date', 'payment_date', 'payment date', 'last_date', 'last date', 'lastpaydate', 'lastpaymentdate'], defaults.lastPaymentDate));
                            const last3Month1 = parseCleanFloat(getVal(cleanRow, ['last_3_month_payment_1', 'last 3 month payment 1', 'last 3 months payment 1', 'last_3_months_payment_1', 'last_3_month_1', 'last 3 month 1', 'last_3_months_1', 'last 3 months 1', 'pay_m1', 'pay m1', 'pay-m1', 'pay_m_1', 'pay m 1', 'pay-m-1', 'm1', 'm-1', 'pay m-1', 'payment_m1', 'payment m1', '3_month_1', '3 month 1', '3 months 1', 'paym1'], defaults.last3Month1));
                            const last3Month2 = parseCleanFloat(getVal(cleanRow, ['last_3_month_payment_2', 'last 3 month payment 2', 'last 3 months payment 2', 'last_3_months_payment_2', 'last_3_month_2', 'last 3 month 2', 'last_3_months_2', 'last 3 months 2', 'pay_m2', 'pay m2', 'pay-m2', 'pay_m_2', 'pay m 2', 'pay-m-2', 'm2', 'm-2', 'pay m-2', 'payment_m2', 'payment m2', '3_month_2', '3 month 2', '3 months 2', 'paym2'], defaults.last3Month2));
                            const last3Month3 = parseCleanFloat(getVal(cleanRow, ['last_3_month_payment_3', 'last 3 month payment 3', 'last 3 months payment 3', 'last_3_months_payment_3', 'last_3_month_3', 'last 3 month 3', 'last_3_months_3', 'last 3 months 3', 'pay_m3', 'pay m3', 'pay-m3', 'pay_m_3', 'pay m 3', 'pay-m-3', 'm3', 'm-3', 'pay m-3', 'payment_m3', 'payment m3', '3_month_3', '3 month 3', '3 months 3', 'paym3'], defaults.last3Month3));
                            const upazilaCode = getVal(cleanRow, ['upazila_code', 'upazila code', 'upazilacode', 'thana_code', 'thana code'], defaults.upazilaCode);
                            const upazilaName = getVal(cleanRow, ['upazila_name', 'upazila name', 'upazila', 'upazilaname', 'thana_name', 'thana name', 'thana'], defaults.upazilaName);
                            let territoryName = getVal(cleanRow, ['territory_name', 'territory name', 'territory', 'territory_id', 'territory id', 'territoryname', 'territoryid', 'zone', 'region', 'area'], defaults.territoryName);
                            const district = getVal(cleanRow, ['district', 'district_name', 'district name', 'dist_name', 'dist name', 'dist'], defaults.district);
                            
                            if (territoryName) {
                                territoryName = territoryName.trim();
                                const tMatch = territories.find(t => String(t.id) === String(territoryName) || String(t.name).toLowerCase() === String(territoryName).toLowerCase());
                                if (tMatch) territoryName = tMatch.name;
                            }

                            if (!customerId && !customerName) continue; // Skip empty rows

                            data.push({
                                customerId,
                                customerName,
                                vehicleRegNo,
                                phone,
                                firstInstDate,
                                instSize,
                                overdueInstNo,
                                overdueTaka,
                                totalOutstanding,
                                lastPaymentDate,
                                last3Month1,
                                last3Month2,
                                last3Month3,
                                upazilaCode,
                                upazilaName,
                                territoryName,
                                district
                            });
                        }

                        const res = await fetch(`${Store.apiUrl}/sync-customers`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ data })
                        });

                        const result = await res.json();
                        if (result.success) {
                            UI.showNotification(`Successfully uploaded ${data.length} customers`, 'success');
                            await Store.init(); // Refresh cache
                            UI.renderAdminCustomers();
                        } else {
                            throw new Error("Backend failed to sync");
                        }
                    } catch (error) {
                        console.error(error);
                        UI.showNotification('Error processing CSV: ' + error.message, 'error');
                    } finally {
                        UI.toggleLoader(false);
                    }
                };
                reader.readAsText(file);
            },

            renderAdminCustomers() {
                const container = document.getElementById('views-container');
                const territories = Store.cache.territories || [];

                // Sanitize customer territory names in memory if they are numeric IDs
                if (Store.cache.customers) {
                    Store.cache.customers.forEach(c => {
                        if (c.territoryName && /^\d+$/.test(String(c.territoryName).trim())) {
                            const tMatch = territories.find(t => String(t.id) === String(c.territoryName).trim());
                            if (tMatch) c.territoryName = tMatch.name;
                        }
                    });
                }
                const customers = Store.cache.customers || [];

                const territoryNames = [...new Set(customers.map(c => c.territoryName).filter(Boolean))].sort();
                const territoryOptions = territoryNames.map(name => `<option value="${name}">${name}</option>`).join('');

                container.innerHTML = `
                    <!-- HEADER TOOLBAR WITH ACTION BUTTONS -->
                    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h2 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="fa-solid fa-users-gear text-brand-500"></i> Customer Management
                            </h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${customers.length} Active Customers loaded</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="UI.openAddCustomerModal()" class="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                                <i class="fa-solid fa-user-plus"></i> Add Customer
                            </button>
                            <input type="file" id="customer-csv-upload" class="hidden" accept=".csv" onchange="UI.handleCustomerCSV(event)">
                            <button onclick="document.getElementById('customer-csv-upload').click()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                                <i class="fa-solid fa-cloud-arrow-up"></i> Upload CSV
                            </button>
                            <button onclick="UI.downloadCustomerTemplateCSV(false)" class="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm flex items-center gap-1.5" title="Download empty CSV template">
                                <i class="fa-solid fa-file-csv"></i> Blank Template
                            </button>
                            <button onclick="UI.downloadCustomerTemplateCSV(true)" class="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all shadow-sm flex items-center gap-1.5" title="Download template prefilled with all current customer data">
                                <i class="fa-solid fa-download"></i> Template with Data
                            </button>
                        </div>
                    </div>

                    <!-- CUSTOMER FILTER BAR -->
                    <div class="glass-panel p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                            <!-- Search -->
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                                    <i class="fa-solid fa-magnifying-glass text-xs"></i>
                                </span>
                                <input type="text" id="admin-customer-search" oninput="UI.filterAdminCustomers()" placeholder="Search ID, Name, Reg No, Phone..." class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500">
                            </div>

                            <!-- Territory Filter -->
                            <div>
                                <select id="admin-customer-territory" onchange="UI.filterAdminCustomers()" class="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-brand-500">
                                    <option value="all">All Territories</option>
                                    ${territoryOptions}
                                </select>
                            </div>

                            <!-- Status & Payment Filter -->
                            <div>
                                <select id="admin-customer-status" onchange="UI.filterAdminCustomers()" class="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-brand-500">
                                    <option value="all">All Payment Statuses</option>
                                    <option value="collected">Paid / Collected (MTD > 0)</option>
                                    <option value="uncollected">Unpaid (MTD = 0)</option>
                                    <option value="overdue">Overdue Only (Overdue > 0)</option>
                                    <option value="clean">Up-to-Date / Clean</option>
                                </select>
                            </div>

                            <!-- Sort Filter -->
                            <div>
                                <select id="admin-customer-sort" onchange="UI.filterAdminCustomers()" class="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-brand-500">
                                    <option value="collected_desc">Sort: Collected MTD (High → Low)</option>
                                    <option value="overdue_desc">Sort: Overdue (High → Low)</option>
                                    <option value="outstanding_desc">Sort: Outstanding (High → Low)</option>
                                    <option value="name_asc">Sort: Name (A to Z)</option>
                                    <option value="id_asc">Sort: Customer ID</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- CUSTOMER TABLE (WITH COLLECTION DATE & ACTIONS) -->
                    <div class="glass-panel rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div class="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
                            <div id="admin-customer-count" class="font-bold text-slate-700 dark:text-slate-200">
                                Showing customers...
                            </div>
                            <div class="text-slate-400 text-[11px] italic">
                                <i class="fa-solid fa-arrows-left-right mr-1"></i> Scroll horizontally to view all columns
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto max-h-[600px] overflow-y-auto relative scrollbar-thin">
                            <table class="w-full text-left border-collapse whitespace-nowrap text-xs">
                                <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] z-10 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-100 dark:bg-slate-800 z-20">Territory</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700">Upazila</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 font-black text-slate-800 dark:text-white">Customer ID</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 font-black text-slate-800 dark:text-white">Customer Name</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700">Phone</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700">Vehicle Reg No</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700">First Inst Date</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right">Inst Size</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">Collected (MTD)</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-center font-bold text-indigo-600 dark:text-indigo-400">Collection Date</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-center">Overdue Insts</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right font-bold text-rose-600 dark:text-rose-400">Overdue Taka</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right font-bold text-slate-800 dark:text-slate-100">Total Outstanding</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700">Last Pay Date</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right">Pay M-1</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right">Pay M-2</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-right">Pay M-3</th>
                                        <th class="px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 text-center">Status</th>
                                        <th class="px-3 py-2.5 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 z-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-customers-tbody" class="divide-y divide-slate-100 dark:divide-slate-800">
                                </tbody>
                            </table>
                        </div>
                        <div id="admin-customers-pagination" class="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center text-xs"></div>
                    </div>
                `;

                this.filterAdminCustomers();
            },

            filterAdminCustomers() {
                const customers = Store.cache.customers || [];
                const db = Store.get();
                const activeMonth = Utils.getActiveMonth();
                const allCollections = db?.collections || [];

                const search = (document.getElementById('admin-customer-search')?.value || '').toLowerCase().trim();
                const territory = (document.getElementById('admin-customer-territory')?.value || 'all');
                const status = (document.getElementById('admin-customer-status')?.value || 'all');
                const sort = (document.getElementById('admin-customer-sort')?.value || 'collected_desc');

                // Map customer collections for MTD amount & latest collection date
                const mappedCustomers = customers.map(c => {
                    const cleanCustomerId = String(c.customerId || '').trim().toLowerCase();
                    const customerCollsThisMonth = allCollections.filter(coll => {
                        const code = String(coll.customerCode || coll.customer_code || '').trim().toLowerCase();
                        const m = coll.activeMonth || coll.active_month || (coll.date ? coll.date.slice(0, 7) : '');
                        return code === cleanCustomerId && m === activeMonth;
                    });
                    const collectedMTD = customerCollsThisMonth.reduce((sum, coll) => sum + (parseFloat(coll.amount) || 0), 0);
                    
                    // Sort collections descending to find latest collection date
                    const sortedColls = [...customerCollsThisMonth].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
                    const latestCollectionDate = sortedColls.length > 0 ? sortedColls[0].date : (c.lastPaymentDate || '-');

                    return { ...c, collectedMTD, latestCollectionDate };
                });

                let filtered = mappedCustomers.filter(c => {
                    if (search) {
                        const matchesSearch = 
                            (c.customerId || '').toLowerCase().includes(search) ||
                            (c.customerName || '').toLowerCase().includes(search) ||
                            (c.vehicleRegNo || '').toLowerCase().includes(search) ||
                            (c.phone || '').toLowerCase().includes(search) ||
                            (c.upazilaName || '').toLowerCase().includes(search);
                        if (!matchesSearch) return false;
                    }

                    if (territory !== 'all' && (c.territoryName || '') !== territory) {
                        return false;
                    }

                    const collAmt = c.collectedMTD || 0;
                    const odAmt = parseFloat(c.overdueTaka) || 0;
                    const odInst = parseInt(c.overdueInstNo) || 0;

                    if (status === 'collected' && collAmt <= 0) return false;
                    if (status === 'uncollected' && collAmt > 0) return false;
                    if (status === 'overdue' && odAmt <= 0 && odInst <= 0) return false;
                    if (status === 'clean' && (odAmt > 0 || odInst > 0)) return false;

                    return true;
                });

                filtered.sort((a, b) => {
                    if (sort === 'collected_desc') {
                        return (b.collectedMTD || 0) - (a.collectedMTD || 0);
                    } else if (sort === 'overdue_desc') {
                        return (parseFloat(b.overdueTaka) || 0) - (parseFloat(a.overdueTaka) || 0);
                    } else if (sort === 'outstanding_desc') {
                        return (parseFloat(b.totalOutstanding) || 0) - (parseFloat(a.totalOutstanding) || 0);
                    } else if (sort === 'name_asc') {
                        return (a.customerName || '').localeCompare(b.customerName || '');
                    } else if (sort === 'id_asc') {
                        return (a.customerId || '').localeCompare(b.customerId || '');
                    }
                    return 0;
                });

                UI.adminCustomersFiltered = filtered;
                UI.adminCustomersPage = 1;
                UI.renderAdminCustomerPage();
            },

            renderAdminCustomerPage() {
                const filtered = UI.adminCustomersFiltered || [];
                const customers = Store.cache.customers || [];
                const page = UI.adminCustomersPage || 1;
                const pageSize = 50;
                
                const countEl = document.getElementById('admin-customer-count');
                if (countEl) {
                    const startIdx = (page - 1) * pageSize + 1;
                    const endIdx = Math.min(page * pageSize, filtered.length);
                    countEl.innerHTML = `Showing <span class="text-brand-600 dark:text-brand-400 font-extrabold">${filtered.length > 0 ? startIdx : 0}-${endIdx}</span> of <span class="font-bold">${filtered.length}</span> matching customers (${customers.length} total)`;
                }

                const tbodyEl = document.getElementById('admin-customers-tbody');
                if (!tbodyEl) return;

                const paginationEl = document.getElementById('admin-customers-pagination');
                if (paginationEl) {
                    const totalPages = Math.ceil(filtered.length / pageSize);
                    paginationEl.innerHTML = `
                        <div class="text-slate-600 dark:text-slate-400 font-medium">Page <span class="font-bold text-slate-800 dark:text-slate-200">${page}</span> of ${totalPages || 1}</div>
                        <div class="flex items-center gap-2">
                            <button onclick="if(UI.adminCustomersPage > 1) { UI.adminCustomersPage--; UI.renderAdminCustomerPage(); }" class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${page === 1 ? 'disabled' : ''}>
                                <i class="fa-solid fa-chevron-left mr-1"></i> Prev
                            </button>
                            <button onclick="if(UI.adminCustomersPage < ${totalPages}) { UI.adminCustomersPage++; UI.renderAdminCustomerPage(); }" class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition ${page === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${page === totalPages || totalPages === 0 ? 'disabled' : ''}>
                                Next <i class="fa-solid fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    `;
                }

                let html = '';
                const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

                if (slice.length === 0) {
                    html = `
                        <tr>
                            <td colspan="19" class="py-8 text-center text-slate-400 dark:text-slate-500 italic">
                                No customers found matching your filter criteria.
                            </td>
                        </tr>
                    `;
                } else {
                    slice.forEach(c => {
                        const parseCleanFloat = (val) => {
                            if (val === undefined || val === null) return 0;
                            const cleanStr = String(val).replace(/[^0-9.-]/g, '');
                            const num = parseFloat(cleanStr);
                            return isNaN(num) ? 0 : num;
                        };

                        const parseCleanDate = (val) => {
                            if (!val || val === '-') return '-';
                            let str = String(val).trim();
                            if (!str || str === '-') return '-';
                            if (/^\d{5}$/.test(str)) {
                                const excelNum = parseInt(str);
                                const dateObj = new Date((excelNum - (25567 + 2)) * 86400 * 1000);
                                if (!isNaN(dateObj.getTime())) {
                                    return dateObj.toISOString().split('T')[0];
                                }
                            }
                            if (str.includes('T')) str = str.split('T')[0];
                            if (str.includes(' ')) str = str.split(' ')[0];
                            if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
                                const parts = str.split(/[\/\-]/);
                                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                            }
                            return str;
                        };

                        const collAmt = c.collectedMTD || 0;
                        const odAmt = parseCleanFloat(c.overdueTaka || c.overdue_taka);
                        const odInst = parseInt(parseCleanFloat(c.overdueInstNo || c.overdue_inst_no)) || 0;
                        const instSize = parseCleanFloat(c.instSize || c.inst_size);
                        const outAmt = parseCleanFloat(c.totalOutstanding || c.total_outstanding);
                        const m1 = parseCleanFloat(c.last3Month1 || c.last_3_month_1 || c.last3Month1 || c.pay_m1 || c.payM1);
                        const m2 = parseCleanFloat(c.last3Month2 || c.last_3_month_2 || c.last3Month2 || c.pay_m2 || c.payM2);
                        const m3 = parseCleanFloat(c.last3Month3 || c.last_3_month_3 || c.last3Month3 || c.pay_m3 || c.payM3);
                        const displayLastPayDate = parseCleanDate(c.lastPaymentDate || c.last_payment_date || c.lastPayDate || c.last_pay_date);

                        let displayTerritory = c.territoryName || c.territory_name || '-';
                        if (displayTerritory && /^\d+$/.test(String(displayTerritory).trim())) {
                            const tMatch = (Store.cache.territories || []).find(t => String(t.id) === String(displayTerritory).trim());
                            if (tMatch) displayTerritory = tMatch.name;
                        }

                        const upazilaText = c.upazilaName || c.upazila_name || '';
                        const upazilaCodeText = c.upazilaCode || c.upazila_code || '';
                        const displayUpazila = upazilaText ? (upazilaCodeText ? `${upazilaText} (${upazilaCodeText})` : upazilaText) : (upazilaCodeText || '-');

                        let statusBadge = '';
                        if (collAmt >= instSize && instSize > 0) {
                            statusBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">PAID</span>';
                        } else if (collAmt > 0) {
                            statusBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">PARTIAL</span>';
                        } else if (odAmt > 0 || odInst > 0) {
                            statusBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">OVERDUE</span>';
                        } else {
                            statusBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200">UNPAID</span>';
                        }

                        const custKey = encodeURIComponent(c.customerId || c.id || '');

                        html += `
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200">
                                    <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">${displayTerritory}</span>
                                </td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 text-xs">${displayUpazila}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${c.customerId || c.customer_id || '-'}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 font-medium text-slate-900 dark:text-white text-xs">${c.customerName || c.customer_name || '-'}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 font-mono text-slate-500 text-xs">${c.phone || '-'}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-300 text-xs">${c.vehicleRegNo || c.vehicle_reg_no || '-'}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 text-xs">${parseCleanDate(c.firstInstDate || c.first_inst_date)}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono text-xs">৳${Math.round(instSize).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono font-black bg-emerald-50/50 dark:bg-emerald-950/20 ${collAmt > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">৳${Math.round(collAmt).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">${c.latestCollectionDate || '-'}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-center font-mono font-bold ${odInst > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}">${odInst}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono font-bold ${odAmt > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}">৳${Math.round(odAmt).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono font-bold text-slate-800 dark:text-slate-100">৳${Math.round(outAmt).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 text-xs">${displayLastPayDate}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">৳${Math.round(m1).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">৳${Math.round(m2).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">৳${Math.round(m3).toLocaleString()}</td>
                                <td class="px-3 py-2 border-r border-slate-100 dark:border-slate-800 text-center">
                                    ${statusBadge}
                                </td>
                                <td class="px-3 py-2 text-center sticky right-0 bg-white dark:bg-slate-900 z-10">
                                    <div class="flex items-center justify-center gap-1.5">
                                        <button onclick="UI.openEditCustomerModal('${custKey}')" class="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition" title="Edit Customer Info">
                                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                                        </button>
                                        <button onclick="UI.openCollectionModal(null, null, '${custKey}')" class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition" title="Log / Edit Collection">
                                            <i class="fa-solid fa-money-bill-wave text-xs"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                }

                tbodyEl.innerHTML = html;
            },

            openAddCustomerModal() {
                const territories = Store.cache.territories || [];
                const terrOptions = territories.map(t => `<option value="${t.name}">${t.name}</option>`).join('');

                const content = `
                    <form onsubmit="UI.saveAdminCustomer(event, false)" class="space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer ID *</label>
                                <input type="text" id="cust-modal-id" required placeholder="e.g. CUST1001" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
                                <input type="text" id="cust-modal-name" required placeholder="Full Name" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                <input type="text" id="cust-modal-phone" placeholder="017xxxxxxxx" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Reg No</label>
                                <input type="text" id="cust-modal-veh" placeholder="e.g. DHAKA-METRO-11-2222" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                                <select id="cust-modal-territory" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer">
                                    ${terrOptions}
                                </select>
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Upazila Name</label>
                                <input type="text" id="cust-modal-upazila" placeholder="Upazila Name" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">First Inst Date</label>
                                <input type="date" id="cust-modal-firstdate" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Installment Size (৳)</label>
                                <input type="number" step="any" id="cust-modal-instsize" placeholder="0" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overdue Inst No</label>
                                <input type="number" id="cust-modal-overdueinst" placeholder="0" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overdue Amount (৳)</label>
                                <input type="number" step="any" id="cust-modal-overduetaka" placeholder="0" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Outstanding (৳)</label>
                                <input type="number" step="any" id="cust-modal-outstanding" placeholder="0" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <button type="button" onclick="UI.closeModal('generic-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition shadow-sm">Save Customer</button>
                        </div>
                    </form>
                `;

                this.renderModal('<i class="fa-solid fa-user-plus text-brand-500 mr-2"></i> Add New Customer', content);
            },

            openEditCustomerModal(custKey) {
                const customers = Store.cache.customers || [];
                const keyDecoded = decodeURIComponent(custKey);
                const c = customers.find(item => String(item.customerId || item.id) === keyDecoded);
                if (!c) {
                    UI.showNotification('Customer not found', 'error');
                    return;
                }

                const territories = Store.cache.territories || [];
                const terrOptions = territories.map(t => `<option value="${t.name}" ${(c.territoryName === t.name) ? 'selected' : ''}>${t.name}</option>`).join('');

                const content = `
                    <form onsubmit="UI.saveAdminCustomer(event, true, '${encodeURIComponent(c.id || c.customerId)}')" class="space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer ID</label>
                                <input type="text" id="cust-modal-id" value="${c.customerId}" readonly class="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono text-slate-500">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
                                <input type="text" id="cust-modal-name" value="${c.customerName || ''}" required class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                <input type="text" id="cust-modal-phone" value="${c.phone || ''}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Reg No</label>
                                <input type="text" id="cust-modal-veh" value="${c.vehicleRegNo || ''}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                                <select id="cust-modal-territory" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer">
                                    ${terrOptions}
                                </select>
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Upazila Name</label>
                                <input type="text" id="cust-modal-upazila" value="${c.upazilaName || ''}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">First Inst Date</label>
                                <input type="date" id="cust-modal-firstdate" value="${c.firstInstDate || ''}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Installment Size (৳)</label>
                                <input type="number" step="any" id="cust-modal-instsize" value="${c.instSize || 0}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overdue Inst No</label>
                                <input type="number" id="cust-modal-overdueinst" value="${c.overdueInstNo || 0}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overdue Amount (৳)</label>
                                <input type="number" step="any" id="cust-modal-overduetaka" value="${c.overdueTaka || 0}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Outstanding (৳)</label>
                                <input type="number" step="any" id="cust-modal-outstanding" value="${c.totalOutstanding || 0}" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono">
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <button type="button" onclick="UI.closeModal('generic-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition shadow-sm">Update Customer</button>
                        </div>
                    </form>
                `;

                this.renderModal('<i class="fa-solid fa-user-pen text-brand-500 mr-2"></i> Edit Customer Info', content);
            },

            async saveAdminCustomer(e, isEdit = false, encodedDbId = '') {
                e.preventDefault();
                UI.toggleLoader(true);

                try {
                    const customerId = document.getElementById('cust-modal-id').value.trim();
                    const customerName = document.getElementById('cust-modal-name').value.trim();
                    const phone = document.getElementById('cust-modal-phone').value.trim();
                    const vehicleRegNo = document.getElementById('cust-modal-veh').value.trim();
                    const territoryName = document.getElementById('cust-modal-territory').value;
                    const upazilaName = document.getElementById('cust-modal-upazila').value.trim();
                    const firstInstDate = document.getElementById('cust-modal-firstdate').value;
                    const instSize = parseFloat(document.getElementById('cust-modal-instsize').value) || 0;
                    const overdueInstNo = parseInt(document.getElementById('cust-modal-overdueinst').value) || 0;
                    const overdueTaka = parseFloat(document.getElementById('cust-modal-overduetaka').value) || 0;
                    const totalOutstanding = parseFloat(document.getElementById('cust-modal-outstanding').value) || 0;

                    const payload = {
                        customerId,
                        customerName,
                        phone,
                        vehicleRegNo,
                        territoryName,
                        upazilaName,
                        firstInstDate,
                        instSize,
                        overdueInstNo,
                        overdueTaka,
                        totalOutstanding
                    };

                    if (isEdit) {
                        const dbId = decodeURIComponent(encodedDbId);
                        payload.id = dbId;
                    }

                    await Store.update('customers', payload);
                    await Store.init();

                    UI.closeModal('generic-modal');
                    UI.showNotification(isEdit ? 'Customer details updated!' : 'New customer added successfully!', 'success');
                    UI.renderAdminCustomers();
                } catch (err) {
                    console.error(err);
                    UI.showNotification('Error saving customer: ' + err.message, 'error');
                } finally {
                    UI.toggleLoader(false);
                }
            },

            openAddCustomerCollectionModal(custKey) {
                const customers = Store.cache.customers || [];
                const keyDecoded = decodeURIComponent(custKey);
                const c = customers.find(item => String(item.customerId || item.id) === keyDecoded);
                if (!c) {
                    UI.showNotification('Customer not found', 'error');
                    return;
                }

                const todayStr = Utils.getLocalDate();

                const content = `
                    <form onsubmit="UI.saveAdminCustomerCollection(event, '${encodeURIComponent(c.customerId)}')" class="space-y-3 text-xs">
                        <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p class="font-bold text-slate-800 dark:text-white text-sm">${c.customerName || 'Customer'}</p>
                            <p class="text-[11px] font-mono text-slate-400">ID: ${c.customerId} • Territory: ${c.territoryName || '-'}</p>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Collection Date *</label>
                            <input type="date" id="cust-coll-date" value="${todayStr}" required class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Collection Amount (৳) *</label>
                            <input type="number" step="any" id="cust-coll-amount" required placeholder="Amount in Taka" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono font-bold text-emerald-600">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                            <select id="cust-coll-mode" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer">
                                <option value="bKash">bKash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Money Receipt / Remarks</label>
                            <input type="text" id="cust-coll-remarks" placeholder="MR No or payment notes" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                        </div>

                        <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <button type="button" onclick="UI.closeModal('generic-modal')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition">Cancel</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm">Save Collection</button>
                        </div>
                    </form>
                `;

                this.renderModal('<i class="fa-solid fa-money-bill-wave text-emerald-500 mr-2"></i> Log Collection Entry', content);
            },

            async saveAdminCustomerCollection(e, encodedCustId) {
                e.preventDefault();
                UI.toggleLoader(true);

                try {
                    const customerCode = decodeURIComponent(encodedCustId);
                    const customers = Store.cache.customers || [];
                    const c = customers.find(item => item.customerId === customerCode) || {};

                    const territories = Store.cache.territories || [];
                    const terr = territories.find(t => t.name === c.territoryName) || {};

                    const date = document.getElementById('cust-coll-date').value;
                    const amount = parseFloat(document.getElementById('cust-coll-amount').value) || 0;
                    const mode = document.getElementById('cust-coll-mode').value;
                    const remarks = document.getElementById('cust-coll-remarks').value.trim();

                    const payload = {
                        customerCode,
                        customerName: c.customerName || '',
                        territoryId: terr.id || '',
                        territory_id: terr.id || '',
                        date,
                        amount,
                        mode,
                        remarks,
                        activeMonth: date.slice(0, 7)
                    };

                    await Store.update('collections', payload);
                    await Store.init();

                    UI.closeModal('generic-modal');
                    UI.showNotification('Collection recorded successfully!', 'success');
                    UI.renderAdminCustomers();
                } catch (err) {
                    console.error(err);
                    UI.showNotification('Error logging collection: ' + err.message, 'error');
                } finally {
                    UI.toggleLoader(false);
                }
            },

            setOfficerCustomerSort(sortType) {
                this.officerCustomerSort = sortType;
                this.filterOfficerCustomers();
            },

            renderOfficerCustomers() {
                const container = document.getElementById('views-container');
                const userTerritoryId = Auth.currentUser.territoryId;
                const territory = Store.cache.territories?.find(t => t.id === userTerritoryId);
                const territoryName = territory ? territory.name.toLowerCase() : '';
                
                // Filter customers by assigned territory name (fuzzy match)
                this.officerCustomersList = (Store.cache.customers || []).filter(c => c.territoryName && c.territoryName.toLowerCase().includes(territoryName));
                
                const totalOutstanding = this.officerCustomersList.reduce((sum, c) => sum + (parseFloat(c.totalOutstanding) || 0), 0);
                const totalOverdue = this.officerCustomersList.reduce((sum, c) => sum + (parseFloat(c.overdueTaka) || 0), 0);
                
                const unpaidCustomers = this.officerCustomersList.filter(c => (parseFloat(c.overdueTaka) || 0) > 0 || (parseInt(c.overdueInstNo) || 0) > 0);
                const paidCustomers = this.officerCustomersList.filter(c => (parseFloat(c.overdueTaka) || 0) <= 0 && (parseInt(c.overdueInstNo) || 0) <= 0);

                const paidCount = paidCustomers.length;
                const unpaidCount = unpaidCustomers.length;

                // Extract unique upazilas for quick filter
                const upazilas = [...new Set(this.officerCustomersList.map(c => c.upazilaName).filter(Boolean))].sort();

                this.officerCustomerFilter = this.officerCustomerFilter || 'all';
                this.officerCustomerSort = this.officerCustomerSort || 'overdue_desc';

                let upazilaOptions = '<option value="all">All Upazilas</option>';
                upazilas.forEach(u => {
                    upazilaOptions += `<option value="${u}">${u}</option>`;
                });

                container.innerHTML = `
                    <div class="mb-3 flex justify-between items-center">
                        <div>
                            <h2 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">My Customers</h2>
                            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">${territory?.name || 'Territory'} • ${this.officerCustomersList.length} Customers</p>
                        </div>
                    </div>

                    <!-- Compact Mobile Dashboard & Filter Bar -->
                    <div class="glass-panel p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                        <!-- Stat / Filter Tabs (3 Columns) -->
                        <div class="grid grid-cols-3 gap-2 mb-2.5">
                            <!-- All -->
                            <button onclick="UI.setOfficerCustomerFilter('all')" id="oc-filter-all" class="p-2 sm:p-2.5 rounded-xl border-2 ${this.officerCustomerFilter === 'all' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800'} text-left transition-all shadow-2xs">
                                <div class="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    <span>TOTAL</span>
                                    <i class="fa-solid fa-users text-brand-500 text-[10px]"></i>
                                </div>
                                <p class="text-base font-black text-slate-800 dark:text-white mt-0.5">${this.officerCustomersList.length}</p>
                            </button>

                            <!-- Paid -->
                            <button onclick="UI.setOfficerCustomerFilter('paid')" id="oc-filter-paid" class="p-2 sm:p-2.5 rounded-xl border-2 ${this.officerCustomerFilter === 'paid' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800'} text-left transition-all shadow-2xs">
                                <div class="flex justify-between items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <span>PAID</span>
                                    <i class="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>
                                </div>
                                <p class="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">${paidCount}</p>
                            </button>

                            <!-- Unpaid -->
                            <button onclick="UI.setOfficerCustomerFilter('unpaid')" id="oc-filter-unpaid" class="p-2 sm:p-2.5 rounded-xl border-2 ${this.officerCustomerFilter === 'unpaid' ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30' : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800'} text-left transition-all shadow-2xs">
                                <div class="flex justify-between items-center text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                    <span>UNPAID</span>
                                    <i class="fa-solid fa-triangle-exclamation text-rose-500 text-[10px]"></i>
                                </div>
                                <p class="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">${unpaidCount}</p>
                            </button>
                        </div>

                        <!-- Advanced Search, Upazila & Sort Toolbar -->
                        <div class="space-y-2">
                            <!-- Search Bar -->
                            <div class="w-full flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-brand-500 transition-colors shadow-2xs">
                                <i class="fa-solid fa-search text-slate-400 text-xs mr-2 shrink-0"></i>
                                <input type="text" id="oc-search" onkeyup="UI.filterOfficerCustomers()" placeholder="Search Name, ID, Vehicle Reg No..." class="w-full bg-transparent border-none focus:outline-none text-xs text-slate-700 dark:text-slate-200">
                            </div>

                            <!-- Sort & Upazila Filters -->
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                <div class="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-xl px-2 py-1 border border-slate-200 dark:border-slate-700">
                                    <i class="fa-solid fa-sort text-slate-400 text-[10px] mr-1.5"></i>
                                    <select id="oc-sort" onchange="UI.setOfficerCustomerSort(this.value)" class="w-full bg-transparent border-none focus:outline-none text-[11px] text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
                                        <option value="overdue_desc">Sort: Overdue High→Low</option>
                                        <option value="outstanding_desc">Sort: Outst. High→Low</option>
                                        <option value="name_asc">Sort: Name (A to Z)</option>
                                    </select>
                                </div>

                                <div class="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-xl px-2 py-1 border border-slate-200 dark:border-slate-700">
                                    <i class="fa-solid fa-location-dot text-slate-400 text-[10px] mr-1.5"></i>
                                    <select id="oc-upazila-filter" onchange="UI.filterOfficerCustomers()" class="w-full bg-transparent border-none focus:outline-none text-[11px] text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
                                        ${upazilaOptions}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Count Status Indicator -->
                    <div class="flex justify-between items-center mb-2 px-1 text-[11px] font-bold text-slate-400">
                        <span id="oc-count-info">Showing customers...</span>
                        <span class="text-[10px] font-semibold text-slate-400"><i class="fa-solid fa-hand-pointer mr-1"></i>Tap card to expand</span>
                    </div>

                    <!-- Customer Grid / Compact List -->
                    <div id="officer-customers-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-24">
                    </div>
                `;
                
                this.filterOfficerCustomers();
            },

            setOfficerCustomerFilter(filterType) {
                this.officerCustomerFilter = filterType;
                
                ['all', 'paid', 'unpaid'].forEach(f => {
                    const card = document.getElementById(`oc-filter-${f}`);
                    if (card) {
                        if (f === filterType) {
                            card.className = f === 'paid' ? 'p-2 sm:p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-left transition-all shadow-2xs' :
                                             f === 'unpaid' ? 'p-2 sm:p-2.5 rounded-xl border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-left transition-all shadow-2xs' :
                                             'p-2 sm:p-2.5 rounded-xl border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-left transition-all shadow-2xs';
                        } else {
                            card.className = 'p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-left transition-all shadow-2xs';
                        }
                    }
                });

                this.filterOfficerCustomers();
            },

            toggleCustomerCardDetail(cardId) {
                const el = document.getElementById(cardId);
                const icon = document.getElementById(`chevron-icon-${cardId}`);
                if (el) {
                    if (el.classList.contains('hidden')) {
                        el.classList.remove('hidden');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    } else {
                        el.classList.add('hidden');
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    }
                }
            },

            renderOfficerCustomersGrid(list) {
                const grid = document.getElementById('officer-customers-grid');
                if (!grid) return;
                
                const countInfo = document.getElementById('oc-count-info');
                if (countInfo) {
                    countInfo.textContent = `Showing ${list.length} customer${list.length === 1 ? '' : 's'}`;
                }

                if (list.length === 0) {
                    grid.innerHTML = `<div class="p-8 text-center text-slate-500 glass-panel rounded-xl text-xs font-semibold col-span-full">No customers match the active search/filters.</div>`;
                    return;
                }

                const db = Store.get();
                const activeMonth = Utils.getActiveMonth();
                const allCollections = db?.collections || [];

                let html = '';
                list.slice(0, 150).forEach((c, idx) => { // Render up to 150 smoothly
                    const cardId = `cust-detail-${idx}`;
                    
                    // Auto-sync collection amount for this customer ID (case-insensitive trim match)
                    const cleanCustomerId = String(c.customerId || '').trim().toLowerCase();
                    const customerCollsThisMonth = allCollections.filter(coll => {
                        const code = String(coll.customerCode || coll.customer_code || '').trim().toLowerCase();
                        const m = coll.activeMonth || coll.active_month || (coll.date ? coll.date.slice(0, 7) : '');
                        return code === cleanCustomerId && m === activeMonth;
                    });
                    const collectedThisMonth = customerCollsThisMonth.reduce((sum, coll) => sum + (parseFloat(coll.amount) || 0), 0);
                    const instSize = parseFloat(c.instSize) || 0;
                    const isPartial = collectedThisMonth > 0 && (instSize > 0 ? collectedThisMonth < instSize : false);

                    const borderAccentClass = isPartial ? 'border-l-4 border-l-amber-500 ring-1 ring-amber-500/20' :
                                              collectedThisMonth > 0 ? 'border-l-4 border-l-emerald-500 ring-1 ring-emerald-500/20' :
                                              (c.overdueInstNo || 0) >= 3 ? 'border-l-4 border-l-rose-500' :
                                              (c.overdueInstNo || 0) > 0 ? 'border-l-4 border-l-amber-500' :
                                              'border-l-4 border-l-emerald-500';

                    html += `
                        <div class="glass-panel rounded-xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col ${borderAccentClass}">
                            <!-- Main Compact Body (Click to Expand Details) -->
                            <div onclick="UI.toggleCustomerCardDetail('${cardId}')" class="p-3 cursor-pointer select-none">
                                <!-- Top Row: Name, Customer ID & OD Badge ONLY -->
                                <div class="flex justify-between items-start gap-1.5 mb-1">
                                    <div class="min-w-0 flex-1 flex items-center gap-1.5 flex-wrap">
                                        <h3 class="font-bold text-slate-800 dark:text-white text-sm sm:text-base leading-tight truncate">${c.customerName}</h3>
                                        <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px] font-bold shrink-0 border border-slate-200/50 dark:border-slate-600/50">
                                            ID: ${c.customerId}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <!-- OD Number Badge -->
                                        <span class="px-2 py-0.5 ${c.overdueInstNo > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 font-bold' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 font-semibold'} rounded-lg text-[10px] sm:text-[11px] shrink-0">
                                            ${c.overdueInstNo > 0 ? `OD: ${c.overdueInstNo} Inst` : 'Paid'}
                                        </span>
                                    </div>
                                </div>

                                <!-- Subtitle Row: Upazila & (if Short Payment) Notice -->
                                <div class="flex justify-between items-center mb-2 text-[10px] sm:text-[11px]">
                                    <span class="font-medium text-slate-400 flex items-center gap-1">
                                        <i class="fa-solid fa-location-dot text-[9px] text-slate-400"></i>
                                        <span>${c.upazilaName || 'Upazila N/A'}</span>
                                    </span>
                                    ${isPartial ? `
                                    <span class="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 rounded-md text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs">
                                        <i class="fa-solid fa-triangle-exclamation text-[9px] text-amber-500"></i> Short Payment
                                    </span>
                                    ` : ''}
                                </div>

                                <!-- Key Info Grid: Inst. Size, Overdue Taka & Collected Taka -->
                                <div class="grid ${collectedThisMonth > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 sm:gap-2 bg-slate-50/80 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700/50 text-xs">
                                    <div>
                                        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Inst. Size</span>
                                        <span class="font-extrabold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">৳${Math.round(instSize).toLocaleString()}</span>
                                    </div>
                                    <div class="${collectedThisMonth > 0 ? 'text-center' : 'text-right'}">
                                        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Overdue Taka</span>
                                        <span class="font-extrabold text-rose-600 dark:text-rose-400 text-xs sm:text-sm">৳${Math.round(parseFloat(c.overdueTaka) || 0).toLocaleString()}</span>
                                    </div>
                                    ${collectedThisMonth > 0 ? `
                                    <div class="text-right">
                                        <span class="text-[9px] ${isPartial ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} font-bold uppercase tracking-wider block">Collected</span>
                                        <span class="font-extrabold ${isPartial ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} text-xs sm:text-sm">৳${Math.round(collectedThisMonth).toLocaleString()}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>

                            ${this.renderCustomerExpandableDrawer(c, cardId, collectedThisMonth, customerCollsThisMonth, isPartial)}

                            <!-- Action Bar: Collect & Call Buttons -->
                            <div class="px-3 py-2 bg-slate-50/90 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex gap-2 items-center mt-auto">
                                <!-- Collect Button -->
                                <button onclick="event.stopPropagation(); UI.initiateCollectionFromCustomer('${c.customerId}', ${c.instSize})" class="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5">
                                    <i class="fa-solid fa-money-bill-wave text-xs"></i>
                                    <span>Collect</span>
                                </button>

                                <!-- Call Button -->
                                <a href="tel:${c.phone}" onclick="event.stopPropagation()" class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-50 dark:hover:bg-slate-600 transition-all shadow-2xs flex items-center gap-1.5">
                                    <i class="fa-solid fa-phone text-xs text-emerald-500"></i>
                                    <span>Call</span>
                                </a>

                                <!-- Expand Arrow -->
                                <button onclick="event.stopPropagation(); UI.toggleCustomerCardDetail('${cardId}')" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <i class="fa-solid fa-chevron-down text-xs transition-transform duration-200" id="chevron-icon-${cardId}"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });

                grid.innerHTML = html;
            },

            getLast3MonthNames() {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const now = new Date();
                
                // Month 1 = 1 month ago (Last Month)
                const d1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                // Month 2 = 2 months ago (Month Before Last)
                const d2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                // Month 3 = 3 months ago
                const d3 = new Date(now.getFullYear(), now.getMonth() - 3, 1);

                return {
                    m1: monthNames[d1.getMonth()] + " '" + String(d1.getFullYear()).slice(-2),
                    m2: monthNames[d2.getMonth()] + " '" + String(d2.getFullYear()).slice(-2),
                    m3: monthNames[d3.getMonth()] + " '" + String(d3.getFullYear()).slice(-2)
                };
            },

            renderCustomerExpandableDrawer(c, cardId, collectedThisMonth = 0, customerCollsThisMonth = [], isPartial = false) {
                const months = this.getLast3MonthNames();
                const instSize = parseFloat(c.instSize) || 0;
                const shortAmount = Math.max(0, instSize - collectedThisMonth);

                return `
                    <div id="${cardId}" class="hidden bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-slate-700/60 p-3 space-y-2.5 text-xs animate-entry">
                        ${collectedThisMonth > 0 ? `
                        <!-- Current Month Auto-Synced Payment Banner -->
                        <div class="flex justify-between items-center ${isPartial ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60' : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60'} p-2.5 rounded-xl border text-xs">
                            <div class="flex items-center gap-2">
                                <i class="${isPartial ? 'fa-solid fa-chart-pie text-amber-500' : 'fa-solid fa-circle-check text-emerald-500'} text-sm"></i>
                                <div>
                                    <span class="text-[10px] font-bold ${isPartial ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-300'} block">
                                        ${isPartial ? 'Partial Collection This Month' : 'Collected This Month'}
                                    </span>
                                    <span class="text-[9px] ${isPartial ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} font-medium">
                                        ${customerCollsThisMonth.length} receipt${customerCollsThisMonth.length > 1 ? 's' : ''} ${isPartial ? `(৳${Math.round(shortAmount).toLocaleString()} short)` : 'auto-synced'}
                                    </span>
                                </div>
                            </div>
                            <span class="font-black ${isPartial ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'} text-sm">৳${Math.round(collectedThisMonth).toLocaleString()}</span>
                        </div>
                        ` : ''}

                        ${c.vehicleRegNo ? `
                        <!-- Vehicle Reg & Customer Code Card -->
                        <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                            <div>
                                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Vehicle Reg Number</span>
                                <span class="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 mt-0.5">
                                    <i class="fa-solid fa-truck-front text-brand-500 text-xs"></i> ${c.vehicleRegNo}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customer Code</span>
                                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${c.customerId}</span>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Installment & Dates Grid -->
                        <div class="grid grid-cols-2 gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <div>
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">Installment Size</span>
                                <span class="font-bold text-slate-700 dark:text-slate-200">৳${Math.round(parseFloat(c.instSize) || 0).toLocaleString()}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">Overdue Taka</span>
                                <span class="font-bold text-rose-600 dark:text-rose-400">৳${Math.round(parseFloat(c.overdueTaka) || 0).toLocaleString()}</span>
                            </div>
                            <div>
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">First Inst Date</span>
                                <span class="font-semibold text-slate-700 dark:text-slate-200">${c.firstInstDate || '-'}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">Last Payment Date</span>
                                <span class="font-semibold text-slate-700 dark:text-slate-200">${c.lastPaymentDate || '-'}</span>
                            </div>
                        </div>

                        <!-- Contact & Location Info -->
                        <div class="grid grid-cols-2 gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <div>
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">Phone Number</span>
                                <a href="tel:${c.phone}" onclick="event.stopPropagation()" class="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 mt-0.5">
                                    <i class="fa-solid fa-phone text-[9px]"></i> ${c.phone || 'N/A'}
                                </a>
                            </div>
                            <div class="text-right">
                                <span class="text-[9px] text-slate-400 font-medium uppercase block">Upazila & Code</span>
                                <span class="font-semibold text-slate-700 dark:text-slate-200">${c.upazilaName || '-'} (${c.upazilaCode || '-'})</span>
                            </div>
                        </div>

                        <!-- Last 3 Months Payment History -->
                        <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5"><i class="fa-solid fa-calendar-days text-[9px] mr-1 text-brand-500"></i>Last 3 Months Collections</span>
                            <div class="grid grid-cols-3 gap-1.5 text-center">
                                <div class="p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span class="text-[9px] text-brand-600 dark:text-brand-400 font-bold block">${months.m1}</span>
                                    <span class="text-[8px] text-slate-400 block mb-0.5">(Last Mo.)</span>
                                    <span class="font-bold text-emerald-600 dark:text-emerald-400 text-xs">৳${Math.round(parseFloat(c.last3Month1) || 0).toLocaleString()}</span>
                                </div>
                                <div class="p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span class="text-[9px] text-slate-600 dark:text-slate-300 font-bold block">${months.m2}</span>
                                    <span class="text-[8px] text-slate-400 block mb-0.5">(2 Mos. Ago)</span>
                                    <span class="font-bold text-emerald-600 dark:text-emerald-400 text-xs">৳${Math.round(parseFloat(c.last3Month2) || 0).toLocaleString()}</span>
                                </div>
                                <div class="p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span class="text-[9px] text-slate-600 dark:text-slate-300 font-bold block">${months.m3}</span>
                                    <span class="text-[8px] text-slate-400 block mb-0.5">(3 Mos. Ago)</span>
                                    <span class="font-bold text-emerald-600 dark:text-emerald-400 text-xs">৳${Math.round(parseFloat(c.last3Month3) || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            filterOfficerCustomers() {
                const term = (document.getElementById('oc-search')?.value || '').toLowerCase();
                const filter = this.officerCustomerFilter || 'all';
                const sort = this.officerCustomerSort || 'overdue_desc';
                const selectedUpazila = (document.getElementById('oc-upazila-filter')?.value || 'all');

                let filtered = (this.officerCustomersList || []).filter(c => {
                    const matchesTerm = !term || (
                        (c.customerName && c.customerName.toLowerCase().includes(term)) || 
                        (c.customerId && c.customerId.toLowerCase().includes(term)) ||
                        (c.vehicleRegNo && c.vehicleRegNo.toLowerCase().includes(term)) ||
                        (c.phone && c.phone.includes(term))
                    );

                    const isUnpaid = (parseFloat(c.overdueTaka) || 0) > 0 || (parseInt(c.overdueInstNo) || 0) > 0;
                    const matchesFilter = filter === 'all' || 
                                          (filter === 'paid' && !isUnpaid) || 
                                          (filter === 'unpaid' && isUnpaid);

                    const matchesUpazila = selectedUpazila === 'all' || c.upazilaName === selectedUpazila;

                    return matchesTerm && matchesFilter && matchesUpazila;
                });

                // Apply Sorting
                filtered.sort((a, b) => {
                    if (sort === 'overdue_desc') {
                        return (parseFloat(b.overdueTaka) || 0) - (parseFloat(a.overdueTaka) || 0);
                    } else if (sort === 'outstanding_desc') {
                        return (parseFloat(b.totalOutstanding) || 0) - (parseFloat(a.totalOutstanding) || 0);
                    } else if (sort === 'name_asc') {
                        return (a.customerName || '').localeCompare(b.customerName || '');
                    }
                    return 0;
                });

                this.renderOfficerCustomersGrid(filtered);
            },

            initiateCollectionFromCustomer(customerId, amount) {
                this.activeCustomerPreFill = { customerId, amount, singleOnly: true, returnTo: 'officer-customers' };
                this.collectionReturnTo = 'officer-customers';
                Router.navigate('officer-collection');
            },

            closeCollectionForm() {
                const target = this.collectionReturnTo || 'officer-dashboard';
                this.activeCustomerPreFill = null;
                this.collectionReturnTo = null;
                if (target === 'officer-customers') {
                    UI.renderOfficerCustomers();
                } else {
                    Router.navigate(target);
                }
            },

            exportCSV() {
                const db = Store.get();
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Date,Territory,CustomerCode,Receipt,Regular,Advance,TotalAmount,Mode,Type\n";
                db.collections.forEach(c => {
                    const tName = db.territories.find(t => t.id === c.territoryId)?.name || 'Unknown';
                    const reg = c.regularAmount || (c.advanceAmount ? 0 : c.amount); // Fallback for old data
                    const adv = c.advanceAmount || 0;

                    const row = `${c.date}, "${tName}", "${c.customerCode || 'N/A'}", "${c.receipt}", ${reg},${adv},${c.amount},${c.mode},${c.isLmNp ? 'LM NP' : 'Regular'} `;
                    csvContent += row + "\n";
                });
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "recovery_data.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            openRawExportModal() {
                const today = Utils.getLocalDate();
                const firstDay = Utils.getActiveMonth() + '-01';

                const html = `
            <div class="text-left" >
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-file-csv text-lg"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 dark:text-white">Export Raw Data</h3>
                                <p class="text-xs text-slate-500">Select date range for customer-wise collection report</p>
                            </div>
                        </div>
                        
                        <form onsubmit="UI.processRawExport(event)" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                    <input type="date" name="startDate" value="${firstDay}" class="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none transition" required>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                    <input type="date" name="endDate" value="${today}" class="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none transition" required>
                                </div>
                            </div>
                            
                            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-start">
                                <i class="fa-solid fa-circle-info mt-0.5 mr-2"></i>
                                <p>This will download a CSV file containing all individual collection entries, including Receipt No, Customer Code, Mode, Regular, Advance, and Total Amount.</p>
                            </div>

                            <div class="flex justify-end space-x-3 pt-2">
                                <button type="button" onclick="document.getElementById('generic-modal').classList.add('hidden')" class="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition">Cancel</button>
                                <button type="submit" class="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-md transition transform active:scale-95">
                                    Download CSV
                                </button>
                            </div>
                        </form>
                    </div>
            `;
                this.renderHtmlModal(html);
            },

            processRawExport(e) {
                e.preventDefault();
                UI.toggleLoader(true);
                setTimeout(() => {
                    const formData = new FormData(e.target);
                    const startDate = formData.get('startDate');
                    const endDate = formData.get('endDate');

                    const db = Store.get();
                    const filtered = db.collections.filter(c => c.date >= startDate && c.date <= endDate);

                    if (filtered.length === 0) {
                        alert('No data found for the selected period.');
                        UI.toggleLoader(false);
                        return;
                    }

                    let csvContent = "data:text/csv;charset=utf-8,";
                    csvContent += "Date,Territory,Officer,CustomerCode,ReceiptNo,Amount,PaymentMode,Type,Timestamp\n";

                    filtered.forEach(c => {
                        const territory = db.territories.find(t => t.id === c.territoryId);
                        const tName = territory ? territory.name : 'Unknown';
                        const officer = territory ? territory.officer : 'Unknown';
                        const reg = c.regularAmount || (c.advanceAmount ? 0 : c.amount);
                        const adv = c.advanceAmount || 0;

                        const row = [
                            c.date,
                            `"${tName}"`,
                            `"${officer}"`,
                            `"${c.customerCode || ''}"`,
                            `"${c.receipt}"`,
                            c.amount,
                            c.mode,
                            c.isLmNp ? 'LM NP' : 'Regular',
                            new Date(c.timestamp).toLocaleString()
                        ].join(",");
                        csvContent += row + "\n";
                    });

                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `ACI_Recovery_Raw_${startDate}_to_${endDate}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    document.getElementById('generic-modal').classList.add('hidden');
                    UI.toggleLoader(false);
                }, 1000);
            },

            renderHtmlModal(content) {
                const modal = document.getElementById('generic-modal');
                const box = document.getElementById('modal-content');
                box.innerHTML = content;
                modal.classList.remove('hidden');
                setTimeout(() => {
                    box.classList.remove('scale-95', 'opacity-0');
                    box.classList.add('scale-100', 'opacity-100');
                }, 10);
            },

            // --- HELPER METHODS ---
            createKPICard(title, value, icon, color) {
                const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-emerald-100 text-emerald-600', purple: 'bg-indigo-100 text-indigo-600', orange: 'bg-orange-100 text-orange-600', red: 'bg-rose-100 text-rose-600', yellow: 'bg-yellow-100 text-yellow-600' };
                return `<div class="glass-panel p-4 rounded-xl shadow-sm dark:bg-dark-card hover-lift" ><div class="flex justify-between mb-4"><h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">${title}</h3><div class="w-10 h-10 rounded-full ${colors[color]} flex items-center justify-center"><i class="fa-solid ${icon}"></i></div></div><div class="text-2xl font-bold dark:text-white">${value}</div></div> `;
            },

            getDailyTrendData(tId) {
                const db = Store.get();
                const todayStr = Utils.getLocalDate();
                const todayParts = todayStr.split('-').map(Number);
                const todayUTC = new Date(Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]));
                const labels = [];
                const data = [];
                for (let i = 6; i >= 0; i--) {
                    const tempUTC = new Date(todayUTC);
                    tempUTC.setUTCDate(todayUTC.getUTCDate() - i);
                    const dateStr = tempUTC.toISOString().split('T')[0];
                    labels.push(dateStr.slice(5));
                    const sum = db.collections.filter(c => (c.territoryId === tId || c.territory_id === tId) && c.date === dateStr).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                    data.push(sum);
                }
                return { labels, data };
            },

            calcRowTotal(input) {
                const tr = input.closest('tr');
                const reg = parseFloat(tr.querySelector('input[name="projReg"]').value) || 0;
                const adv = parseFloat(tr.querySelector('input[name="projAdv"]').value) || 0;
                tr.querySelector('input[name="totalProj"]').value = reg + adv;
            },

            addEmptyDataRow() {
                const tbody = document.querySelector('#data-entry-table tbody');
                const rowCount = tbody.children.length + 1;
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition";
                tr.setAttribute('data-id', 'new');
                tr.innerHTML = `
            <td class="p-2 text-center text-slate-400 text-xs" > ${rowCount}</td>
                    <td class="p-1"><select name="part" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center"><option value="A">A</option><option value="B">B</option></select></td>
                    <td class="p-1"><input type="text" name="name" placeholder="New Territory" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-medium"></td>
                    <td class="p-1"><input type="number" name="targetFiles" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                    <td class="p-1"><input type="number" name="projFiles" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                    <td class="p-1"><input type="number" name="targetAmount" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-blue-600"></td>
                    <td class="p-1"><input type="number" name="projReg" oninput="UI.calcRowTotal(this)" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                    <td class="p-1"><input type="number" name="projAdv" oninput="UI.calcRowTotal(this)" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                    <td class="p-1"><input type="number" name="totalProj" readonly class="w-full p-2 bg-slate-50 dark:bg-slate-800 border-none text-right font-mono font-bold text-slate-500 cursor-default"></td>
                    <td class="p-1"><input type="number" name="lmNpTargetAmount" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-600"></td>
                    <td class="p-1"><input type="number" name="lmNpTargetFiles" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                    <td class="p-1 border-l border-slate-100 dark:border-slate-700"><input type="number" name="totalOd" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-brand-600 dark:text-brand-400"></td>
                    <td class="p-1"><div class="relative"><input type="number" name="odGrowthSply" step="0.01" class="w-full p-2 pr-6 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"><span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-[10px]">%</span></div></td>
                    <td class="p-1"><input type="number" name="perFileOd" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                    <td class="p-1"><input type="number" name="sixPlusOdFiles" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-center font-mono"></td>
                    <td class="p-1"><div class="relative"><input type="number" name="sixPlusOdGrowthSplm" step="0.01" class="w-full p-2 pr-6 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"><span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-[10px]">%</span></div></td>

                    <td class="p-1 text-center"><button onclick="UI.deleteDataEntryRow(this, 'new')" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
                tbody.appendChild(tr);
            },

            addUserRow() {
                const tbody = document.querySelector('#user-mgmt-table tbody');
                const rowCount = tbody.children.length + 1;
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition";
                tr.innerHTML = `
            <td class="p-2 text-center text-slate-400 text-xs" > ${rowCount}</td>
                    <td class="p-1"><input type="text" name="username" placeholder="New Territory" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-medium"></td>
                    <td class="p-1"><input type="text" name="officerName" placeholder="Officer Name" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                    <td class="p-1"><input type="text" name="password" placeholder="1234" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono text-slate-600 dark:text-slate-400"></td>
                    <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
                tbody.appendChild(tr);
            },

            deleteDataEntryRow(btn, id) {
                const tr = btn.closest('tr');
                const nameInput = tr.querySelector('input[name="name"]');
                const name = nameInput && nameInput.value ? nameInput.value : 'this territory';

                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = `
                    <div class="text-center p-4">
                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Territory?</h3>
                        <p class="text-slate-500 mb-4">Are you sure you want to delete <strong>${name}</strong>? This cannot be undone and permanently erases all associated targets, projections, and collections immediately.</p>
                        <div class="flex justify-center space-x-3">
                            <button onclick="UI.closeModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium">Cancel</button>
                            <button id="confirm-delete-btn" class="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-md hover:shadow-red-500/30 transition transform active:scale-95">Delete Permanently</button>
                        </div>
                    </div>
                `;
                document.getElementById('generic-modal').classList.remove('hidden');
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);

                document.getElementById('confirm-delete-btn').onclick = async () => {
                    if (!id || id === 'new') {
                        tr.remove();
                        UI.closeModal();
                        UI.showSuccess('Draft row removed quickly');
                    } else {
                        UI.toggleLoader(true);
                        try {
                            const response = await fetch(`${Store.apiUrl}/delete`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ collection: 'territories', id })
                            });

                            if (!response.ok) throw new Error('Failed to delete territory permanently');

                            await Store.init(); // System Refresh Cache Flow Hook
                            tr.remove();
                            UI.closeModal();
                            UI.showSuccess('Territory perma-deleted successfully Tracker wiped');
                        } catch (err) {
                            console.error('Data Deletion error:', err);
                            alert('An error occurred deleting this entity record.');
                        } finally {
                            UI.toggleLoader(false);
                        }
                    }
                };
            },

            saveBulkData() {
                const db = Store.get();
                const currentMonth = Utils.getActiveMonth();
                const rows = document.querySelectorAll('#data-entry-table tbody tr');

                (async () => {
                    UI.toggleLoader(true);
                    const targets = [];
                    const territories = [];

                    rows.forEach(row => {
                        const id = row.getAttribute('data-id');
                        const getVal = (name) => row.querySelector(`[name="${name}"]`).value;
                        const getNum = (name) => parseFloat(getVal(name)) || 0;

                        const tId = (!id || id === 'new' || id === 'null') ? 't' + Date.now().toString(36) + Math.random().toString(36).substr(2) : id;

                        territories.push({
                            id: tId,
                            name: getVal('name'),
                            part: getVal('part'),
                            officer: getVal('name')
                        });

                        targets.push({
                            territory_id: tId,
                            month: currentMonth,
                            files: getNum('targetFiles'),
                            proj_files: getNum('projFiles'),
                            amount: getNum('targetAmount'),
                            proj_reg: getNum('projReg'),
                            proj_adv: getNum('projAdv'),
                            lm_np_target_amount: getNum('lmNpTargetAmount'),
                            lm_np_target_files: getNum('lmNpTargetFiles'),
                            total_od: getNum('totalOd'),
                            od_growth_sply: getNum('odGrowthSply'),
                            per_file_od: getNum('perFileOd'),
                            six_plus_od_files: getNum('sixPlusOdFiles'),
                            six_plus_od_growth_splm: getNum('sixPlusOdGrowthSplm')
                        });
                    });

                    const activeIds = territories.map(t => t.id);
                    const deletedTerritoryIds = db.territories.map(t => t.id).filter(id => !activeIds.includes(id));

                    try {
                        const response = await fetch(`${Store.apiUrl}/sync-targets`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ territories, targets, deletedTerritoryIds })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Sync failed: ${errorText}`);
                        }

                        await Store.init(); // Refresh cache
                        UI.showSuccess('Monthly Targets & Setup Saved!');
                        UI.renderAdminDashboard();
                    } catch (error) {
                        console.error('Failed to save data:', error);
                        alert(`Error saving targets: ${error.message}`);
                    } finally {
                        UI.toggleLoader(false);
                    }
                })();
            },

            restoreDefaultUsers() {
                if (!confirm("Are you sure you want to restore default officers for all territories?")) return;
                (async () => {
                    UI.toggleLoader(true);
                    try {
                        await Store.seed();
                        await Store.init();
                        UI.renderUserManagement();
                        UI.showSuccess('Default officers restored!');
                    } catch (err) {
                        console.error(err);
                        alert('Failed to restore officers: ' + err.message);
                    } finally {
                        UI.toggleLoader(false);
                    }
                })();
            },

            saveUsers() {
                (async () => {
                    UI.toggleLoader(true);
                    const rows = document.querySelectorAll('#user-mgmt-table tbody tr');
                    const users = [];
                    rows.forEach(row => {
                        const getVal = (name) => row.querySelector(`[name="${name}"]`).value;
                        const username = getVal('username');
                        if (username) {
                            users.push({
                                username: username,
                                officerName: getVal('officerName'),
                                password: getVal('password'),
                                role: 'officer',
                                territoryId: username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                            });
                        }
                    });

                    try {
                        const response = await fetch(`${Store.apiUrl}/sync-users`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ users })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Sync failed: ${errorText}`);
                        }

                        await Store.init();
                        UI.showSuccess('User Credentials Saved!');
                    } catch (error) {
                        console.error('Failed to save users:', error);
                        alert(`Error saving users: ${error.message}`);
                    } finally {
                        UI.toggleLoader(false);
                    }
                })();
            },

            downloadTargetTemplate() {
                const db = Store.get();
                let csv = "Part,Territory Name,Total Files,Proj Files,Total EMI,Proj (Reg),Proj (Adv),LM NP Amt,LM NP Files,Total OD,OD Growth SPLY,Per File OD,6+ OD Files,6+ OD Growth SPLM\n";

                // Include all current territories from the Store
                db.territories.forEach(t => {
                    csv += `${t.part},${t.name},0,0,0,0,0,0,0,0,0,0,0,0\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = "target_setup_template.csv";
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            },

            downloadCurrentDataCSV() {
                const db = Store.get();
                const currentMonth = Utils.getActiveMonth();
                let csv = "Part,Territory Name,Total Files,Proj Files,Total EMI,Proj (Reg),Proj (Adv),LM NP Amt,LM NP Files,Total OD,OD Growth SPLY,Per File OD,6+ OD Files,6+ OD Growth SPLM\n";

                db.territories.forEach(t => {
                    const target = db.targets.find(tg => tg.territoryId === t.id && tg.month === currentMonth) || {};
                    const val = (prop, fallback = 0) => target[prop] !== undefined ? target[prop] : fallback;

                    csv += `${t.part || ''},${t.name || ''},` +
                           `${val('files')},` +
                           `${val('projFiles')},` +
                           `${val('amount')},` +
                           `${val('projReg')},` +
                           `${val('projAdv')},` +
                           `${val('lmNpTargetAmount')},` +
                           `${val('lmNpTargetFiles')},` +
                           `${val('totalOd')},` +
                           `${val('odGrowthSply')},` +
                           `${val('perFileOd')},` +
                           `${val('sixPlusOdFiles')},` +
                           `${val('sixPlusOdGrowthSplm')}\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `current_target_setup_${currentMonth}.csv`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            },

            async handleCSVUpload(e) {
                const file = e.target.files[0];
                if (!file) return;

                UI.toggleLoader(true);

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const text = event.target.result;
                    const rows = text.split('\n').slice(1);
                    const externalData = [];

                    rows.forEach((row, i) => {
                        if (!row.trim()) return;
                        const cols = row.split(',');
                        if (cols.length >= 14) {
                            const tId = cols[1].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                            externalData.push({
                                id: tId,
                                part: cols[0],
                                name: cols[1],
                                targetFiles: parseInt(cols[2]) || 0,
                                projFiles: parseInt(cols[3]) || 0,
                                targetAmount: parseFloat(cols[4]) || 0,
                                projReg: parseFloat(cols[5]) || 0,
                                projAdv: parseFloat(cols[6]) || 0,
                                lmNpTargetAmount: parseFloat(cols[7]) || 0,
                                lmNpTargetFiles: parseInt(cols[8]) || 0,
                                totalOd: parseFloat(cols[9]) || 0,
                                odGrowthSply: parseFloat(cols[10]) || 0,
                                perFileOd: parseFloat(cols[11]) || 0,
                                sixPlusOdFiles: parseInt(cols[12]) || 0,
                                sixPlusOdGrowthSplm: parseFloat(cols[13]) || 0
                            });
                        }
                    });

                    UI.renderDataEntry(externalData);
                    UI.toggleLoader(false);
                    UI.showSuccess('Previewing imported data. Click "Save All Changes" to save to database.');
                };
                reader.readAsText(file);
            },

            handleUserCSV(e) {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target.result;
                    const rows = text.split('\n').slice(1);
                    const tbody = document.querySelector('#user-mgmt-table tbody');
                    tbody.innerHTML = '';
                    rows.forEach((row, i) => {
                        if (!row.trim()) return;
                        const cols = row.split(',');
                        if (cols.length >= 3) {
                            const tr = document.createElement('tr');
                            tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition";
                            tr.innerHTML = `
                                <td class="p-2 text-center text-slate-400 text-xs">${i + 1}</td>
                                <td class="p-1"><input type="text" name="username" value="${(cols[0] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-medium"></td>
                                <td class="p-1"><input type="text" name="officerName" value="${(cols[1] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                <td class="p-1"><input type="text" name="password" value="${(cols[2] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono text-slate-600 dark:text-slate-400"></td>
                                <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
                            `;
                            tbody.appendChild(tr);
                        }
                    });
                };
                reader.readAsText(file);
            },

            downloadUserTemplate() {
                const csv = "Territory Name (Username),Officer Name,Employee ID (Password)\n" +
                    "Region 01,John Doe,EMP101";
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = "user_import_template.csv";
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            },



            handleVehiclePerfCSV(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    const text = e.target.result;
                    const rows = text.split('\n').slice(1);
                    const tbody = document.querySelector('#vehicle-perf-table tbody');
                    tbody.innerHTML = '';

                    rows.forEach(row => {
                        const cols = row.split(',');
                        if (cols.length >= 6) {
                            const tr = document.createElement('tr');
                            tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition";
                            tr.innerHTML = `
            <td class="p-1" ><input type="text" name="customerId" value="${(cols[0] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono font-bold"></td>
                                <td class="p-1"><input type="text" name="customerName" value="${(cols[1] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                <td class="p-1"><input type="text" name="model" value="${(cols[2] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                <td class="p-1"><input type="number" name="km1" value="${(cols[3] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                <td class="p-1"><input type="number" name="km2" value="${(cols[4] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                <td class="p-1"><input type="number" name="earning" value="${(cols[5] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono font-bold text-brand-600"></td>
                                <td class="p-1"><input type="number" name="overdueNo" value="${(cols[6] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-500"></td>
                                <td class="p-1"><input type="number" name="overdueAmt" value="${(cols[7] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-600 font-bold"></td>
                                <td class="p-1"><input type="text" name="extra1" value="${(cols[8] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                <td class="p-1"><input type="text" name="extra2" value="${(cols[9] || '').trim()}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
                            tbody.appendChild(tr);
                        }
                    });
                };
                reader.readAsText(file);
            },

            renderAdminVehiclePerf() {
                const db = Store.get();
                const data = db.vehicle_performance || [];
                // Extract all IDs for Select All
                const allIds = data.map(d => d.id);

                document.getElementById('views-container').innerHTML = `
            <div class="animate-entry flex flex-col h-[calc(100vh-140px)]" >
                        <div class="mb-4 flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Vehicle Performance Data</h2>
                                <p class="text-sm text-slate-500">Upload running data, earning estimates, and overdue info</p>
                            </div>
                            <div class="flex space-x-3">
                                <button onclick="UI.downloadVehiclePerfTemplate()" class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium hover-lift">
                                    <i class="fa-solid fa-download mr-2 text-slate-500"></i> Template
                                </button>
                                <label class="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-sm font-medium cursor-pointer hover-lift">
                                    <i class="fa-solid fa-file-csv mr-2 text-brand-600"></i> Import CSV
                                    <input type="file" class="hidden" accept=".csv" onchange="UI.handleVehiclePerfCSV(event)">
                                </label>
                                <button onclick="UI.saveVehiclePerf()" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md font-bold hover-lift">
                                    <i class="fa-solid fa-save mr-2"></i> Save Data
                                </button>
                            </div>
                        </div>

                        <div class="flex-1 glass-panel rounded-xl shadow-md dark:bg-dark-card overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
                             <div class="overflow-auto flex-1">
                                <table class="w-full text-sm text-left border-collapse" id="vehicle-perf-table">
                                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase sticky top-0 z-10 font-bold text-xs">
                                        <tr>
                                            <th class="p-3 border-b dark:border-slate-700 w-10 text-center">
                                                <input type="checkbox" id="select-all-vehicle_performance" onchange="UI.selectAll('vehicle_performance', ['${allIds.join("','")}'])" class="rounded border-slate-300 cursor-pointer">
                                            </th>
                                            <th class="p-3 border-b dark:border-slate-700 w-24">Cust. ID</th>
                                            <th class="p-3 border-b dark:border-slate-700 w-32">Name</th>
                                            <th class="p-3 border-b dark:border-slate-700 w-24">Model</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-right w-20">M1 KM</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-right w-20">M2 KM</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-right text-brand-600 w-24">Earning</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-right text-rose-500 w-20">OD No</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-right text-rose-600 w-24">OD Amt</th>
                                            <th class="p-3 border-b dark:border-slate-700 w-24">Info 1</th>
                                            <th class="p-3 border-b dark:border-slate-700 w-24">Info 2</th>
                                            <th class="p-3 border-b dark:border-slate-700 text-center w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        ${data.length > 0 ? data.map(row => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition" data-row-id="${row.id}">
                                                <td class="p-3 text-center">
                                                    <input type="checkbox" onchange="UI.toggleSelect('vehicle_performance', '${row.id}')" data-select-type="vehicle_performance" data-id="${row.id}" class="rounded border-slate-300 cursor-pointer">
                                                </td>
                                                <td class="p-1"><input type="text" name="customerId" value="${row.customerId || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono font-bold"></td>
                                                <td class="p-1"><input type="text" name="customerName" value="${row.customerName || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                                <td class="p-1"><input type="text" name="model" value="${row.model || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                                <td class="p-1"><input type="number" name="km1" value="${row.km1 || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                                <td class="p-1"><input type="number" name="km2" value="${row.km2 || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                                                <td class="p-1"><input type="number" name="earning" value="${row.earning || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono font-bold text-brand-600"></td>
                                                <td class="p-1"><input type="number" name="overdueNo" value="${row.overdueNo || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-500"></td>
                                                <td class="p-1"><input type="number" name="overdueAmt" value="${row.overdueAmt || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-600 font-bold"></td>
                                                <td class="p-1"><input type="text" name="extra1" value="${row.extra1 || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                                <td class="p-1"><input type="text" name="extra2" value="${row.extra2 || ''}" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                                                <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
                                            </tr>
                                        `).join('') : `
                                            <tr><td colspan="12" class="p-8 text-center text-slate-400 italic">No data. Add rows or import CSV.</td></tr>
                                        `}
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 flex justify-between">
                                <button onclick="UI.addVehiclePerfRow()" class="text-brand-600 hover:text-brand-700 font-bold">+ Add Row</button>
                            </div>
                        </div>
                    </div>
            `;
            },

            addVehiclePerfRow() {
                const tbody = document.querySelector('#vehicle-perf-table tbody');
                if (tbody.children.length === 1 && tbody.children[0].innerText.includes('No data')) tbody.innerHTML = '';

                const id = 'new_' + Date.now();
                const tr = document.createElement('tr');
                tr.setAttribute('data-row-id', id);
                tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition";
                tr.innerHTML = `
            <td class="p-3 text-center" >
                         <!--New rows not selectable until saved-->
            <i class="fa-solid fa-asterisk text-slate-300 text-xs"></i>
                    </td>
                    <td class="p-1"><input type="text" name="customerId" placeholder="C-XXXX" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none font-mono font-bold"></td>
                    <td class="p-1"><input type="text" name="customerName" placeholder="Name" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                    <td class="p-1"><input type="text" name="model" placeholder="Model" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                    <td class="p-1"><input type="number" name="km1" placeholder="0" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                    <td class="p-1"><input type="number" name="km2" placeholder="0" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono"></td>
                    <td class="p-1"><input type="number" name="earning" placeholder="0" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono font-bold text-brand-600"></td>
                    <td class="p-1"><input type="number" name="overdueNo" placeholder="0" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-500"></td>
                    <td class="p-1"><input type="number" name="overdueAmt" placeholder="0" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none text-right font-mono text-rose-600 font-bold"></td>
                    <td class="p-1"><input type="text" name="extra1" placeholder="Info" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                    <td class="p-1"><input type="text" name="extra2" placeholder="Info" class="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded outline-none"></td>
                    <td class="p-1 text-center"><button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
                tbody.appendChild(tr);
                tbody.lastElementChild.scrollIntoView({ behavior: 'smooth' });
            },

            // NEW TEMPLATE DOWNLOAD FUNCTION
            downloadVehiclePerfTemplate() {
                const csvContent = "CustomerID,CustomerName,VehicleModel,KMRunMonth1,KMRunMonth2,EstimatedEarning,OverdueNo,OverdueAmount,ExtraInfo1,ExtraInfo2\n" +
                    "C-1001,John Doe,Yamaha FZS V3,1200,1500,25000,1,5500,Note1,Note2";

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `vehicle_performance_template.csv`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            },

            async saveVehiclePerf() {
                UI.toggleLoader(true);
                const rows = document.querySelectorAll('#vehicle-perf-table tbody tr');
                const data = [];
                rows.forEach(row => {
                    const getVal = (name) => row.querySelector(`input[name = "${name}"]`)?.value || '';
                    const cid = getVal('customerId');

                    if (cid) {
                        data.push({
                            customerId: cid,
                            customerName: getVal('customerName'),
                            model: getVal('model'),
                            km1: parseFloat(getVal('km1')) || 0,
                            km2: parseFloat(getVal('km2')) || 0,
                            earning: parseFloat(getVal('earning')) || 0,
                            overdueNo: parseInt(getVal('overdueNo')) || 0,
                            overdueAmt: parseFloat(getVal('overdueAmt')) || 0,
                            extra1: getVal('extra1'),
                            extra2: getVal('extra2')
                        });
                    }
                });

                try {
                    const response = await fetch(`${Store.apiUrl}/sync-vehicle-perf`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Sync failed: ${errorText}`);
                    }

                    await Store.init();
                    UI.showSuccess('Vehicle Performance Data Saved!');
                    UI.renderAdminVehiclePerf();
                } catch (error) {
                    console.error('Failed to save vehicle perf:', error);
                    alert(`Error saving performance: ${error.message}`);
                } finally {
                    UI.toggleLoader(false);
                }
            },



            searchVehiclePerf(query) {
                if (!query) return;
                UI.toggleLoader(true);
                const container = document.getElementById('vehicle-result');
                if (container) container.classList.add('hidden');

                setTimeout(() => {
                    const db = Store.get();
                    // Basic exact match or includes
                    query = query.toUpperCase();
                    const vehicle = (db.vehicle_performance || []).find(v => v.customerId.toUpperCase() === query || v.customerId.toUpperCase().includes(query));

                    if (!container) return;

                    if (vehicle) {
                        const totalKm = (parseFloat(vehicle.km1) || 0) + (parseFloat(vehicle.km2) || 0);
                        container.innerHTML = `
            <div class="glass-panel p-0 rounded-3xl shadow-2xl dark:bg-dark-card overflow-hidden border border-brand-100 dark:border-brand-900/30">
                                <div class="bg-gradient-to-r from-brand-600 to-emerald-500 p-6 text-white relative overflow-hidden">
                                    <div class="absolute -right-6 -bottom-6 opacity-20 transform rotate-12">
                                        <i class="fa-solid fa-truck-fast text-9xl"></i>
                                    </div>
                                    <div class="relative z-10">
                                        <div class="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-3 border border-white/30 backdrop-blur-sm">${vehicle.customerId}</div>
                                        <h3 class="text-2xl font-bold mb-1">${vehicle.customerName || 'Unknown'}</h3>
                                        <p class="opacity-90 font-medium flex items-center"><i class="fa-solid fa-car-side mr-2"></i> ${vehicle.model || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-8 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                        <div>
                                            <p class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Estimated Earning</p>
                                            <h4 class="text-3xl font-black text-amber-600">Ã Â§Â³ ${parseFloat(vehicle.earning || 0).toLocaleString()}</h4>
                                        </div>
                                        <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                                            <i class="fa-solid fa-money-bill-trend-up"></i>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mb-2">
                                        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                                            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Last 2 Months Run</p>
                                            <p class="text-xl font-bold text-slate-800 dark:text-white">${totalKm.toLocaleString()} <span class="text-xs text-slate-500">KM</span></p>
                                        </div>
                                        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                                            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Avg. Monthly</p>
                                            <p class="text-xl font-bold text-slate-800 dark:text-white">${Math.round(totalKm / 2).toLocaleString()} <span class="text-xs text-slate-500">KM</span></p>
                                        </div>
                                    </div>

                                    <div class="flex gap-1 mt-4">
                                        <div class="h-2 rounded-l-full bg-blue-400" style="width: ${(vehicle.km1 / totalKm) * 100}%" title="Month 1: ${vehicle.km1}"></div>
                                        <div class="h-2 rounded-r-full bg-blue-600" style="width: ${(vehicle.km2 / totalKm) * 100}%" title="Month 2: ${vehicle.km2}"></div>
                                    </div>
                                    <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                        <span>Month 1: ${vehicle.km1} km</span>
                                        <span>Month 2: ${vehicle.km2} km</span>
                                    </div>
                                </div>
                            </div>
            `;
                    } else {
                        container.innerHTML = `
            <div class="glass-panel p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                <div class="text-red-400 text-4xl mb-3"><i class="fa-regular fa-circle-xmark"></i></div>
                                <h3 class="text-lg font-bold text-red-600 mb-1">No Data Found</h3>
                                <p class="text-sm text-red-500 opacity-80">Could not find vehicle data for ID: <b>${query}</b></p>
                            </div>
            `;
                    }

                    container.classList.remove('hidden');
                    UI.toggleLoader(false);
                }, 500);
            },

            // --- MODAL HANDLERS (NEW) ---
            renderModal(title, content) {
                let m = document.getElementById('generic-modal');
                // Ensure modal wrapper exists (it should from static HTML)
                if (!m) {
                    console.error('Generic modal container not found');
                    return;
                }

                const modalContent = document.getElementById('modal-content');
                if (!modalContent) {
                    console.error('Modal content container not found');
                    return;
                }

                // Inject full structure including title and body into modal-content
                modalContent.innerHTML = `
                    <div class="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white" id="modal-title">${title}</h3>
                        <button onclick="UI.closeModal('generic-modal')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    <div id="modal-body" class="p-6">${content}</div>
                `;

                m.classList.remove('hidden');
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            },

            openSettlementModal(id = null) {
                const db = Store.get();
                const item = id ? db.settlements.find(s => String(s.id) === String(id)) : {};
                const isOfficer = Auth.currentUser.role === 'officer';
                const currentTId = isOfficer ? this.getCurrentTerritoryId() : (item.territoryId || '');
                const territories = db.territories.map(t => `<option value="${t.id}" ${item.territoryId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

                const html = `
                    <form onsubmit="UI.saveSettlement(event)" class="space-y-4">
                        <input type="hidden" name="id" value="${id || ''}">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                <input type="date" name="date" value="${item.date || Utils.getLocalDate()}" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500">
                            </div>
                            ${isOfficer ? `
                            <div class="flex flex-col justify-end pb-1">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Territory</span>
                                <span class="text-sm font-bold text-brand-600">${db.territories.find(t => t.id === currentTId)?.name || 'N/A'}</span>
                                <input type="hidden" name="territoryId" value="${currentTId}">
                            </div>` : `
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Territory</label>
                                <select name="territoryId" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500">
                                    <option value="">Select Territory</option>
                                    ${territories}
                                </select>
                            </div>`}
                        </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Code</label>
                        <input type="text" id="coll-input-customer" oninput="UI.calcCollModalTotal()" name="customerCode" value="${item.customerCode || ''}" required placeholder="C-XXXX" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-mono font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select name="type" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500">
                                <option value="Regular Close" ${item.type === 'Regular Close' ? 'selected' : ''}>Regular Close</option>
                                <option value="Early Settlement" ${item.type === 'Early Settlement' ? 'selected' : ''}>Early Settlement</option>
                                <option value="Credit Note" ${item.type === 'Credit Note' ? 'selected' : ''}>Credit Note</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                            <input type="number" name="amount" value="${item.amount || ''}" placeholder="0" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-mono font-bold">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Remarks</label>
                        <textarea name="remarks" rows="2" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500">${item.remarks || ''}</textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-md hover-lift transition">
                        <i class="fa-solid fa-save mr-2"></i> Save Settlement
                    </button>
                </form>
        `;
                this.renderModal(id ? 'Edit Settlement' : 'Add New Settlement', html);
            },

            saveSettlement(e) {
                e.preventDefault();
                const form = e.target;
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
                    btn.disabled = true;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const payload = {
                    date: data.date,
                    territory_id: data.territoryId,
                    customer_code: data.customerCode,
                    type: data.type,
                    amount: parseFloat(data.amount) || 0,
                    remarks: data.remarks
                };

                if (data.id) payload.id = data.id;

                Store.update('settlements', payload).then(() => {
                    UI.closeModal('generic-modal');
                    if (Auth.currentUser.role === 'admin') {
                        UI.renderAdminSettlementsView();
                    } else {
                        UI.renderOfficerSettlementsView();
                    }
                    UI.showSuccess('Settlement Saved!');
                }).catch(err => {
                    alert('Error saving settlement: ' + err.message);
                }).finally(() => {
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                });
            },

            openCollectionModal(id = null, prefillTId = null, prefillCustId = null) {
                const db = Store.get();
                const item = id ? (db.collections.find(c => String(c.id) === String(id)) || {}) : {};
                const isOfficer = Auth.currentUser.role === 'officer';
                const currentTId = isOfficer ? this.getCurrentTerritoryId() : (item.territoryId || item.territory_id || prefillTId || '');
                const territories = db.territories.map(t => `<option value="${t.id}" ${currentTId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

                const html = `
                    <form onsubmit="UI.saveManualCollection(event)" class="space-y-3 text-xs">
                        <input type="hidden" name="id" value="${id || ''}">
                        
                        <!-- COMPACT MOBILE HEADER CARD -->
                        <div class="p-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 rounded-2xl text-white shadow-md flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                                    <i class="fa-solid fa-hand-holding-dollar"></i>
                                </div>
                                <div>
                                    <p class="text-[9px] font-black uppercase tracking-wider text-brand-200 leading-none">Territory</p>
                                    <p class="text-xs font-extrabold font-mono mt-0.5">
                                        ${isOfficer ? (db.territories.find(t => t.id === currentTId)?.name || 'N/A') : 'Manual Entry'}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] font-extrabold font-mono bg-white/25 border border-white/20 px-2.5 py-1 rounded-full shadow-2xs">${id ? 'EDIT ENTRY' : 'NEW COLLECTION'}</span>
                            </div>
                        </div>

                        <!-- DATE & TERRITORY -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div class="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label class="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <i class="fa-solid fa-calendar-day text-brand-500"></i> Collection Date *
                                </label>
                                <input type="date" name="date" value="${item.date || Utils.getLocalDate()}" required class="w-full h-9 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100 text-xs">
                            </div>

                            ${isOfficer ? `
                                <input type="hidden" name="territoryId" value="${currentTId}">
                            ` : `
                                <div class="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <label class="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                        <i class="fa-solid fa-map-location-dot text-brand-500"></i> Territory *
                                    </label>
                                    <select name="territoryId" required class="w-full h-9 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-semibold cursor-pointer text-xs">
                                        <option value="">Select Territory</option>
                                        ${territories}
                                    </select>
                                </div>
                            `}
                        </div>

                        <!-- CUSTOMER CODE & MONEY RECEIPT NO -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div class="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label class="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <i class="fa-solid fa-id-card text-brand-500"></i> Customer ID *
                                </label>
                                <input type="text" id="coll-input-customer" oninput="UI.calcCollModalTotal()" name="customerCode" value="${item.customerCode || ''}" required placeholder="Enter Customer ID" class="w-full h-9 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs uppercase">
                            </div>
                            <div class="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label class="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <i class="fa-solid fa-receipt text-brand-500"></i> Money Receipt No
                                </label>
                                <input type="text" name="receipt" value="${item.receipt || ''}" placeholder="MR Number" class="w-full h-9 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                            </div>
                        </div>

                        <!-- COLLECTION AMOUNT & AUTO-CALCULATION -->
                        <div class="p-3 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-2.5">
                            <div class="flex flex-col gap-1.5 pb-3 border-b border-emerald-500/20">
                                <label class="block text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-coins text-emerald-500"></i> Total Collected (৳) *</span>
                                    <span id="coll-customer-found-badge" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 hidden">Customer Found</span>
                                </label>
                                <input type="number" step="any" id="coll-input-total" oninput="UI.calcCollModalTotal()" value="${(parseFloat(item.amount) || (parseFloat(item.regularAmount || 0) + parseFloat(item.advanceAmount || 0)) || '')}" required placeholder="0.00" class="w-full h-12 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-xl shadow-sm">
                            </div>

                            <input type="hidden" name="regularAmount" id="coll-hidden-regular" value="${item.regularAmount || 0}">
                            <input type="hidden" name="advanceAmount" id="coll-hidden-advance" value="${item.advanceAmount || 0}">

                            <div class="grid grid-cols-3 gap-2 text-center" id="coll-auto-calc-box">
                                <div class="bg-white/60 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <p class="text-[9px] font-black uppercase text-slate-500">Total Due</p>
                                    <p class="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5" id="coll-display-due">৳0</p>
                                </div>
                                <div class="bg-indigo-50/50 dark:bg-indigo-900/20 p-2 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
                                    <p class="text-[9px] font-black uppercase text-indigo-500">Regular</p>
                                    <p class="text-[11px] font-mono font-bold text-indigo-600 mt-0.5" id="coll-display-reg">৳${item.regularAmount || 0}</p>
                                </div>
                                <div class="bg-amber-50/50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                                    <p class="text-[9px] font-black uppercase text-amber-500">Advance</p>
                                    <p class="text-[11px] font-mono font-bold text-amber-600 mt-0.5" id="coll-display-adv">৳${item.advanceAmount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <!-- PAYMENT MODE SELECTOR -->
                        <div class="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <label class="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <i class="fa-solid fa-credit-card text-brand-500"></i> Payment Mode *
                            </label>
                            <select name="mode" required class="w-full h-9 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer text-xs">
                                <option value="Cash" ${item.mode === 'Cash' ? 'selected' : ''}>💵 Cash</option>
                                <option value="Bank Transfer" ${item.mode === 'Bank Transfer' ? 'selected' : ''}>🏦 Bank Transfer</option>
                                <option value="Cheque" ${item.mode === 'Cheque' ? 'selected' : ''}>📑 Cheque</option>
                                <option value="Bkash/Nagad" ${item.mode === 'Bkash/Nagad' ? 'selected' : ''}>📱 Bkash / Nagad</option>
                            </select>
                        </div>

                        <!-- LMNP CHECKBOX CARD -->
                        <div class="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="isLmNp" name="isLmNp" value="true" ${item.isLmNp || item.is_lm_np ? 'checked' : ''} class="w-4 h-4 text-brand-600 bg-white dark:bg-slate-900 border-amber-300 rounded cursor-pointer accent-amber-500">
                                <label for="isLmNp" class="text-[11px] font-bold text-amber-800 dark:text-amber-300 cursor-pointer select-none">
                                    Mark as Last Month Non-Pay (LMNP) Collection
                                </label>
                            </div>
                        </div>

                        <!-- SUBMIT BUTTON -->
                        <div class="pt-1">
                            <button type="submit" class="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-98 transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-check-double text-sm"></i> Save Collection Entry
                            </button>
                        </div>
                    </form>
                `;
                this.renderModal(id ? 'Edit Collection' : 'Add Collection Entry', html);
                
                // Auto-fill customer ID if provided (e.g. from Admin Customer List)
                if (prefillCustId && !id) {
                    const custInput = document.getElementById('coll-input-customer');
                    if (custInput) {
                        custInput.value = decodeURIComponent(prefillCustId);
                        custInput.readOnly = true;
                        custInput.classList.add('bg-slate-100', 'cursor-not-allowed', 'opacity-80');
                        
                        // Trigger calculation immediately
                        setTimeout(() => UI.calcCollModalTotal(), 50);
                    }
                }

                setTimeout(() => { this.calcCollModalTotal(); }, 50);
            },

            calcCollModalTotal() {
                const totalColl = parseFloat(document.getElementById('coll-input-total')?.value) || 0;
                const custCode = (document.getElementById('coll-input-customer')?.value || '').trim().toLowerCase();
                
                let totalDue = 0;
                let customerFound = false;

                if (custCode) {
                    const customers = Store.cache.customers || [];
                    const customer = customers.find(c => String(c.customerId).trim().toLowerCase() === custCode);
                    if (customer) {
                        customerFound = true;
                        const overdue = parseFloat(customer.overdueTaka) || 0;
                        const emi = parseFloat(customer.instSize) || 0;
                        totalDue = overdue + emi;
                    }
                }

                const badgeEl = document.getElementById('coll-customer-found-badge');
                if (badgeEl) {
                    if (customerFound) {
                        badgeEl.classList.remove('hidden');
                        badgeEl.classList.add('bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/30', 'dark:text-emerald-400');
                        badgeEl.classList.remove('bg-slate-200', 'text-slate-500');
                        badgeEl.textContent = "Data Found";
                    } else {
                        badgeEl.classList.remove('hidden');
                        badgeEl.classList.add('bg-slate-100', 'text-slate-500', 'dark:bg-slate-800');
                        badgeEl.classList.remove('bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/30', 'dark:text-emerald-400');
                        badgeEl.textContent = custCode ? "No Match" : "";
                        if (!custCode) badgeEl.classList.add('hidden');
                    }
                }

                document.getElementById('coll-display-due').textContent = `৳${totalDue.toLocaleString()}`;

                let reg = 0;
                let adv = 0;
                
                if (customerFound && totalDue > 0) {
                    if (totalColl <= totalDue) {
                        reg = totalColl;
                    } else {
                        reg = totalDue;
                        adv = totalColl - totalDue;
                    }
                } else {
                    // If no customer matched or total due is 0, default to Regular
                    reg = totalColl;
                }

                const hiddenReg = document.getElementById('coll-hidden-regular');
                const hiddenAdv = document.getElementById('coll-hidden-advance');
                if (hiddenReg) hiddenReg.value = reg;
                if (hiddenAdv) hiddenAdv.value = adv;
                
                const dispReg = document.getElementById('coll-display-reg');
                const dispAdv = document.getElementById('coll-display-adv');
                if (dispReg) dispReg.textContent = `৳${reg.toLocaleString()}`;
                if (dispAdv) dispAdv.textContent = `৳${adv.toLocaleString()}`;
            },

            saveManualCollection(e) {
                e.preventDefault();
                UI.toggleLoader(true);
                const formData = new FormData(e.target);
                const reg = parseFloat(formData.get('regularAmount')) || 0;
                const adv = parseFloat(formData.get('advanceAmount')) || 0;

                const payload = {
                    date: formData.get('date'),
                    territory_id: formData.get('territoryId'),
                    receipt: formData.get('receipt'),
                    customer_code: formData.get('customerCode'),
                    regular_amount: reg,
                    advance_amount: adv,
                    amount: reg + adv,
                    mode: formData.get('mode'),
                    is_lm_np: formData.get('isLmNp') === 'true',
                    timestamp: Date.now(),
                    active_month: (formData.get('date') === Utils.getLocalDate() ? Utils.getActiveMonth() : formData.get('date').slice(0, 7))
                };

                const existingId = formData.get('id');
                if (existingId) {
                    payload.id = existingId;
                } else {
                    payload.id = 'new_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
                }

                Store.update('collections', payload).then(() => {
                    UI.closeModal('generic-modal');
                    if (document.getElementById('admin-history-table-body')) {
                        UI.updateAdminHistory(null, payload.date.substring(0, 8) + '01', payload.date.substring(0, 8) + '31', '', '');
                    } else if (document.getElementById('views-container').innerHTML.includes('Projection Monitor')) {
                        UI.renderAdminProjections();
                    } else if (document.getElementById('officer-dashboard-panel')) {
                        UI.renderOfficerDashboard();
                    }
                    UI.showSuccess('Collection Saved!');
                    UI.toggleLoader(false);
                }).catch(err => {
                    UI.toggleLoader(false);
                    alert("Error saving collection: " + err.message);
                });
            },

            deleteCollection(id) {
                if (!confirm('Are you sure you want to permanently delete this collection? This will immediately affect MTD statistics for all users.')) return;

                UI.toggleLoader(true);
                Store.delete('collections', id).then(() => {
                    if (document.getElementById('admin-history-table-body')) {
                        const formData = new FormData(document.querySelector('form[onsubmit="UI.updateAdminHistory(event)"]'));
                        // Reload history using the existing date range in the filters
                        UI.updateAdminHistory(null, formData.get('startDate'), formData.get('endDate'), formData.get('territorySearch'), formData.get('customerSearch'));
                    } else if (document.getElementById('views-container').innerHTML.includes('Projection Monitor')) {
                        UI.renderAdminProjections();
                    } else if (document.getElementById('officer-dashboard-panel')) {
                        UI.renderOfficerDashboard();
                    }
                    UI.showSuccess('Collection Deleted!');
                    UI.toggleLoader(false);
                }).catch(err => {
                    UI.toggleLoader(false);
                    alert("Error deleting collection: " + err.message);
                });
            },

            openOffroadModal(id = null) {
                const db = Store.get();
                const item = id ? db.offroad_vehicles.find(v => String(v.id) === String(id)) : {};
                const isOfficer = Auth.currentUser.role === 'officer';
                const currentTId = isOfficer ? this.getCurrentTerritoryId() : (item.territoryId || '');
                const territories = db.territories.map(t => `<option value="${t.id}" ${item.territoryId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

                const html = `
                    <form onsubmit="UI.saveOffroad(event)" class="space-y-3 sm:space-y-4">
                        <input type="hidden" name="id" value="${id || ''}">
                        <div class="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">In Date</label>
                                <input type="date" name="inDate" value="${item.inDate || Utils.getLocalDate()}" required class="w-full px-3 py-0 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-xs sm:text-sm appearance-none block m-0">
                            </div>
                            <div>
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Customer Code</label>
                                <input type="text" name="customerCode" value="${item.customerCode || ''}" required placeholder="C-XXXX" class="w-full px-3 py-0 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 font-mono font-bold text-xs sm:text-sm appearance-none block m-0">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3 sm:gap-4">
                            <div class="col-span-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Reason</label>
                                <select name="reason" required class="w-full px-3 py-0 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-xs sm:text-sm appearance-none block m-0">
                                    <option value="">Select Reason</option>
                                    <option value="Accident" ${item.reason === 'Accident' ? 'selected' : ''}>Accident</option>
                                    <option value="Capture" ${item.reason === 'Capture' ? 'selected' : ''}>Capture</option>
                                    <option value="Thana/Police station" ${item.reason === 'Thana/Police station' ? 'selected' : ''}>Thana/Police station</option>
                                    <option value="Lost or untraceable" ${item.reason === 'Lost or untraceable' ? 'selected' : ''}>Lost or untraceable</option>
                                </select>
                            </div>
                        </div>

                        ${isOfficer ? `<input type="hidden" name="territoryId" value="${currentTId}">` : `
                        <div>
                            <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Territory</label>
                            <select name="territoryId" required class="w-full px-3 py-0 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-xs sm:text-sm appearance-none block m-0">
                                <option value="">Select Territory</option>
                                ${territories}
                            </select>
                        </div>`}
                        
                        <div>
                            <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Vehicle currently in location</label>
                            <input type="text" name="location" value="${item.location || ''}" required class="w-full px-3 py-0 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-xs sm:text-sm appearance-none block m-0">
                        </div>
                        
                        <div>
                            <label class="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Remarks</label>
                            <textarea name="remarks" class="w-full px-3 py-2 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-xs sm:text-sm appearance-none block resize-none m-0">${item.remarks || ''}</textarea>
                        </div>

                        <button type="submit" class="w-full h-12 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition transform active:scale-95 text-sm sm:text-base mt-2 flex items-center justify-center">
                            <i class="fa-solid fa-save mr-2"></i> Submit Offroad Report
                        </button>
                    </form>
                `;
                this.renderModal(id ? 'Update Offroad record' : 'Report Offroad Vehicle', html);
            },

            saveOffroad(e) {
                e.preventDefault();
                const form = e.target;
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
                    btn.disabled = true;
                }
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                let payload = {
                    in_date: data.inDate,
                    customer_code: data.customerCode,
                    reason: data.reason,
                    location: data.location,
                    remarks: data.remarks,
                    territory_id: data.territoryId || Auth.currentUser.territoryId
                };

                if (data.id) {
                    payload.id = data.id;
                    const db = Store.get();
                    const existing = db.offroad_vehicles.find(v => String(v.id) === String(data.id));
                    if (existing && existing.status === 'Solved' && data.status !== 'Solved') payload.solve_date = Utils.getLocalDate();
                } else {
                    payload.status = 'Active';
                }

                Store.update('offroad_vehicles', payload).then(() => {
                    UI.closeModal('generic-modal');
                    if (Auth.currentUser.role === 'admin') UI.renderAdminOffroadView();
                    else UI.renderOfficerOffroadTracker();
                    UI.showSuccess('Offroad Case Saved!');
                }).catch(err => {
                    alert('Error saving offroad data: ' + err.message);
                }).finally(() => {
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                });
            },

            resolveOffroad(id) {
                if (confirm('Mark this case as Solved?')) {
                    const payload = {
                        id: id,
                        status: 'Solved',
                        solve_date: Utils.getLocalDate()
                    };
                    Store.update('offroad_vehicles', payload).then(() => {
                        if (Auth.currentUser.role === 'admin') UI.renderAdminOffroadView();
                        else UI.renderOfficerOffroadTracker();
                    });
                }
            },

            deleteOffroad(id) {
                if (confirm('Are you sure you want to permanently delete this offroad record?')) {
                    UI.toggleLoader(true);
                    Store.delete('offroad_vehicles', id).then(() => {
                        if (Auth.currentUser.role === 'admin') UI.renderAdminOffroadView();
                        else UI.renderOfficerOffroadTracker();
                        UI.showSuccess('Deleted successfully!');
                        UI.toggleLoader(false);
                    }).catch(err => {
                        UI.toggleLoader(false);
                        alert('Delete failed: ' + err.message);
                    });
                }
            },


            openProjectionModal(id = null) {
                const db = Store.get();
                const item = id ? db.projections.find(p => String(p.id) === String(id)) : {};
                const isOfficer = Auth.currentUser.role === 'officer';
                const currentTId = isOfficer ? this.getCurrentTerritoryId() : (item.territoryId || '');
                const territories = db.territories.map(t => `<option value="${t.id}" ${item.territoryId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

                const html = `
                    <form onsubmit="UI.saveProjection(event)" class="space-y-4">
                        <input type="hidden" name="id" value="${id || ''}">
                        ${isOfficer ? `
                        <div class="mb-4 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-lg border border-brand-100 dark:border-brand-900/20">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Managing Territory</span>
                            <span class="text-sm font-bold text-brand-600">${db.territories.find(t => t.id === currentTId)?.name || 'N/A'}</span>
                            <input type="hidden" name="territoryId" value="${currentTId}">
                        </div>` : `
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Territory</label>
                            <select name="territoryId" required ${id ? 'disabled' : ''} class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500">
                                <option value="">Select Territory</option>
                                ${territories}
                            </select>
                        </div>`}
                        ${isOfficer ? `
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Target Amount (Total)</label>
                                <input type="number" name="amount" value="${item.amount || (item.regularAmount || 0) + (item.advanceAmount || 0) || ''}" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-right font-mono font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">File Count Target</label>
                                <input type="number" name="fileCount" value="${item.fileCount || ''}" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-center font-mono font-bold">
                            </div>
                        </div>` : `
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Regular Target</label>
                                <input type="number" name="regularAmount" value="${item.regularAmount || 0}" required class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-right font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Advance Target</label>
                                <input type="number" name="advanceAmount" value="${item.advanceAmount || 0}" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-right font-mono">
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">File Count Target</label>
                            <input type="number" name="fileCount" value="${item.fileCount || 0}" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 text-center font-mono">
                        </div>`}
                    <button type="submit" class="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-md hover-lift transition">
                        <i class="fa-solid fa-save mr-2"></i> Save Projection
                    </button>
                </form>
                 `;
                this.renderModal(id ? 'Edit Projection' : 'Add Projection', html);
            },

            saveProjection(e) {
                e.preventDefault();
                const form = e.target;
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
                    btn.disabled = true;
                }

                const formData = new FormData(form);
                const isOfficer = Auth.currentUser.role === 'officer';

                let reg = parseFloat(formData.get('regularAmount')) || 0;
                let adv = parseFloat(formData.get('advanceAmount')) || 0;
                let total = reg + adv;

                if (isOfficer) {
                    total = parseFloat(formData.get('amount')) || 0;
                    reg = total;
                    adv = 0;
                }

                const today = Utils.getLocalDate();
                const payload = {
                    territory_id: formData.get('territoryId'),
                    regular_amount: reg,
                    advance_amount: adv,
                    amount: total,
                    file_count: parseInt(formData.get('fileCount')) || 0,
                    date: today,
                    active_month: Utils.getActiveMonth()
                };

                const dataId = formData.get('id');
                const db = Store.get();
                const existing = dataId ? db.projections.find(p => String(p.id) === String(dataId)) : db.projections.find(p => (p.territoryId === payload.territory_id || p.territory_id === payload.territory_id) && p.date === today);
                payload.timestamp = (existing && existing.timestamp) ? Number(existing.timestamp) : Date.now();

                if (dataId) {
                    payload.id = dataId;
                    if (!payload.territory_id && existing) {
                        payload.territory_id = existing.territoryId || existing.territory_id;
                    }
                }

                Store.update('projections', payload).then(() => {
                    UI.closeModal('generic-modal');
                    if (Auth.currentUser.role === 'admin') {
                        UI.renderAdminProjections();
                    } else {
                        UI.renderOfficerDashboard();
                    }
                    UI.showSuccess('Projection Saved!');
                }).catch(err => {
                    alert('Error saving projection: ' + err.message);
                }).finally(() => {
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                });
            },

            // --- HELPERS ---
            getOffroadIcon(reason) {
                if (!reason) return 'fa-triangle-exclamation';
                if (reason.includes('Thana') || reason.includes('Police')) return 'fa-shield-halved';
                if (reason === 'Capture' || reason === 'Captured') return 'fa-handcuffs';
                if (reason === 'Lost or untraceable') return 'fa-magnifying-glass-blur';
                return 'fa-triangle-exclamation';
            },
            getOffroadBadgeColor(reason) {
                if (!reason) return 'bg-red-100 text-red-600 border-red-200';
                if (reason.includes('Thana') || reason.includes('Police')) return 'bg-blue-100 text-blue-600 border border-blue-200';
                if (reason === 'Capture' || reason === 'Captured') return 'bg-orange-100 text-orange-600 border border-orange-200';
                if (reason === 'Lost or untraceable') return 'bg-slate-100 text-slate-600 border border-slate-200';
                return 'bg-red-100 text-red-600 border-red-200';
            },
            showModal(id) {
                const m = document.getElementById(id);
                if (m) {
                    m.classList.remove('hidden');
                    setTimeout(() => {
                        if (m.firstElementChild) {
                            m.firstElementChild.classList.remove('opacity-0', 'scale-95');
                            m.firstElementChild.classList.add('opacity-100', 'scale-100');
                        }
                    }, 10);
                }
            },
            closeModal(id = 'generic-modal') {
                const m = document.getElementById(id);
                if (m) {
                    if (m.firstElementChild) {
                        m.firstElementChild.classList.remove('opacity-100', 'scale-100');
                        m.firstElementChild.classList.add('opacity-0', 'scale-95');
                    }
                    setTimeout(() => m.classList.add('hidden'), 300);
                }
            },
            showRPICriteriaModal() {
                const content = `
                <div class="space-y-4">
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                        The Recovery Performance Index (RPI) is a consolidated performance score calculated as a weighted average of four key metrics, capped at a maximum of 100 points:
                    </p>
                    
                    <div class="space-y-3">
                        <!-- MTD Achievement (70%) -->
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 border-l-4 border-l-brand-500">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs font-black text-slate-700 dark:text-slate-200">MTD Achievement Target</span>
                                <span class="text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-1.5 py-0.5 rounded text-[10px]">70% Weight</span>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-normal">Month-to-Date Collections divided by the Month Projected Target Amount.</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div class="bg-brand-500 h-full rounded-full" style="width: 70%"></div>
                            </div>
                        </div>

                        <!-- Today's Projection Accuracy (10%) -->
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 border-l-4 border-l-blue-500">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs font-black text-slate-700 dark:text-slate-200">Today's Projection Accuracy</span>
                                <span class="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded text-[10px]">10% Weight</span>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-normal">Accuracy of today's collections relative to today's forecasted target.</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div class="bg-blue-500 h-full rounded-full" style="width: 10%"></div>
                            </div>
                        </div>

                        <!-- LMNP Recovery Rate (10%) -->
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 border-l-4 border-l-rose-500">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs font-black text-slate-700 dark:text-slate-200">LMNP Recovery Rate</span>
                                <span class="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded text-[10px]">10% Weight</span>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-normal">Collections progress on Last Month Non-Paying customer targets.</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div class="bg-rose-500 h-full rounded-full" style="width: 10%"></div>
                            </div>
                        </div>

                        <!-- Paid Files Rate (10%) -->
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 border-l-4 border-l-amber-500">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs font-black text-slate-700 dark:text-slate-200">Paid Files Rate (Cure Rate)</span>
                                <span class="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded text-[10px]">10% Weight</span>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-normal">Unique customer paid codes count versus total projected target files count.</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div class="bg-amber-500 h-full rounded-full" style="width: 10%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-[10px] text-indigo-700 dark:text-indigo-400 text-center font-bold">
                        <i class="fa-solid fa-circle-info mr-1"></i> Scoring Index is automatically capped at a maximum of 100 points.
                    </div>
                </div>
                `;
                this.renderModal('RPI Scoring Criteria', content);
            },
            toggleDailyReqColumn() {
                UI.showDailyReqColumn = !UI.showDailyReqColumn;
                const cols = document.querySelectorAll('.daily-req-col');
                cols.forEach(el => {
                    if (UI.showDailyReqColumn) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                    }
                });
                
                // Update empty row colspan
                const emptyRowTd = document.querySelector('#ranking-table-body td[colspan]');
                if (emptyRowTd) {
                    const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                    const baseColspan = isCompact ? 16 : 26;
                    let extra = 0;
                    if (UI.showDailyReqColumn) extra += 1;
                    if (UI.showOdColumns) extra += 2;
                    emptyRowTd.setAttribute('colspan', baseColspan + extra);
                }

                // Update toggle button style/icon
                const btn = document.getElementById('toggle-daily-req-btn');
                if (btn) {
                    const icon = btn.querySelector('i');
                    if (icon) {
                        if (UI.showDailyReqColumn) {
                            icon.className = 'fa-solid fa-eye';
                        } else {
                            icon.className = 'fa-solid fa-eye-slash';
                        }
                    }
                    if (UI.showDailyReqColumn) {
                        btn.className = "px-2.5 py-1 h-8 text-xs font-bold rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 transition flex items-center gap-1.5 shadow-sm";
                    } else {
                        btn.className = "px-2.5 py-1 h-8 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm";
                    }
                }
            },
            toggleOdColumns() {
                UI.showOdColumns = !UI.showOdColumns;
                const cols = document.querySelectorAll('.od-col');
                cols.forEach(el => {
                    if (UI.showOdColumns) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                    }
                });
                
                // Update empty row colspan
                const emptyRowTd = document.querySelector('#ranking-table-body td[colspan]');
                if (emptyRowTd) {
                    const isCompact = document.getElementById('views-container').innerHTML.includes("UI.renderAdminDashboard('compact')");
                    const baseColspan = isCompact ? 16 : 26;
                    let extra = 0;
                    if (UI.showDailyReqColumn) extra += 1;
                    if (UI.showOdColumns) extra += 2;
                    emptyRowTd.setAttribute('colspan', baseColspan + extra);
                }

                // Update toggle button style/icon dynamically
                const btn = document.getElementById('toggle-od-btn');
                if (btn) {
                    const icon = btn.querySelector('i');
                    if (icon) {
                        if (UI.showOdColumns) {
                            icon.className = 'fa-solid fa-eye transition-transform duration-300 group-hover:scale-110';
                        } else {
                            icon.className = 'fa-solid fa-eye-slash transition-transform duration-300 group-hover:scale-110';
                        }
                    }
                    
                    const indicatorDot = btn.querySelector('.relative.flex.h-1.5.w-1.5 .relative.inline-flex');
                    const indicatorPing = btn.querySelector('.relative.flex.h-1.5.w-1.5 .animate-ping');
                    
                    if (UI.showOdColumns) {
                        btn.className = "group relative px-3 py-1 h-8 text-xs font-bold rounded-lg border transition-all duration-350 ease-out flex items-center gap-2 shadow-sm overflow-hidden border-emerald-250 dark:border-emerald-850 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
                        if (indicatorDot) indicatorDot.className = "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500";
                        if (indicatorPing) indicatorPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400";
                    } else {
                        btn.className = "group relative px-3 py-1 h-8 text-xs font-bold rounded-lg border transition-all duration-350 ease-out flex items-center gap-2 shadow-sm overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-655 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600";
                        if (indicatorDot) indicatorDot.className = "relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-400";
                        if (indicatorPing) indicatorPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75";
                    }
                }
            },
            showSuccess(message) {
                const existing = document.getElementById('success-toast');
                if (existing) existing.remove();

                const toast = document.createElement('div');
                toast.id = 'success-toast';
                toast.className = 'fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-l-4 border-emerald-500 shadow-2xl rounded-xl px-3 py-2.5 pr-10 min-w-[320px] transform transition-all duration-500 translate-x-full opacity-0';
                toast.innerHTML = `
                    <div class="bg-emerald-100 text-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-check text-lg"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white text-sm">Success</h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">${message}</p>
                    </div>
                    <button onclick="this.parentElement.remove()" class="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                    <!-- Progress Bar -->
                    <div class="absolute bottom-0 left-0 h-1 bg-emerald-500/50 rounded-b-xl transition-all duration-[3000ms] ease-linear w-0" id="toast-progress"></div>
                `;

                document.body.appendChild(toast);

                // Entrance animation
                requestAnimationFrame(() => {
                    toast.classList.remove('translate-x-full', 'opacity-0');
                    document.getElementById('toast-progress').style.width = '100%';
                });

                // Auto remove
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        toast.classList.add('translate-x-full', 'opacity-0');
                        setTimeout(() => toast.remove(), 500);
                    }
                }, 3000);
            },
            toggleLoader(show) {
                const loader = document.getElementById('global-loader');
                if (loader) {
                    if (show) {
                        loader.classList.remove('hidden');
                        void loader.offsetWidth;
                        loader.classList.remove('opacity-0');
                    } else {
                        loader.classList.add('opacity-0');
                        setTimeout(() => loader.classList.add('hidden'), 300);
                    }
                }
            },

            async captureDashboard() {
                UI.toggleLoader(true);
                UI.showSuccess('Generating Formal Excel Report...');

                const dashboard = document.getElementById('views-container');
                if (!dashboard) {
                    UI.toggleLoader(false);
                    return;
                }

                // Helper: Robust text extraction by label
                const findValueByLabel = (label, root = dashboard) => {
                    const elements = Array.from(root.querySelectorAll('span, td, th, p'));
                    const target = elements.find(s => s.innerText.trim().toUpperCase() === label.toUpperCase());
                    if (!target) return 'N/A';

                    // Check next sibling for metric-style layout
                    if (target.nextElementSibling) return target.nextElementSibling.innerText.trim();

                    // Check parent's last child (for cards)
                    const parent = target.parentElement;
                    if (parent && parent.children.length > 1) {
                        return parent.children[parent.children.length - 1].innerText.trim();
                    }
                    return 'N/A';
                };

                // Helper: Extract Achievement specifically
                const getAchievement = (card) => {
                    if (!card) return 'N/A';
                    const target = Array.from(card.querySelectorAll('span')).find(s => s.innerText.includes('Achievement'));
                    return target ? target.nextElementSibling?.innerText.trim() : 'N/A';
                };

                // 1. Data Gathering
                const metrics = {
                    totalTarget: findValueByLabel('Total Target'),
                    totalFiles: findValueByLabel('Total Files'),
                    todayProj: findValueByLabel('Today Proj'),
                    remaining: findValueByLabel('Remaining'),
                    mtdColl: findValueByLabel('Till Date Coll'),
                    collFiles: findValueByLabel('Coll Files'),
                    todayColl: findValueByLabel('Collection'),
                    dailyReq: findValueByLabel('Daily Req'),
                    achMtd: findValueByLabel('Ach % (MTD)'),
                    uncollected: findValueByLabel('Uncollected'),
                    achToday: findValueByLabel('Ach % (Today)')
                };

                // Sections
                const partACard = Array.from(dashboard.querySelectorAll('h3')).find(h => h.innerText.includes('Part A'))?.closest('.rounded-xl');
                const partBCard = Array.from(dashboard.querySelectorAll('h3')).find(h => h.innerText.includes('Part B'))?.closest('.rounded-xl');

                const summaryPartA = {
                    rpi: partACard?.querySelector('.text-xl.font-black')?.innerText.trim() || 'N/A',
                    target: findValueByLabel('Target Amt', partACard),
                    coll: findValueByLabel('Coll Amt', partACard),
                    ach: getAchievement(partACard)
                };

                const summaryPartB = {
                    rpi: partBCard?.querySelector('.text-xl.font-black')?.innerText.trim() || 'N/A',
                    target: findValueByLabel('Target Amt', partBCard),
                    coll: findValueByLabel('Coll Amt', partBCard),
                    ach: getAchievement(partBCard)
                };

                // 2. Report Generation
                const report = document.createElement('div');
                report.id = 'excel-report-render';
                report.style.cssText = `
                    position: fixed; left: -9999px; top: 0; 
                    width: 794px; padding: 20px 30px; background: #ffffff; 
                    font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937;
                    box-sizing: border-box;
                `;

                const tableStyle = 'width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;';
                const headerStyle = 'background-color: #f8fafc; font-weight: bold; border: 0.5px solid #cbd5e1; padding: 1.5px 6px; color: #475569; text-align: left; vertical-align: middle;';
                const cellStyle = 'border: 0.5px solid #cbd5e1; padding: 1.5px 6px; text-align: left; vertical-align: middle;';
                const mainTitle = 'font-size: 18px; font-weight: 800; color: #1e40af; letter-spacing: -0.5px; border-bottom: 2px solid #1e40af; padding-bottom: 6px; margin-bottom: 8px;';
                const sectionTitle = 'font-weight: 800; margin-bottom: 8px; font-size: 12px; color: #334155; text-transform: uppercase;';

                let html = `
                    <div style="${mainTitle}">OFFICIAL RECOVERY PERFORMANCE REPORT</div>
                    <div style="margin-bottom: 15px; font-size: 10px; color: #64748b; font-weight: 600;">REPORTING DATE: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</div>
                    
                    <div style="${sectionTitle}">1. Executive Summary Aggregate</div>
                    <table style="${tableStyle}">
                        <tr>
                            <td style="${headerStyle}">TOTAL TARGET (AMT)</td><td style="${cellStyle}; font-weight:700;">${metrics.totalTarget}</td>
                            <td style="${headerStyle}">TOTAL TARGET (FILES)</td><td style="${cellStyle}">${metrics.totalFiles}</td>
                        </tr>
                        <tr>
                            <td style="${headerStyle}">MTD COLLECTION (AMT)</td><td style="${cellStyle}; font-weight:700; color:#059669;">${metrics.mtdColl}</td>
                            <td style="${headerStyle}">MTD COLLECTION (FILES)</td><td style="${cellStyle}; color:#059669;">${metrics.collFiles}</td>
                        </tr>
                        <tr>
                            <td style="${headerStyle}">REMAINING TARGET</td><td style="${cellStyle}; font-weight:700; color:#dc2626;">${metrics.remaining}</td>
                            <td style="${headerStyle}">REQUIRED DAILY COLL</td><td style="${cellStyle}; color:#dc2626;">${metrics.dailyReq}</td>
                        </tr>
                        <tr>
                            <td style="${headerStyle}">MTD ACHIEVEMENT</td><td style="${cellStyle}; font-weight:800; color:#2563eb; background:#f0f9ff;">${metrics.achMtd}</td>
                            <td style="${headerStyle}">TODAY ACHIEVEMENT</td><td style="${cellStyle}; font-weight:800; color:#7c3aed; background:#f5f3ff;">${metrics.achToday}</td>
                        </tr>
                    </table>

                    <div style="${sectionTitle}">2. Portfolio Performance Segmentation</div>
                    <table style="${tableStyle}">
                        <tr style="background-color: #1e40af; color: #ffffff;">
                            <th style="padding: 4px 6px; border: 0.5px solid #1e3a8a;">PORTFOLIO SEGMENT</th>
                            <th style="padding: 4px 6px; border: 0.5px solid #1e3a8a; text-align: center;">RPI SCORE</th>
                            <th style="padding: 4px 6px; border: 0.5px solid #1e3a8a; text-align: right;">TARGET</th>
                            <th style="padding: 4px 6px; border: 0.5px solid #1e3a8a; text-align: right;">COLLECTION</th>
                            <th style="padding: 4px 6px; border: 0.5px solid #1e3a8a; text-align: center;">ACHIEVEMENT</th>
                        </tr>
                        <tr>
                            <td style="${cellStyle}"><b>PART A</b> (North & Central)</td>
                            <td style="${cellStyle}; text-align: center; font-weight: 700;">${summaryPartA.rpi}</td>
                            <td style="${cellStyle}; text-align: right;">${summaryPartA.target}</td>
                            <td style="${cellStyle}; text-align: right; color: #059669;">${summaryPartA.coll}</td>
                            <td style="${cellStyle}; text-align: center; font-weight: 800; background: #f0fdf4;">${summaryPartA.ach}</td>
                        </tr>
                        <tr>
                            <td style="${cellStyle}"><b>PART B</b> (South & East)</td>
                            <td style="${cellStyle}; text-align: center; font-weight: 700;">${summaryPartB.rpi}</td>
                            <td style="${cellStyle}; text-align: right;">${summaryPartB.target}</td>
                            <td style="${cellStyle}; text-align: right; color: #059669;">${summaryPartB.coll}</td>
                            <td style="${cellStyle}; text-align: center; font-weight: 800; background: #f0fdf4;">${summaryPartB.ach}</td>
                        </tr>
                    </table>
                `;

                // Ranking Table Section
                const rankingTable = dashboard.querySelector('#ranking-table-body')?.closest('table');
                if (rankingTable) {
                    html += `<div style="${sectionTitle}">3. Territory Performance Ranking Details</div>`;
                    const clone = rankingTable.cloneNode(true);
                    clone.style.cssText = tableStyle;

                    // Cleanup and formalize
                    clone.querySelectorAll('thead th').forEach(th => {
                        th.style.cssText = headerStyle + 'background: #f1f5f9; position: static; white-space: normal; font-size: 9px; padding: 1.5px;';
                        th.className = '';
                    });
                    clone.querySelectorAll('tbody tr').forEach(tr => {
                        tr.className = '';
                        tr.style.backgroundColor = '';
                    });
                    clone.querySelectorAll('tbody td').forEach(td => {
                        td.style.cssText = cellStyle + 'font-size: 9px; white-space: normal; padding: 1.5px;';
                        td.className = '';
                        // Highlight Total rows
                        if (td.innerText.includes('Total')) {
                            td.parentElement.style.backgroundColor = '#f1f5f9';
                            td.style.fontWeight = 'bold';
                        }
                    });
                    clone.querySelectorAll('.sticky').forEach(el => el.style.position = 'static');

                    html += `<div style="width: 100%; border: 0.5px solid #cbd5e1;">${clone.outerHTML}</div>`;
                }

                html += `
                    <div style="margin-top: 20px; border-top: 0.5px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8; font-weight: 600;">
                        <span>GENERATED BY RECOVERY INTELLIGENCE PORTAL V3.0</span>
                        <span>STRICTLY CONFIDENTIAL - INTERNAL DISTRIBUTION</span>
                    </div>
                `;

                report.innerHTML = html;
                document.body.appendChild(report);

                try {
                    const canvas = await html2canvas(report, {
                        scale: 2,
                        backgroundColor: '#ffffff',
                        useCORS: true,
                        logging: false
                    });

                    const image = canvas.toDataURL('image/png', 1.0);

                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    let drawWidth = pdfWidth;
                    let drawHeight = pdfHeight;

                    if (pdfHeight > pageHeight) {
                        const ratio = pageHeight / pdfHeight;
                        drawWidth = pdfWidth * ratio;
                        drawHeight = pageHeight;
                    }

                    const xOffset = (pdfWidth - drawWidth) / 2;
                    const yOffset = (pageHeight > drawHeight) ? 5 : 0; // Add top margin if fits inside

                    pdf.addImage(image, 'PNG', xOffset, yOffset, drawWidth, drawHeight);
                    pdf.save(`Formal_Recovery_Report_${Utils.getLocalDate()}.pdf`);
                    UI.showSuccess('Formal PDF Report Ready!');
                } catch (error) {
                    console.error('Report failed:', error);
                    UI.showSuccess('Error in Report Generation.');
                } finally {
                    document.body.removeChild(report);
                    UI.toggleLoader(false);
                }
            },

            getCurrentTerritoryId() {
                const db = Store.get();
                let tId = Auth.currentUser.territoryId;
                if (!tId) {
                    const t = db.territories.find(t => t.name === Auth.currentUser.username || t.officer === Auth.currentUser.username);
                    if (t) tId = t.id;
                }
                return tId;
            }
        };

        const Charts = {
            init() {
                if (typeof ChartDataLabels !== 'undefined') {
                    Chart.register(ChartDataLabels);
                }
            },
            renderLine(id, labels, data) {
                this.init();
                const ctx = document.getElementById(id);
                if (UI.charts[id]) UI.charts[id].destroy();
                UI.charts[id] = new Chart(ctx, {
                    type: 'line',
                    data: { labels: labels, datasets: [{ label: 'Collection', data: data, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 }] },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            datalabels: {
                                align: 'top',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: 4,
                                color: '#10b981',
                                font: { weight: 'bold', size: 10 },
                                formatter: (val) => val.toLocaleString(),
                                padding: 4
                            }
                        }
                    }
                });
            },
            renderBar(id, labels, data) {
                this.init();
                const ctx = document.getElementById(id);
                if (UI.charts[id]) UI.charts[id].destroy();
                UI.charts[id] = new Chart(ctx, {
                    type: 'bar',
                    data: { labels: labels, datasets: [{ label: 'Amount', data: data, backgroundColor: ['#94a3b8', '#10b981'], borderRadius: 6 }] },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } },
                        plugins: {
                            legend: { display: false },
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                color: '#475569',
                                font: { weight: 'bold' },
                                formatter: (val) => val.toLocaleString()
                            }
                        }
                    }
                });
            },
            renderDoughnut(id, labels, data, customColors = null) {
                this.init();
                const ctx = document.getElementById(id);
                if (UI.charts[id]) UI.charts[id].destroy();
                
                // Color palette mapping based on labels to ensure high-end aesthetics
                let colors = customColors;
                if (!colors) {
                    if (labels.includes('bKash') || labels.includes('Cash') || labels.includes('Bank Transfer') || labels.includes('Cheque')) {
                        // Channel Mix Colors
                        colors = labels.map(lbl => {
                            if (lbl === 'Bank Transfer') return '#10b981'; // Emerald Green
                            if (lbl === 'bKash') return '#ec4899';        // bKash Magenta/Pink
                            if (lbl === 'Cheque') return '#f59e0b';       // Amber/Yellow
                            if (lbl === 'Cash') return '#3b82f6';         // Sky Blue
                            return '#64748b';
                        });
                    } else if (labels.includes('Part A') || labels.includes('Part B')) {
                        // Part comparison colors
                        colors = ['#3b82f6', '#8b5cf6'];
                    } else {
                        colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'];
                    }
                }

                const isDark = document.documentElement.classList.contains('dark');
                const labelColor = isDark ? '#cbd5e1' : '#475569';

                UI.charts[id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: { 
                        labels: labels, 
                        datasets: [{ 
                            data: data, 
                            backgroundColor: colors, 
                            borderWidth: isDark ? 2 : 1,
                            borderColor: isDark ? '#1e293b' : '#ffffff'
                        }] 
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    color: labelColor,
                                    font: {
                                        size: 10,
                                        weight: 'bold',
                                        family: "'Outfit', 'Inter', sans-serif"
                                    },
                                    boxWidth: 10,
                                    padding: 8
                                }
                            },
                            datalabels: {
                                color: '#ffffff',
                                font: { weight: 'bold', size: 9 },
                                formatter: (val, ctx) => {
                                    const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    if (sum === 0) return '';
                                    const pct = (val / sum * 100).toFixed(0) + '%';
                                    return pct;
                                }
                            }
                        }
                    }
                });
            }
        };

        // --- PARTICLE ENGINE ---
