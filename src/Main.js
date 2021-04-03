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

function clearAndAdvanceSignUp() {
  clearToastmasterDetails();
  advanceSignUpSheet();
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
