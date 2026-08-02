window.Utils = {
            getLocalDate(d) {
                const db = Store.cache;
                let cutoffHours = 0;
                if (db && db.system_settings) {
                    const setting = db.system_settings.find(s => s.key === 'cutoff_extension_hours');
                    if (setting) cutoffHours = parseFloat(setting.value) || 0;
                }

                let targetDate;
                if (!d) {
                    const now = new Date(Date.now() + (Store.clientServerDiff || 0));
                    now.setHours(now.getHours() - cutoffHours);
                    targetDate = now;
                } else {
                    targetDate = new Date(d);
                }

                try {
                    const formatter = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Dhaka',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    const parts = formatter.formatToParts(targetDate);
                    const year = parts.find(p => p.type === 'year').value;
                    const month = parts.find(p => p.type === 'month').value;
                    const day = parts.find(p => p.type === 'day').value;
                    return `${year}-${month}-${day}`;
                } catch (e) {
                    return new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                }
            },
            getActiveMonth() {
                const db = Store.cache;
                if (db && db.system_settings) {
                    const setting = db.system_settings.find(s => s.key === 'active_month');
                    if (setting && setting.value) return setting.value;
                }
                return this.getLocalDate().slice(0, 7);
            },
            getMonthBounds() {
                const activeMonth = this.getActiveMonth();
                const [year, month] = activeMonth.split('-').map(Number);
                const lastDay = new Date(year, month, 0);
                const lastDayStr = this.getLocalDate(lastDay);
                
                // UX Optimization: If physically in next month but active month hasn't changed (extended month),
                // dynamically extend the endOfMonth boundary to today's date so collections display in history forms.
                const realTodayStr = this.getLocalDate();
                const end = realTodayStr > lastDayStr && realTodayStr.startsWith(activeMonth.slice(0, 4)) ? realTodayStr : lastDayStr;
                
                return { startOfMonth: `${activeMonth}-01`, endOfMonth: end };
            }
        };

        /**
         * 1. DATA LAYER
         */
