/// entrypoint script

function copyAndGenerateAgenda() {
  copyCurrentSignUpSheetEntryToRolesSheet();
  copyToastmasterDetailsToRoles();
  generateAgenda();
}

function copyAndGenerateMinutes() {
  copyCurrentSignUpSheetEntryToRolesSheet();
  copyToastmasterDetailsToRoles();
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
    ui.alert("Permission denied.");
  }
}

function clearAndAdvanceSignUp() {
  confirm(() => {
    clearToastmasterDetails();
    advanceSignUpSheet();
  });
}

function onOpen() {
  let menuEntries = [
    {
      name: "Generate Agenda",
      functionName: "copyAndGenerateAgenda",
    },
    {
      name: "Generate Minutes",
      functionName: "copyAndGenerateMinutes",
    },
    {
      name: "Advance Sign Up Sheet",
      functionName: "clearAndAdvanceSignUp",
    },
  ];
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.addMenu("Generate", menuEntries);
}
