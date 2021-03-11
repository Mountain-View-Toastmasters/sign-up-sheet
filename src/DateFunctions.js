/**
 * A collection of common scripts for handling dates
 */
// TODO(bshaibu): Better namespace variables & add more comments

function prettyFormatDate(date) {
  return Utilities.formatDate(date, "GMT-7", "MM/dd/yy").toString();
}
