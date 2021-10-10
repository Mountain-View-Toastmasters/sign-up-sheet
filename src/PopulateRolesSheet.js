/**
 * A script with reference information and helper functions
 * for dealing with the Roles sheet
 *
 * This script depends on the `DateFunctions` script
 */
// TODO(bshaibu): Better namespace variables & add more comments

// Roles Sheet Column References
//  Note: some are not currently used
//  These are 1-indexed relative to the Roles spreadsheet
// TODO(acmiyaguchi): add simple check to ensure these are in the correct order
const ROLES_COL_NAMES = [
  "Date",
  "Meeting_Theme",
  "Word_of_the_Day",
  "Word_of_the_Day_Part_of_Speech",
  "Word_of_the_Day_Definition",
  "Word_of_the_Day_Sample_Sentence",
  "Meeting_Location",
  "Sergeant_at_Arms",
  "Secretary",
  "Tech_Chair",
  "Zoom_Master",
  "Toastmaster",
  "Jokemaster",
  "General_Evaluator",
  "Recorder",
  "Timer",
  "Ah_Counter",
  "Wordmaster_Grammarian",
  "Table_Topics_Master",
  "Speaker_1",
  "Speaker_1_Pathway",
  "Speaker_1_Level",
  "Speaker_1_Project",
  "Speaker_1_Speech_Title",
  "Speaker_1_Min_Time",
  "Speaker_1_Max_Time",
  "Speaker_2",
  "Speaker_2_Pathway",
  "Speaker_2_Level",
  "Speaker_2_Project",
  "Speaker_2_Speech_Title",
  "Speaker_2_Min_Time",
  "Speaker_2_Max_Time",
  "Speaker_3",
  "Speaker_3_Pathway",
  "Speaker_3_Project",
  "Speaker_3_Level",
  "Speaker_3_Speech_Title",
  "Speaker_3_Min_Time",
  "Speaker_3_Max_Time",
  "Speaker_4",
  "Speaker_4_Pathway",
  "Speaker_4_Project",
  "Speaker_4_Level",
  "Speaker_4_Speech_Title",
  "Speaker_4_Min_Time",
  "Speaker_4_Max_Time",
  "Speaker_5",
  "Speaker_5_Pathway",
  "Speaker_5_Level",
  "Speaker_5_Project",
  "Speaker_5_Speech_Title",
  "Speaker_5_Min_Time",
  "Speaker_5_Max_Time",
  "Evaluator_1",
  "Evaluator_2",
  "Evaluator_3",
  "Evaluator_4",
  "Evaluator_5",
  "Waiting_List_Speaker_1",
  "Waiting_List_Speaker_2",
  "Club_President",
  "VP_Education",
  "VP_Membership",
  "VP_Public_Relations",
  "Club_Secretary",
  "Club_Treasurer",
  "Club_Sergeant_at_Arms",
  "Mentorship_Chair",
];
const ROLES_COL_MAP = Object.fromEntries(
  ROLES_COL_NAMES.map((name, index) => [name, index + 1])
);

// A mapping of the offset for different speaker columns
var Speaker_COL_OFFSET = 0;
var Speaker_Pathway_COL_OFFSET = 1;
var Speaker_Level_COL_OFFSET = 2;
var Speaker_Project_COL_OFFSET = 3;
var Speaker_Speech_Title_COL_OFFSET = 4;
var Speaker_Min_Time_COL_OFFSET = 5;
var Speaker_Max_Time_COL_OFFSET = 6;


function getAllRolesDates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  return sheet
    .getRange(1, ROLES_COL_MAP["Date"], sheet.getLastRow())
    .getValues();
}

// Check if the current entry is within the last few columns
// Return a Range object of the last dates entered into the
//  Roles spreadsheeet
function getMostRecentRows(rowsToCheck = 10) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  var lastFilledRow = sheet.getLastRow();
  return sheet.getRange(
    lastFilledRow - rowsToCheck + 1,
    ROLES_COL_MAP["Date"],
    rowsToCheck
  );
}

// Check whether the date of interest is in the spreadsheet's last few rows
//    Returns a tuple of whether the row exists & what index in the spreadsheet
//    [indexInRange, indexInSheet]
function hasRoleEntryForDate(recentEntries, dateString) {
  var dateStrings = recentEntries
    .getValues()
    .map((row) => prettyFormatDate(row[0]));
  var rangeIndex = dateStrings.indexOf(dateString);
  var sheetIndex;

  // If the date is in the recent entries, find its index in the sheet
  if (rangeIndex != -1) {
    // Add 1 to select relative to 1-indexed range
    var cell = recentEntries.getCell(rangeIndex + 1, 1);
    sheetIndex = cell.getLastRow();
  }

  return [rangeIndex != -1, sheetIndex];
}

// This function tries to find the row in Roles matching the current date
//  If it can't be found, creates a new row in the sheet at the end
//    for the current date
// TODO(bshaibu): remove default date
//  Returns the row in the Roles sheet to edit
function getOrCreateRoleEntryRow(dateString) {
  const recentRows = getMostRecentRows();
  var [hasRow, rowIndex] = hasRoleEntryForDate(recentRows, dateString);

  if (!hasRow) {
    var lastRow = recentRows.getLastRow();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      ROLES_SHEET_NAME
    );
    sheet.insertRowAfter(lastRow);
    rowIndex = lastRow + 1;
    sheet.getRange(rowIndex, DATE_COL_IDX).setValue(dateString);
  }

  return rowIndex;
}

// Section for protecting the Roles spreadsheet

// These are the people generally allowed to edit protected sheets - Officers
const DEFAULT_PROTECTED_RANGE_EDITORS = [
  // Allow MVTM Officers
  "mountainviewtoastmastersofficers@googlegroups.com",
  // Allow Craig Wood (he's the spreadsheet owner and probably already added)
  "cwwood1234@gmail.com",
  // Allow the Officer's "robot" account
  "mountainviewtm@gmail.com",
];
const PROTECTION_MESSAGE =
  "Don't allow editing of finalized roles sheet rows (saved sign up details) by non-officers";

function removeAllCurrentEditors(protection) {
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}

function protectRolesSheetRow(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  const range = sheet.getRange(`${rowNumber}:${rowNumber}`);
  const protection = range
    .protect()
    .setDescription(`${PROTECTION_MESSAGE} - Row ${rowNumber}`);

  // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
  // permission comes from a group, the script throws an exception upon removing the group.
  const me = Session.getEffectiveUser();
  protection.addEditor(me);

  // Before protections can be added, exitsting user list must be removed
  protection.removeEditors(protection.getEditors());

  // Add the default editors
  protection.addEditors(DEFAULT_PROTECTED_RANGE_EDITORS);

  // Restrict editing to only users explicitly set as editors - not just anyone
  //  with permissions to the sheet
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}
