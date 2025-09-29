// Check authentication
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.isLoggedIn) {
        window.location.href = 'login.html';
    }
    return user;
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = checkAuth();
    
    // Update header with user info
    const userBtn = document.querySelector('.user-btn');
    userBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.email.split('@')[0]}`;
    
    // Add logout functionality
    userBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    });
    
    // Initialize portal status
    initPortalStatus();
    
    // Navigation
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.section');

    // Tables
    const assetTableBody = document.querySelector('#asset-registry .data-table tbody');
    const inventoryTableBody = document.querySelector('#inventory-status .data-table tbody');

    // QR Code
    const generateQrBtn = document.getElementById('generate-qr');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadQrBtn = document.getElementById('download-qr');

    // Scanner
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    const scanResultData = document.getElementById('scan-result-data');

    // AI Report
    const generateReportBtn = document.getElementById('generate-report');
    const reportContainer = document.getElementById('report-container');

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Sample data for assets
    const assetData = [
        { id: 'AST-001', type: 'Rail', location: 'Section A-12', status: 'Active' },
        { id: 'AST-002', type: 'Sleeper', location: 'Section B-05', status: 'Maintenance' },
        { id: 'AST-003', type: 'Fastening', location: 'Section A-08', status: 'Active' },
        { id: 'AST-004', type: 'Ballast', location: 'Section C-03', status: 'Inactive' },
        { id: 'AST-005', type: 'Rail', location: 'Section D-11', status: 'Active' }
    ];

    // Sample data for inventory
    const inventoryData = [
        { id: 'INV-001', type: 'Rail', batch: 'B-2023-01', vendor: 'Steel Corp', warranty: '24 months', createdAt: '2023-01-15' },
        { id: 'INV-002', type: 'Sleeper', batch: 'B-2023-02', vendor: 'Concrete Solutions', warranty: '36 months', createdAt: '2023-02-20' },
        { id: 'INV-003', type: 'Fastening', batch: 'B-2023-01', vendor: 'Metal Works', warranty: '12 months', createdAt: '2023-01-30' },
        { id: 'INV-004', type: 'Ballast', batch: 'B-2023-03', vendor: 'Stone Quarry Ltd', warranty: 'N/A', createdAt: '2023-03-10' },
        { id: 'INV-005', type: 'Rail', batch: 'B-2023-04', vendor: 'Steel Corp', warranty: '24 months', createdAt: '2023-04-05' }
    ];

    // Populate asset table
    function populateAssetTable() {
        assetTableBody.innerHTML = '';
        assetData.forEach(asset => {
            const statusClass = asset.status === 'Active' ? 'success' : 
                              asset.status === 'Maintenance' ? 'warning' : 'danger';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.id}</td>
                <td>${asset.type}</td>
                <td>${asset.location}</td>
                <td><span class="status-badge ${statusClass}">${asset.status}</span></td>
                <td>
                    <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            assetTableBody.appendChild(row);
        });
    }

    // Populate inventory table
    function populateInventoryTable() {
        inventoryTableBody.innerHTML = '';
        inventoryData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.type}</td>
                <td>${item.batch}</td>
                <td>${item.vendor}</td>
                <td>${item.warranty}</td>
                <td>${item.createdAt}</td>
                <td>
                    <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
    }

    // Initialize charts
    function initCharts() {
        // Inventory Status Chart
        const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
        new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['In Stock', 'Deployed', 'Maintenance', 'Disposed'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        '#34a853',
                        '#1a73e8',
                        '#fbbc04',
                        '#ea4335'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Inspection Status Chart
        const inspectionCtx = document.getElementById('inspectionChart').getContext('2d');
        new Chart(inspectionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Pending'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: [
                        '#34a853',
                        '#ea4335',
                        '#fbbc04'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Vendor Performance Chart
        const vendorCtx = document.getElementById('vendorChart').getContext('2d');
        new Chart(vendorCtx, {
            type: 'bar',
            data: {
                labels: ['Steel Corp', 'Concrete Solutions', 'Metal Works', 'Stone Quarry Ltd'],
                datasets: [{
                    label: 'Quality Score',
                    data: [85, 92, 78, 88],
                    backgroundColor: '#1a73e8',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // QR Code Generation
    generateQrBtn.addEventListener('click', function() {
        const assetId = document.getElementById('asset-id').value || 'AST-DEMO';
        const assetType = document.getElementById('asset-type').value || 'Rail';
        const location = document.getElementById('location').value || 'Demo Location';
        const manufacturer = document.getElementById('manufacturer').value || 'Demo Manufacturer';
        const installationDate = document.getElementById('installation-date').value || '2023-01-01';

        const qrData = JSON.stringify({
            assetId,
            assetType,
            location,
            manufacturer,
            installationDate
        });

        // Generate QR code
        qrCodeContainer.innerHTML = '';
        const qr = qrcode(0, 'M');
        qr.addData(qrData);
        qr.make();
        qrCodeContainer.innerHTML = qr.createImgTag(5);
        
        // Enable download button
        downloadQrBtn.disabled = false;
    });

    // Download QR Code
    downloadQrBtn.addEventListener('click', function() {
        const img = qrCodeContainer.querySelector('img');
        if (img) {
            const assetId = document.getElementById('asset-id').value || 'AST-DEMO';
            const link = document.createElement('a');
            link.download = `qr-code-${assetId}.png`;
            link.href = img.src;
            link.click();
        }
    });

    // Scanner functionality with real camera access and random data
    startScannerBtn.addEventListener('click', function() {
        const scannerPlaceholder = document.getElementById('scanner-placeholder');
        startScannerBtn.disabled = true;
        stopScannerBtn.disabled = false;
        
        // Create video element for camera feed
        scannerPlaceholder.innerHTML = '';
        const video = document.createElement('video');
        video.style.width = '100%';
        video.style.height = '300px';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '8px';
        scannerPlaceholder.appendChild(video);
        
        // Try to access camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.play();
                    
                    // Store stream for later stopping
                    window.currentStream = stream;
                    
                    // Simulate QR code detection with random data after delay
                    setTimeout(() => {
                        generateRandomScanResult();
                    }, 2000);
                })
                .catch(function(error) {
                    console.error("Camera error: ", error);
                    scannerPlaceholder.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #fbbc04;"></i>
                            <p>Camera access denied or not available</p>
                        </div>
                    `;
                    // Still generate random data even if camera fails
                    setTimeout(() => {
                        generateRandomScanResult();
                    }, 1500);
                });
        } else {
            // Fallback for browsers that don't support getUserMedia
            scannerPlaceholder.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-camera-slash" style="font-size: 3rem; color: #ea4335;"></i>
                    <p>Camera not supported in this browser</p>
                </div>
            `;
            // Still generate random data
            setTimeout(() => {
                generateRandomScanResult();
            }, 1500);
        }
    });
    
    // Function to generate random scan results
    function generateRandomScanResult() {
        // Random asset data
        const assetTypes = ['Rail', 'Sleeper', 'Fastening', 'Ballast', 'Signal', 'Switch'];
        const locations = ['Section A', 'Section B', 'Section C', 'Section D', 'Junction 1', 'Junction 2'];
        const statuses = ['Active', 'Maintenance', 'Inactive', 'Critical'];
        const conditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];
        
        // Generate random asset ID
        const assetId = 'AST-' + Math.floor(1000 + Math.random() * 9000);
        
        // Random selections
        const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)] + '-' + Math.floor(10 + Math.random() * 90);
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        // Generate random date within last year
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        const randomDate = new Date(lastYear.getTime() + Math.random() * (today.getTime() - lastYear.getTime()));
        const formattedDate = randomDate.toISOString().split('T')[0];
        
        // Display the result
        scanResultData.innerHTML = `
            <div class="scan-success">
                <h4>Asset Found</h4>
                <p><strong>Asset ID:</strong> ${assetId}</p>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Condition:</strong> ${condition}</p>
                <p><strong>Last Inspection:</strong> ${formattedDate}</p>
                <p><strong>Maintenance Due:</strong> ${Math.floor(30 + Math.random() * 120)} days</p>
            </div>
        `;
    }

    stopScannerBtn.addEventListener('click', function() {
        startScannerBtn.disabled = false;
        stopScannerBtn.disabled = true;
        
        // Stop camera stream if it exists
        if (window.currentStream) {
            window.currentStream.getTracks().forEach(track => {
                track.stop();
            });
            window.currentStream = null;
        }
        
        // Reset scanner placeholder
        document.getElementById('scanner-placeholder').innerHTML = `
            <i class="fas fa-camera"></i>
            <p>Camera feed will appear here</p>
        `;
    });

    // Portal Status Initialization
function initPortalStatus() {
    console.log("Initializing portal status...");
    
    // Simulate checking connection status
    const udmPortalStatus = true; // Connected
    const tmsPortalStatus = true; // Connected
    
    // Update UI based on connection status
    updatePortalStatus('UDM', udmPortalStatus);
    updatePortalStatus('TMS', tmsPortalStatus);
    
    // Add click event listeners to portal detail buttons
    const portalButtons = document.querySelectorAll('.portal-details .btn');
    portalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portalType = this.closest('.portal-card').querySelector('h3').textContent;
            alert(`${portalType} details will be displayed here. Portal is connected and integrated.`);
        });
    });
}

// Update Portal Status UI
function updatePortalStatus(portalType, isConnected) {
    const portalCards = document.querySelectorAll('.portal-card');
    
    portalCards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent;
        if (cardTitle.includes(portalType)) {
            const statusIcon = card.querySelector('.portal-status i');
            const statusText = card.querySelector('.portal-status p');
            
            if (isConnected) {
                statusIcon.className = 'fas fa-check-circle portal-connected';
                statusText.textContent = `${portalType} Portal is connected and integrated`;
            } else {
                statusIcon.className = 'fas fa-times-circle';
                statusIcon.style.color = '#dc3545';
                statusText.textContent = `${portalType} Portal connection failed`;
            }
        }
    });
}

// AI Report Generation
generateReportBtn.addEventListener('click', function() {
    const reportType = document.getElementById('report-type').value;
    const timePeriod = document.getElementById('time-period').value;
    
    if (!reportType || !timePeriod) {
        alert('Please select both report type and time period');
        return;
    }
    
    reportContainer.innerHTML = '<p>Generating report...</p>';
    
    // Simulate report generation
    setTimeout(() => {
        if (reportType === 'maintenance') {
            reportContainer.innerHTML = `
                <h3>Maintenance Prediction Report</h3>
                <p>Based on AI analysis of historical data for the ${timePeriod === '1month' ? 'last month' : 
                   timePeriod === '3months' ? 'last 3 months' : 
                   timePeriod === '6months' ? 'last 6 months' : 'last year'}, 
                   the following assets require maintenance:</p>
                <ul>
                    <li>AST-002 (Sleeper) - Predicted failure within 30 days (87% confidence)</li>
                    <li>AST-005 (Rail) - Recommended inspection within 45 days (72% confidence)</li>
                    <li>AST-008 (Fastening) - Showing early wear patterns (65% confidence)</li>
                </ul>
                <div class="chart-container">
                    <canvas id="maintenanceChart"></canvas>
                </div>
            `;
            
            // Create maintenance prediction chart
            const maintenanceCtx = document.getElementById('maintenanceChart').getContext('2d');
            new Chart(maintenanceCtx, {
                type: 'bar',
                data: {
                    labels: ['AST-002', 'AST-005', 'AST-008', 'AST-012', 'AST-015'],
                    datasets: [{
                        label: 'Failure Probability (%)',
                        data: [87, 72, 65, 42, 28],
                        backgroundColor: [
                            '#ea4335',
                            '#fbbc04',
                            '#fbbc04',
                            '#34a853',
                            '#34a853'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        } else {
            reportContainer.innerHTML = `
                <h3>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h3>
                <p>AI-generated report for ${timePeriod === '1month' ? 'the last month' : 
                   timePeriod === '3months' ? 'the last 3 months' : 
                   timePeriod === '6months' ? 'the last 6 months' : 'the last year'}.</p>
                <p>This is a placeholder for the ${reportType} report content.</p>
                <div class="chart-container">
                    <canvas id="reportChart"></canvas>
                </div>
            `;
            
            // Create generic report chart
            const reportCtx = document.getElementById('reportChart').getContext('2d');
            new Chart(reportCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Data Points',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#1a73e8',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }, 1500);
});

    // Initialize the application
    populateAssetTable();
    populateInventoryTable();
    initCharts();

    // Add status badge styles
    const style = document.createElement('style');
    style.textContent = `
        .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .status-badge.success {
            background-color: rgba(52, 168, 83, 0.1);
            color: #34a853;
        }
        .status-badge.warning {
            background-color: rgba(251, 188, 4, 0.1);
            color: #fbbc04;
        }
        .status-badge.danger {
            background-color: rgba(234, 67, 53, 0.1);
            color: #ea4335;
        }
        .btn-icon {
            background: none;
            border: none;
            color: var(--gray-600);
            cursor: pointer;
            font-size: 1rem;
            padding: 0.25rem;
            transition: var(--transition);
        }
        .btn-icon:hover {
            color: var(--primary-color);
        }
        .scan-success {
            background-color: rgba(52, 168, 83, 0.1);
            border-left: 4px solid #34a853;
            padding: 1rem;
            border-radius: 4px;
        }
        .scan-success h4 {
            color: #34a853;
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
});