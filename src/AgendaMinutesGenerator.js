// variables share global scope, AMG = Agenda Minutes Generator

// templates for documents
const AMG_AGENDA_TEMPLATE_ID = "1to1G9m12Om-0u5rDfxyPhwdShiaDVaa55R8SP_7XvMY";
const AMG_MINUTES_TEMPLATE_ID = "11NdRpVHwGTBLiCoCQmr8sDlskHnfkjzMMrhnB5iPpU8";

// directory for output files
const AMG_AGENDA_OUTPUT_FOLDER_ID = "14fBhsQ7u34EtXVWS8lWLS7QBwK7cdLNA";
const AMG_MINUTES_OUTPUT_FOLDER_ID = "1GWySjq8y4OQS48PHT2vRyTxXWxKv8PyL";

function generateAgenda() {
  _generateMain(
    "Agendas",
    AMG_AGENDA_OUTPUT_FOLDER_ID,
    AMG_AGENDA_TEMPLATE_ID,
    (row) => `MVTM Meeting Agenda, ${row.DATE.toISOString().slice(0, 10)}`,
    false
  );
}

function generateMinutes() {
  _generateMain(
    "Minutes",
    AMG_MINUTES_OUTPUT_FOLDER_ID,
    AMG_MINUTES_TEMPLATE_ID,
    (row) => `Meeting Minutes, ${row.DATE.toISOString().slice(0, 10)}`,
    true
  );
}

/// template_type: The name of the template, used to show in the popup
/// output_folder_id: id of the drive folder to write output to
/// template_id: id of the document to use as a template
/// title_formatter: a callback of (row) -> string, for the title of the document
/// use_full_name: whether to use the full name of a member
function _generateMain(
  template_type,
  output_folder_id,
  template_id,
  title_formatter,
  use_full_name = false
) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Roles");

  const memberMap = getMemberMap();
  const fieldsAlwaysFull = [
    "CLUB_PRESIDENT",
    "VP_EDUCATION",
    "VP_MEMBERSHIP",
    "VP_PUBLIC_RELATIONS",
    "CLUB_SECRETARY",
    "CLUB_TREASURER",
    "CLUB_SERGEANT_AT_ARMS",
    "MENTORSHIP_CHAIR",
  ];

  // generate from the date in the current Toastmaster details sheet
  let date = new ToastmasterDetails().date;
  let data = fetchSpreadsheetData(sheet)
    .filter((row) => row.DATE.getTime() == date.getTime())
    // pre-format dates and include some things
    .map((row) => ({
      ...row,
      // derived fields, for convenience
      DATE_LOCAL: localDate(row.DATE),
      DATE_ISO: isoDate(row.DATE),
      NEXT_DATE_LOCAL: localDate(addWeek(row.DATE)),
      NEXT_DATE_ISO: isoDate(addWeek(row.DATE)),
    }))
    .map((row) =>
      // For each object, check if it's a name. If it is, then map it to the
      // members.
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (!(value in memberMap.members)) {
            return [key, value];
          }
          if (use_full_name || fieldsAlwaysFull.includes(key)) {
            return [key, memberMap.members[value].fullName];
          } else {
            return [key, value];
          }
        })
      )
    );

  Logger.log(JSON.stringify(data[0], " ", 2));
  fillTemplate(data, output_folder_id, template_id, title_formatter);
  ss.toast(
    `${template_type} have been compiled!\nWrote:\n\t` +
      data.map(title_formatter).join("\n\t")
  );
}

// Convert spreadsheet data from a sheet object (csv) into an array of objects in
// reverse chronological order
function fetchSpreadsheetData(sheet) {
  let values = sheet
    .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();

  let header = values[0].filter((cell) => cell != "").map(normalizeName);
  let entries = values
    .slice(1)
    .map((row) =>
      // map each column to it's corresponding header and create an object
      Object.fromEntries(
        row
          .slice(0, header.length)
          .map((col, i) => [header[i], col ? col : null])
      )
    )
    // return in reverse chronological order
    .reverse();

  Logger.log(header);
  Logger.log(`number of entries: ${entries.length}`);
  return entries;
}

// The iterator doesn't actually implement a javascript iterator interface; instead
// read everything into an array. Don't use this to read the entire drive...
function intoArray(gsIterator) {
  let result = [];
  while (gsIterator.hasNext()) {
    result.push(gsIterator.next());
  }
  return result;
}

function fillTemplate(
  data,
  output_folder_id,
  template_id,
  title_formatter = () => {
    throw Error("must implement title formatter callback");
  }
) {
  let folder = DriveApp.getFolderById(output_folder_id);

  for (row of data) {
    let name = title_formatter(row);
    Logger.log(`creating document for ${name}`);
    // trash the old document with the same name
    for (let file of intoArray(folder.getFilesByName(name))) {
      Logger.log(`trashing existing file`);
      file.setTrashed(true);
    }

    let docId = DriveApp.getFileById(template_id)
      .makeCopy(name, folder)
      .getId();
    let doc = DocumentApp.openById(docId);
    let body = doc.getActiveSection();

    // replace template variables inside of the document, only for keys that are
    // non-null
    Object.entries(row)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        body.replaceText(`{{${key}}}`, value);
      });

    doc.saveAndClose();
  }
}
