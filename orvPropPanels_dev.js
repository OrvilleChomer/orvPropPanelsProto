/**********************************************************************************
    orvPropPanels.js

    VERSIONS:      DESCRIPTION:
    =========      ============
      1.012        Bug fixes, error handling, oncommit functionality
      1.010        Bug fixes, edit CSS values with Units of Measure
      1.000        Initial Version

    Key Code Reference Tags:
         -  #library_constructor                 🔨🔨 [LIBRARY] CONSTRUCTOR 🔨🔨
         -  #component_level_instance_var_def
         -  #component_level_constants           Component level constants are defined.
         -  #props_add_prop_method
         -  #props_clear_method
         -  #set_main_props_method
         -  #props_add_event_listener            {Custom} [Property Panel] Level EVENT HANDLER!
         -  #run_change_event_handlers
         -  #props_clean_up
         -  #props_add_prop_method               📌ADD PROPERTY METHOD!

    HTML Markup          
         -  #props_display_panel_method          Build <HTML> Markup and display panel in 
                                                 Browser. 🖍🖍🖍
        
         -  #private_functions                   ⭐⭐⭐⭐⭐⭐ PRIVATE FUNCTIONS BEGIN ⭐⭐⭐⭐⭐⭐⭐

    CSS...
         -  #build_prop_style_block              🖼🖼 CSS Styles 🖼🖼

         -  #build_Props_Style_Unselectable
         -  #create_prop_constructor             🔨🔨 [PROPERTY] OBJECT CONSTRUCTOR 🔨🔨
         -  #property_obj_custom_prop_def        CUSTOM PROPERTIES (property obj)
         -  #data_idx
         -  #prop_id
         -  #prop_setup_color_change             set up event listener for value change of 'color' input tag
         -  #color_changed

         -  #prop_add_event_listener_method      {PROPERTY} Level Custom event listener for devs to use
         -  #run_prop_level_change_event_handlers

         -  #prop_hide_uom_dropdown_method       CSS UOM 📏
         -  #prop_hide_uom_dropdown__            CSS UOM 📏
         -  #prop_show_uom_dropdown_method       CSS UOM 📏
         -  #pick_uom                            CSS UOM 📏

         -  #prop_sel_prop_method                SELECT PROPERTY
         -  #prop_de_sel_prop_method             DE-SELECT PROPERTY

         -  #prop_hide_dropdown_method           Hides dropdown (if it is being shown)

         -  #drop_down_toggle                    Builds/Shows/ and Hides selection dropdown list! 🔨👀❌
         -  #dropdown_scroll
         -  #get_hex_color_value
         -  #key_nav_dropdown                    👉Manage navigation keystrokes on dropdown 👈
         -  #highlight_dropdown_option
         -  #proc_prop_option_selected           User selected option in selection dropdown list
         -  #prop_commit_changes_method
         -  #prop_begin_edit_method
         -  #split_value_and_uom
         -  #keystroke_is_non_data_value         Returns (true) if keystroke input is a non-data value
         -  #text_box_handle_keydown
         -  #text_box_handle_keyup
         -  #prop_toggle_prop_value              Toggle Property value on Double Click!
         -  #get_option_set_caption

    HTML Markup
         -  #prop_markup_method                  Generate HTML markup for [Property] on panel   🖍🖍🖍
         -  #get_color_value_markup
         -  #sel_first_prop

         -  #prop_container_event_listeners      👂CONTAINER EVENT LISTENERS👂
         -  #panel_focus
         -  #panel_blur
         -  #key_down_nav                        Handle navigating panel and items in dropdown using the keyboard!
         -  #props_click
         -  #props_dbl_click

         -  #get_val                             GET VAL function!
         -




 
 **********************************************************************************/



/*************************************************************************
 *  Constructor for Library
 *  #library_constructor
 *************************************************************************/ 
function OrvProps(siContainerId) {

   /**
    * Debugging variables
    */
    let sBreakOnPropertyName = "borderColor"; // need browser development window to be visible to use


    const orvCore_comp = new OrvCore({componentName:"propPanel"})

    try {

            /*************************************************************************
            *  
            *  #component_level_instance_var_def
            * 
            *************************************************************************/     

            const sContainerId = siContainerId;
            const containerNd = document.getElementById(sContainerId)
            const props = this;
            let propsByIndex = [];
            let propsByPropName = [];
            let mainPropsObj;
            let nLastSelectedPropIndex = -1; 
            let nCurrentDropdownSelIndex = -1;
            let nStartingDropdownSelIndex = -1;

            let lastSelectedPropObj;

            let swatchIdListByIndex = [];
            let changeEventHandlers = [];
            let selectEventHandlers = [];

            let propDataByPropName = []

            let bEditingPanelValue = false;  // panel-level flag
            let bShowingCssUomPopup = false;

            /*************************************************************************
            *  
            *  #component_level_constants
            * 
            *************************************************************************/ 
            const ESC_KEY = 27;
            const ENTER_KEY = 13;
            const BACKSPACE_KEY = 8;
            const LEFTARROW_KEY = 37;
            const UPARROW_KEY = 38;
            const RIGHTARROW_KEY = 39;
            const DOWNARROW_KEY = 40;
            const HOME_KEY = 36;
            const END_KEY = 35;
            const INSERT_KEY = 45;
            const TAB_KEY = 9;
            const SHIFT_KEY = 16;
            const CTRL_KEY = 17;
            const CMD_KEY = 93;
            

            // ** makes it so overall property panel can receive keyboard inputs...
            containerNd.setAttribute("tabindex", "-1");
            containerNd.style.outlineStyle = "none";

            /********************************************************************************
            * 
            *   #props_clear_method
            ********************************************************************************/ 
            props.clear = function() {
                propsByIndex = [];
                propsByPropName = [];
                nLastSelectedPropIndex = -1
            } // end of props.clear() method




            /********************************************************************************
             * 
             *   #set_main_props_method
             ********************************************************************************/ 
            props.setMainPropsObj = function(newMainPropsObj) {
                    mainPropsObj = newMainPropsObj;
            } // end of props.clear() method





            /********************************************************************************
             * 
             *   #props_add_event_listener
             * 
             *   allow dev to add event listeners at the property panel level
             ********************************************************************************/    
            props.addEventListener = function(sEvent, functToRun) {
                try {
                    const eventInfoObj = {};
                    eventInfoObj.event = sEvent;
                    eventInfoObj.functToRun = functToRun;
        
                    // event to fire when property value changes:       
                    if (sEvent === "change" && typeof functToRun === "function") {
                            changeEventHandlers.push(eventInfoObj)
                    } // end if

                    // event to fire when property is selected by user
                    if (sEvent === "select" && typeof functToRun === "function") {
                        selectEventHandlers.push(eventInfoObj)
                    } // end if

                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch
                
            } // end of props.addEventListener() method




            /********************************************************************************
             * 
             *   #run_change_event_handlers
             ********************************************************************************/     
            function runChangeEventHandlers(propertyObj,vOldValue,vNewValue, sOperation) {
                try {
                    const nMax = changeEventHandlers.length;

                    for (let n=0; n< nMax; n++) {           
                        eventInfoObj = changeEventHandlers[n]
                        const funcToRun = eventInfoObj.functToRun;
                        customEventObj = {};
                        customEventObj.event = "change"
                        customEventObj.level = "panel"
                        customEventObj.operation = sOperation
                        customEventObj.timestamp = new Date();
                        customEventObj.propertyObj = propertyObj; // the Property object
                        customEventObj.propertyName = propertyObj.propName;
                        customEventObj.refObj = propertyObj.propsObj; // object that the property belongs to
                        customEventObj.refObjType = propertyObj.propsObj.objType;
                        customEventObj.oldValue = vOldValue;
                        customEventObj.newValue = vNewValue;
                        funcToRun(customEventObj);
                    } // next n
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch            

            } // end of function runChangeEventHandlers()


           /********************************************************************************
             * 
             *   #run_sel_event_handlers
             ********************************************************************************/     
            function runSelEventHandlers(prevPropObj, propertyObj,sOperation) {
                try {
                    const nMax = selectEventHandlers.length;

                    for (let n=0; n< nMax; n++) {           
                        eventInfoObj = selectEventHandlers[n]
                        const funcToRun = eventInfoObj.functToRun;
                        customEventObj = {};
                        customEventObj.event = "select"
                        customEventObj.level = "panel"
                        customEventObj.operation = sOperation
                        customEventObj.timestamp = new Date();
                        let sPrevPropName = "";

                        if (typeof prevPropObj !== "undefined") {
                            sPrevPropName = prevPropObj.propName
                        } // end if

                        customEventObj.prevPropName = sPrevPropName
                        customEventObj.prevPropObj = prevPropObj
                        customEventObj.selPropertyObj = propertyObj;// the Property object
                        customEventObj.selPropertyName = propertyObj.propName;
                        customEventObj.refObj = propertyObj.propsObj;// object that the property belongs to
                        customEventObj.refObjType = propertyObj.propsObj.objType;
                        
                        funcToRun(customEventObj);
                    } // next n
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch            

            } // end of function runSelEventHandlers()



            /********************************************************************************
             * 
             *   #props_clean_up
             * 
             *   Call this Before removing a property panel from the page...
             *   (If you are not just leaving the page)
             * 
             *   This includes removing any event listeners that need removing from memory.
             ********************************************************************************/ 
            props.cleanUp = function() {
                try {
                    console.log("props.cleanUp() method called")
                    containerNd.removeEventListener("click", propsClick);
                    containerNd.removeEventListener("dblclick", propsDblClick);
                    containerNd.removeEventListener("keydown", keyDownNav);
                    containerNd.removeEventListener("focus", panelFocus);
                    containerNd.removeEventListener("blur", panelBlur);
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch            
                
            } // end of props.cleanUp() method




            /********************************************************************************
            * 
            *   #props_add_prop_method
            ********************************************************************************/ 
            props.addProp = function(params) {
                try {
                    //console.log("props.addProp() method called")
                    params.indexNum = propsByIndex.length;
                    params.props = props
                    const prop = new CreateProp(params);
                    propsByIndex.push(prop);
                    propsByPropName[prop.propName] = prop;
                    return prop;
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch                
                
            } // end of props.addProp() method




            /********************************************************************************
            * 
            *   #props_display_panel_method
            ********************************************************************************/ 
            props.displayPanel = function() {
                const s=[];

                swatchIdListByIndex = [];

                try {
                    // was there a left-over dropdown from before? hide it
                    let orvPropDropdown = document.getElementsByClassName("orvPropDropdownList")[0]
                    if (typeof orvPropDropdown !== "undefined" && orvPropDropdown !== null) {
                        orvPropDropdown.style.display = "none"
                    } // end if

                    s.push("<div class='orvPropsTitlebar'>")
                    s.push("<div class='orvPropsTitlebarCaption'>")
                    s.push("Properties</div></div>")

                    s.push("<div id='orvPropsListCntr'>");

                    const nMax = propsByIndex.length;

                    s.push("<ul class='orvPropsList'>");
                    for (let n=0;n<nMax;n++) {
                        const prop = propsByIndex[n]
                        s.push(prop.markup(n))
                    } // next n

                    s.push("</ul>"); // orvPropsList

                    s.push("</div>"); // orvPropsListCntr

                    s.push("<div class='orvPropDescPanel'>")
                    s.push("<div class='orvPropDescPanelInset'>")

                    s.push("<div id='orvPropDescPanelTitle'></div>")
                    s.push("<div id='orvPropDescPanelDetails'></div>")


                    s.push("</div>"); // orvPropDescPanelInset
                    s.push("</div>"); // orvPropDescPanel

                    containerNd.innerHTML = orvCore.safeMarkup(s.join(""));

                    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    // do AFTER adding markup to DOM...
                    propDataByPropName = []; // clear out any previous values
                   // debugger
                    for (let n=0;n<nMax;n++) {
                        const prop = propsByIndex[n]
                        let propNameInfo = propDataByPropName[prop.propName]
                        if (typeof propNameInfo === "undefined") {
                            propNameInfo = {}
                            propNameInfo.propName = prop.propName
                            propNameInfo.propsUsingThisNameByIndex = []
                            propDataByPropName[prop.propName] = propNameInfo                                                   
                        } // end if

                        const propNameDiv = document.getElementById("ppane_"+(n)+"_orvPropName")
                        const propValueDiv = document.getElementById("ppane_"+(n)+"_orvPropValue")     
                        prop.propNameDiv = propNameDiv
                        prop.propValueDiv = propValueDiv
                        propNameInfo.propsUsingThisNameByIndex.push(prop)

                    } // next n
                    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                    const nMax2 = swatchIdListByIndex.length;
                    if (nMax2>0) {
                        for (let n=0;n<nMax2;n++) {
                            const prop = swatchIdListByIndex[n]
                            prop.setupColorChange();
                        } // next n

                    } // end if

                    // Make the first property in panel [Selected] automatically:
                    selFirstProp();
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch

                

            } // end of props.displayPanel() method
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


            /**
             * 
             * 
             */
            props.getPropObjByPropName = function(sPropName) {
                return propsByPropName[sPropName];
            } // end of props.getPropObjByPropName() method
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



            const STYLE_BLOCK_ID = "orvPropStyles";
            let styleBlockNd = document.getElementById(STYLE_BLOCK_ID);

            if (styleBlockNd === null) {
                buildPropStyleBlock();
            } // end if


            // ######### PRIVATE FUNCTIONS BELOW: ######################
            // #private_functions

            /********************************************************************************
            * 
            *   #build_prop_style_block
            ********************************************************************************/        
            function buildPropStyleBlock() {
                const s = [];

                try {
                    styleBlockNd = document.createElement("style");
                    styleBlockNd.id = STYLE_BLOCK_ID;
                    
    
                    // assume below is for a panel that does not have focus...
                    s.push(".orvPropsTitlebar {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:absolute;");
                    s.push("  background: #E6EAED;");
                    s.push("  border-bottom:solid silver .5px;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  top:0px;");
                    s.push("  height:18px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
    
                    // title bar for panel with focus...
                    s.push(".orvPropsTitlebarFocus {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:absolute;");
                    s.push("  background: #DFE1E5;");
                    s.push("  border-bottom:solid silver .5px;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  top:0px;");
                    s.push("  height:18px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
    
                    s.push(".orvPropsTitlebarCaption {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:absolute;");
                    s.push("  top:1px;");
                    s.push("  margin:0px;");
                    s.push("  padding:0px;");
                    s.push("  left:5px;");
                    s.push("  right:5px;");   
                    s.push("  text-align:center;");        
                    s.push("  color: #616161;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 18px;");
                    s.push("}");
    
                    s.push("#orvPropsListCntr {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow-x:hidden;");
                    s.push("  overflow-y:auto;");
                    s.push("  position:absolute;");
                    s.push("  margin:0px;");
                    s.push("  padding:0px;");
                    s.push("  top:18px;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  bottom:143px;");
                    s.push("  background:white;");
                    s.push("  box-shadow: -5px 5px 3px #888888;");
                    s.push("}");
    
                    s.push(".orvPropsList {");
                    s.push("  list-style-type: none;");
                    s.push("  margin:0px;");
                    s.push("  padding:0px;");
                    s.push("}");
    
                    //orvPropLi
                    s.push(".orvPropLi {");
                    s.push("  margin:0px;");
                    s.push("  padding:0px;");
                    s.push("  cursor:default;");
                    s.push("}");
    
    
                    s.push(".orvProp {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:relative;");
                    s.push("  top:0px;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  height:18px;");
                    s.push("  border-bottom:solid silver .5px;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 18px;");
                    s.push("  background: white;");
                    s.push("  color: #616161;");
                    s.push("}");
    
                    //orvPropLiSectionSpacer
                    s.push(".orvPropLiSectionSpacer {");
                    s.push("  margin:0px;");
                    s.push("  padding:0px;");
                    s.push("  cursor:default;");
                    s.push("  overflow:hidden;");
                    s.push("  background: #E6EAED;");
                    s.push("  height:20px;");
                    s.push("  width:100%;");
                    s.push("}");
    
                    s.push(".orvPropSection {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:relative;");
                    s.push("  top:0px;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  height:16px;");
                    s.push("  border-bottom:solid silver .5px;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 11px;");
                    s.push("  font-weight:bold;");
                    s.push("  text-height: 16px;");
                    s.push("  background: #616161;");
                    s.push("  color: white;");
                    s.push("}");
    
                    s.push(".orvPropSubSection {");
                    s.push("  box-sizing: border-box;");
                    s.push("  overflow:hidden;");
                    s.push("  position:relative;");
                    s.push("  top:0px;");
                    s.push("  left:18px;");
                    s.push("  padding-left:0px;");
                    s.push("  margin-left:0px;");
                    s.push("  right:0px;");
                    s.push("  height:16px;");
                    s.push("  border-bottom:solid silver .5px;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 11px;");
                    s.push("  font-weight:bold;");
                    s.push("  text-height: 16px;");
                    s.push("  background: #5572a5;");
                    s.push("  color: white;");
                    s.push("  pointer-events: none; ");
                    s.push("}");

    
                    s.push(".orvPropDropdownButton {");
                    s.push("  box-sizing: border-box;");
                    s.push("  padding:0px;");
                    s.push("  margin:0px;");
                    s.push("  height:19px;");
                    s.push("  width:19px;");
                    s.push("  position:absolute;");
                    s.push("  top:-1px;");
                    s.push("  right:3px;");
                    s.push("  z-index:10;");
                    s.push("  background: #E5E5E5;");
                    s.push("  border:solid silver .5px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");

                    s.push(".orvPropElipsesBtn {");
                    s.push("  box-sizing: border-box;");
                    s.push("  padding:0px;");
                    s.push("  margin:0px;");
                    s.push("  height:19px;");
                    s.push("  width:19px;");
                    s.push("  position:absolute;");
                    s.push("  top:-1px;");
                    s.push("  right:3px;");
                    s.push("  z-index:10;");
                   // s.push("  background: #E5E5E5;");
                    s.push("  overflow:hidden;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    //orvPropDropdownList
                    s.push(".orvPropDropdownList {");
                    s.push("  box-sizing: border-box;");
                    s.push("  position:absolute;");
                    s.push("  overflow-x:hidden;");
                    s.push("  overflow-y:auto;");
                    s.push("  margin:0px;");
                    s.push("  z-index:200;");
                    s.push("  background: white;");
                    s.push("  border:solid gray .5px;");
                    s.push("  width:51%;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropDropdownListItm {");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 18px;");
                    s.push("  color: #616161;");
                    s.push("  cursor:default;");
                    s.push("  box-sizing: border-box;");
                    s.push("}");
    
                    s.push(".orvPropDropdownListHdr {");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 10px;");
                    s.push("  padding-left: 3px;");
                    s.push("  text-height: 12px;");
                    s.push("  height: 12px;");
                    s.push("  background:#abb1d4;");
                    s.push("  color: white;");
                    s.push("  text-shadow: -1px 1px #454f87;");        
                    s.push("}");
    
                    s.push(".orvPropDropdownListItmSel {");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 18px;");
                    s.push("  margin-bottom: 0px;");
                    s.push("  background-color:#E4E6F1;");
                    s.push("  cursor:default;");
                    s.push("  box-sizing: border-box;");
                    s.push("}");
    
                    s.push(".orvPropDropdownListItmSpacer {");
                    s.push("  height: 10px;");
                    s.push("}");
    
                    s.push(".orvColorOptContnr {");
                    s.push("  position:relative;");
                    s.push("  left: 0px;");
                    s.push("  right: 0px;");
                    s.push("  top: 0px;");
                    s.push("  height: 18px;");
                    s.push("  padding: 0px;");
                    s.push("  overflow:hidden;");
                    s.push("}");
    
                    s.push(".orvColorOptSwatch {");
                    s.push("  position:absolute;");
                    s.push("  left: 4px;");
                    s.push("  top: 3px;");
                    s.push("  width: 11px;");
                    s.push("  height: 11px;");
                    s.push("  border:solid silver .5px;");
                    s.push("  border-radius:3px;");
                    s.push("}");        
    
                    s.push(".orvColorOptCaption {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");        
                    s.push("  left: 20px;");
                    s.push("  top: 0px;");
                    s.push("  right: 0px;");
                    s.push("  height: 18px;");
                    s.push("  color: #990000;");
                    s.push("  overflow:hidden;");
                    s.push("}");
    
                    s.push(".orvPropName {");
                    s.push("  padding-left:18px;"); // 2px
                    s.push("  width:45%;"); //49%
                    s.push("  border-right:solid silver .5px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropNameSection {");
                    s.push("  padding-left:10px;"); // 2px
                    s.push("  width:100%;"); //
                    s.push("  border-right:solid silver .5px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropNameSel {");
                    s.push("  margin:0px;");
                    s.push("  padding-left:18px;"); // 2px
                    s.push("  width:45%;"); //49%
                    s.push("  background:#E4E6F1;");
                    s.push("  border-right:solid silver .5px;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropValue {");
                    s.push("  position:absolute;");
                    s.push("  top:0px;");
                    s.push("  left:50%;");
                    s.push("  padding-left:3px;");
                    s.push("  right:0px;");
                    s.push("}");
    
                    s.push(".orvPropValueTextBox {");
                    s.push("  box-sizing: border-box;");
                    s.push("  position:absolute;");
                    s.push("  top:0px;");
                    s.push("  left:0px;");
                    s.push("  bottom:0px;");
                    s.push("  right:20px;");
                    s.push("  border-style:none;");
                    s.push("  border-width:0px;");
                    s.push("  outline: none;");        
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  height:18px;");
                    s.push("  text-height: 18px;");
                //  s.push("  background-color: lightblue;"); // *** remove when done debugging
                    s.push("  color: #616161;");
                    s.push("}");      
                    
                    s.push(".orvPropUom {");
                    s.push("  box-sizing: border-box;");
                    s.push("  position:absolute;");
                    s.push("  top:0px;");
                    s.push("  width:20px;");
                    s.push("  bottom:0px;");
                    s.push("  right:0px;");
                    s.push("  border-style:none;");
                    s.push("  border-width:0px;");
                    s.push("  outline: none;");        
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  height:18px;");
                    s.push("  text-height: 18px;");
                    s.push("  text-align: center;");
                    s.push("  cursor: pointer;");
                    //s.push("  background-color: lightyellow;"); // *** remove when done debugging
                    s.push("  color: #616161;");
                    s.push("}");     
    
    
    
                    s.push(".orvPropSwatch {");
                    s.push("  position:absolute;");
                    s.push("  top:1px;");
                    s.push("  left:2px;");
                    s.push("  width:12px;");
                    s.push("  height:12px;");
                    s.push("  border:solid silver .5px;");
                    s.push("  border-radius:3px;");
                    s.push("}");
    
                    s.push(".orvPropInpSwatchFrame1 {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  top:.5px;");
                    s.push("  left:4px;");
                    s.push("  width:4px;");
                    s.push("  height:17px;");
                    s.push("  border-left:solid gray 1.5px;");
                    s.push("  border-top-left-radius:3px;");
                    s.push("  border-bottom-left-radius:3px;");
                    s.push("  z-index:3;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropInpSwatchFrame2 {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  top:.5px;");
                    s.push("  left:4px;");
                    s.push("  width:21px;");
                    s.push("  height:4px;");
                    s.push("  border-top:solid gray 1.5px;");
                    s.push("  border-top-left-radius:3px;");
                    s.push("  border-top-right-radius:3px;");
                    s.push("  z-index:3;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropInpSwatchFrame3 {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  top:14px;");
                    s.push("  left:4px;");
                    s.push("  width:21px;");
                    s.push("  height:4px;");
                    s.push("  border-bottom:solid gray 1.5px;");
                    s.push("  border-bottom-left-radius:3px;");
                    s.push("  border-bottom-right-radius:3px;");
                    s.push("  z-index:3;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
    
                    s.push(".orvPropInpSwatchFrame4 {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  top:.5px;");
                    s.push("  left:22px;");
                    s.push("  width:4px;");
                    s.push("  height:17px;");
                    s.push("  border-right:solid gray 1.5px;");
                    s.push("  border-top-right-radius:3px;");
                    s.push("  border-bottom-right-radius:3px;");
                    s.push("  z-index:3;");
                    s.push(buildPropsStyleUnselectable());
                    s.push("}");
                    
    
                    s.push(".orvPropInpSwatch {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  padding:0px;");
                    s.push("  margin:0px;");
                    s.push("  border:none;");
                    s.push("  top:-3px;");
                    s.push("  left:2px;");
                    s.push("  height:25px;");
                    s.push("  width:25px;");
                    s.push("  overflow:hidden;");
                    s.push("  cursor:pointer;");
                //  s.push("  background-color: yellow;"); // temp
                    s.push("  z-index:2;");
                    s.push("}");
    
                    s.push(".orvPropColorCode {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  padding: 0px;");
                    s.push("  margin: 0px;");
                    s.push("  top:0px;");
                    s.push("  left:20px;");
                    s.push("  right:2px;");
                    s.push("  height:18px;");
                    s.push("  text-height: 18px;");
                    s.push("  color: #990000;");
                    s.push("}");
    
                    s.push(".orvPropColorCode2 {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  padding: 0px;");
                    s.push("  margin: 0px;");
                    s.push("  top:0px;");
                    s.push("  left:30px;");
                    s.push("  right:2px;");
                    s.push("  height:18px;");
                    s.push("  text-height: 18px;");
                    s.push("  color: #990000;");
                    s.push("}");
    
                    s.push(".orvPropDescPanel {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  left:0px;");
                    s.push("  right:0px;");
                    s.push("  bottom:0px;");
                    s.push("  height:143px;");
                    s.push("  padding:0px;");
                    s.push("  background:#e5e5e5;");
                    s.push("  border-top:solid silver .5px;");
                    s.push("}");
    
                    s.push(".orvPropDescPanelInset {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  margin:0px;");
                    s.push("  left:4px;");
                    s.push("  right:4px;");
                    s.push("  bottom:4px;");
                    s.push("  top:4px;");
                    s.push("  bottom:4px;");
                    s.push("  border:solid silver .5px;");
                    s.push("}");
    
                    s.push("#orvPropDescPanelTitle {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  left:2px;");
                    s.push("  right:2px;");
                    s.push("  top:2px;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 18px;");
                    s.push("  height: 18px;");
                    s.push("  color:black;");
                    s.push("  overflow:hidden;");
                    s.push("  text-overflow: ellipsis;");
                    s.push("}");
    
                    s.push(".readOnlyNote {");
                    s.push("  font-size: 9pt;");
                    s.push("  color: #990000;");
                    s.push("  background: lightyellow;");
                    s.push("}");
                    
    
                    s.push("#orvPropDescPanelDetails {");
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  left:2px;");
                    s.push("  right:2px;");
                    s.push("  top:25px;");
                    s.push("  bottom:2px;");
                    s.push("  font-family: tahoma;");
                    s.push("  font-size: 13px;");
                    s.push("  text-height: 15px;");
                    s.push("  color: #616161;");
                    s.push("  overflow:hidden;");
                    s.push("  text-overflow: ellipsis;");
                    s.push("}");
    
                    //s.push("")
                    s.push(".uomDropdown {")
                    s.push("  position:absolute;");
                    s.push("  box-sizing: border-box;");
                    s.push("  background-color: #e5e5e5;");
                    s.push("  border: solid gray 1px;");
                    s.push("  margin: 0px;");
                    s.push("  padding: 0px;");
                    s.push("  width: 35px;");
                    s.push("  height: 165px;");
                    s.push("  overflow: hidden;");
                    s.push("  box-shadow: -5px 5px 3px #888888;");
                    s.push("  z-index: 500;");
                    s.push("}")
    
                    s.push(".uomDropdownLi{")
                    s.push("  margin: 0px;");
                    s.push("  padding: 0px;");
                    s.push("  padding-left: 3px;");
                    s.push("  padding-top: 1px;");
                    s.push("}")
    
                    s.push(".uomDropdownLi:hover{")
                    s.push("  background-color: #c2c2d6;");
                    s.push("  color: #33334d;");
                    s.push("  text-align:center;");
                    s.push("  cursor: pointer;");
                    s.push("  transform: scale(1.2);");
                    s.push("}")
    
                    //s.push("")
                    s.push(".uomDropdownLst {")
                    s.push("  font-family: tahoma;");
                    s.push("  list-style-type: none;");
                    s.push("  margin: 0px;");
                    s.push("  padding: 0px;");
                    s.push("}")
    
                    styleBlockNd.innerHTML = orvCore.safeMarkup(s.join(""));
                    document.body.appendChild(styleBlockNd);
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch

            } // end of function buildPropStyleBlock()


            /********************************************************************************
            * 
            *   #build_Props_Style_Unselectable
            ********************************************************************************/    
            function buildPropsStyleUnselectable() {
                const s=[];
                s.push("user-select: none;");
                s.push("-moz-user-select: none;");
                s.push("-khtml-user-select: none;");
                s.push("-webkit-user-select: none;");
                s.push("-o-user-select: none;");
                
                return s.join("");
            } // end of function buildPropsStyleUnselectable()    




            /********************************************************************************
             * 
             *   #create_prop_constructor
             ********************************************************************************/
            function CreateProp(params) {
                const prop = this;
                let nPopupHeight = -1;

                try {
                    // theme and variations...
                    let alternateObj = params.alternateObj;
                    let additionalObj = params.additionalObj;

                    let propPanelObj = params.props
                    let sPropType = getVal(params,"propType","basicProperty");
                    let sObjPropName = getVal(params,"objPropName","???");
                    let sPropName = getVal(params,"propName",sObjPropName);  // human readable property name
                    let sDataType = getVal(params,"dataType","string");
                    let sCurrentUom; // used when data type is: 'cssUom'
                    let nDefaultMaxLength = 50;

                    if (sDataType === "number" || sDataType === "int") {
                        nDefaultMaxLength = 10;
                    } // end if

                    let nMaxLength = getVal(params,"maxLength",nDefaultMaxLength);

                    let propsObj = getVal(params,"propsObj",mainPropsObj);
                


                    let bBold = getVal(params,"bold",false);
                    let bReadOnly = getVal(params,"readOnly",false);
                    let bSticky = getVal(params,"sticky",false);
                    let sCategory = getVal(params,"category","misc");
                    let optionSet = getVal(params,"optionSet",undefined); // when used, it is array of possible options
                    let dialogPnlFn = getVal(params,"dialogPnlFn",undefined);
                    let altGuiDomEl = getVal(params,"altGuiDomEl",undefined);
                    let bAutoUpdate = getVal(params,"autoUpdate",false);
                    let fnOnCommit = getVal(params,"onCommit",undefined);
                    let sDescr = getVal(params,"descr","");
                    let nIndexNum = getVal(params,"indexNum",0);
                    let vBeginEditValue;
                    let vPendingValue;
                    let bEditingPropValue = false;
                    let propLevelChangeEventHandlers = [];

                    if (typeof optionSet === "undefined" && sDataType==="boolean") {
                        optionSet = [];
                        optionSet.push({caption:"True",value:true})
                        optionSet.push({caption:"False",value:false})
                    } // end if

                // **************************************************************************************



                    // #property_obj_custom_prop_def

                    Object.defineProperties(prop, {
                        //
                        "objType": {
                            "get": function() { 
                                return "propPanelProperty";
                            } // end of getter code!
                        },  // end of "objType" property definition

                        "dataType": {
                            "get": function() { 
                                return sDataType;
                            } // end of getter code!
                        },  // end of "dataType" property definition


                        // the prop's (property's object)... object this property belongs to...
                        "propsObj": {
                            "get": function() { 
                                return propsObj;
                            }, // end of getter code!
                        },  // end of "propsObj" property definition

                        // the propertyPanel Object
                        "propPanelObj": {
                            "get": function() { 
                                return propPanelObj;
                            }, // end of getter code!
                        },  // end of "propPanelObj" property definition

                        "propName": {
                            "get": function() { 
                                return sObjPropName;
                            }, // end of getter code!
                        },  // end of "propName" property definition

                        "altGuiDomEl": {
                            "get": function() { 
                                return altGuiDomEl;
                            }, // end of getter code!
                        },  // end of "altGuiDomEl" property definition

                        "indexNum": {
                            "get": function() { 
                                return nIndexNum;
                            }, // end of getter code!
                        },  // end of "indexNum" property definition

                        // the property object's "value" property...
                        "value": {
                            "get": function() { 
                                let refObj = propsObj

                                if (typeof alternateObj !== "undefined") {
                                    refObj = alternateObj;
                                } // end if

                                return refObj[sObjPropName];
                            }, // end of getter code!

                            "set": function(vNewValue) { 
                                let sCheckDataType = sDataType;
                                let refObj = propsObj

                                if (typeof alternateObj !== "undefined") {
                                    refObj = alternateObj;
                                } // end if

                                if (sCheckDataType === "int") {
                                    sCheckDataType = "number"
                                } // end if

                                if (sCheckDataType === "cssUom") {
                                    sCheckDataType = "string"
                                } // end if

                                if (typeof vNewValue !== sCheckDataType) {
                                    return;
                                } // end if

                                if (sDataType === "int") {
                                    vNewValue = Math.floor(vNewValue)
                                } // end if

                                let vOldValue = refObj[sObjPropName]
                                if (vNewValue !== vOldValue) {
                                    refObj[sObjPropName] = vNewValue;

                                    if (typeof additionalObj !== "undefined") {
                                        additionalObj[sObjPropName] = vNewValue;
                                    } // end if

                                    updatePropValueDisplayForPropsNamed(sObjPropName, vNewValue)

                                    runChangeEventHandlers(prop, vOldValue, vNewValue, "valueSetOnPropObj");
                                    runPropLevelChangeEventHandlers(vOldValue, vNewValue, "valueSetOnPropObj")
                                } // end if
                                
                            } // end of setter code!
                        }

                    }); // end of Object.defineProperties()




                    /********************************************************************************
                     * 
                     *   #data_idx
                     * 
                     *   Build data index string to add to tag in HTML markup
                     ********************************************************************************/      
                    function dataIdx(nOverrideIndexNum) {
                        const s=[];
                        let nIdx = nIndexNum;

                        try {
                            if (typeof nOverrideIndexNum === "number") {
                                nIdx = nOverrideIndexNum
                            } // end if
    
                            Q = '"'
                            s.push(" data-idx=")
                            s.push(Q)
                            s.push(nIdx)
                            s.push(Q)
                            s.push(" ")
                            return s.join("");

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function dataIdx()


                    /**
                     * 
                     *   #get_derived_value
                     */
                    function getDerivedValue(sPropName) {
                        let refObj = propsObj
                        let vValue;

                        try {
                            if (typeof alternateObj !== "undefined") {
                                refObj = alternateObj;
                            } // end if
    
                            vValue = refObj[sPropName]
    
                            if (typeof vValue === "undefined" && typeof additionalObj !== "undefined") {
                                vValue = additionalObj[sPropName]
                            } // end if
    
                            return vValue;
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of getDerivedValue()



                    /**
                     * 
                     *    #set_derived_value
                     */
                    function setDerivedValue(sPropName, vNewValue) {
                        let refObj = propsObj

                        try {
                            if (typeof alternateObj !== "undefined") {
                                refObj = alternateObj;
                            } // end if
    
                            refObj[sPropName] = vNewValue;
    
                            if (typeof additionalObj !== "undefined") {
                                additionalObj[sPropName] = vNewValue;
                            } // end if
    
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of setDerivedValue()




                    /********************************************************************************
                    * 
                    *  #prop_id
                    *   
                    ********************************************************************************/      
                    function propId(sPart) {
                        const s=[];
                        
                        try {
                            s.push(sContainerId+"_")
                            s.push(nIndexNum)
                            s.push("_"+sPart)
    
                            return s.join("");

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function dataIdx()





                    /********************************************************************************
                    * 
                    *  #prop_setup_color_change
                    *   
                    ********************************************************************************/      
                    prop.setupColorChange = function() {
                        console.log("prop.setupColorChange() called 🖍")
                        let orvPropSwatchNd;

                        try {
                            orvPropSwatchNd = document.getElementById(propId("orvPropSwatch"));
                            orvPropSwatchNd.addEventListener("change", colorChanged);
                            // orvPropSwatchNd.addEventListener("click", propsClick);   
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch             

                    } // end of prop.setupColorChange() method



                    /********************************************************************************
                    * 
                    *  #setDerivedValue(sObjPropName, vPendingValue) 
                    * 
                    *   called on an input tag type='color' change event
                    *   
                    ********************************************************************************/     
                    function colorChanged(evt) {
                        console.log("colorChanged() function called")
                        const el = evt.srcElement;

                        try {
                            console.log(el.tagName)
                        
                            let sOldValue = getDerivedValue(sObjPropName)
    
                            if (sOldValue !== "") {
                                if (sOldValue.substr(0,1) !== "#") {
                                    sOldValue = getHexColorValue(sOldValue)
                                } // end if
                            } // end if
    
                            if (el.value !== sOldValue) {
                                const sNewValue = el.value+"";
                                
                                if (sOldValue !== sNewValue) {
                                    const orvPropColorCodeNd = document.getElementById(propId("orvPropColorCode"))
                                    orvPropColorCodeNd.innerText = el.value;
                                    setDerivedValue(sObjPropName, sNewValue)
                                    runChangeEventHandlers(prop, sOldValue, sNewValue, "colorChangedWithColorPickerDialog");
                                    runPropLevelChangeEventHandlers(sOldValue, sNewValue, "colorChangedWithColorPickerDialog")
                                } // end if (sOldValue !== sNewValue)
                                
                            } // end if (el.value !== sOldValue)

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch 

                    } // end of function colorChanged()




                    /********************************************************************************
                    * 
                    *   
                    *   #prop_add_event_listener_method
                    * 
                    ********************************************************************************/  
                    prop.addEventListener = function(sEvent, functToRun) {
                        const eventInfoObj = {};

                        try {
                            eventInfoObj.event = sEvent;
                            eventInfoObj.functToRun = functToRun;
                    
                            // event to fire when property value changes:       
                            if (sEvent === "change" && typeof functToRun === "function") {
                                propLevelChangeEventHandlers.push(eventInfoObj)
                            } // end if
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of prop.addEventListener()



                    /********************************************************************************
                     * 
                     *   #run_prop_level_change_event_handlers
                     ********************************************************************************/     
                    function runPropLevelChangeEventHandlers(vOldValue,vNewValue, sOperation) {
                        let nMax,eventInfoObj

                        try {
                            nMax = propLevelChangeEventHandlers.length;

                            for (let n=0; n< nMax; n++) {           
                                eventInfoObj = propLevelChangeEventHandlers[n]
                                const funcToRun = eventInfoObj.functToRun;
                                customEventObj = {};
                                customEventObj.level = "property"
                                customEventObj.event = "change"
                                customEventObj.operation = sOperation;
                                customEventObj.timestamp = new Date();
                                customEventObj.propertyObj = prop;
                                customEventObj.oldValue = vOldValue;
                                customEventObj.newValue = vNewValue;
                                funcToRun(customEventObj);
                            } // next n

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch

                    } // end of function runPropLevelChangeEventHandlers()    


                    /**
                     * 
                     *  #prop_hide_uom_dropdown_method
                     *  
                     */
                    prop.hideUomDropdown = function() {
                        hideUomDropdown()
                    } // end of


                    /**
                     * 
                     *  #prop_hide_uom_dropdown__
                     * 
                     */
                    function hideUomDropdown() {
                        try {
                            let uomDropdown = document.getElementById("uomDropdown")
                            if (uomDropdown !== null) {
                                uomDropdown.removeEventListener("click", pickUom);
                                uomDropdown.remove();
                            } // end if
                            bShowingCssUomPopup = false;
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                            
                    } // hideUomDropdown()


                    /**
                    * 
                    * 
                    *   #prop_show_uom_dropdown_method
                    * 
                    */
                    prop.showUomDropdown = function(el) {
                        const s=[]
                        const domRect = el.getBoundingClientRect();
                        console.log(domRect)

                        try {
                            let uomDropdown = document.getElementById("uomDropdown")

                            if (uomDropdown !== null) {
                                hideUomDropdown() 
                                return;
                            } // end if
    
                            uomDropdown = document.createElement("div")
                            uomDropdown.id = "uomDropdown"
                            uomDropdown.className = "uomDropdown"
                            uomDropdown.style.top = (domRect.bottom-3)+"px"
                            uomDropdown.style.right = (window.innerWidth - domRect.right)+"px"
    
                            //s.push("")
                            s.push("<ul class='uomDropdownLst'>")
                                s.push("<li class='uomDropdownLi'>%</li>")
                                s.push("<li class='uomDropdownLi'>ch</li>")
                                s.push("<li class='uomDropdownLi'>em</li>")
                                s.push("<li class='uomDropdownLi'>pt</li>")
                                s.push("<li class='uomDropdownLi'>px</li>")
                                s.push("<li class='uomDropdownLi'>rem</li>")
                                s.push("<li class='uomDropdownLi'>vh</li>")
                                s.push("<li class='uomDropdownLi'>vw</li>")
                            s.push("</ul>")
    
                            uomDropdown.innerHTML = orvCore.safeMarkup(s.join(""))
                            document.body.append(uomDropdown)
                            uomDropdown.addEventListener("click", pickUom);
                            bShowingCssUomPopup = true;
                            console.log("finished prop.showUomDropdown()")

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of prop.showUomDropdown()


                    /**
                     * 
                     *   #pick_uom
                     */
                    function pickUom(evt) {
                        const el = evt.srcElement;

                        try {
                            
                            if (el.className === "uomDropdownLi") {
                                const orvPropUomNd = document.getElementById("orvPropUom")
                                sCurrentUom = el.innerText
                                orvPropUomNd.innerText = sCurrentUom
                                hideUomDropdown()
                            } // end if
                            
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of pickUom()




                    /********************************************************************************
                    * 
                    *   
                    *   #prop_sel_prop_method
                    * 
                    ********************************************************************************/      
                    prop.selProp = function() {
                        try {
                            let bDropdownButtonDrawn = false

                            prop.hideDropdown(); // if dropdown is around for property for any reason, hide it!
                            prop.hideUomDropdown()  // ditto for UOM dropdown
    
                            const propNameEl = document.getElementById(propId("orvPropName"));
                            propNameEl.className = "orvPropNameSel"
    
                            const orvPropDescPanelTitleNd = document.getElementById("orvPropDescPanelTitle");
                            const orvPropDescPanelDetailsNd = document.getElementById("orvPropDescPanelDetails");
    
                            let sPropTitle = "Selected Property: <i>"+sPropName+"</i>";
    
                            if (bReadOnly) {
                                sPropTitle = sPropTitle + "&nbsp;&nbsp;&nbsp;<span class='readOnlyNote'>(read only)</span>"
                            } // end if
    
                            orvPropDescPanelTitleNd.innerHTML = orvCore.safeMarkup(sPropTitle);
                            orvPropDescPanelDetailsNd.innerHTML = orvCore.safeMarkup(sDescr);
    
                            if (Array.isArray(optionSet) && !bReadOnly) {
                                const propNd = document.getElementById(propId("orvProp"));
                                const dropdownBtnNd = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                dropdownBtnNd.setAttribute("id", propId("orvPropDropdownBtn"));
                                dropdownBtnNd.setAttribute("class", "orvPropDropdownButton");
                                dropdownBtnNd.setAttribute("width", "19");
                                dropdownBtnNd.setAttribute("height", "19");
                                const s=[];
                                const Q='"';
    
                                // draw a Down Arrow on the button!
                                const sStartPos = "5 8"
                                s.push("<path d=")
                                s.push(Q)
                                s.push("M"+sStartPos+" "); // move upper left corner
                                s.push("L11 8 "); // draw line to upper right corner
                                s.push("L8 11 "); // draw line to lower middle corner
                            //    s.push("L"+sStartPos+" "); // draw line back to original start drawing position
                                s.push(Q)
                                s.push(" fill='#616161' stroke='#616161' stroke-width='1' stroke-linejoin='miter' ")            
                                s.push("/>")
    
                            // alert(s.join(""))
                                dropdownBtnNd.innerHTML = orvCore.safeMarkup(s.join(""));
    
                                dropdownBtnNd.addEventListener("click", dropdownToggle);
    
                                propNd.appendChild(dropdownBtnNd)
                                bDropdownButtonDrawn = true
                            } // end if (Array.isArray(optionSet))

                            // build elipses button if there is a dialog panel function to call for the
                            // property in question...
                            if (typeof dialogPnlFn === "function") {
                                const elipsesBtn = document.createElement("button")
                                elipsesBtn.innerText = "..."
                                elipsesBtn.title = "click to edit value of\nthe "+sPropName+" property"
                                elipsesBtn.className = "orvPropElipsesBtn"
                                if (bDropdownButtonDrawn) {
                                    elipsesBtn.style.right = "22px"
                                } // end if
                                elipsesBtn.id = propId("orvPropElipsesBtn")
                                elipsesBtn.addEventListener("click", dialogPnlFn);
                                propNd.appendChild(elipsesBtn)
                            } // end if (typeof dialogPnlFn === "function") 

                            runSelEventHandlers(lastSelectedPropObj, prop,"propSelected")

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch                        

                    } // end of prop.selProp() method





                    /********************************************************************************
                    * 
                    *   #prop_de_sel_prop_method
                    * 
                    *   Deselect the previously selected property.
                    ********************************************************************************/    
                    prop.deSelProp = function() {
                        try {
                            const propNameEl = document.getElementById(propId("orvPropName"));
                            propNameEl.className = "orvPropName"
    
                            if (Array.isArray(optionSet)) {
                                let dropdownBtnNd = document.getElementById(propId("orvPropDropdownBtn"));
                                
                                if (dropdownBtnNd !== null) {
                                    dropdownBtnNd.removeEventListener("click", dropdownToggle);
                                    dropdownBtnNd.parentElement.removeChild(dropdownBtnNd);
                                } // end if
    
                                let dropdownNd = document.getElementById(propId("orvPropDropdown"));
                                if (dropdownNd !== null) {
                                    dropdownNd.removeEventListener("click", procPropOptionSelected);
                                    dropdownNd.parentElement.removeChild(dropdownNd);
                                } // end if
                            } // end if
    
                            prop.commitChanges();
                            
                            lastSelectedPropObj = prop;
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch                        
                        
                    } // end of prop.deSelProp() method



                    /********************************************************************************
                    * 
                    *   #prop_hide_dropdown_method
                    * 
                    *   Hide dropdown... if it is currently being shown...
                    *   if it is already hidden, it will Remain hidden!
                    ********************************************************************************/    
                    prop.hideDropdown = function() {
                        let orvPropDropdown
                        try {
                            orvPropDropdown = document.getElementsByClassName("orvPropDropdownList")[0]
                            if (typeof orvPropDropdown !== "undefined") {
                                dropdownToggle({})
                            } // end if
    
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of prop.hideDropdown() method




                    /********************************************************************************
                    * 
                    *   #drop_down_toggle
                    * 
                    *   Builds / Shows / and Hides dropdown list of possible values for
                    *   a property.
                    * 
                    ********************************************************************************/        
                    function dropdownToggle(evt) {
                        console.log("dropdownToggle() called")

                        try {
                            const dropdownBtnNd = document.getElementById(propId("orvPropDropdownBtn"));
                            let dropdownNd = document.getElementById(propId("orvPropDropdown"));
                            const propValueEl = document.getElementById(propId("orvPropValue"));
                            const bdy = document.getElementsByTagName("BODY")[0];
                    
                            if (dropdownNd === null) {
                    
                                vBeginEditValue = propsObj[sObjPropName]
                                vPendingValue = vBeginEditValue
                    
                                dropdownNd = document.createElement("div");
                                dropdownNd.id = propId("orvPropDropdown");
                    
                                // below makes dropdown able to take keyboard input
                                // ... for arrow keys, enter key, ESC key, etc.
                                dropdownNd.setAttribute("tabindex", "-1");
                                dropdownNd.style.outlineStyle = "none";
                    
                                dropdownNd.className = "orvPropDropdownList"
                                dropdownNd.style.width = (propValueEl.offsetWidth+3)+"px"
                                
                                let domRect1 = dropdownBtnNd.getBoundingClientRect();
                                let nTop = domRect1.y+18;
                                let domRect2 = propValueEl.getBoundingClientRect();
                                let nLeft = domRect2.x - 5;
                    
                                dropdownNd.style.top = (nTop)+"px";
                                dropdownNd.style.left = (nLeft)+"px";
                    
                                let nEntries = optionSet.length;
                                let nShowEntries = nEntries;
                    
                                if (nShowEntries > 6) {
                                    nShowEntries = 6;
                                } // end if
                    
                                let nHeight = nShowEntries * 18 ;
                                dropdownNd.style.height = (nHeight)+"px";
                                nPopupHeight = nHeight; // save at property object level for later use.
                    
                                const s = [];
                                const Q = '"';
                                let bItemAlreadySelected = false;
                                let nCalcScrollTop = 0;
                                let nSelItmScrollTop = -1;
                    
                                s.push("<ul class='orvPropsList' ")
                                s.push("style=")
                                s.push(Q)
                                s.push("width:"+(propValueEl.offsetWidth * 2)+"px;")
                                s.push(Q)
                                s.push(">")
                    
                                for (let n=0;n<nEntries;n++) {
                                    const lstOpt = optionSet[n];
                                    
                                    const sOptionType = getVal(lstOpt,"optionType","option")
                                    const sCaption = getVal(lstOpt,"caption",lstOpt.value)
                                    let sLstItmClass = "orvPropDropdownListItm"
                                    
                                    if (sOptionType === "heading") {
                                        s.push("<li class='orvPropDropdownListHdr' >")
                                    } else {
                                        if (lstOpt.value === propsObj[sObjPropName]) {                        
                                            sLstItmClass = "orvPropDropdownListItmSel"
                                            bItemAlreadySelected = true;
                                            nCurrentDropdownSelIndex = n; // set Dropdown Select Index!
                                            nStartingDropdownSelIndex = n; // set Dropdown Select Index (Starting)!
                                        } // end if
                        
                                        s.push("<li class='"+sLstItmClass+"' ")
                                        s.push("id="+Q+propId("orvPropDropdownItm-"+(n))+Q+" ")
                    
                                        s.push(" data-idx="+Q+n+Q)
                                        s.push(">")
                                    } // end if
                    
                                    if (sDataType === "color" && sOptionType !== "heading") {
                                        s.push("<div class='orvColorOptContnr'>")
                                        
                                        s.push("<div class='orvColorOptSwatch' ")
                                        s.push("style="); 
                                        s.push(Q); 
                                        s.push("background:"+lstOpt.value+";"); 
                                        s.push(Q); 
                                        s.push(" data-idx="+Q+n+Q)
                                        s.push("></div>\n\n"); //orvColorOptSwatch
                    
                                        s.push("<div class='orvColorOptCaption' ")
                                        s.push(" data-idx="+Q+n+Q)
                    
                                        if (typeof sCaption === "string" || typeof sCaption === "number") {
                                            s.push(" title="); 
                                            s.push(Q); 
                                            s.push(sCaption); // needs something to escape out any double quote characters
                                            s.push(Q); 
                                        } // end if
                    
                                        s.push(" >");
                                        
                                    } // end if
                    
                                    s.push(sCaption)
                    
                                    if (sDataType === "color" && sOptionType !== "heading") {                    
                                        s.push("</div>\n"); // orvColorOptCaption
                                        s.push("</div>\n"); // colorOptContnr
                                    } // end if (sDataType === "color" && sOptionType !== "heading")
                    
                                    s.push("</li>")
                    
                                } // next n
                    
                                // a little extra breathing room at the bottom of the list...
                                s.push("<li class='orvPropDropdownListItmSpacer'></li>")
                    
                    
                                s.push("</ul>")
                                
                                dropdownNd.innerHTML = orvCore.safeMarkup(s.join(""));
                    
                                
                    
                
                                //console.dir(dropdownNd)
                    
                                dropdownNd.addEventListener("click", procPropOptionSelected);
                                dropdownNd.addEventListener("keydown", keyNavDropdown);
                                dropdownNd.addEventListener("scroll", dropdownScroll);
                    
                                bdy.appendChild(dropdownNd);
                    
                                // to accurately figure scrollTop for each item, it must be done
                                // AFTER it is added to the DOM!
                                const nMaxScrollTop = dropdownNd.scrollHeight - nPopupHeight ;
                
                                for (let n=0;n<nEntries;n++) {
                                    const lstOpt = optionSet[n];
                                    const sOptionType = getVal(lstOpt,"optionType","option")
                                    
                                    lstOpt.scrollTop = nCalcScrollTop;
                    
                                    if (nCalcScrollTop<=nMaxScrollTop) {
                                        if (sOptionType === "heading") {                    
                                            nCalcScrollTop = nCalcScrollTop + 12;
                                        } else {
                                            if (lstOpt.value === propsObj[sObjPropName]) {
                                                nSelItmScrollTop = lstOpt.scrollTop; // 
                                            } // end if
                    
                                            nCalcScrollTop = nCalcScrollTop + 18;  
                                        } // end if/else
                    
                                        if (nCalcScrollTop > nMaxScrollTop) {
                                            nCalcScrollTop = nMaxScrollTop;
                                        } // end if
                                    } // end if
                                    
                                    console.log("lstOpt.scrollTop="+lstOpt.scrollTop+"   ("+sOptionType+")")
                    
                                } // next n
                
                                if (bItemAlreadySelected) {
                                    //const orvPropDropdownListItmSelNd = document.getElementsByClassName("orvPropDropdownListItmSel")[0];
                                    //console.log("about to call scrollIntoView() method... 🙄")
                                    // see:  https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                                    //orvPropDropdownListItmSelNd.scrollIntoView({behavior:"smooth",block:"end",inline:"nearest"});
                                    // **** NOTE: this isn't working quite like I expected.
                                    // ****      so, I am doing my own routine to scroll the selected item into view!
                                    //console.log("scrollIntoView() method called.")
                    
                                    let nCalcSelScrollTop = nSelItmScrollTop + 18;
                                    if (nCalcSelScrollTop > dropdownNd.scrollTop) {
                                        console.log("nCalcSelScrollTop="+nCalcSelScrollTop+"  >  dropdownNd.scrollTop="+dropdownNd.scrollTop)
                                        dropdownNd.scrollTop = nCalcSelScrollTop;
                                    } // end if
                    
                                } // end if
                    
                                dropdownNd.focus();
                
                            } else {
                                dropdownNd.removeEventListener("click", procPropOptionSelected);
                                dropdownNd.removeEventListener("keydown", keyNavDropdown);
                                dropdownNd.removeEventListener("scroll", dropdownScroll);
                                dropdownNd.parentElement.removeChild(dropdownNd);
                                containerNd.focus();
                            } // end if/else
                        } catch(err) {
                            showErrInfo(err,{},function(err) {
                            debugger;
                            })     
                        } // end of try/catch


                    } // end of function dropdownToggle()





                    /********************************************************************************
                     * 
                     *   
                     *  #dropdown_scroll
                     * 
                     *  - Called when user scrolls content of dropdown
                     * 
                     *    For now, this function is just mainly for testing and debugging.
                     * 
                     *    Highest value for scroll top:
                     *  
                     *      el.scrollHeight - nPopupHeight   (bottom edge of last item)
                     * 
                     *      el.scrollHeight will vary based on how many items are in list
                     * 
                     * 
                     *    ???
                     *    scrollTop = el.scrollHeight - nPopupHeight - originalScrollTop - item height
                     * 
                     ********************************************************************************/      
                    function dropdownScroll(evt) {
                        const el = evt.srcElement;

                        try {
                            if (el.className !== "orvPropDropdownList") {
                                return;
                            } // end if
    
                            //debugger;
                            const css1="background:yellow;font-weight:bold;";
                            const css2="background:white;font-weight:normal;";
                            console.log("%cPopup Dropdown was scrolled!%c    scrollTop="+el.scrollTop+"   scrollHeight="+el.scrollHeight,css1,css2)
                            console.log("    nPopupHeight="+nPopupHeight)

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function dropdownScroll()




                    /**
                     * 
                     *   #get_hex_color_value
                     * 
                     *   get hex value of color based on valid html color name
                     */
                    function getHexColorValue(sColorName) {
                        try {
                            if (sColorName.substr(0,1)=== "#") {
                                return sColorName; // assume input value is a hex value already
                                } // end if
                                
                                let sRgbColorValue;
                                
                                if (sColorName.substr(0,4)=== "rgb(") {
                                sRgbColorValue = sColorName;
                                } else {
                                // compute the hex value of the color name passed in:
                                let testSwatch = document.createElement("div")
                                testSwatch.style.backgroundColor = sColorName;
                                document.body.append(testSwatch)
                                sRgbColorValue =  getComputedStyle(testSwatch).backgroundColor
                                testSwatch.remove()
                                } // end if/else
                                
                                
                                let split1 = sRgbColorValue.split("(")
                                let split2 = split1[1].split(")")
                                let split3 = split2[0].split(",")
                                let r = split3[0]-0
                                let g = split3[1]-0
                                let b = split3[2]-0
                                
                                let r2 = r.toString(16)
                                let g2 = g.toString(16)
                                let b2 = b.toString(16)
                                
                                if (r2.length===1) {
                                r2 = "0"+r2
                                }
                                
                                if (g2.length===1) {
                                g2 = "0"+g2
                                }
                                
                                if (b2.length===1) {
                                b2 = "0"+b2
                                }
                                
                                return "#"+r2+g2+b2

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch                
                        
                    } // end of function getHexColorValue




                    /********************************************************************************
                     * 
                     *   
                     *  #key_nav_dropdown
                     * 
                     *  Manage navigation keystrokes on Dropdown.
                     * 
                     *  this routine should be within scope of property object!
                     * 
                     ********************************************************************************/  
                    function keyNavDropdown(evt) {
                        console.log("keyNavDropdown() called.  keyCode="+evt.keyCode)

                        let nKeyCode = evt.keyCode;
                        let liElement,prevLiElement,dropdownNd;

                        try {
                            dropdownNd = document.getElementById(propId("orvPropDropdown"));

                            // any changes canceled...
                            if (nKeyCode === ESC_KEY) {
                                if (bReadOnly) {
                                    prop.hideDropdown()
                                    prop.hideUomDropdown()
                                    return;
                                } // end if
    
                                liElement = document.getElementById(propId("orvPropDropdownItm-"+(nStartingDropdownSelIndex)))
                                const evt = {};
                                evt.srcElement = liElement;
                                procPropOptionSelected(evt)
                                return;
                            } // end if
    
                            if (bReadOnly) {
                                // Don't look any further at any keystrokes (since you are not allowed to change the value)
                                return;
                            } // end if
    
                            // commit changes
                            if (nKeyCode === ENTER_KEY) {
                                liElement = document.getElementById(propId("orvPropDropdownItm-"+(nCurrentDropdownSelIndex)))
                                const evt = {};
                                evt.srcElement = liElement;
                                procPropOptionSelected(evt)
                                return;
                            } // end if
    
                            // move back through list index
                            if (nKeyCode === LEFTARROW_KEY || nKeyCode === UPARROW_KEY) {
                                if (nCurrentDropdownSelIndex > 0) {
                                    let optionItm;
                                    let idx = nCurrentDropdownSelIndex;
                                    let prevIdx,sOptionType;
    
                                    do {
                                        idx = idx - 1;
                                        optionItm = optionSet[idx];
                                        sOptionType = getVal(optionItm,"optionType","option")
    
                                        if (sOptionType !== "heading") {
                                            // found a non-heading option item, so use it!
                                            prevIdx = nCurrentDropdownSelIndex;
                                            prevLiElement = document.getElementById(propId("orvPropDropdownItm-"+(prevIdx)))
                                            prevLiElement.className = "orvPropDropdownListItm"
                                            nCurrentDropdownSelIndex = idx;
                                            liElement = document.getElementById(propId("orvPropDropdownItm-"+(nCurrentDropdownSelIndex)))
                                            liElement.className = "orvPropDropdownListItmSel"
                                            const evt = {};
                                            evt.srcElement = liElement;
                                            procPropOptionSelected(evt, "leaveDropdownOpen")
                                            //console.log("about to call scrollIntoView() method... -- Scrolling Up")
                                            // see:  https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                                            //liElement.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"});
                                            //console.log("scrollIntoView() method called.")
                                            // **** NOTE: this isn't working quite like I expected.
                                            // ****      so, I am doing my own routine to scroll the selected item into view!
    
                                            
                                            console.log("%c** UP ARROW:","font-weight:bold;")
                                            console.log("  --  optionItm.scrollTop="+optionItm.scrollTop)
                                            console.log("  --         nPopupHeight="+nPopupHeight)
                                            console.log("  -- dropdownNd.scrollTop="+dropdownNd.scrollTop)
                                            
                                            
                                            //scrollTopSettings()
                                            let nThreshold = optionItm.scrollTop - nPopupHeight;
    
                                            if (nThreshold < 0) {
                                                nThreshold = 0;
                                            } // end if
    
                                            if (dropdownNd.scrollTop > nThreshold) {                            
                                                dropdownNd.scrollTop = nThreshold;  // optionItm.scrollTop
                                            } // end if
    
                                            return;
                                        } // end if
    
                                    } while(sOptionType === "heading" || idx === 0)
                                } // end if
    
                                return;
                            } // end if
    
                            // move forward through list index
                            if (nKeyCode === RIGHTARROW_KEY || nKeyCode === DOWNARROW_KEY) {
                                let nPlaceholder = nCurrentDropdownSelIndex;
    
                                if (nCurrentDropdownSelIndex < optionSet.length - 1) {
                                    let optionItm;
                                    let idx = nCurrentDropdownSelIndex;
                                    let prevIdx,sOptionType;
    
                                    do {
                                        idx = idx + 1;
                                        optionItm = optionSet[idx];
                                        sOptionType = getVal(optionItm,"optionType","option")
    
                                        if (sOptionType !== "heading") {
                                            // found a non-heading option item, so use it!
                                            prevIdx = nCurrentDropdownSelIndex;
                                            prevLiElement = document.getElementById(propId("orvPropDropdownItm-"+(prevIdx)))
                                            //orvPropDropdownListItm
                                            prevLiElement.className = "orvPropDropdownListItm"
                                            nCurrentDropdownSelIndex = idx;
                                            liElement = document.getElementById(propId("orvPropDropdownItm-"+(nCurrentDropdownSelIndex)))
                                            liElement.className = "orvPropDropdownListItmSel"
                                            const evt = {};
                                            evt.srcElement = liElement;
                                            procPropOptionSelected(evt, "leaveDropdownOpen")
                                            console.log("about to call scrollIntoView() method... -- Scrolling Down")
                                            // see:  https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                                            //liElement.scrollIntoView({behavior:"smooth",block:"end",inline:"nearest"});
                                            //console.log("scrollIntoView() method called.")
                                            // **** NOTE: this isn't working quite like I expected.
                                            // ****      so, I am doing my own routine to scroll the selected item into view!
    
                                            let nCalcSelScrollTop = optionItm.scrollTop + 18;
    
                                            console.log("%c** DOWN ARROW:","font-weight:bold;")
                                            console.log("  --  optionItm.scrollTop="+optionItm.scrollTop)
                                            console.log("  --         nPopupHeight="+nPopupHeight)
                                            console.log("  -- dropdownNd.scrollTop="+dropdownNd.scrollTop)
                                            console.log("  --    nCalcSelScrollTop="+nCalcSelScrollTop)
    
                                            if (dropdownNd.scrollTop < nCalcSelScrollTop) {
                                                dropdownNd.scrollTop = nCalcSelScrollTop;
                                            } // end if
    
                                            return;
                                        } // end if
    
                                    } while(sOptionType === "heading" || idx === optionSet.length - 1)
                                } // end if
    
                                return;
                            } // end if
                            
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch

                        

                    } // end of function keyNavDropdown()




                    /********************************************************************************
                     * 
                     *   FOR DEBUGGING  
                     * 
                     *  #scroll_top_settings
                     * 
                     * 
                     ********************************************************************************/      
                    function scrollTopSettings() {
                        const nMax = optionSet.length;

                        console.clear();
                        console.log("==================================")
                        console.log("==================================")
                        for (let n=0;n<nMax;n++) {
                            const optionItm = optionSet[n];
                            console.log("optionItm   index="+n+"    scrollTo="+optionItm.scrollTop)
                        } // next n

                        console.log("==================================")

                    } // end of function scrollTopSettings() 



                    /********************************************************************************
                     * 
                     *   
                     *  #highlight_dropdown_option
                     * 
                     *  Programatically highlight item in dropdown for index
                     *  Also, unhighlight any highlighted item with another index
                     * 
                     *  this routine should be within scope of property object!
                     * 
                     ********************************************************************************/      
                    function highlightDropdownOption(idx) {
                        try {
                            if (nCurrentDropdownSelIndex > -1) {
                                const oldSelItm = optionSet[nCurrentDropdownSelIndex];
                            } // end if
    
                            nCurrentDropdownSelIndex = idx;

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function highlightDropdownOption()




                    /********************************************************************************
                     * 
                     *   
                     *  #proc_prop_option_selected
                     ********************************************************************************/      
                    function procPropOptionSelected(evt, leaveOpen) {
                        console.log("procPropOptionSelected() called")
                        const el = evt.srcElement;

                        try {
                            if (el.className !== "orvPropDropdownListItm" && 
                            el.className !== "orvPropDropdownListItmSel" &&
                            el.className !== "orvColorOptContnr" &&
                            el.className !== "orvColorOptSwatch" &&
                            el.className !== "orvColorOptCaption") {
                            return;
                        } // end if

                        /*************************************************************************
                            If property is Read Only, you can only [look] at the possible options
                            but not change to a different option!
                        *************************************************************************/
                        if (bReadOnly) {
                            return;
                        } // end if

                        //
                        const idx = el.dataset.idx-0;
                        const optionPicked = optionSet[idx];
                        const vOldValue = propsObj[sObjPropName];
                        const vNewValue = optionPicked.value;

                        // propsObj[sObjPropName] = optionPicked.value;
                        let sCaptionKey = "orvPropValue";

                        if (sDataType === "color") {
                            sCaptionKey = "orvPropColorCode";            
                            const swatch = document.getElementById(propId("orvPropSwatch"));
                            swatch.style.backgroundColor = optionPicked.value;
                        } // end if
                        
                        
                        const propValEl = document.getElementById(propId(sCaptionKey));
                        const sCaption = getVal(optionPicked,"caption", optionPicked.value) ;

                        propValEl.innerText = sCaption;

                        nCurrentDropdownSelIndex = idx;

                        if (typeof leaveOpen === "undefined") {
                            dropdownToggle(); // should toggle dropdown to Hidden/Removed position! 🙂
                        } // end if
                        

                        if (vOldValue !== vNewValue) {
                            setDerivedValue(sObjPropName, vNewValue) 
                            runChangeEventHandlers(prop, vOldValue, vNewValue, "dropdownOptionSelected");
                            runPropLevelChangeEventHandlers(vOldValue, vNewValue, "dropdownOptionSelected")
                        } // end if        

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function procPropOptionSelected()




                    /********************************************************************************
                     * 
                     *   
                     *   #prop_commit_changes_method
                     * 
                     ********************************************************************************/    
                    prop.commitChanges = function() {
                        console.log("prop.commitChanges() called");
                        let propValElInp;

                        try {
                            propValElInp = document.getElementById(propId("orvPropValueInput"));

                            if (propValElInp !== null) {
                                if (sDataType==="cssUom") {
                                    vPendingValue = propValElInp.value
    
                                    if (vPendingValue !== "") {
                                        vPendingValue = vPendingValue + sCurrentUom
                                    } // end if
    
                                } // end if
    
                                propValElInp.removeEventListener("keydown", textBoxHandleKeyup);
                                propValElInp.removeEventListener("keyup", textBoxHandleKeyup);
                                propValElInp.parentElement.removeChild(propValElInp);
                                console.log("child removed")
                                const propValEl = document.getElementById(propId("orvPropValue"));
                                
                                // let sDisplayValue = vPendingValue
                                // if (sDisplayValue === "") {
                                //     propValEl.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                // } else {
                                //     propValEl.innerText = vPendingValue;
                                // } // end if/else

                                updatePropValueDisplayForPropsNamed(prop.propName, vPendingValue)

                                
    
                                if (sDataType === "number" || sDataType === "int") {
                                    if (vPendingValue === "") {
                                        vPendingValue = undefined;
                                    } else {
                                        vPendingValue = vPendingValue - 0;
                                    } // end if/else
    
                                } // end if
    
                                let vOldValue = getDerivedValue(sObjPropName);
                                //let vOldValue = propsObj[sObjPropName];
                                let vNewValue = vPendingValue;
    
                                
                                //propsObj[sObjPropName] = vPendingValue;
    
                                if (vOldValue !== vNewValue) {
                                    setDerivedValue(sObjPropName, vNewValue) 
                                    runChangeEventHandlers(prop, vOldValue, vNewValue, "textEdited");
                                    runPropLevelChangeEventHandlers(vOldValue, vNewValue, "textEdited")

                                    if (typeof fnOnCommit === "function") {
                                        const evtObj = {}
                                        evtObj.event = "commit"
                                        evtObj.timestamp = new Date()
                                        evtObj.oldValue = vOldValue
                                        evtObj.newValue = vNewValue
                                        evtObj.additionalObj = additionalObj
                                        evtObj.propObj = prop;  // the Property object involved
                                        evtObj.propsObj = prop.propsObj // the object that the property belongs to
                                        fnOnCommit(evtObj)
                                    } // end if (typeof fnOnCommit === "function")

                                } // end if                                
    
                            } // end if (propValElInp !== null)

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch

                    } // end of prop.commitChanges() method



                    /********************************************************************************
                     * 
                     *   
                     *   #prop_begin_edit_method
                     * 
                     ********************************************************************************/      
                    prop.beginEdit = function() {
                        const s=[];
                        const Q = '"';
                        let propValEl;

                        try {
                            if (Array.isArray(optionSet)) {
                                return; // if there is an option set, we will not edit value in a text box!
                            } // end if
    
                            bEditingPropValue = true; // property level flag
                            bEditingPanelValue = true;  // panel level flag
                            
                            propValEl = document.getElementById(propId("orvPropValue"));
    
                            if (sDataType==="string" || sDataType==="number" || sDataType==="int" || sDataType==="cssUom") {
                                s.push("<input class='orvPropValueTextBox' ")
                                s.push("id=")
                                s.push(Q)
                                s.push(propId("orvPropValueInput"))
                                s.push(Q)
                                s.push(" maxlength='"+nMaxLength+"' ")
    
                                if (bReadOnly) {
                                    s.push(" readonly ")
                                } // end if
    
                                s.push(">")
    
                                //s.push("")
                                if (sDataType==="cssUom") {
                                    s.push("<div class='orvPropUom' id='orvPropUom' ")
                                    s.push(dataIdx(nIndexNum))
                                    s.push(">")
                                    s.push("px")
                                    s.push("</div>")
                                } // end if
    
                                propValEl.innerHTML = orvCore.safeMarkup(s.join("")); // @@@
                                const propValElInp = document.getElementById(propId("orvPropValueInput"));
                                const orvPropUomNd = document.getElementById("orvPropUom")
                                vBeginEditValue = getDerivedValue(sObjPropName)
                                vPendingValue = vBeginEditValue;
    
                                if (sDataType==="cssUom") {                
                                    [sValue2,sUom] = splitValueAndUom(vBeginEditValue)
                                    propValElInp.value = sValue2;
                                    sCurrentUom = sUom
                                    orvPropUomNd.innerHTML = sUom
                                } else {
                                    propValElInp.value = vBeginEditValue;
                                } // end if/else
                                
                                propValElInp.addEventListener("keydown", textBoxHandleKeydown);
                                propValElInp.addEventListener("keyup", textBoxHandleKeyup);
                                
                                // looking for a 'click' event listener?

                            } // end if (sDataType==="string" || sDataType==="number" || sDataType==="int" || sDataType==="cssUom")

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch

                    } // end of prop.beginEdit() method


                    /**
                     * 
                     * 
                     *  #split_value_and_uom
                     * 
                     */  
                    function splitValueAndUom(sValue) {
                        try {
                            if (sValue === "") {
                                return ['','px']
                            } // end if
    
                            const sCheck = "0123456789"
                            const nMax = sValue.length;
                            for (let n=nMax-1;n>-1;n--) {
                                const sCheckChar = sValue.substr(n,1)
                                nPos = sCheck.indexOf(sCheckChar)
                                if (nPos > -1) {
                                    let sValue2 = sValue.substr(0,n+1)
                                    let sUom = sValue.substr(n+1)
    
                                    if (sUom==="") {
                                        sUom = "px"
                                    } // end if
    
                                    return [sValue2, sUom]
                                } // end if
                            } // next n
    
                            return ['','px']
                            
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch                        
                        
                    } // end of splitValueAndUom()




                    /********************************************************************************
                     * 
                     *   #keystroke_is_non_data_value
                     * 
                     *   Returns (true) if keystroke input is a non-data value
                     *   otherwise, it returns (false)!
                     * 
                     ********************************************************************************/   
                    function keystrokeIsNonDataValue(nKeyCode) {
                        try {
                            switch(nKeyCode) {
                                case ESC_KEY:
                                case ENTER_KEY:
                                case BACKSPACE_KEY:
                                case LEFTARROW_KEY:
                                case UPARROW_KEY:
                                case DOWNARROW_KEY:
                                case RIGHTARROW_KEY:
                                case HOME_KEY:
                                case END_KEY:
                                case INSERT_KEY:
                                case TAB_KEY:
                                case SHIFT_KEY:
                                case CTRL_KEY:
                                case CMD_KEY:
                                    return true;
                                default:
                                    return false;
                            } // end of switch()
    
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function keystrokeIsNonDataValue()



                    /********************************************************************************
                     * 
                     *   #text_box_handle_keydown
                     * 
                     ********************************************************************************/    
                    function textBoxHandleKeydown(evt) {
                        console.log("textBoxHandleKeydown() called.   keyCode="+evt.keyCode)
                        let nKeyCode = evt.keyCode;
                        let propValElInp;
                        
                        try {
                            propValElInp = document.getElementById(propId("orvPropValueInput"));

                            if (keystrokeIsNonDataValue(nKeyCode)) {
                                return true; // let non-data values through
                            } // end if
    
                            if (sDataType==="string") {
                                return true; // let whatever keystroke it is through
                            } // end if
    
                            if (sDataType==="number" || sDataType==="int" || sDataType==="cssUom") {
                                
                                // keyboard number keys across the top of keyboard:
                                if (nKeyCode > 47 && nKeyCode < 58) {
                                    return true; // let characters 0-9 through
                                } // end if
    
                                // numeric keypad number keys:
                                if (nKeyCode > 95 && nKeyCode < 106) {
                                    return true; // let characters 0-9 through
                                } // end if
                            } // end if
    
                            if ((sDataType==="number" || sDataType==="cssUom") && (nKeyCode === 110 || nKeyCode === 190) && propValElInp.value.indexOf(".") === -1) {
                                return true; // let a decimal point through (if none in value yet)
                            } // end if
    
                            if ((sDataType==="number" || sDataType==="int" || sDataType==="cssUom") && nKeyCode === 109) {
                                return true; // let a minus sign through (gotta handle this better)
                            } // end if
    
                            evt.preventDefault();

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch

                    } // end of function textBoxHandleKeydown()



                    /********************************************************************************
                    * 
                    *   #text_box_handle_keyup
                    ********************************************************************************/    
                    function textBoxHandleKeyup(evt) {
                        let nKeyCode = evt.keyCode;
                        let propValElInp,propValEl;

                        try {
                            propValElInp = document.getElementById(propId("orvPropValueInput"));

                            // reset (back out any user changes to property value)
                            if (nKeyCode===ESC_KEY) {
                                propValEl = document.getElementById(propId("orvPropValue"));
                                vPendingValue = vBeginEditValue;
                                propValElInp.removeEventListener("keydown", textBoxHandleKeyup);
                                propValElInp.removeEventListener("keyup", textBoxHandleKeyup);
                                propValElInp.parentElement.removeChild(propValElInp);
                                propValEl.innerText = vPendingValue;
    
                                console.log("child removed")
                                if (bAutoUpdate && typeof altGuiDomEl !== "undefined") {
                                    altGuiDomEl.innerText = vPendingValue;
                                } // end if
    
                                bEditingPropValue = false;
                                bEditingPanelValue = false;  // panel level flag
                                containerNd.focus(); // so it can pick up keystrokes once again!
                                return;
                            } // end if (nKeyCode===ESC_KEY)
    
    
                            if (nKeyCode===ENTER_KEY) {
                                console.log("Enter key pressed")
                                prop.commitChanges();
                                bEditingPropValue = false;
                                bEditingPanelValue = false;  // panel level flag
                                containerNd.focus(); // so it can pick up keystrokes once again!
                                return;
                            } // end if
    
    
                            vPendingValue = propValElInp.value;
    
                            if (bAutoUpdate && typeof altGuiDomEl !== "undefined") {
                                altGuiDomEl.innerText = vPendingValue;
                            } // end if

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function textBoxHandleKeyup()





                    /********************************************************************************
                    * 
                    *   #prop_toggle_prop_value
                    * 
                    *   - User double clicks property on panel...
                    *   - Value is toggled to next value in dropdown list (option set)
                    *   - if double clicked when at last value, the value is set to first
                    *     one in list!
                    ********************************************************************************/    
                    prop.togglePropValue = function() {
                        let refObj,vCurrentValue,nMax,nCurrentIdx,optionSetOption,sOldValue,sNewValue

                        try {
                            if (!Array.isArray(optionSet)) {
                                return;
                            } // end if
    
                            refObj = propsObj
    
                            if (typeof alternateObj !== "undefined") {
                                refObj = alternateObj;
                            } // end if
    
                            vCurrentValue = refObj[sObjPropName];
                            nMax = optionSet.length;
    
                            if (nMax<2) {
                                return; // if this is true, there is no point in going any further!
                            } // end if
    
                            nCurrentIdx = nMax - 1;
    
                            // find out what index the current value is
                            for (let n=0;n<nMax;n++) {
                                const optionSetOption = optionSet[n];
                                if (optionSetOption.value ===vCurrentValue) {
                                    nCurrentIdx = n;
                                    console.log("found current value in option set. index="+nCurrentIdx)
                                    break; // break out of for loop
                                } // end if
                            } // next n
                               
                            do {
                                nCurrentIdx = nCurrentIdx + 1;
    
                                if (nCurrentIdx>nMax-1) {
                                    nCurrentIdx = 0;
                                } // end if
    
                                optionSetOption = optionSet[nCurrentIdx];
                            } while (optionSetOption.optionType === "heading")        
                            
                            
    
                            sOldValue = refObj[sObjPropName]
                            sNewValue = optionSetOption.value
    
                            if (sNewValue !== sOldValue) {
                                refObj[sObjPropName] = sNewValue;
    
                                if (typeof additionalObj !== "undefined") {
                                    additionalObj[sObjPropName] = sNewValue;
                                } // end if
    
                                runChangeEventHandlers(prop, sOldValue, sNewValue, "valueSetOnPropObj");
                                runPropLevelChangeEventHandlers(sOldValue, sNewValue, "valueSetOnPropObj")

                                if (typeof fnOnCommit === "function") {
                                    const evtObj = {}
                                    evtObj.event = "commit"
                                    evtObj.timestamp = new Date()
                                    evtObj.oldValue = sOldValue
                                    evtObj.newValue = sNewValue
                                    evtObj.additionalObj = additionalObj
                                    evtObj.propObj = prop; // the Property object involved
                                    evtObj.propsObj = prop.propsObj  // the object that the property belongs to
                                    fnOnCommit(evtObj)
                                } // end if (typeof fnOnCommit === "function")                                
                                
                            } // end if
    
                            
    
                            if (sDataType !== "color") {            
                                const propValEl = document.getElementById(propId("orvPropValue"));
                                propValEl.innerText = optionSetOption.caption;
                            } else {
                                const swatch = document.getElementById(propId("orvPropSwatch"));
                                swatch.style.backgroundColor = optionSetOption.value;
    
                                const propValEl = document.getElementById(propId("orvPropColorCode"));
                                const sCaption = getVal(optionSetOption,"caption", optionSetOption.value) ;
                                propValEl.innerText = sCaption;
                            } // end if/else
    
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of prop.togglePropValue() method






                    /********************************************************************************
                    * 
                    *   
                    *    #get_option_set_caption
                    * 
                    ********************************************************************************/    
                    function getOptionSetCaption(vValue) {
                        let nMax;

                        try {
                            nMax = optionSet.length;

                            for (let n=0;n<nMax;n++) {
                                const optionSetItm = optionSet[n];
                                if (optionSetItm.value === vValue) {
                                    return optionSetItm.caption;
                                }
                            } // next n
                            return "???"

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function getCurrentOptionSetCaption() 




                    /********************************************************************************
                    * 
                    *   
                    *   #prop_markup_method
                    * 
                    *   class selectors are built by the:  buildPropStyleBlock()  function!
                    * 
                    ********************************************************************************/
                    prop.markup = function(idx) {
                        const s=[];
                        const Q = '"';

                        try {
                            let refObj = propsObj

                            // if (typeof alternateObj !== "undefined") {
                            //     refObj = alternateObj;
                            // } // end if
                    
                            // if (typeof additionalObj !== "undefined" && typeof refObj[sObjPropName] === "undefined") {
                            //     refObj = additionalObj
                            // } // end if
                    
                            // Hone in on a specific property for debugging:
                            if (sBreakOnPropertyName === sObjPropName && sBreakOnPropertyName !== "") {
                                console.log("Breaking on Property Name: '"+sObjPropName+"'")
                                //debugger;
                            } // end if
                            
                            if (sDataType==="section" && idx > 0) {
                                s.push("<li class='orvPropLiSectionSpacer'></li>")
                            } // end if

                            s.push("<li class='orvPropLi'  ")
                            s.push("id="+Q+propId("li")+Q+" ")
                            s.push(dataIdx())
                            s.push(">")
                    
                            let sPropClassName = "orvProp"
                            if (sDataType==="section") {
                                sPropClassName = "orvPropSection"
                            } // end if (sDataType==="section")
                            
                            if (sDataType==="subsection") {
                                sPropClassName = "orvPropSubSection"
                            } // end if (sDataType==="subsection")

                            s.push("<div class='"+sPropClassName+"' ")
                            s.push("id="+Q+propId("orvProp")+Q+" ")
                            s.push(dataIdx())
                            s.push(">")

                            //orvPropNameSection
                            sPropClassName = "orvPropName"
                            if (sDataType==="section") {
                                sPropClassName = "orvPropNameSection"
                            } // end if (sDataType==="section")
                    
                            s.push("<div class='"+sPropClassName+"' ")
                            s.push("id="+Q+propId("orvPropName")+Q+" ")
                            s.push(dataIdx())
                            s.push(">")
                    
                            if (bBold) {
                                s.push("<b>")
                            } // end if
                    
                            if (sPropName === "left") {
                            // debugger
                            }
                    
                    
                            s.push(sPropName)
                    
                            if (bBold) {
                                s.push("</b>")
                            } // end if
                    
                            s.push("</div>"); // orvPropName
                    

                            if (sDataType==="section" || sDataType==="subsection") {
                                s.push("</div>"); // orvProp    
                                s.push("</li>")
                                return s.join("");
                                // if 'section' or 'subsection' property,
                                // we're not going to display a 'value'
                            } // end if  (sDataType==="section")

                            s.push("<div class='orvPropValue' ")
                            s.push("id="+Q+propId("orvPropValue")+Q+" ")
                            s.push(dataIdx())
                            s.push(">")
                    
                            if (typeof refObj[sObjPropName] === "undefined") {
                                // property not defined... so define it as a blank string
                                refObj[sObjPropName] = ""
                                
                            } // end if
                    
                            if (bBold) {
                                s.push("<b>")
                            } // end if
                    
                    
                            if (sDataType==="string" || sDataType==="int" || sDataType==="number" || sDataType==="cssUom") {
                                if (!Array.isArray(optionSet)) {
                                    let sValue = refObj[sObjPropName];

                                    if (sValue==="") {
                                        s.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
                                    } else {
                                        s.push(sValue)
                                    } // end if/else
                                    
                                } else {
                    
                                    s.push(getOptionSetCaption(refObj[sObjPropName]))
                    
                                } // if/else
                    
                            } // end if
                    
                            if (sDataType==="boolean" && typeof refObj[sObjPropName] === "boolean") {
                                const bVal = refObj[sObjPropName];
                    
                                if (bVal) {
                                    s.push("True")
                                } else {
                                    s.push("False")
                                } // end if/else
                    
                            } // end if
                    
                            if (sDataType==="color") {            
                                s.push(getColorValueMarkup())
                                
                            } // end if
                    
                            if (bBold) {
                                s.push("</b>")
                            } // end if
                    
                            s.push("</div>"); // orvPropValue
                    
                            s.push("</div>"); // orvProp
                    
                            s.push("</li>")
                            return s.join("");
                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                                debugger;
                            })
                        } // end of try/catch

                    } // end of prop.markup() method

                


                    /********************************************************************************
                    * 
                    *   
                    *   #get_color_value_markup
                    * 
                    ********************************************************************************/    
                    function getColorValueMarkup() {
                        const s=[];
                        let sColor,bHasOptionSet

                        try {
                            sColor = propsObj[sObjPropName];

                            if (typeof sColor === "undefined") {
                                sColor = "";
                            } // end if
    
                            if (sColor !== "") {
                                if (sColor.substr(0,1) !== "#") {
                                    sColor = getHexColorValue(sColor)
                                } // end if
                            } // end if                       
    
                            bHasOptionSet = Array.isArray(optionSet);
    
                            //s.push("")
                            if (bHasOptionSet) {
                                s.push("<div class='orvPropSwatch' ")
                            } else {
                                s.push("<input class='orvPropInpSwatch' type='color' ")
                                s.push("title='click here to change color value...' ")
                                s.push("value='"+sColor+"' ")
                                swatchIdListByIndex.push(prop)
                            } // end if/else
                            
                            s.push("id="+Q+propId("orvPropSwatch")+Q+" ")
                            s.push(dataIdx())
    
                            if (bHasOptionSet) {
                                s.push("style='background:"+sColor+";'")
                            } // end if
    
                            s.push(dataIdx())
    
                            s.push(">")
    
                            if (bHasOptionSet) {
                                s.push("</div>"); // orvPropSwatch
                            } else { 
                                // draw a frame around input tag swatch which still allows
                                // the user to interact with the swatch with their mouse.
                                s.push("<div class='orvPropInpSwatchFrame1'></div>")
                                s.push("<div class='orvPropInpSwatchFrame2'></div>")
                                s.push("<div class='orvPropInpSwatchFrame3'></div>")
                                s.push("<div class='orvPropInpSwatchFrame4'></div>")
                            } // end if
    
                            if (bHasOptionSet) {
                                s.push("<div class='orvPropColorCode' ")
                            } else {
                                s.push("<div class='orvPropColorCode2' ")
                            } // end if
    
                            s.push(dataIdx())
    
                            s.push("id="+Q+propId("orvPropColorCode")+Q+" ")
                            s.push(">");
                            s.push(sColor);
                            s.push("</div>"); // orvPropColorCode
    
                            return s.join("");

                        } catch(err) {
                            orvCore_comp.displayErrMsg(err,{},function(err) {
                              debugger;
                            }) 
                        } // end of try/catch
                        
                    } // end of function getColorValueMarkup()



                    
                // 🔵🔵🔵 🔨🔨🔨 Overall CreateProp constructor error handler below: 🔨🔨🔨 🔵🔵🔵
                } catch(err) {
                    sDescr = "Overall CreateProp constructor error handler"
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                    debugger;
                    }) 
                } // end of try/catch


            } // end of CreateProp() constructor


            /********************************************************************************
             * 
             *   
             *   #sel_first_prop
             * 
             ********************************************************************************/
            function selFirstProp() {
                try {
                    if (propsByIndex.length === 0) {
                        return; // @ this point, there are no properties to select yet!
                    } // end if
                
                    if (nLastSelectedPropIndex > -1) {
                        const lastProp = propsByIndex[nLastSelectedPropIndex];
                        lastProp.deSelProp();
                    } // end if
                
                    // find first property object that is not a section and select it!
                    const nMax = propsByIndex.length;
                    for (let n=0;n<nMax;n++) {
                        const prop = propsByIndex[n];
                        if (prop.dataType !== "section") {
                            prop.selProp();
                            nLastSelectedPropIndex = n;
                            break;
                        } // end if
                    } // next n
                    
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                        debugger;
                    })
                } // end of try/catch
                
            } // end of function selFirstProp()



            // #prop_container_event_listeners
            containerNd.addEventListener("click", propsClick);
            containerNd.addEventListener("dblclick", propsDblClick);
            containerNd.addEventListener("keydown", keyDownNav);
            containerNd.addEventListener("focus", panelFocus);
            containerNd.addEventListener("blur", panelBlur);

            console.log("--- top level event listeners added")





            /********************************************************************************
             * 
             *   
             *   #panel_focus
             * 
             ********************************************************************************/
            function panelFocus(evt) {
                console.log("   --- 🔎🔎 %cproperty panel received focus!","color:red;");
                let titleBar;

                try {
                    titleBar = document.getElementsByClassName("orvPropsTitlebar")[0];

                    if (typeof titleBar !== "undefined") {        
                        titleBar.className = "orvPropsTitlebarFocus";
                        console.log("   --- titlebar's className has been set to: 'orvPropsTitlebarFocus'")
                    } // end if

                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch 

            } // end of function panelFocus()




            /********************************************************************************
             * 
             *   
             *   #panel_blur
             * 
             ********************************************************************************/
            function panelBlur(evt) {
                //console.log("   --- 🔎🔎 %cproperty panel Lost focus!","color:red;");
                const el = evt.relatedTarget; // what got the focus instead
                
                try {

                    if (bShowingCssUomPopup) return; // leave up to another event to hide it

                    if (nLastSelectedPropIndex > -1) {
                        const lastProp = propsByIndex[nLastSelectedPropIndex];
                        lastProp.hideUomDropdown()
    
                        if (el !== null) {
                            sId = el.id;
                            console.log("sId='"+sId+"'")
                            nPos = sId.indexOf("PropDropdown")
                            console.log("nPos="+nPos)
                            if (nPos === -1) {
                                lastProp.hideDropdown();
                            } // end if
                        } else {
                            console.log("el (relatedTarget) === null")
                        } // end if (el !== null) / else     
                        
                    } // end if (nLastSelectedPropIndex > -1) 
                    
    
                    const titleBar = document.getElementsByClassName("orvPropsTitlebarFocus")[0];
    
                    if (typeof titleBar !== "undefined") {        
                        titleBar.className = "orvPropsTitlebar";
                        //console.log("   --- titlebar's className has been set to: 'orvPropsTitlebar'")
                    } // end if

                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch

            } // end of function panelBlur()




            function updatePropValueDisplayForPropsNamed(sPropName, vValue) {
                try {
                    const propNameInfo = propDataByPropName[sPropName]
                    const nMax = propNameInfo.propsUsingThisNameByIndex.length
                    for (let n=0;n<nMax;n++) {
                        const prop = propNameInfo.propsUsingThisNameByIndex[n]

                        if (typeof prop.propValueDiv !== "undefined") {
                            if (vValue==="") {
                                vValue = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                prop.propValueDiv.innerHTML = vValue
                            } else if (prop.propValueDiv.innerText !== vValue) {
                                prop.propValueDiv.innerText = vValue
                            } // end if
                        } // end if
                    } // next n
                } catch(err) {
                    orvCore.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch
            } // end of updatePropValueDisplayForPropsNamed()


            /********************************************************************************
             * 
             *   
             *   #key_down_nav
             * 
             *   Handle navigating properties in panel and items in dropdown using the Keyboard!
             * 
             *     - use ESC key to cancel dropdown
             *     - use up/down arrow keys to move through properties (if dropdown not shown)
             *     - use ENTER/ left arrow/right arrow to move to First property (if not editing in text box)
             *     - use up/down arrow keys to move through value options if dropdown IS shown!
             * 
             ********************************************************************************/
            function keyDownNav(evt) {
                console.log("keyDownNav() called.   keyCode="+evt.keyCode)
                let nKeyCode = evt.keyCode;

                const lastProp = propsByIndex[nLastSelectedPropIndex];

                // is a dropdown being displayed?
                let bDropDown = false;
                let orvPropDropdown = document.getElementsByClassName("orvPropDropdownList")[0]
                if (typeof orvPropDropdown !== "undefined" && orvPropDropdown !== null) {
                    bDropDown = true;
                } // end if

                if (nKeyCode === ESC_KEY) {
                    lastProp.hideUomDropdown()
                    return;
                } // end if
                
                if (nKeyCode === ESC_KEY && bDropDown) {
                    lastProp.hideDropdown();        
                    return;
                } // end if

                if (!bDropDown && !bEditingPanelValue) {
                    if (nKeyCode === UPARROW_KEY) {
                        if (nLastSelectedPropIndex > 0) {
                            nLastSelectedPropIndex = nLastSelectedPropIndex - 1;
                            const newProp = propsByIndex[nLastSelectedPropIndex];
                            lastProp.deSelProp();
                            newProp.selProp();
                        } // end if

                        return
                    } // end if (nKeyCode === UPARROW_KEY)


                    if (nKeyCode === DOWNARROW_KEY) {
                        if (nLastSelectedPropIndex < propsByIndex.length - 1) {
                            nLastSelectedPropIndex = nLastSelectedPropIndex + 1;
                            const newProp = propsByIndex[nLastSelectedPropIndex];
                            lastProp.deSelProp();
                            newProp.selProp();
                        } // end if
                        return
                    } // end if (nKeyCode === DOWNARROW_KEY)

                    // any keystrokes that would make selected property jump to the 
                    // First property (like in Microsoft's IDE)...
                    switch(nKeyCode) {
                        case LEFTARROW_KEY:
                        case RIGHTARROW_KEY:
                        case ENTER_KEY:
                            selFirstProp();
                            return;
                        default:

                    } // end of switch()
                    return;
                } // end if (!bDropDown && !bEditingPanelValue)

            } // end of function keyDownNav()



            /********************************************************************************
             * 
             *   
             *   #props_click
             * 
             ********************************************************************************/
            function propsClick(evt) {
                console.log("propsClick() called")
                const el = evt.srcElement;

                try {
                    console.log("######")
                    console.log(" -- el.className: "+el.className)
                    console.log(" -- el.id: "+el.id)
    
                    if (el.id === "orvPropsListCntr") {
                        if (nLastSelectedPropIndex > -1) {
                            const lastProp = propsByIndex[nLastSelectedPropIndex];
                            
                            lastProp.hideDropdown();        
    
                            //console.log("about to call prop.hideUomDropdown()...")
                            lastProp.hideUomDropdown()
                            return;
                        } // end if
    
                        
                    } // end if

                    if (el.className !== "orvPropName" && el.className !== "orvPropValue"  && el.className !== "orvPropInpSwatch" 
                        && el.className !== "orvPropSwatch" && el.className !== "orvProp" && el.className !== "orvPropNameSel"
                        && el.className !== "orvPropColorCode" && el.className !== "orvPropColorCode2"
                        && el.className !== "orvPropUom") {
                        return;
                    } // end if
                    
    
                    const idx = el.dataset.idx - 0;
    
                    const prop = propsByIndex[idx];
    
                    if (el.className === "orvPropUom") {
                        prop.showUomDropdown(el)        
                        return;
                    } // end if
    
                    if (nLastSelectedPropIndex > -1) {
                        const lastProp = propsByIndex[nLastSelectedPropIndex];
                        lastProp.deSelProp();
                    } // end if
    
                    prop.selProp();
    
                    if (el.className === "orvPropValue") {
                        prop.beginEdit();
                    } // end if
    
                    nLastSelectedPropIndex = idx;    
                    
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch
                
            } // end of function propsClick()




            /********************************************************************************
             * 
             *   
             *   #props_dbl_click
             * 
             ********************************************************************************/
            function propsDblClick(evt) {
                const el = evt.srcElement;

                try {
                    if (nLastSelectedPropIndex > -1) {
                        const prop = propsByIndex[nLastSelectedPropIndex];
                        prop.togglePropValue()
                    } // end if
                } catch(err) {
                    orvCore_comp.displayErrMsg(err,{},function(err) {
                      debugger;
                    }) 
                } // end of try/catch
                
            } // end of function propsClick()




            /********************************************************************************
             * 
             *   #get_val
             ********************************************************************************/
            function getVal(params,sParam,defVal) {
                if (!params) {
                    params = {};
                } // end if

                if (typeof params[sParam] !== "undefined") {
                    return params[sParam];
                } else {
                    return defVal;
                } // if / else

            } // end of function getVal()


    } catch(overallErr) {
        sDescr = "Overall OrvProps constructor error handler"
        orvCore_comp.displayErrMsg(overallErr,{descr:sDescr},function(err) {
          debugger;
        }) 
    } // end of try/catch


} // end of OrvProps constructor