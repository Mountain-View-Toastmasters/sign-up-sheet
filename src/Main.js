/// entrypoint script

// function to run to create a new menu item
function onOpen() {
  let menuEntries = [
    {
      name: "Generate Agenda",
      functionName: "generateAgenda",
    },
    {
      name: "Generate Minutes",
      functionName: "generateMinutes",
    },
    {
      name: "Advance Sign Up Sheet",
      functionName: "advanceSignUpSheet",
    },
    {
      name: "Copy Sign Ups to Roles",
      functionName: "copyCurrentSignUpSheetEntryToRolesSheet",
    },
    {
      name: "Copy Toastmaster Details to Roles",
      functionName: "copyToastmasterDetailsToRoles",
    },
    {
      name: "Clear Toastmaster Details",
      functionName: "clearToastmasterDetails",
    },
  ];
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.addMenu("Generate", menuEntries);
}
