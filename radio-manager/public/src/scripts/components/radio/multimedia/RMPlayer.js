import React, { Component } from "react"
import { unsort } from "array-unsort"

import RMListFactory from "../../../list/RMListFactory"

/**
 * Represent a player of the radio station.
 * @extends Component
 */
export default class RMPlayer extends Component
{
  constructor( props )
  {
    super( props )

    this._playlist = RMListFactory.createList( "plain", "playlistItem", props.playlistData )
    this._warnings = RMListFactory.createList( "plain", "warning", props.warningData )
    this._posts = RMListFactory.createList( "shuffle", "post", props.postData )
    
    this._player = React.createRef()
    this._loop = this.loop()

    this._numOfPlayedMusicians = 0
  } // CONSTRUCTOR

  /**
   * Check whether it is the time to show the warning.
   * @param {object} warning � The current warning.
   */
  checkWarning( warning )
  {
    if ( this._numOfPlayedMusicians >= warning.first )
    {
      if ( ( ( this._numOfPlayedMusicians - warning.first ) % warning.step ) == 0 )
      {
        return true
      } // if
    } // if

    return false
  } // CHECK WARNING

  /**
   * Set a post to the radio station. The post
   * can be either about the musician or from
   * the website.
   * @param {string} post � The specific post to be shown.
   */
  setPost( post )
  {
    // There must be some post
    if ( post )
    {
      this.props.setLogoVisibility( false )

      this.props.setPostContent( post )
      this.props.setPostButtons( false )
      this.props.setPostVisibility( true )
    } // if
  } // SET POST

  /**
   * Set images to the radio station. Images
   * can be either about the musician or from
   * the website.
   * @param {object[]} images � The specific images to be shown.
   */
  setImages( images )
  {
    // There must be some images
    if ( images.length )
    {
      this.props.setLogoVisibility( false )

      this.props.setPostButtons( true )
      this.props.setPostVisibility( false )
          
      this.props.setImgData( unsort( images ) /* Shuffled images */ )
      this.props.setImgVisibility( true )
    } // if
  } // SET IMAGES

  /**
   * Generator function as a logic of the radio station.
   */
  * loop()
  {
    let canStartPlaylist = false

    // The playlist must have at least one playlist item
    if ( this._playlist.hasData() )
    {
      // At least one playlist item must have musicians
      for ( let playlistItem of this._playlist.data )
      {
        if ( playlistItem.genre.musicians.hasData() )
        {
          canStartPlaylist = true
        } // if
      } // for
    } // if

    if ( !canStartPlaylist )
    {
      return
    } // if

    // Loop through the playlist
    while ( true )
    {
      // Get a playlist item
      let playlistItem = this._playlist.nextElement()

      // Loop through the musicians
      for ( let i = 0; i < playlistItem.numOfMusicians; i++ )
      {
        // Reset the musician
        this.props.setRecordData( "", "", "", "" )
        
        this.props.setLogoVisibility( true )

        this.props.setPostContent( "" )
        this.props.setPostButtons( false )
        this.props.setPostVisibility( false )

        this.props.setImgData( [] )
        this.props.setImgVisibility( false )

        // Select the musician
        let musician = playlistItem.genre.musicians.nextElement()

        // There must be a musician
        if ( !musician )
        {
          continue
        } // if

        // Check warnings
        for ( let warning of this._warnings.data )
        {
          if ( this.checkWarning( warning ) )
          {
            this.props.setRadioPlay( false )
            this.props.setRadioSkip( false )
            this.props.setWarningData( warning.title, warning.message, warning.link )
            this.props.setWarningVisibility( true )
        
            yield
          } // if
        } // for

        // Play an introduction by the musician
        if ( musician.hasIntroductions() )
        {
          let introduction = musician.introductions.nextElement()
          
          this.props.setRadioSkip( false )
          this.props.setRecordData( "", "", introduction.src, introduction.type )
          this.props.setRadioPlay( true )
          
          yield
        } // if

        // Loop through the records
        for ( let j = 0; j < playlistItem.numOfRecordsPerMusician; j++ )
        {
          // Show a post
          if ( playlistItem.showWebsitePosts )
          {
            // Posts from the website must be shown
            let post = this._posts.nextElement()

            // There must be the post
            if ( post )
            {
              this.setPost( post.content )
              this.setImages( post.image )
            } // if
          } // if
          else
          {
            // Post about the musician must be shown
            this.setPost( musician.description )
            this.setImages( musician.images.data )
          } // else

          // Play a record by the musician
          if ( musician.hasRecords() )
          {
            let record = musician.records.nextElement()

            if ( record.type == "video" )
            {
              this.props.setLogoVisibility( false )
              this.props.setPostVisibility( false )
              this.props.setImgVisibility( false )
            } // if

            this.props.setRadioSkip( false )
            this.props.setRecordData( musician.name, record.title, record.src, record.type )
            this.props.setRadioPlay( true )
            
            yield
          } // if
        } // for

        // Increment the number of played musicians
        this._numOfPlayedMusicians++
      } // for
    } // while
  } // LOOP

  /**
   * Called after the component is updated in the DOM
   */
  componentDidUpdate()
  {
    // Play the record
    if ( this._player.current && this.props.radioPlay && this.props.radioOn )
    {
      this._player.current.play()
    } // if

    // Pause the record
    if ( this._player.current && !this.props.radioPlay && this.props.radioOn )
    {
      this._player.current.pause()
    } // if

    // Skip the record
    if ( this.props.radioSkip )
    {
      this._loop.next()
    } // if
  } // COMPONENT DID UPDATE

  /**
   * Output the HTML to the DOM.
   */
  render()
  {
    if ( this.props.recordData.type == "video" )
    {
      // Show the video player
      return (
        <video
          src={ this.props.recordData.src }
          onEnded={ () => { this._loop.next() } }
          ref={ this._player }
        />
      )
    } // if

    if ( this.props.recordData.type == "audio" )
    {
      // Show the audio player
      return (
        <audio
          src={ this.props.recordData.src }
          onEnded={ () => { this._loop.next() } }
          ref={ this._player }
        />
      )
    } // if
    
    return null
  } // RENDER
} // RM PLAYER