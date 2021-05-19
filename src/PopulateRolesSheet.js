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
var Date_COL = 1;
var Meeting_Theme_COL = 2;
var Word_of_the_Day_COL = 3;
var Word_of_the_Day_Part_of_Speech_COL = 4;
var Word_of_the_Day_Definition_COL = 5;
var Word_of_the_Day_Sample_Sentence_COL = 6;
var Meeting_Location_COL = 7;
var Sergeant_at_Arms_COL = 8;
var Secretary_COL = 9;
var Toastmaster_COL = 10;
var Jokemaster_COL = 11;
var General_Evaluator_COL = 12;
var Recorder_COL = 13;
var Timer_COL = 14;
var Ah_Counter_COL = 15;
var Wordmaster_Grammarian_COL = 16;
var Table_Topics_Master_COL = 17;
var Speaker_1_COL = 18;
var Speaker_1_Pathway_COL = 19;
var Speaker_1_Level_COL = 20;
var Speaker_1_Project_COL = 21;
var Speaker_1_Speech_Title_COL = 22;
var Speaker_1_Min_Time_COL = 23;
var Speaker_1_Max_Time_COL = 24;
var Speaker_2_COL = 25;
var Speaker_2_Pathway_COL = 26;
var Speaker_2_Level_COL = 27;
var Speaker_2_Project_COL = 28;
var Speaker_2_Speech_Title_COL = 29;
var Speaker_2_Min_Time_COL = 30;
var Speaker_2_Max_Time_COL = 31;
var Speaker_3_COL = 32;
var Speaker_3_Pathway_COL = 33;
var Speaker_3_Project_COL = 34;
var Speaker_3_Level_COL = 35;
var Speaker_3_Speech_Title_COL = 36;
var Speaker_3_Min_Time_COL = 37;
var Speaker_3_Max_Time_COL = 38;
var Speaker_4_COL = 39;
var Speaker_4_Pathway_COL = 40;
var Speaker_4_Project_COL = 41;
var Speaker_4_Level_COL = 42;
var Speaker_4_Speech_Title_COL = 43;
var Speaker_4_Min_Time_COL = 44;
var Speaker_4_Max_Time_COL = 45;
var Speaker_5_COL = 46;
var Speaker_5_Pathway_COL = 47;
var Speaker_5_Level_COL = 48;
var Speaker_5_Project_COL = 49;
var Speaker_5_Speech_Title_COL = 50;
var Speaker_5_Min_Time_COL = 51;
var Speaker_5_Max_Time_COL = 52;
var Evaluator_1_COL = 53;
var Evaluator_2_COL = 54;
var Evaluator_3_COL = 55;
var Evaluator_4_COL = 56;
var Evaluator_5_COL = 57;
var Waiting_List_Speaker_1_COL = 58;
var Waiting_List_Speaker_2_COL = 59;
var Club_President_COL = 60;
var VP_Education_COL = 61;
var VP_Membership_COL = 62;
var VP_Public_Relations_COL = 63;
var Club_Secretary_COL = 64;
var Club_Treasurer_COL = 65;
var Club_Sergeant_at_Arms_COL = 66;
var Mentorship_Chair_COL = 67;

// A mapping of the offset for different speaker columns
var Speaker_COL_OFFSET = 0;
var Speaker_Pathway_COL_OFFSET = 1;
var Speaker_Level_COL_OFFSET = 2;
var Speaker_Project_COL_OFFSET = 3;
var Speaker_Speech_Title_COL_OFFSET = 4;
var Speaker_Min_Time_COL_OFFSET = 5;
var Speaker_Max_Time_COL_OFFSET = 6;

// let rolesSheetRow;
// if roles sheet does not have a row for current date
//  rowToEdit = signUpSheet.addRow
//  rowToEdit[dateColumns] = date

function getAllRolesDates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  return sheet.getRange(1, Date_COL, sheet.getLastRow()).getValues();
}

// Check if the current entry is within the last few columns
// Return a Range object of the last dates entered into the
//  Roles spreadsheeet
function getMostRecentRows(rowsToCheck = 10) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  var lastFilledRow = sheet.getLastRow();
  return sheet.getRange(lastFilledRow - rowsToCheck + 1, Date_COL, rowsToCheck);
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
