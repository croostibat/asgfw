createPackage("ui");
createPackage("ui.base");
createPackage("ui.container");
createPackage("ui.std");
createPackage("ui.form");
/*****************************************************************************/
/* @class ui.Event
 * 
 */
createClass({
    
	_name               : "Event",
    _package            : "ui",
    _extends            : ["std.proc.Event"],

    /* @attributes 
     */
    uiElement           : {_type: "UiElement", _getter: true, _setter: true, _autoSet: true},
    
    /* @method UiEvent.constructor(_p)
     * _p.callbackFn (Function) : the main function to be called when the event will be triggered */
    constructor         : {
        _method         : function(_p) {
            this.callback.addParam("uiEvent",this);
        }
    } 
});
/*****************************************************************************/

/*****************************************************************************/
/* @class ui.Brick
 * 
 */
 createClass({
	_name               : "Brick",
    _package            : "ui.base",
	_extends            : ["std.chainer.Node"],
    
    className           : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    id                  : {_type: "std.Id", _getter: true},
    help                : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    text                : {_type: "String", _getter: true, _setter: true, _autoSet: true},   
    width               : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    height              : {_type: "String", _getter: true, _setter: true, _autoSet: true},    

    padding             : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    paddingLeft         : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    paddingRight        : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    paddingTop          : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    paddingBottom       : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    margin              : {_type: "String", _getter: true, _setter: true, _autoSet: true},    
    marginLeft          : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    marginRight         : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    marginTop           : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    marginBottom        : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    backgroundColor     : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    borderColor         : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
	onActivate			: {_type: "ui.Event", _getter: true, _setter: true, _autoSet: true},
    
    domRoot             : {_type: "Object", _getter: true},
    domFirstElement     : {_type: "Object"},
    
    constructor     : {
        _method: function(_p) {
            this.children       = new std.collection.MapArray();
            this.domRoot        = _p.domRoot;
            this.id             = new std.misc.Id();
        }
    },
    
    /* @method UiHTML.setRoot
     * @params
     */
    setRoot         : {
        _method: function(_domRoot) {
            this.domRoot = _domRoot;
            this.domRoot.appendChild(this.domFirstElement);            
        }
    },
    
    applyStyle        : {
        _overloadable   : true,
        _method     : function() {
            var temp;
            /* */
            
            temp = this.getClassName();
            if (temp) { this.domFirstElement.className = temp;}
            temp = this.getWidth();
            if (temp) { this.domFirstElement.style.width = temp;}
            temp = this.getHeight();
            if (temp) { this.domFirstElement.style.height = temp;}
            /* Padding */
            temp = this.getPadding();
            if (temp) { this.domFirstElement.style.padding = temp;}
            temp = this.getPaddingLeft();
            if (temp) { this.domFirstElement.style.paddingLeft = temp;}
            temp = this.getPaddingRight();
            if (temp) { this.domFirstElement.style.paddingRight = temp;}
            temp = this.getPaddingTop();
            if (temp) { this.domFirstElement.style.paddingTop = temp;}
            temp = this.getPaddingBottom();
            if (temp) { this.domFirstElement.style.paddingBottom = temp;}
            /* Margin */
            temp = this.getMargin();
            if (temp) { this.domFirstElement.style.margin = temp;}
            temp = this.getMarginLeft();
            if (temp) { this.domFirstElement.style.marginLeft = temp;}
            temp = this.getMarginRight();
            if (temp) { this.domFirstElement.style.marginRight = temp;}
            temp = this.getMarginTop();
            if (temp) { this.domFirstElement.style.marginTop = temp;}
            temp = this.getMarginBottom();
            if (temp) { this.domFirstElement.style.marginBottom = temp;}
            /* Border / Background */
            temp = this.getBackgroundColor();
            if (temp) { this.domFirstElement.style.backgroundColor = temp;}
            temp = this.getBorderColor();
            if (temp) { this.domFirstElement.style.borderColor = temp;}
        }
    },
    
    applyEvents       : {
        _overloadable   : true,
        _method     : function() {
            if (this.onActivate) {
                this.domFirstElement.onclick     = this.onActivate.getTrigger();
            } 
        }
    },
    
    applyValues       : {
        _overloadable   : true,
        _method     : function() {
            var temp;
            
            temp = this.getText();
            if (temp) { this.domFirstElement.innerHTML = temp;};
        }
    },
    
    draw            : {
        _overloadable   : true,
        _method: function() {
            this.applyValues();
            this.applyEvents();
            this.applyStyle();
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "Container",
    _package        : "ui.base",
	_extends		: ["ui.base.Brick"],
    
    domRootChildren : {_type: "Object", _getter: true, _setter: true},
    
    addUiElement   : {
        _method: function(_element) {
            if (implements("ui.base.Brick",_element)) {
                this.addChild(_element);
                _element.setRoot(this.getDomRootChildren());
            }
        }
    },
    
    constructor     : {
        _method: function(_p) {
            
        }
    },
    
    draw            : {
        _overload   : true,
        _method: function() {
            this.applyEvents();
            this.applyStyle();
        }
    }
});

/*****************************************************************************/

/*****************************************************************************/
/*
 *
 */
createClass({
	_name 			: "Window",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
	
    constructor     : {
        _method : function(_p) {
            this.build();
            this.draw();
        }
    },
    
    build           : {
        _method: function() {
            var statesBar, buttonsBar, content;
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = "uiContainerWindow";         
            statesBar =  new ui.container.Pane({});
            content = document.createElement("div");            
            buttonsBar = document.createElement("div");            
            
            this.setDomRootChildren(this.domFirstElement);
        }
    }
});
/*
 *
 */
createClass({
	_name 			: "Pane",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
	
    constructor     : {
        _method : function(_p) {
            this.build();
            this.draw();
        }
    },
    
    build           : {
        _method: function() {
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = "uiContainerPane";                
            this.setDomRootChildren(this.domFirstElement);
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "PaneH",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbColumns       : {_type: "Number", _autoSet: true},    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {
        _method: function(_p) {
            
            this.className = (this.className ? this.className : "uiContainerPaneH");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {
        _method: function() {
            var pane, spacer, i;
            
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = this.className;                
            this.setDomRootChildren(this.domFirstElement);
            // Ajoute les différents panes
            for(i = 0; i < this.nbColumns; i++) {
                pane = new ui.container.Pane(this.panesSettings);
                this.children.set(pane,i);
                this.addUiElement(pane);
            }
            spacer = document.createElement("div");            
            spacer.className = "spacer";
            this.domFirstElement.appendChild(spacer);
        }
    },
    
    getPane    : {
        _method : function(_column) {
            return this.children.get(_column);
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "PanesV",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {
        _method: function(_p) {;
            
            this.className = (this.className ? this.className : "uiContainerPaneV");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {
        _method: function() {
            var pane, spacer, i;
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = "uiContainerPaneV";
            this.setDomRootChildren(this.domFirstElement);
            // Ajoute les différents panes
            for(i = 0; i < this.nbRows; i++) {
                pane = new ui.container.Pane(this.panesSettings);
                this.children.set(pane,i);
                this.addUiElement(pane);
            }
            spacer = document.createElement("div");            
            spacer.className = "spacer";
            this.domFirstElement.appendChild(spacer);            
        }
    },
    
    getPane    : {
        _method : function(_row) {
            return this.chdilren.get(_row);
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "PanesS",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    nbColumns       : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {
        _method: function(_p) {;
            
            this.className = (this.className ? this.className : "uiContainerPaneS");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {
        _method: function() {
            var pane, spacer, i, j;
            
            this.domFirstElement = document.createElement("div");            
            this.setDomRootChildren(this.domFirstElement);
                    
            for(j = 0; j < this.nbColumns; j++) {
                for(i = 0; i < this.nbColumns; i++) {
                    pane = new ui.container.Pane(this.panesSettings);
                    this.children.set(pane, i + ":" + j);
                    this.addUiElement(pane);
                }
            
                spacer = document.createElement("div");            
                spacer.className = "spacer";
                this.domFirstElement.appendChild(spacer);
            }
        }
    },
    
    setRowHeight : {
         _method : function(_row, _height) {
            var i, pane;
            for (i = 0; i < this.nbColumns; i++) {
                pane = this.getPane(i, _row);
                pane.setHeight(_height);
                pane.draw();
            }
        }
    },
    
    setColumnWidth : {
         _method : function(_column, _width) {
             var i, pane;
            for (i = 0; i < this.nbRows; i++) {
                pane = this.getPane(_column, i);
                pane.setWidth(_width);
                pane.draw();
            }            
        }
    },
    
    getPane    : {
        _method : function(_colum, _row) {
            return this.children.get(_colum + ":" + _row);
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "Button",
    _package        : "ui.std",
	_extends		: ["ui.base.Container"],   
     
    label           : {_type: "ui.label", _getter: true},
    
    constructor		: {
        _method:function(_p) {
            this.build(_p);
            this.draw();
		}
	},
    
    build           : {
        _method: function(_p) {
            this.domFirstElement = document.createElement("div");            
            this.setDomRootChildren(this.domFirstElement);
            this.label = new ui.std.Label(_p);
            this.addUiElement(this.label);
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "Label",
    _package        : "ui.std",
	_extends		: ["ui.base.Brick"],
    
    constructor		: {
        _method:function(_p) {
            this.build();
            this.draw();
		}
	},
    
    build           : {
        _method: function() {
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = "uiStdLabel";
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "Image",
    _package        : "ui.std",
	_extends		: ["ui.base.Brick"],
    
    constructor		: {
        _method:function(_p) {
            this.build();
            this.draw();
		}
	},
    
    build           : {
        _method: function() {
            this.domFirstElement = document.createElement("img");            
            this.domFirstElement.className = "uiStdImage";
        }
    }
});

/*
 * 
 */
createClass({
	_name 			: "TextArea",
    _package        : "ui.form",
	_extends		: ["ui.base.Brick"],
    
    constructor		: {
        _method:function(_p) {
            this.build();
            this.draw();
		}
	},
    
    build           : {
        _method: function() {
            this.domFirstElement = document.createElement("textarea");            
            this.domFirstElement.className = "uiTextArea";
        }
    }
});
/*****************************************************************************/
