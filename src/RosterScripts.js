/**
 * A script to parse the Roster and grab a mapping of current
 * members and the current officers.
 *
 * This script depends on no other scripts
 */
// TODO(bshaibu): Better namespace variables & add more comments

// The indices of the cells that the current entry in
//    the sign up sheet relies on.
//  (1-indexed relative to spreadsheet)
const ROSTER_START_ROW = 5;
const ROSTER_HEADER_ROW = 4;
const ROSTER_START_COL = 2;
const ROSTER_END_COL = 7;

// The indices of the header row for the table
//    0-indexed relative to the start of the table
//    NOT the spreadsheet without its header
const FIRST_NAME_COL = 0;
const LAST_NAME_COL = 1;
const CLUB_NAME_COL = 2;
const FULL_NAME_COL = 3;
const EMAIL_COL = 4;
const OFFICER_ROLES_COL = 5;

// Mapping of OfficerRole "enum"
//  to its value in the roles sheet
//  This is probably an overcomplication
const OfficerRole = {
  president: "Club President",
  vpEducation: "VP of Education",
  vpMembership: "VP of Membership",
  vpPublicRelations: "VP of Public Relations",
  clubSecretary: "Club Secretary",
  clubTreasurer: "Club Treasurer",
  sergeantAtArms: "Sergeant-at-Arms",
  chairOfMentorship: "Chair of Mentorship",
};

class MemberMap {
  constructor(members, officers) {
    this.members = members;
    this.officers = officers;
  }
}

const getMemberMap = () => {
  const rosterData = getRosterSheetData();
  const members = {};
  const officers = {};
  for (let rosterRow of rosterData) {
    const clubName = rosterRow[CLUB_NAME_COL];
    members[clubName] = new Member(rosterRow);
    let officerRole = members[clubName].officerRole;
    if (officerRole != undefined && officerRole.length > 0) {
      officers[officerRole] = clubName;
    }
  }
  return new MemberMap(members, officers);
};

class Member {
  constructor(rolesRow) {
    this.firstName = rolesRow[FIRST_NAME_COL];
    this.lastName = rolesRow[LAST_NAME_COL];
    this.clubName = rolesRow[CLUB_NAME_COL];
    this.fullName = rolesRow[FULL_NAME_COL];
    this.email = rolesRow[EMAIL_COL];
    this.officerRole = rolesRow[OFFICER_ROLES_COL];
  }
}

// Helper to calculate the last row in the Roster spreadsheet
//  with members (can't just use sheet.getLastRow as there are
//  non-empty select columns)
// Technique from https://stackoverflow.com/a/17637159
function getLastRowOfRoster(spreadsheet) {
  var firstNameCol = spreadsheet
    .getRange(`B${ROSTER_HEADER_ROW + 1}:B`)
    .getValues();
  return firstNameCol.filter(String).length + ROSTER_HEADER_ROW;
}

function getRosterSheetData() {
  // Open MVTM's Roster Spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROSTER_SHEET_NAME
  );
  // Get the values into the data Array (ignoring the first few header rows)
  //  Note: we have to calculate
  return sheet
    .getRange(
      ROSTER_START_ROW,
      ROSTER_START_COL,
      getLastRowOfRoster(sheet) - ROSTER_START_ROW + 1,
      ROSTER_END_COL - ROSTER_START_COL + 1
    )
    .getValues();
}

// Copies to the current officers to the Roles
//  Row with the given date
function copyOfficersToRoles(dateString) {
  const memberMap = getMemberMap();
  const officers = memberMap.officers;
  const rolesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROLES_SHEET_NAME
  );
  const roleEntryRow = getOrCreateRoleEntryRow(dateString);

  const setCell = (column, value) => {
    rolesSheet.getRange(roleEntryRow, column).setValue(value);
  };

  // Set Cells for Officers
  setCell(Club_President_COL, officers[OfficerRole.president]);
  setCell(VP_Education_COL, officers[OfficerRole.vpEducation]);
  setCell(VP_Membership_COL, officers[OfficerRole.vpMembership]);
  setCell(VP_Public_Relations_COL, officers[OfficerRole.vpPublicRelations]);
  setCell(Club_Secretary_COL, officers[OfficerRole.clubSecretary]);
  setCell(Club_Treasurer_COL, officers[OfficerRole.clubTreasurer]);
  setCell(Club_Sergeant_at_Arms_COL, officers[OfficerRole.sergeantAtArms]);
  setCell(Mentorship_Chair_COL, officers[OfficerRole.chairOfMentorship]);
}

// Function to clear the roster selections
function clearRosterSelections() {
  const rosterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    ROSTER_SHEET_NAME
  );
  const firstCheckRow = ROSTER_HEADER_ROW + 1;
  const lastFilledRow = getLastRowOfRoster(rosterSheet);
  rosterSheet.getRange(`A${firstCheckRow}:A${lastFilledRow}`).uncheck();
}
