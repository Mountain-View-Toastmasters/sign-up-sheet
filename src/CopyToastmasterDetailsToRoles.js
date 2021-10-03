/**
 * A script to copy all the extra meeting details in
 *  the ToastmasterDetails sheet to the Roles sheets.
 * Also grabs the officer information at the same time.
 *
 * This script depends on the `GetClubOfficers` script
 */
// TODO(bshaibu): Better namespace variables & add more comments

// The indices of the cells that the current entry in
//    the sign up sheet relies on.
//  (1-indexed relative to spreadsheet)
const TMDETAILS_START_ROW = 1;
const TMDETAILS_END_ROW = 10;
const TMDETAILS_START_COL = 1;
const TMDETAILS_END_COL = 8;

// TM Details Field References
// These are relative to the spreadsheet and 0-indexed
var DATE_ROW_IDX = 0;
var DATE_COL_IDX = 1;

// TM Details Rows
//  relative to range, 0-indexed
var MEETING_THEME_ROW = 1;
var WORD_OF_THE_DAY_ROW = 2;
var WOTD_PART_OF_SPEECH_ROW = 3;
var WOTD_DESCRIPTION = 4;
var WORD_SAMPLE_SENTENCE = 5;
var MTD_SPEECH_HEADER_ROW = 6;
var SPEAKER_1_ROW = 7;
var SPEAKER_2_ROW = 8;
var SPEAKER_3_ROW = 9;

// TM Details Sheet Headers
//  (relative to range, 0-indexed)
// some columns are already in the SignUpSheet and ignored
var DETAILS_COL = 1;
var SPEAKER_NUMBER_COL = 0;
var SPEAKER_NAME_COL = 1;
var PATHNAME_COL = 2;
var LEVEL_COL = 3;
var PROJECT_COL = 4;
var SPEECH_TITLE_COL = 5;
var MIN_SPEECH_TIME_COL = 6;
var MAX_SPEECH_TIME_COL = 7;

class ToastmasterDetails {
  constructor() {
    const toastmasterDetailsData = getToastmastersDetailsSheetData();

    this.date = toastmasterDetailsData[DATE_ROW_IDX][DATE_COL_IDX];
    this.meetingTheme = toastmasterDetailsData[MEETING_THEME_ROW][DETAILS_COL];
    this.wordOfTheDay =
      toastmasterDetailsData[WORD_OF_THE_DAY_ROW][DETAILS_COL];
    this.wordOfTheDayPartOfSpeech =
      toastmasterDetailsData[WOTD_PART_OF_SPEECH_ROW][DETAILS_COL];
    this.wordOfTheDayDescription =
      toastmasterDetailsData[WOTD_DESCRIPTION][DETAILS_COL];
    this.wordOfTheDaySampleSentence =
      toastmasterDetailsData[WORD_SAMPLE_SENTENCE][DETAILS_COL];
    this.speaker1 = new SpeakerDetails(toastmasterDetailsData, SPEAKER_1_ROW);
    this.speaker2 = new SpeakerDetails(toastmasterDetailsData, SPEAKER_2_ROW);
    this.speaker3 = new SpeakerDetails(toastmasterDetailsData, SPEAKER_3_ROW);
  }

  populateRolesSheet(rolesSheet, roleEntryRow) {
    const setCell = (column, value) => {
      rolesSheet.getRange(roleEntryRow, column).setValue(value);
    };

    // Fill out meeting metadata (minus already filled-in date)
    setCell(ROLES_COL_MAP["Meeting_Theme"], this.meetingTheme);
    setCell(ROLES_COL_MAP["Word_of_the_Day"], this.wordOfTheDay);
    setCell(
      ROLES_COL_MAP["Word_of_the_Day_Part_of_Speech"],
      this.wordOfTheDayPartOfSpeech
    );
    setCell(
      ROLES_COL_MAP["Word_of_the_Day_Definition"],
      this.wordOfTheDayDescription
    );
    setCell(
      ROLES_COL_MAP["Word_of_the_Day_Sample_Sentence"],
      this.wordOfTheDaySampleSentence
    );

    // Fill out Speaker Details
    this.speaker1.populateRolesSheet(
      rolesSheet,
      roleEntryRow,
      ROLES_COL_MAP["Speaker_1"]
    );
    this.speaker2.populateRolesSheet(
      rolesSheet,
      roleEntryRow,
      ROLES_COL_MAP["Speaker_2"]
    );
    this.speaker3.populateRolesSheet(
      rolesSheet,
      roleEntryRow,
      ROLES_COL_MAP["Speaker_3"]
    );
  }
}

class SpeakerDetails {
  constructor(toastmasterDetailsData, speakerRow) {
    // Duplicated Fields
    this._role = toastmasterDetailsData[speakerRow][SPEAKER_NUMBER_COL];
    this._name = toastmasterDetailsData[speakerRow][SPEAKER_NAME_COL];
    this._pathway = toastmasterDetailsData[speakerRow][PATHNAME_COL];
    this._level = toastmasterDetailsData[speakerRow][LEVEL_COL];
    this._project = toastmasterDetailsData[speakerRow][PROJECT_COL];

    // Fields to actually copy over
    this.speechTitle = toastmasterDetailsData[speakerRow][SPEECH_TITLE_COL];
    this.minSpeechTime =
      toastmasterDetailsData[speakerRow][MIN_SPEECH_TIME_COL];
    this.maxSpeechTime =
      toastmasterDetailsData[speakerRow][MAX_SPEECH_TIME_COL];
  }

  populateRolesSheet(rolesSheet, roleEntryRow, speakerCol) {
    // Refilling fields that the sign up sheet probably hit jic
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_COL_OFFSET)
      .setValue(this._name);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Pathway_COL_OFFSET)
      .setValue(this._pathway);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Level_COL_OFFSET)
      .setValue(this._level);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Project_COL_OFFSET)
      .setValue(this._project);

    // Filling out the TM Details-unique fields
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Speech_Title_COL_OFFSET)
      .setValue(this.speechTitle);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Min_Time_COL_OFFSET)
      .setValue(this.minSpeechTime);
    rolesSheet
      .getRange(roleEntryRow, speakerCol + Speaker_Max_Time_COL_OFFSET)
      .setValue(this.maxSpeechTime);
  }
}

function getToastmastersDetailsSheetData() {
  // Open MVTM's Toastmasters Details Spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TM_DETAILS_SHEET_NAME
  );
  // Get the values into the data Array (ignoring the first few header rows)
  return sheet
    .getRange(
      TMDETAILS_START_ROW,
      TMDETAILS_START_COL,
      TMDETAILS_END_ROW - TMDETAILS_START_ROW + 1,
      TMDETAILS_END_COL - TMDETAILS_START_COL + 1
    )
    .getValues();
}

/**
 * Copies all details from the ToastmasterDetails page into the Roles spreadsheet.
 * @returns roleEntryRow the number of the row that has been added/edited
 */
function copyToastmasterDetailsToRoles() {
  const tmDetails = new ToastmasterDetails();
  const rolesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  const roleEntryRow = getOrCreateRoleEntryRow(
    prettyFormatDate(tmDetails.date)
  );
  tmDetails.populateRolesSheet(rolesSheet, roleEntryRow);
  copyOfficersToRoles(prettyFormatDate(tmDetails.date));
  return roleEntryRow;
}

// Function to clear the roster selections
function clearToastmasterDetails() {
  var tmDetailsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TM_DETAILS_SHEET_NAME
  );
  // Clear meeting and word of the day
  tmDetailsSheet.getRange("B2:B6").clearContent();
  // Clear Speech and speaker titles
  tmDetailsSheet.getRange("F8:H10").clearContent();
}

function resetToastmasterDetailsFormulas() {
  var toastmasterDetails = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TM_DETAILS_SHEET_NAME
  );

  // Set Date cell
  var currentDateCell = toastmasterDetails.getRange("B1");
  // NOTE(acmiyaguchi): variables are generally defined in
  // CopySignUpSheetToRoles, but I don't appreciate the design choice of gs to
  // share variable scope across files. It's very confusing.
  // Also, it may be useful to make this an integer offset from the start of the
  // sheet at some point.
  currentDateCell.setFormula(`='${SIGNUP_SHEET_NAME}'!D${SIGNUP_START_ROW}`);

  // Set Speaker 1 - 3 shared details
  setSpeakerCells(
    toastmasterDetails,
    8,
    SIGNUP_START_ROW + SIGNUP_ROW_MAP["speaker1"]
  );
  setSpeakerCells(
    toastmasterDetails,
    9,
    SIGNUP_START_ROW + SIGNUP_ROW_MAP["speaker2"]
  );
  setSpeakerCells(
    toastmasterDetails,
    10,
    SIGNUP_START_ROW + SIGNUP_ROW_MAP["speaker3"]
  );
}

function setSpeakerCells(toastmasterDetails, tmDetailsRow, signUpSheetRow) {
  var speakerCell = toastmasterDetails.getRange(`B${tmDetailsRow}`);
  var pathNameCell = toastmasterDetails.getRange(`C${tmDetailsRow}`);
  var levelCell = toastmasterDetails.getRange(`D${tmDetailsRow}`);
  var projectCell = toastmasterDetails.getRange(`E${tmDetailsRow}`);

  // NOTE: these must be manually updated if the columns change at all
  speakerCell.setFormula(`='${SIGNUP_SHEET_NAME}'!E${signUpSheetRow}`);
  pathNameCell.setFormula(`='${SIGNUP_SHEET_NAME}'!F${signUpSheetRow}`);
  levelCell.setFormula(`='${SIGNUP_SHEET_NAME}'!G${signUpSheetRow}`);
  projectCell.setFormula(`='${SIGNUP_SHEET_NAME}'!H${signUpSheetRow}`);
}
