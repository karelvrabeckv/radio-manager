export default class RMIntroduction
{
    constructor( url )
    {
        this._url = url;
    } // CONSTRUCTOR
    
    // ========================================
    
    get url()
    {
        return this._url;
    } // GET URL
    
    set url( url )
    {
        this._url = url;
    } // SET URL
} // RM INTRODUCTION