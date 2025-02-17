/**
 * Represent a parent class for images,
 * recordings and introductions.
 */
export default class RMMultimedia
{
  /**
   * Create a base for all the multimedia.
   * @param {string} title - The main title.
   * @param {string} description - More descriptive text.
   * @param {string} src - The URL address.
   */
  constructor( title, description, src )
  {
    this._title = title
    this._description = description
    this._src = src
  } // CONSTRUCTOR

  /**
   * Get the title value.
   * @return {string} The title value.
   */
  get title()
  {
    return this._title
  } // GET TITLE

  /**
   * Get the description value.
   * @return {string} The description value.
   */
  get description()
  {
    return this._description
  } // GET DESCRIPTION

  /**
   * Get the src value.
   * @return {string} The src value.
   */
  get src()
  {
    return this._src
  } // GET SRC
} // RM MULTIMEDIA
