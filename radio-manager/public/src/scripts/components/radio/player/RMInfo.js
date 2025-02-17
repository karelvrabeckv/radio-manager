import React, { Component } from "react"

/**
 * Represent an information in 
 * the visual player.
 * @extends Component
 */
export default class RMInfo extends Component
{
  render()
  {
    // There is an information to be shown
    if ( this.props.info )
    {
      return (
        <div className="rm-info">
          <div>
            <span>{ this.props.caption }</span>
            <span className="rm-info-content">{ this.props.info }</span>
          </div>
        </div>
      )
    } // if
    
    // There is no information
    return <div className="rm-no-info"></div>
  } // RENDER
} // RM INFO
