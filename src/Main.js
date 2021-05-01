/// entrypoint script

function copyAllSignUpDetails() {
  copyCurrentSignUpSheetEntryToRolesSheet();
  copyToastmasterDetailsToRoles();
}

function copyAndGenerateAgenda() {
  copyAllSignUpDetails();
  generateAgenda();
}

function copyAndGenerateMinutes() {
  copyAllSignUpDetails();
  generateMinutes();
}

// https://developers.google.com/apps-script/guides/dialogs
function confirm(confirm_cb) {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
    "Please confirm",
    "Are you sure you want to continue?",
    ui.ButtonSet.YES_NO
  );

  // Process the user's response.
  if (result == ui.Button.YES) {
    confirm_cb();
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert("Cancelled change.");
  }
}

function clearAndAdvanceSignUp() {
  confirm(() => {
    copyAllSignUpDetails();
    clearToastmasterDetails();
    advanceSignUpSheet();
    resetToastmasterDetailsFormulas();
  });
}

function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Generate")
    .addItem("Generate Agenda", "copyAndGenerateAgenda")
    .addItem("Generate Minutes", "copyAndGenerateMinutes")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Officers Only")
        // ensure items in this submenu have a confirmation prompt
        .addItem("Advance Sign Up Sheet", "clearAndAdvanceSignUp")
    )
    .addToUi();
}
