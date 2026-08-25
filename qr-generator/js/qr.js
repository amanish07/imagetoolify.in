// Navbar Toggle
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.style.display = (navMenu.style.display === "flex") ? "none" : "flex";
});

// Common Country Codes List
const countryCodesOptions = `
            <option value="91" selected>🇮🇳 +91 (India)</option>
            <option value="1">🇺🇸 +1 (US/Canada)</option>
            <option value="44">🇬🇧 +44 (UK)</option>
            <option value="971">🇦🇪 +971 (UAE)</option>
            <option value="92">🇵🇰 +92 (Pakistan)</option>
            <option value="880">🇧🇩 +880 (Bangladesh)</option>
            <option value="977">🇳🇵 +977 (Nepal)</option>
            <option value="61">🇦🇺 +61 (Australia)</option>
            <option value="49">🇩🇪 +49 (Germany)</option>
            <option value="33">🇫🇷 +33 (France)</option>
            <option value="81">🇯🇵 +81 (Japan)</option>
            <option value="86">🇨🇳 +86 (China)</option>
            <option value="55">🇧🇷 +55 (Brazil)</option>
            <option value="7">🇷🇺 +7 (Russia)</option>
            <option value="27">🇿🇦 +27 (South Africa)</option>
            <option value="20">🇪🇬 +20 (Egypt)</option>
            <option value="966">🇸🇦 +966 (Saudi Arabia)</option>
            <option value="60">🇲🇾 +60 (Malaysia)</option>
            <option value="65">🇸🇬 +65 (Singapore)</option>
            <option value="62">🇮🇩 +62 (Indonesia)</option>
        `;

// Current Active State Variables
let currentType = 'url';
let uploadedLogoBase64 = '';

// Initialize QR Code Styling Engine Instance
const qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    type: "canvas",
    data: "https://imagetoolify.in",
    margin: 20,
    dotsOptions: { color: "#000000", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.25, margin: 2 }
});

qrCode.append(document.getElementById("qrcode"));

// Tab Switching Logic
const typeTabs = document.querySelectorAll('.type-tab');
const dynamicForm = document.getElementById('dynamicForm');

typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        typeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentType = tab.dataset.type;
        renderFormFields();
        updateQRCode();
    });
});

// Form Rendering Templates for 11 Types
function renderFormFields() {
    let html = '';
    switch (currentType) {
        case 'url':
            html = `<div class="input-group"><label>Website URL</label><input type="url" id="urlInput" class="control-input" value="https://imagetoolify.in" placeholder="https://example.com"></div>`;
            break;
        case 'text':
            html = `<div class="input-group"><label>Plain Text</label><textarea id="textInput" class="text-input" rows="3" placeholder="Enter your custom message here...">Welcome to Imagetoolify.in!</textarea></div>`;
            break;
        case 'wifi':
            html = `<div class="form-row">
                        <div class="input-group"><label>Network Name (SSID)</label><input type="text" id="wifiSsid" class="control-input" placeholder="WiFi Name"></div>
                        <div class="input-group"><label>Password</label><input type="text" id="wifiPass" class="control-input" placeholder="Password"></div>
                    </div>
                    <div class="input-group"><label>Encryption</label><select id="wifiType" class="control-select"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select></div>`;
            break;
        case 'phone':
            html = `<div class="input-group">
                        <label>Phone Number (Call)</label>
                        <div class="phone-input-group">
                            <select id="phoneCc" class="control-select">${countryCodesOptions}</select>
                            <input type="tel" id="phoneInput" class="control-input" placeholder="9876543210">
                        </div>
                    </div>`;
            break;
        case 'email':
            html = `<div class="input-group"><label>Email Address</label><input type="email" id="emailTo" class="control-input" placeholder="name@domain.com"></div>
                    <div class="input-group"><label>Subject</label><input type="text" id="emailSub" class="control-input" placeholder="Subject line"></div>
                    <div class="input-group"><label>Body</label><textarea id="emailBody" class="text-input" rows="2" placeholder="Email body content"></textarea></div>`;
            break;
        case 'sms':
            html = `<div class="input-group">
                        <label>Recipient Number</label>
                        <div class="phone-input-group">
                            <select id="smsCc" class="control-select">${countryCodesOptions}</select>
                            <input type="tel" id="smsNum" class="control-input" placeholder="9876543210">
                        </div>
                    </div>
                    <div class="input-group"><label>Message</label><textarea id="smsMsg" class="text-input" rows="2" placeholder="SMS text..."></textarea></div>`;
            break;
        case 'whatsapp':
            html = `<div class="input-group">
                        <label>WhatsApp Number</label>
                        <div class="phone-input-group">
                            <select id="waCc" class="control-select">${countryCodesOptions}</select>
                            <input type="tel" id="waNum" class="control-input" placeholder="9876543210">
                        </div>
                    </div>
                    <div class="input-group"><label>Pre-filled Message</label><input type="text" id="waMsg" class="control-input" placeholder="Hello!"></div>`;
            break;
        case 'vcard':
            html = `<div class="form-row">
                        <div class="input-group"><label>First Name</label><input type="text" id="vFirstName" class="control-input" placeholder="John"></div>
                        <div class="input-group"><label>Last Name</label><input type="text" id="vLastName" class="control-input" placeholder="Doe"></div>
                    </div>
                    <div class="input-group">
                        <label>Phone</label>
                        <div class="phone-input-group">
                            <select id="vCc" class="control-select">${countryCodesOptions}</select>
                            <input type="tel" id="vPhone" class="control-input" placeholder="9876543210">
                        </div>
                    </div>
                    <div class="input-group"><label>Email</label><input type="email" id="vEmail" class="control-input" placeholder="john@doe.com"></div>
                    <div class="input-group"><label>Organization / Company</label><input type="text" id="vOrg" class="control-input" placeholder="Company Name"></div>`;
            break;
        case 'location':
            html = `<div class="form-row">
                        <div class="input-group"><label>Latitude</label><input type="text" id="locLat" class="control-input" placeholder="28.6139"></div>
                        <div class="input-group"><label>Longitude</label><input type="text" id="locLng" class="control-input" placeholder="77.2090"></div>
                    </div>`;
            break;
        case 'upi':
            html = `<div class="form-row">
                        <div class="input-group"><label>UPI ID (VPA)</label><input type="text" id="upiId" class="control-input" placeholder="username@upi"></div>
                        <div class="input-group"><label>Payee Name</label><input type="text" id="upiName" class="control-input" placeholder="Merchant Name"></div>
                    </div>
                    <div class="input-group"><label>Amount (Optional)</label><input type="number" id="upiAmt" class="control-input" placeholder="100"></div>`;
            break;
        case 'social':
            html = `<div class="input-group"><label>Platform Profile Link</label><input type="url" id="socialUrl" class="control-input" placeholder="https://instagram.com/yourprofile"></div>`;
            break;
    }
    dynamicForm.innerHTML = html;

    // Attach change listeners to dynamic inputs
    dynamicForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', updateQRCode);
    });
}

// Clean phone numbers by removing non-digits
function cleanNumber(val) {
    return (val || '').replace(/\D/g, '');
}

// Data String Construction Logic
function getQRDataString() {
    switch (currentType) {
        case 'url':
            return document.getElementById('urlInput')?.value || 'https://imagetoolify.in';
        case 'text':
            return document.getElementById('textInput')?.value || 'Sample Text';
        case 'wifi':
            const ssid = document.getElementById('wifiSsid')?.value || '';
            const pass = document.getElementById('wifiPass')?.value || '';
            const type = document.getElementById('wifiType')?.value || 'WPA';
            return `WIFI:T:${type};S:${ssid};P:${pass};;`;
        case 'phone':
            const pCc = document.getElementById('phoneCc')?.value || '91';
            const pNum = cleanNumber(document.getElementById('phoneInput')?.value);
            return `tel:+${pCc}${pNum}`;
        case 'email':
            const to = document.getElementById('emailTo')?.value || '';
            const sub = encodeURIComponent(document.getElementById('emailSub')?.value || '');
            const body = encodeURIComponent(document.getElementById('emailBody')?.value || '');
            return `mailto:${to}?subject=${sub}&body=${body}`;
        case 'sms':
            const sCc = document.getElementById('smsCc')?.value || '91';
            const sNum = cleanNumber(document.getElementById('smsNum')?.value);
            const msg = encodeURIComponent(document.getElementById('smsMsg')?.value || '');
            return `sms:+${sCc}${sNum}?body=${msg}`;
        case 'whatsapp':
            const waCc = document.getElementById('waCc')?.value || '91';
            const waNum = cleanNumber(document.getElementById('waNum')?.value);
            const waMsg = encodeURIComponent(document.getElementById('waMsg')?.value || '');
            return `https://wa.me/${waCc}${waNum}?text=${waMsg}`;
        case 'vcard':
            const fn = document.getElementById('vFirstName')?.value || '';
            const ln = document.getElementById('vLastName')?.value || '';
            const vCc = document.getElementById('vCc')?.value || '91';
            const vp = cleanNumber(document.getElementById('vPhone')?.value);
            const ve = document.getElementById('vEmail')?.value || '';
            const vo = document.getElementById('vOrg')?.value || '';
            return `BEGIN:VCARD\nVERSION:3.0\nN:${ln};${fn}\nFN:${fn} ${ln}\nORG:${vo}\nTEL:+${vCc}${vp}\nEMAIL:${ve}\nEND:VCARD`;
        case 'location':
            const lat = document.getElementById('locLat')?.value || '0';
            const lng = document.getElementById('locLng')?.value || '0';
            return `https://maps.google.com/?q=${lat},${lng}`;
        case 'upi':
            const upiId = document.getElementById('upiId')?.value || '';
            const name = encodeURIComponent(document.getElementById('upiName')?.value || '');
            const amt = document.getElementById('upiAmt')?.value || '';
            return `upi://pay?pa=${upiId}&pn=${name}${amt ? '&am=' + amt : ''}&cu=INR`;
        case 'social':
            return document.getElementById('socialUrl')?.value || 'https://imagetoolify.in';
        default:
            return 'https://imagetoolify.in';
    }
}

// Live Update Handler
function updateQRCode() {
    const dataStr = getQRDataString();
    const darkColor = document.getElementById('colorDark').value;
    const lightColor = document.getElementById('colorLight').value;
    const dotStyle = document.getElementById('dotStyle').value;
    const marginVal = parseInt(document.getElementById('marginInput').value, 10);

    document.getElementById('marginVal').textContent = marginVal;

    qrCode.update({
        data: dataStr,
        image: uploadedLogoBase64,
        margin: marginVal,
        dotsOptions: { color: darkColor, type: dotStyle },
        backgroundOptions: { color: lightColor }
    });
}

// Color, Style & Margin Inputs Listener
document.getElementById('colorDark').addEventListener('input', updateQRCode);
document.getElementById('colorLight').addEventListener('input', updateQRCode);
document.getElementById('dotStyle').addEventListener('change', updateQRCode);
document.getElementById('marginInput').addEventListener('input', updateQRCode);

// Logo Upload Handler
const logoInput = document.getElementById('logoInput');
const removeLogoBtn = document.getElementById('removeLogoBtn');

logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            uploadedLogoBase64 = evt.target.result;
            removeLogoBtn.style.display = 'inline-block';
            updateQRCode();
        };
        reader.readAsDataURL(file);
    }
});

removeLogoBtn.addEventListener('click', () => {
    uploadedLogoBase64 = '';
    logoInput.value = '';
    removeLogoBtn.style.display = 'none';
    updateQRCode();
});

// Download Action
document.getElementById('downloadBtn').addEventListener('click', () => {
    qrCode.download({ name: "qrcode-(imagetoolify.in)", extension: "png" });
});

// Reset Action
document.getElementById('resetBtn').addEventListener('click', () => {
    uploadedLogoBase64 = '';
    logoInput.value = '';
    removeLogoBtn.style.display = 'none';
    document.getElementById('colorDark').value = '#000000';
    document.getElementById('colorLight').value = '#ffffff';
    document.getElementById('dotStyle').value = 'rounded';
    document.getElementById('marginInput').value = '20';
    renderFormFields();
    updateQRCode();
});

// Initial Render
renderFormFields();