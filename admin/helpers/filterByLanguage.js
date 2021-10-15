/**
 *
 * @param {array} entries Objects with language field matching Language schema
 * @param {string} languageCode
 */
module.exports = (entries, languageCode) => {
  // console.log({ entries });
  /**
   * Filter logic:
   * - First, check for matching language
   * - If none, get the english language
   * - If none, get the first entry
   */

  return (
    Array.isArray(entries)
    ? entries.find(entry => (
        entry.language && languageCode
        ? entry.language.code === languageCode
        : entry.language.code === 'en'
      )) || entries[0]
    : null
  )
}
