
/**
 * VIBESTYLE TRYON: OMNI-CAPTURE ENGINE v11.0
 * 
 * FORCED HEADINGS: ["Date", "Full Name", "Contact Phone", "Business Email", "Business Name", "Employee Size"]
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var timestamp = new Date();
  
  // 1. AUTO-HEADER SETUP
  var headers = ["Date", "Full Name", "Contact Phone", "Business Email", "Business Name", "Employee Size"];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, 6).setBackground("#8A2BE2").setFontColor("white").setFontWeight("bold");
  }

  // 2. DATA HOLDER
  var lead = {
    fullName: "MISSING",
    phone: "MISSING",
    email: "MISSING",
    bizName: "MISSING",
    size: "MISSING"
  };

  // 3. EXTRACTION
  if (e.parameter) {
    if (e.parameter.FullName) lead.fullName = e.parameter.FullName;
    if (e.parameter.ContactPhone) lead.phone = e.parameter.ContactPhone;
    if (e.parameter.BusinessEmail) lead.email = e.parameter.BusinessEmail;
    if (e.parameter.BusinessName) lead.bizName = e.parameter.BusinessName;
    if (e.parameter.EmployeeSize) lead.size = e.parameter.EmployeeSize;
  }

  // 4. PERSISTENCE
  try {
    sheet.appendRow([
      timestamp,
      lead.fullName,
      "'" + lead.phone, // Force string for phone to avoid scientific notation
      lead.email,
      lead.bizName,
      lead.size
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput("Critical Error: " + err.message);
  }
}
