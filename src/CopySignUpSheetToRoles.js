/**
 * A script to parse the Sign Up Sheet's latest (leftmost) entry
 * and then copy its information into the Roles spreadsheet.
 *
 * This script depends on the `PopulateRolesSheet` and `DateFunctions` scripts
 */
// TODO(bshaibu): Better namespace variables & add more comments

// Sheet Information
const SIGNUP_SHEET_NAME = "Sign-up Sheet";

// The indices of the cells that the current entry in
//    the sign up sheet relies on.
//  (1-indexed relative to spreadsheet)
const SIGNUP_START_ROW = 7;
const SIGNUP_END_ROW = 27;
const SIGNUP_START_COL = 2;
const SIGNUP_END_COL = 9;

// Sign Up Sheet Field References
// These are relative to the current entry in the
//    sign up sheet and NOT the entire spreadsheet
//    (0-indexed)
var DATE_ROW_IDX = 0;
var DATE_COL_IDX = 1;

// Sign Up Sheet Headers
//  (relative to current entry, 0-indexed)
var CONFIRM_COL_IDX = 0;
var ROLE_COL_IDX = 1;
var MEETING_LOCATION_IDX = 2;
var NAME_COL_IDX = 2;
var FULLNAME_COL_IDX = 3;
var EMAIL_COL_IDX = 4;
var PATHWAY_COL_IDX = 5;
var LEVEL_COL_IDX = 6;
var PROJECT_COL_IDX = 7;

// Sign Up Sheet Rows
//  (relative to current entry, 0-indexed)
var MEETING_HEADER_ROW_IDX = 0;
var SIGN_UP_HEADER_ROW_IDX = 1;
var SAA_ROW_IDX = 2;
var SECRETARY_ROW_IDX = 3;
var TMOD_ROW_IDX = 4;
var JKM_ROW_IDX = 5;
var GE_ROW_IDX = 6;
var REC_ROW_IDX = 7;
var TIM_ROW_IDX = 8;
var AHC_ROW_IDX = 9;
var GRAM_ROW_IDX = 10;
var TTM_ROW_IDX = 11;
var SPK_HEADER_ROW_IDX = 12;
var SPK1_ROW_IDX = 13;
var SPK2_ROW_IDX = 14;
var SPK3_ROW_IDX = 15;
var EVAL1_ROW_IDX = 16;
var EVAL2_ROW_IDX = 17;
var EVAL3_ROW_IDX = 18;
var WLSPK1_ROW_IDX = 19;
var WLSPK2_ROW_IDX = 20;

// Helpers and Classes
class SpeechDetails {
  constructor(signupsData, rowIdx) {
    const speakerRow = signupsData[rowIdx];
    this.confirmed = speakerRow[CONFIRM_COL_IDX];
    this.role = speakerRow[ROLE_COL_IDX];
    this.name = speakerRow[NAME_COL_IDX];
    this.fullName = speakerRow[FULLNAME_COL_IDX];
    this.email = speakerRow[EMAIL_COL_IDX];
    this.pathway = speakerRow[PATHWAY_COL_IDX];
    this.level = speakerRow[LEVEL_COL_IDX];
    this.project = speakerRow[PROJECT_COL_IDX];
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

class SignUpDetails {
  constructor() {
    const signupsData = getSignUpSheetData();

    this.date = signupsData[DATE_ROW_IDX][DATE_COL_IDX];
    this.meetingLocation =
      signupsData[MEETING_HEADER_ROW_IDX][MEETING_LOCATION_IDX];
    this.sergeantAtArms = signupsData[SAA_ROW_IDX][NAME_COL_IDX];
    this.secretary = signupsData[SECRETARY_ROW_IDX][NAME_COL_IDX];
    this.toastmaster = signupsData[TMOD_ROW_IDX][NAME_COL_IDX];
    this.jokemaster = signupsData[JKM_ROW_IDX][NAME_COL_IDX];
    this.generalEvaluator = signupsData[GE_ROW_IDX][NAME_COL_IDX];
    this.recorder = signupsData[REC_ROW_IDX][NAME_COL_IDX];
    this.timer = signupsData[TIM_ROW_IDX][NAME_COL_IDX];
    this.ahCounter = signupsData[AHC_ROW_IDX][NAME_COL_IDX];
    this.wordmasterGrammarian = signupsData[GRAM_ROW_IDX][NAME_COL_IDX];
    this.tableTopicsMaster = signupsData[TTM_ROW_IDX][NAME_COL_IDX];
    this.speaker1 = new SpeechDetails(signupsData, SPK1_ROW_IDX);
    this.speaker2 = new SpeechDetails(signupsData, SPK2_ROW_IDX);
    this.speaker3 = new SpeechDetails(signupsData, SPK3_ROW_IDX);
    this.evaluator1 = signupsData[EVAL1_ROW_IDX][NAME_COL_IDX];
    this.evaluator2 = signupsData[EVAL2_ROW_IDX][NAME_COL_IDX];
    this.evaluator3 = signupsData[EVAL3_ROW_IDX][NAME_COL_IDX];
    this.waitlistSpeaker1 = new SpeechDetails(signupsData, WLSPK1_ROW_IDX);
    this.waitlistSpeaker2 = new SpeechDetails(signupsData, WLSPK2_ROW_IDX);
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
}
