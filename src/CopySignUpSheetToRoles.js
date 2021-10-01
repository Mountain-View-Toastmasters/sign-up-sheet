/**
 * A script to parse the Sign Up Sheet's latest (leftmost) entry
 * and then copy its information into the Roles spreadsheet.
 *
 * This script depends on the `PopulateRolesSheet` and `DateFunctions` scripts
 */
// TODO(bshaibu): Better namespace variables & add more comments

// The indices of the cells that the current entry in
//    the sign up sheet relies on.
//  (1-indexed relative to spreadsheet)
const SIGNUP_START_ROW = 2;
const SIGNUP_END_ROW = 22;
const SIGNUP_START_COL = 2;
const SIGNUP_END_COL = 7;

// Sign Up Sheet Field References
// These are relative to the current entry in the
//    sign up sheet and NOT the entire spreadsheet
//    (0-indexed)
const SIGNUP_DATE_COL_IDX = 2;
const SIGNUP_MEETING_LOCATION_COL_IDX = 3;

// Sign Up Sheet Headers
//  (relative to current entry, 0-indexed)
const SIGNUP_HEADER_NAMES = [
  "confirmed",
  "location",
  "role",
  "name",
  "pathway",
  "level",
  "project",
];
const SIGNUP_HEADER_MAP = Object.fromEntries(
  SIGNUP_HEADER_NAMES.map((name, index) => [name, index])
);

// Sign Up Sheet Rows
// By naming each row in the spreadsheet, it should be relatively simple to add
// or remove rows without having explicitly enumerate their indices. This is
// 0-offset from the start location of the rows.
const SIGNUP_ROW_NAMES = [
  "meetingHeader",
  "signUpHeader",
  "sergeantAtArms",
  "secretary",
  "toastmaster",
  "jokemaster",
  "generalEvaluator",
  "recorder",
  "timer",
  "ahCounter",
  "wordmasterGrammarian",
  "tableTopicsMaster",
  "speakerHeader",
  "speaker1",
  "speaker2",
  "speaker3",
  "evaluator1",
  "evaluator2",
  "evaluator3",
  "waitlistSpeaker1",
  "waitlistSpeaker2",
];
const SIGNUP_ROW_MAP = Object.fromEntries(
  SIGNUP_ROW_NAMES.map((name, index) => [name, index])
);

// Helpers and Classes
class SpeechDetails {
  constructor(signupsData, rowIdx) {
    const speakerRow = signupsData[rowIdx];
    for (let [name, index] of Object.entries(SIGNUP_HEADER_MAP)) {
      this[name] = speakerRow[index];
    }
  }

  populateRolesSheet(rolesSheet, roleEntryRow, speakerCol) {
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_COL_OFFSET)
      .setValue(this.name);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Pathway_COL_OFFSET)
      .setValue(this.pathway);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Level_COL_OFFSET)
      .setValue(this.level);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Project_COL_OFFSET)
      .setValue(this.project);
  }
}

/// Slice a list based on the location of two entries in the list inclusive.
/// Throws an exception if the resulting slice is empty. Assumes all entires are
/// unique.
function between(arr, first, last) {
  let sliced = arr.slice(arr.indexOf(first), arr.indexOf(last) + 1);
  if (sliced.length == 0) {
    throw "sliced list is empty";
  }
  return sliced;
}

class SignUpDetails {
  constructor() {
    const signupsData = getSignUpSheetData();

    this.date =
      signupsData[SIGNUP_ROW_MAP["meetingHeader"]][SIGNUP_DATE_COL_IDX];
    this.meetingLocation =
      signupsData[SIGNUP_ROW_MAP["meetingHeader"]][
        SIGNUP_MEETING_LOCATION_COL_IDX
      ];

    // helper function to keep things compact
    let rows_between = (start, end) => between(SIGNUP_ROW_NAMES, start, end);

    for (let name of rows_between("sergeantAtArms", "tableTopicsMaster").concat(
      rows_between("evaluator1", "evaluator3")
    )) {
      this[name] = signupsData[SIGNUP_ROW_MAP[name]][SIGNUP_HEADER_MAP["name"]];
    }
    for (let name of rows_between("speaker1", "speaker3").concat(
      rows_between("waitlistSpeaker1", "waitlistSpeaker2")
    )) {
      this[name] = new SpeechDetails(signupsData, SIGNUP_ROW_MAP[name]);
    }
  }

  populateRolesSheet(rolesSheet, roleEntryRow) {
    const setCell = (column, value) => {
      rolesSheet.getRange(roleEntryRow, column).setValue(value);
    };

    // Fill out meeting metadata (minus already filled-in date)
    setCell(Meeting_Location_COL, this.meetingLocation);

    // Fill out Functionaries
    setCell(Sergeant_at_Arms_COL, this.sergeantAtArms);
    setCell(Secretary_COL, this.secretary);
    setCell(Toastmaster_COL, this.toastmaster);
    setCell(Jokemaster_COL, this.jokemaster);
    setCell(General_Evaluator_COL, this.generalEvaluator);
    setCell(Recorder_COL, this.recorder);
    setCell(Timer_COL, this.timer);
    setCell(Ah_Counter_COL, this.ahCounter);
    setCell(Wordmaster_Grammarian_COL, this.wordmasterGrammarian);
    setCell(Table_Topics_Master_COL, this.tableTopicsMaster);

    // Fill out Speakers
    this._populateSpeakerCells(rolesSheet, roleEntryRow);

    // Fill out Evaluators
    setCell(Evaluator_1_COL, this.evaluator1);
    setCell(Evaluator_2_COL, this.evaluator2);
    setCell(Evaluator_3_COL, this.evaluator3);
    // TODO(bshaibu): We might want to handle adding a 4th and 5th evaluator to the sign up sheet

    // Fill out Waiting list speakers
    setCell(Waiting_List_Speaker_1_COL, this.waitlistSpeaker1.name);
    setCell(Waiting_List_Speaker_2_COL, this.waitlistSpeaker2.name);
    // TODO(bshaibu): Do we want to save anything beside the waiting list speaker's name?
  }

  _populateSpeakerCells(rolesSheet, roleEntryRow) {
    this.speaker1.populateRolesSheet(rolesSheet, roleEntryRow, Speaker_1_COL);
    this.speaker2.populateRolesSheet(rolesSheet, roleEntryRow, Speaker_2_COL);
    this.speaker3.populateRolesSheet(rolesSheet, roleEntryRow, Speaker_3_COL);
    // TODO(bshaibu): We might want to handle adding a 4th and 5th speaker to the sign up sheet
  }
}

function getSignUpSheetData() {
  // Open MVTM's Meeting Sign-Up Spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SIGNUP_SHEET_NAME
  );
  // Get the values into the data Array (ignoring the first few header rows)
  return sheet
    .getRange(
      SIGNUP_START_ROW,
      SIGNUP_START_COL,
      SIGNUP_END_ROW - SIGNUP_START_ROW + 1,
      SIGNUP_END_COL - SIGNUP_START_COL + 1
    )
    .getValues();
}

/**
 * Copies all details from the active (leftmost) sign up sheet entry
 *  into the Roles spreadsheet.
 * @returns roleEntryRow the number of the row that has been added/edited
 */
function copyCurrentSignUpSheetEntryToRolesSheet() {
  const signUpDetails = new SignUpDetails();
  const rolesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  const roleEntryRow = getOrCreateRoleEntryRow(
    prettyFormatDate(signUpDetails.date)
  );
  signUpDetails.populateRolesSheet(rolesSheet, roleEntryRow);
  copyOfficersToRoles(prettyFormatDate(signUpDetails.date));
  return roleEntryRow;
}
