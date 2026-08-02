window.Calc = {
            getMetrics(territoryId = null) {
                const db = Store.get();
                const todayStr = Utils.getLocalDate();
                const currentMonth = Utils.getActiveMonth();
                const todayParts = todayStr.split('-').map(Number);
                
                // Pure UTC calendar calculations to avoid client timezone offset shift bugs
                const todayUTC = new Date(Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]));
                const yesterdayUTC = new Date(todayUTC);
                yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);
                const yesterdayStr = yesterdayUTC.toISOString().split('T')[0];

                let collections = db.collections.filter(c => (c.activeMonth || c.active_month || c.date.slice(0, 7)) === currentMonth);
                let targets = db.targets.filter(t => t.month === currentMonth);
                let projections = db.projections.filter(p => (p.activeMonth || p.active_month || p.date.slice(0, 7)) === currentMonth);

                if (territoryId) {
                    if (Array.isArray(territoryId)) {
                        collections = collections.filter(c => territoryId.includes(c.territoryId) || territoryId.includes(c.territory_id));
                        targets = targets.filter(t => territoryId.includes(t.territoryId) || territoryId.includes(t.territory_id));
                        projections = projections.filter(p => territoryId.includes(p.territoryId) || territoryId.includes(p.territory_id));
                    } else if (String(territoryId).includes(',')) {
                        const ids = String(territoryId).split(',').filter(Boolean);
                        collections = collections.filter(c => ids.includes(c.territoryId) || ids.includes(c.territory_id));
                        targets = targets.filter(t => ids.includes(t.territoryId) || ids.includes(t.territory_id));
                        projections = projections.filter(p => ids.includes(p.territoryId) || ids.includes(p.territory_id));
                    } else {
                        collections = collections.filter(c => c.territoryId === territoryId || c.territory_id === territoryId);
                        targets = targets.filter(t => t.territoryId === territoryId || t.territory_id === territoryId);
                        projections = projections.filter(p => p.territoryId === territoryId || p.territory_id === territoryId);
                    }
                }

                const targetAmt = targets.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
                const targetFiles = targets.reduce((sum, t) => sum + (parseInt(t.files) || 0), 0);
                const lmNpTargetAmt = targets.reduce((sum, t) => sum + (parseFloat(t.lmNpTargetAmount) || 0), 0);
                const lmNpTargetFiles = targets.reduce((sum, t) => sum + (parseInt(t.lmNpTargetFiles) || 0), 0);

                const mtdColl = collections.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
                const uniquePaidCodes = new Set(collections.map(c => c.customerCode)).size;
                const tillDateNonPayFiles = Math.max(0, targetFiles - uniquePaidCodes);

                const mtdLmNpColl = collections.filter(c => c.isLmNp).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
                const mtdLmNpFiles = new Set(collections.filter(c => c.isLmNp).map(c => c.customerCode)).size;

                const presetProjReg = targets.reduce((sum, t) => sum + (parseFloat(t.projReg || t.proj_reg) || 0), 0);
                const presetProjAdv = targets.reduce((sum, t) => sum + (parseFloat(t.projAdv || t.proj_adv) || 0), 0);
                const presetProjTotal = presetProjReg + presetProjAdv;

                const mtdProjRegular = projections.reduce((sum, p) => sum + (parseFloat(p.regularAmount) || parseFloat(p.amount) || 0), 0);
                const mtdProjAdvance = projections.reduce((sum, p) => sum + (parseFloat(p.advanceAmount) || 0), 0);
                const mtdProjTotal = mtdProjRegular + mtdProjAdvance;
                const mtdProjFiles = projections.reduce((sum, p) => sum + (parseInt(p.fileCount) || 0), 0);

                const yestProjEntries = projections.filter(p => p.date === yesterdayStr);
                const yestProjAmt = yestProjEntries.reduce((sum, p) => sum + (parseFloat(p.regularAmount) || parseFloat(p.amount) || 0) + (parseFloat(p.advanceAmount) || 0), 0);
                const yestProjFiles = yestProjEntries.reduce((sum, p) => sum + (parseInt(p.fileCount) || 0), 0);
                const yestCollEntries = collections.filter(c => c.date === yesterdayStr);
                const yestCollAmt = yestCollEntries.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
                const yestCollFiles = new Set(yestCollEntries.map(c => c.customerCode)).size;

                const todayProjEntries = projections.filter(p => p.date === todayStr);
                const todayProj = todayProjEntries.reduce((sum, p) => sum + (parseFloat(p.regularAmount) || parseFloat(p.amount) || 0) + (parseFloat(p.advanceAmount) || 0), 0);
                const todayColl = collections.filter(c => c.date === todayStr).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

                const achievement = presetProjTotal > 0 ? (mtdColl / presetProjTotal) * 100 : 0;
                const emiAchievement = targetAmt > 0 ? (mtdColl / targetAmt) * 100 : 0;
                const tillDayAchievement = achievement; // Keep for compatibility
                const lmNpRecPct = lmNpTargetAmt > 0 ? (mtdLmNpColl / lmNpTargetAmt) * 100 : 0;
                const cureRate = targetFiles > 0 ? (uniquePaidCodes / targetFiles) * 100 : 0;

                let projAcc = 0;
                if (todayProj > 0) {
                    const diff = Math.abs(todayProj - todayColl);
                    projAcc = Math.max(0, (1 - (diff / todayProj)) * 100);
                } else if (todayColl > 0 && todayProj === 0) {
                    projAcc = 0;
                } else {
                    projAcc = 100;
                }

                // Rigorous Days Left & Run Rate math for both standard and extended months
                const [activeYear, activeMonthNum] = currentMonth.split('-').map(Number);
                const realTodayStr = Utils.getLocalDate();
                
                let daysLeft = 0;
                if (realTodayStr.slice(0, 7) === currentMonth) {
                    const daysInMonth = new Date(activeYear, activeMonthNum, 0).getDate();
                    const dayOfMonth = todayParts[2];
                    daysLeft = daysInMonth - dayOfMonth + 1; // Include today in remaining days calculation
                } else if (realTodayStr.slice(0, 7) < currentMonth) {
                    const daysInMonth = new Date(activeYear, activeMonthNum, 0).getDate();
                    daysLeft = daysInMonth;
                } else {
                    daysLeft = 0; // Exceeded the active month, treat as final/extended days
                }

                const remainingAmt = Math.max(0, presetProjTotal - mtdColl);
                const rdrr = daysLeft > 0 ? remainingAmt / daysLeft : remainingAmt;

                const rpi = Math.min(100, (achievement * 0.7) + (projAcc * 0.1) + (lmNpRecPct * 0.1) + (cureRate * 0.1));

                return {
                    targetAmt, targetFiles,
                    mtdColl, todayColl, remainingAmt, rdrr,
                    achievement: achievement.toFixed(1),
                    emiAchievement: emiAchievement.toFixed(1),
                    lmNpRecPct: lmNpRecPct.toFixed(1),
                    cureRate: cureRate.toFixed(1),
                    projAcc: projAcc.toFixed(1),
                    rpi: rpi.toFixed(1),
                    uniquePaidCodes,
                    tillDateNonPayFiles,
                    mtdProjRegular, mtdProjAdvance, mtdProjTotal, mtdProjFiles,
                    presetProjReg, presetProjAdv, presetProjTotal,
                    tillDayAchievement: tillDayAchievement.toFixed(1),
                    yestProjAmt, yestProjFiles, yestCollAmt, yestCollFiles,
                    lmNpTargetAmt, lmNpTargetFiles, mtdLmNpColl, mtdLmNpFiles,
                    todayProj,
                    rawCollections: collections,
                    rawTargets: targets
                };
            },

            getRPIColor(score) {
                if (score >= 90) return 'text-green-500';
                if (score >= 70) return 'text-yellow-500';
                return 'text-red-500';
            },

            getRPIBg(score) {
                if (score >= 90) return 'bg-green-100 dark:bg-green-900/30 border-green-200';
                if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200';
                return 'bg-red-100 dark:bg-red-900/30 border-red-200';
            },

            getAppUsePercentage(territoryId) {
                if (!territoryId) return 0;
                
                const db = Store.get();
                if (!db || !db.projections || !db.collections) return 0;

                const holidaysStr = db.system_settings?.find(s => s.key === 'holidays')?.value || '';
                const holidays = holidaysStr.split(',').map(s => s.trim()).filter(Boolean);
                
                const activeMonth = Utils.getActiveMonth();
                const bounds = Utils.getMonthBounds();
                const startOfMonth = bounds.startOfMonth;
                const endOfMonth = bounds.endOfMonth;
                const today = Utils.getLocalDate();
                
                const calcEndDate = (today < startOfMonth) ? startOfMonth : (today > endOfMonth ? endOfMonth : today);
                
                const dates = [];
                const [year, month] = activeMonth.split('-').map(Number);
                const [endYear, endMonth, endDay] = calcEndDate.split('-').map(Number);
                let curr = new Date(year, month - 1, 1);
                const endD = new Date(endYear, endMonth - 1, endDay);
                while (curr <= endD) {
                    const yStr = curr.getFullYear();
                    const mStr = String(curr.getMonth() + 1).padStart(2, '0');
                    const dStr = String(curr.getDate()).padStart(2, '0');
                    const dateString = `${yStr}-${mStr}-${dStr}`;

                    if (curr.getDay() !== 5 && !holidays.includes(dateString)) { // Skip Friday and Holidays
                        dates.push(dateString);
                    }
                    curr.setDate(curr.getDate() + 1);
                }
                
                if (dates.length === 0) return 100;
                
                const ids = String(territoryId).split(',').filter(Boolean);
                const territoryProjs = db.projections.filter(p => ids.includes(p.territoryId || p.territory_id) && (p.activeMonth || p.active_month) === activeMonth);
                const territoryColls = db.collections.filter(c => ids.includes(c.territoryId || c.territory_id) && (c.activeMonth || c.active_month) === activeMonth);
                
                let totalScore = 0;
                
                dates.forEach(d => {
                    const projs = territoryProjs.filter(p => p.date === d);
                    const hasColl = territoryColls.some(c => c.date === d);
                    
                    let dayScore = 0;
                    if (projs.length > 0) {
                        dayScore += 40;
                        
                        let isOnTime = false;
                        for (const proj of projs) {
                            if (proj.timestamp) {
                                const pTime = new Date(Number(proj.timestamp));
                                let pHour = 12;
                                try {
                                    pHour = parseInt(new Intl.DateTimeFormat('en-US', {
                                        timeZone: 'Asia/Dhaka',
                                        hour: 'numeric',
                                        hour12: false
                                    }).format(pTime)) || 0;
                                } catch (e) {
                                    pHour = pTime.getHours();
                                }
                                if (pHour < 10) {
                                    isOnTime = true;
                                    break;
                                }
                            } else {
                                isOnTime = true;
                                break;
                            }
                        }
                        if (isOnTime) {
                            dayScore += 20;
                        }
                    }
                    
                    if (hasColl) {
                        dayScore += 40;
                    }
                    
                    totalScore += dayScore;
                });
                
                return Number((totalScore / dates.length).toFixed(1));
            },

            getAppUseDetails(territoryId) {
                if (!territoryId) return { pct: 0, details: [] };
                
                const db = Store.get();
                if (!db || !db.projections || !db.collections) return { pct: 0, details: [] };

                const holidaysStr = db.system_settings?.find(s => s.key === 'holidays')?.value || '';
                const holidays = holidaysStr.split(',').map(s => s.trim()).filter(Boolean);
                
                const activeMonth = Utils.getActiveMonth();
                const bounds = Utils.getMonthBounds();
                const startOfMonth = bounds.startOfMonth;
                const endOfMonth = bounds.endOfMonth;
                const today = Utils.getLocalDate();
                
                const calcEndDate = (today < startOfMonth) ? startOfMonth : (today > endOfMonth ? endOfMonth : today);
                
                const dates = [];
                const [year, month] = activeMonth.split('-').map(Number);
                const [endYear, endMonth, endDay] = calcEndDate.split('-').map(Number);
                let curr = new Date(year, month - 1, 1);
                const endD = new Date(endYear, endMonth - 1, endDay);
                while (curr <= endD) {
                    const yStr = curr.getFullYear();
                    const mStr = String(curr.getMonth() + 1).padStart(2, '0');
                    const dStr = String(curr.getDate()).padStart(2, '0');
                    const dateString = `${yStr}-${mStr}-${dStr}`;

                    if (curr.getDay() !== 5 && !holidays.includes(dateString)) { // Skip Friday and Holidays
                        dates.push(dateString);
                    }
                    curr.setDate(curr.getDate() + 1);
                }
                
                if (dates.length === 0) return { pct: 100, details: [] };
                
                const ids = String(territoryId).split(',').filter(Boolean);
                const territoryProjs = db.projections.filter(p => ids.includes(p.territoryId || p.territory_id) && (p.activeMonth || p.active_month) === activeMonth);
                const territoryColls = db.collections.filter(c => ids.includes(c.territoryId || c.territory_id) && (c.activeMonth || c.active_month) === activeMonth);
                
                let totalScore = 0;
                const details = [];
                
                dates.forEach(d => {
                    const projs = territoryProjs.filter(p => p.date === d);
                    const hasColl = territoryColls.some(c => c.date === d);
                    
                    let dayScore = 0;
                    let hasProj = false;
                    let isOnTime = false;
                    
                    if (projs.length > 0) {
                        hasProj = true;
                        dayScore += 40;
                        
                        for (const proj of projs) {
                            if (proj.timestamp) {
                                const pTime = new Date(Number(proj.timestamp));
                                let pHour = 12;
                                try {
                                    pHour = parseInt(new Intl.DateTimeFormat('en-US', {
                                        timeZone: 'Asia/Dhaka',
                                        hour: 'numeric',
                                        hour12: false
                                    }).format(pTime)) || 0;
                                } catch (e) {
                                    pHour = pTime.getHours();
                                }
                                if (pHour < 10) {
                                    isOnTime = true;
                                    break;
                                }
                            } else {
                                isOnTime = true;
                                break;
                            }
                        }
                        if (isOnTime) {
                            dayScore += 20;
                        }
                    }
                    
                    if (hasColl) {
                        dayScore += 40;
                    }
                    
                    totalScore += dayScore;
                    details.push({
                        date: d,
                        hasProj,
                        isOnTime,
                        hasColl,
                        dayScore
                    });
                });
                
                return {
                    pct: Number((totalScore / dates.length).toFixed(1)),
                    details
                };
            }
        };

        /**
         * 3. AUTHENTICATION LAYER
         */
