/**
 * A collection of utility functions
 */
// TODO(bshaibu): Better namespace variables & add more comments

function prettyFormatDate(date) {
  return Utilities.formatDate(date, "GMT-7", "MM/dd/yy").toString();
}

// April 12, 2021
function localDate(date) {
  return Utilities.formatDate(
    new Date(date),
    "GMT-7",
    "MMMM dd, yyyy"
  ).toString();
}

// 2021-04-12
function isoDate(date) {
  return Utilities.formatDate(new Date(date), "GMT-7", "yyyy-MM-dd").toString();
}

function addWeek(date) {
  var nextDate = new Date(date);
  return nextDate.setDate(date.getDate() + 7);
}

// Prepare names for use in templates
// "Hello World" -> "HELLO_WORLD"
function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, " ")
    .trim()
    .split(/\s+/)
    .join("_");
}

/// Slice a list based on the location of two entries in the list inclusive.
/// Throws an exception if the resulting slice is empty. Assumes all entries are
/// unique.
function sliceRowsBetweenValues(arr, first, last) {
  let sliced = arr.slice(arr.indexOf(first), arr.indexOf(last) + 1);
  if (sliced.length == 0) {
    throw "sliced list is empty";
  }
  return sliced;
}
