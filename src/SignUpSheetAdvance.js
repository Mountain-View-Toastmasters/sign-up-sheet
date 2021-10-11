const __SIGNUP_SHEET_HEADER_ROW_NUM = SIGNUP_START_ROW;
const __SIGNUP_SHEET_SECTION_START_COL_NUM = SIGNUP_START_COL;

function advanceSignUpSheet() {
  var signUpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SIGNUP_SHEET_NAME
  );
  var signUpTemplate = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SIGNUP_TEMPLATE
  );

  // Google Apps Script does not allow you to delete cells with active formulas,
  // so they must be cleared out first.
  clearOutCurrentSignUp(signUpSheet, signUpTemplate);
  insertNewSignupSection(signUpSheet, signUpTemplate);
  deleteCurrentSignupSection(signUpSheet, signUpTemplate);
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
  // TODO: remove extra columns if they aren't being used for anything
  signUpSheet.showColumns(5);
  signUpSheet.showColumns(6);

  signUpSheet
    .getRange(
      __SIGNUP_SHEET_HEADER_ROW_NUM,
      __SIGNUP_SHEET_SECTION_START_COL_NUM,
      signUpTemplate.getLastRow(),
      signUpTemplate.getLastColumn()
    )
    .deleteCells(SpreadsheetApp.Dimension.COLUMNS);
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
      __SIGNUP_SHEET_HEADER_ROW_NUM,
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

  // Merge the meeting location cells
  signUpSheet
    .getRange(
      __SIGNUP_SHEET_HEADER_ROW_NUM,
      signUpSheet.getLastColumn() - 3,
      1,
      4
    )
    .mergeAcross();
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
  // Note: we need to flush to be sure all pending spreadsheet operations
  //  complete before the script exits
  SpreadsheetApp.flush();
}
