window.Router = {
            navigate(viewId) {
                if (Auth.currentUser?.role) {
                    localStorage.setItem('currentView_' + Auth.currentUser.role, viewId);
                }

                // Default header titles/subtitles mapping
                const defaultTitles = {
                    
                    'admin-customers': { title: 'Customer Upload', subtitle: 'Manage Active Customers CSV' },
                    'officer-customers': { title: 'My Customers', subtitle: 'Assigned Territory Customers' },
    
                    'admin-dashboard': { title: 'Admin Dashboard', subtitle: 'Executive Performance Control' },
                    'admin-data-entry': { title: 'Data Entry Setup', subtitle: 'Monthly Targets & Projections' },
                    'admin-users': { title: 'User Management', subtitle: 'Credentials & Permissions' },
                    'admin-area-heads': { title: 'Area Heads', subtitle: 'Region Configurations' },
                    'area-head-dashboard': { title: 'Area Head Dashboard', subtitle: 'Regional Monitoring' },
                    'admin-offroad': { title: 'Offroad Tracker', subtitle: 'Out of Operations Recovery' },
                    'admin-settlements': { title: 'Settlements Monitor', subtitle: 'Discount & Waiver Approval Status' },
                    'admin-history': { title: 'Global Collection History', subtitle: 'Master Record of All Collections' },
                    'admin-vehicle-perf': { title: 'Vehicle Performance', subtitle: 'Recovery Status by Customer' },
                    'admin-projections': { title: 'Projection Monitor', subtitle: 'Missing & Submitted Projections' },
                    'admin-performance': { title: 'Strategic Analytics', subtitle: 'Collection Momentum & Performance' },
                    'admin-analytics': { title: 'In-Depth Analytics', subtitle: 'Enterprise Portfolio & Insights' },
                    
                    'officer-dashboard': { title: 'Dashboard', subtitle: '' },
                    'officer-projection': { title: 'Projections', subtitle: 'Submit Daily Recovery Estimate' },
                    'officer-collection': { title: 'Collection Entry', subtitle: 'Post Recovery Receipts' },
                    'officer-offroad': { title: 'Offroad Tracker', subtitle: 'Active Offroad Vehicles' },
                    'officer-settlements': { title: 'Settlement Status', subtitle: 'Discounts & Waivers Tracker' },
                    'officer-history': { title: 'Collection History', subtitle: 'Track Your Payments' },
                    'officer-analytics': { title: 'Vehicle Analytics', subtitle: 'Interactive Recovery Insights' }
                };

                const headerInfo = defaultTitles[viewId] || { title: '', subtitle: '' };
                if (typeof UI !== 'undefined' && UI.updateHeader) {
                    UI.updateHeader(headerInfo.title, headerInfo.subtitle, '');
                }

                const container = document.getElementById('views-container');
                container.innerHTML = '';

                // Auto hide sidebar on mobile/desktop selection
                UI.closeSidebar();

                document.querySelectorAll('.nav-item').forEach(el => {
                    el.classList.remove('bg-brand-50', 'text-brand-700', 'dark:bg-slate-800', 'dark:text-brand-400');
                    el.classList.add('text-slate-600', 'dark:text-slate-300');
                });

                if (viewId === 'admin-customers') UI.renderAdminCustomers();
                else if (viewId === 'officer-customers') UI.renderOfficerCustomers();
                else if (viewId === 'admin-dashboard') UI.renderAdminDashboard();
                else if (viewId === 'admin-data-entry') UI.renderDataEntry();
                else if (viewId === 'admin-users') UI.renderUserManagement();
                else if (viewId === 'admin-area-heads') UI.renderAdminAreaHeads();
                else if (viewId === 'area-head-dashboard') UI.renderAreaHeadDashboard();
                else if (viewId === 'admin-offroad') UI.renderAdminOffroadView();
                else if (viewId === 'admin-settlements') UI.renderAdminSettlementsView();
                else if (viewId === 'admin-history') UI.renderAdminHistory();
                else if (viewId === 'admin-vehicle-perf') UI.renderAdminVehiclePerf();
                else if (viewId === 'admin-projections') UI.renderAdminProjections();
                else if (viewId === 'admin-performance') UI.renderAdminPerformance();
                else if (viewId === 'admin-analytics') UI.renderAdminAnalytics();
                else if (viewId === 'officer-dashboard') UI.renderOfficerDashboard();
                else if (viewId === 'officer-projection') UI.renderProjectionForm();
                else if (viewId === 'officer-collection') UI.renderCollectionForm();
                else if (viewId === 'officer-offroad') UI.renderOfficerOffroadTracker();
                else if (viewId === 'officer-settlements') UI.renderOfficerSettlementsView();
                else if (viewId === 'officer-history') UI.renderOfficerHistory();
                else if (viewId === 'officer-analytics') UI.renderOfficerVehicleAnalytics();
            },
        };
