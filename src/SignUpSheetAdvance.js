const __SIGNUP_SHEET_HEADER_ROW_NUM = 7;
const __SIGNUP_SHEET_SECTION_START_COL_NUM = 2;

function advanceSignUpSheet() {
  var signUpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Sign-up Sheet"
  );
  var signUpTemplate = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "SignUp Template"
  );

  // Google Apps Script does not allow you to delete cells with active formulas,
  // so they must be cleared out first.
  clearOutCurrentSignUp(signUpSheet, signUpTemplate);
  insertNewSignupSection(signUpSheet, signUpTemplate);
  deleteCurrentSignupSection(signUpSheet, signUpTemplate);
  insertHiddenCols(signUpSheet, signUpTemplate);
  cleanUpExtraCols(signUpSheet);
  updateDate(signUpSheet, signUpTemplate);
}

function cleanUpExtraCols(signUpSheet) {
  var maxCol = signUpSheet.getMaxColumns();
  var lastCol = signUpSheet.getLastColumn();

  if (maxCol - lastCol != 0) {
    signUpSheet.deleteColumns(lastCol + 1, maxCol - lastCol);
  }
}

function clearOutCurrentSignUp(signUpSheet, signUpTemplate) {
  signUpSheet
    .getRange(
      __SIGNUP_SHEET_HEADER_ROW_NUM,
      __SIGNUP_SHEET_SECTION_START_COL_NUM,
      signUpTemplate.getLastRow(),
      signUpTemplate.getLastColumn() + 2
    ) // with 2 header cols
    .setValue("");
}

function deleteCurrentSignupSection(signUpSheet, signUpTemplate) {
  signUpSheet.showColumns(5);
  signUpSheet.showColumns(6);

  signUpSheet
    .getRange(
      __SIGNUP_SHEET_HEADER_ROW_NUM,
      __SIGNUP_SHEET_SECTION_START_COL_NUM,
      signUpTemplate.getLastRow(),
      signUpTemplate.getLastColumn() + 2
    ) // with 2 header cols
    .deleteCells(SpreadsheetApp.Dimension.COLUMNS);
}

function insertHiddenCols(signUpSheet, signUpTemplate) {
  signUpSheet.insertColumnsAfter(__SIGNUP_SHEET_SECTION_START_COL_NUM + 2, 2);

  var fullNameReference = "=FILTER(Roster!$E$5:$E,Roster!$D$5:$D=";
  var emailReference = "=FILTER(Roster!F$5:$F,Roster!D$5:$D=";

  var startRow = __SIGNUP_SHEET_HEADER_ROW_NUM + 2;
  var endRow = __SIGNUP_SHEET_HEADER_ROW_NUM + signUpTemplate.getLastRow();

  for (var i = startRow; i <= endRow; i++) {
    signUpSheet.getRange("E" + i).setValue(fullNameReference + "D" + i + ")");
    signUpSheet.getRange("F" + i).setValue(emailReference + "D" + i + ")");
  }

  signUpSheet.hideColumns(5);
  signUpSheet.hideColumns(6);
}

function insertNewSignupSection(signUpSheet, signUpTemplate) {
  var signUpTemplateRange = signUpTemplate.getRange(
    1,
    1,
    signUpTemplate.getLastRow(),
    signUpTemplate.getLastColumn()
  );

  var rangeVals = signUpTemplateRange.getValues();
  var rangeBkgnds = signUpTemplateRange.getBackgrounds();
  var rangeColors = signUpTemplateRange.getFontColors();
  var rangeFontFam = signUpTemplateRange.getFontFamilies();
  var rangeFontLines = signUpTemplateRange.getFontLines();
  var rangeFontSizes = signUpTemplateRange.getFontSizes();
  var rangeFontStyles = signUpTemplateRange.getFontStyles();
  var rangeFontWeights = signUpTemplateRange.getFontWeights();
  var rangeHorizAlign = signUpTemplateRange.getHorizontalAlignments();
  var rangeVertAlign = signUpTemplateRange.getVerticalAlignments();
  var rangeNumFormats = signUpTemplateRange.getNumberFormats();
  var rangeWraps = signUpTemplateRange.getWraps();
  var rangeDataValids = signUpTemplateRange.getDataValidations();

  signUpSheet
    .getRange(
      7,
      signUpSheet.getLastColumn() + 1,
      rangeVals.length,
      signUpTemplate.getLastColumn()
    )
    .setValues(rangeVals)
    .setBackgrounds(rangeBkgnds)
    .setFontColors(rangeColors)
    .setFontFamilies(rangeFontFam)
    .setFontLines(rangeFontLines)
    .setFontSizes(rangeFontSizes)
    .setFontStyles(rangeFontStyles)
    .setFontWeights(rangeFontWeights)
    .setHorizontalAlignments(rangeHorizAlign)
    .setVerticalAlignments(rangeVertAlign)
    .setNumberFormats(rangeNumFormats)
    .setWraps(rangeWraps)
    .setDataValidations(rangeDataValids);
}

function updateDate(signUpSheet, signUpTemplate) {
  var dateCell = signUpSheet.getRange(
    __SIGNUP_SHEET_HEADER_ROW_NUM,
    signUpSheet.getLastColumn() - 4
  );
  var prevDate = signUpSheet
    .getRange(
      __SIGNUP_SHEET_HEADER_ROW_NUM,
      signUpSheet.getLastColumn() - 4 - signUpTemplate.getLastColumn()
    )
    .getValue();

  var date = new Date(prevDate);
  date.setDate(date.getDate() + 7);

  dateCell.setValue(date);
}
