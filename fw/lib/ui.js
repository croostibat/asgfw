createPackage("ui");
createPackage("ui.base");
createPackage("ui.container");
createPackage("ui.std");

/* @class ui.Event
 * 
 * */
createClass({
	_name               : "Event",
    _package            : "ui",
    _extends            : ["std.proc.Event"],

    /* @attributes 
     */
    uiBrick             : {_type: "ui.base.Brick", _getter: true, _autoSet: true},
    
    /* @method UiEvent.constructor(_p)
     * _p.callbackFn (Function) : the main function to be called when the event will be triggered */
    constructor         : {_type: "Method", 
        _method         : function(_p) {
            this.callback.addParam("uiEvent",this);
        }
    } 
});

/*
 * 
 * */
createClass({
    _name               : "Stylable",
    _package            : "ui.base",
    _virtual            : true,
    
    className           : {_type: "String", _getter: true, _setter: true, _autoSet: true},
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
    color               : {_type: "String", _getter: true, _setter: true, _autoSet: true},

    borderColor         : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    borderBottomStyle   : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    borderBottomWidth   : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    borderBottomColor   : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    fontFamily          : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    fontSize            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    textAlign           : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    applyStyles         : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name               : "Eventable",
    _package            : "ui.base",
    _virtual            : true,
       
	onActivate			: {_type: "ui.Event", _getter: true, _autoSet: true},
	onClick             : {_type: "ui.Event", _getter: true, _autoSet: true},   
                   
    applyEvents         : {_type: "Method", _method: null}
});

/*****************************************************************************/
/* @class ui.base.Brick
 * 
 * */
 createClass({
	_name               : "Brick",
    _package            : "ui.base",
	_extends            : ["std.chainer.Node","ui.base.Stylable","ui.base.Eventable"],
    
    id                  : {_type: "std.Id", _getter: true},
    help                : {_type: "String", _getter: true, _autoSet: true},
    
    domRoot             : {_type: "Object", _getter: true},
    domFirstElement     : {_type: "Object"},
    
    constructor         : {_type: "Method", 
        _method: function(_p) {
            this.children       = new std.collection.MapArray();
            this.domRoot        = _p.domRoot;
            this.id             = new std.misc.Id();
            
            if (isFunction(_p.onActivate)) {
                this.onActivate = new ui.Event({fn:_p.onActivate, uiBrick: this});
            }
            if (isFunction(_p.onClick)) {
                this.onClick = new ui.Event({fn:_p.onClick, uiBrick: this});
            }
        }
    },
    
    /* @method UiHTML.setRoot
     * @params
     */
    setRoot         : {_type: "Method", 
        _method: function(_domRoot) {
            this.domRoot = _domRoot;
            this.domRoot.appendChild(this.domFirstElement);            
        }
    },
            
    applyStyles     : {_type: "Method", _overloadable   : true,
        _method  : function() {
            if (this.domFirstElement) {
                if (this.domFirstElement.className !== this.className) this.domFirstElement.className = this.className;
                if (this.domFirstElement.style.width !== this.width) this.domFirstElement.style.width = this.width;
                if (this.domFirstElement.style.height !== this.height) this.domFirstElement.style.height = this.height;

                if (this.domFirstElement.style.padding !== this.padding) this.domFirstElement.style.padding = this.padding;
                if (this.paddingTop !== null && this.domFirstElement.style.paddingTop !== this.paddingTop) this.domFirstElement.style.paddingTop = this.paddingTop;
                if (this.paddingBottom !== null && this.domFirstElement.style.paddingBottom !== this.paddingBottom) this.domFirstElement.style.paddingBottom = this.paddingBottom;
                if (this.paddingLeft !== null && this.domFirstElement.style.paddingLeft !== this.paddingLeft) this.domFirstElement.style.paddingLeft = this.paddingLeft;
                if (this.paddingRight !== null && this.domFirstElement.style.paddingRight !== this.paddingRight) this.domFirstElement.style.paddingRight = this.paddingRight;

                if (this.domFirstElement.style.margin !== this.margin) this.domFirstElement.style.margin = this.margin;
                if (this.marginTop !== null && this.domFirstElement.style.marginTop !== this.marginTop) this.domFirstElement.style.marginTop = this.marginTop;
                if (this.marginBottom !== null && this.domFirstElement.style.marginBottom !== this.marginBottom) this.domFirstElement.style.marginBottom = this.marginBottom;
                if (this.marginLeft !== null && this.domFirstElement.style.marginLeft !== this.marginLeft) this.domFirstElement.style.marginLeft = this.marginLeft;
                if (this.marginRight !== null && this.domFirstElement.style.marginRight !== this.marginRight) this.domFirstElement.style.marginRight = this.marginRight;

                if (this.borderBottomColor !== null && this.domFirstElement.style.borderBottomColor !== this.borderBottomColor) this.domFirstElement.style.borderBottomColor = this.borderBottomColor;
                if (this.borderBottomWidth !== null && this.domFirstElement.style.borderBottomWidth !== this.borderBottomWidth) this.domFirstElement.style.borderBottomWidth = this.borderBottomWidth;
                if (this.borderBottomStyle !== null && this.domFirstElement.style.borderBottomStyle !== this.borderBottomStyle) this.domFirstElement.style.borderBottomStyle = this.borderBottomStyle;

                if (this.backgroundColor !== null && this.domFirstElement.style.backgroundColor !== this.backgroundColor) this.domFirstElement.style.backgroundColor = this.backgroundColor;
                if (this.borderColor !== null && this.domFirstElement.style.borderColor !== this.borderColor) this.domFirstElement.style.borderColor = this.borderColor;
                if (this.color !== null && this.domFirstElement.style.color !== this.color) this.domFirstElement.style.color = this.color;

                if (this.domFirstElement.style.fontFamily !== this.fontFamily) this.domFirstElement.style.fontFamily = this.fontFamily;
                if (this.domFirstElement.style.fontSize !== this.fontSize) this.domFirstElement.style.fontSize = this.fontSize;

                if (this.domFirstElement.style.textAlign !== this.textAlign) this.domFirstElement.style.textAlign = this.textAlign;

            }
        }
    },
            
    applyEvents       : {_type: "Method", _overloadable   : true,
        _method     : function() {
            if (this.onActivate) {
                this.domFirstElement.onclick     = this.onActivate.getTrigger();
            }
            if (this.onClick) {
                this.domFirstElement.onclick     = this.onClick.getTrigger();
            }
        }
    }
});


/*
 * 
 * */
createClass({
	_name               : "Element",
    _package            : "ui.base",
	_extends            : ["ui.base.Brick"],
    
    value               : {_type: "String", _getter: true, _autoSet: true},   
    
    applyValues         : {_type: "Method", _overloadable   : true,
        _method     : function() {
            if (this.domFirstElement.innerHTML !== this.value) this.domFirstElement.innerHTML = this.value;
        }
    },
    
    draw                : {_type: "Method", _overloadable   : true,
        _method: function() {
            this.applyEvents();
            this.applyStyles();
            this.applyValues();
        }
    }
});

/*
 *
 * */
createClass({
	_name 			: "Container",
    _package        : "ui.base",
	_extends		: ["ui.base.Brick"],
    
    domRootChildren : {_type: "Object", _getter: true, _setter: true},
    
    addUiElement    : {_type: "Method",
        _method: function(_element) {
            if (implements("ui.base.Brick",_element)) {
                this.addChild(_element);
                _element.setRoot(this.getDomRootChildren());
            }
        }
    },
            
    draw            : {_type: "Method", _overloadable   : true,
        _method: function() {
            this.applyEvents();
            this.applyStyles();
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "Pane",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
	
    constructor     : {_type: "Method", 
        _method : function(_p) {            
            
            this.className = (this.className ? this.className : "uiContainerPane");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            this.domFirstElement = document.createElement("div");                 
            this.setDomRootChildren(this.domFirstElement);
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "PanesH",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbColumns       : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {_type: "Method", 
        _method: function(_p) {
            
            this.className = (this.className ? this.className : "uiContainerPaneH");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            var pane, spacer, i;
            
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = this.className;                
            this.setDomRootChildren(this.domFirstElement);
            
            this.panesSettings          = (this.panesSettings ? this.panesSettings : {});
            this.panesSettings.width    = (this.panesSettings.width ? this.panesSettings.width : Math.round(100 / this.nbColumns) + "%");
            
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
    
    getPane    : {_type: "Method", 
        _method : function(_column) {
            return this.children.get(_column);
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "PanesV",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {_type: "Method", 
        _method: function(_p) {;
            
            this.className = (this.className ? this.className : "uiContainerPaneV");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
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
    
    getPane    : {_type: "Method", 
        _method : function(_row) {
            return this.children.get(_row);
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "PanesS",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    nbColumns       : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    constructor     : {_type: "Method", 
        _method: function(_p) {
            this.className = (this.className ? this.className : "uiContainerPaneS");
            
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
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
    
    setRowHeight : {_type: "Method", 
        _method : function(_row, _height) {
            var i, pane;
            for (i = 0; i < this.nbColumns; i++) {
                pane = this.getPane(i, _row);
                pane.setHeight(_height);
                pane.draw();
            }
        }
    },
    
    setColumnWidth : {_type: "Method", 
        _method : function(_column, _width) {
             var i, pane;
            for (i = 0; i < this.nbRows; i++) {
                pane = this.getPane(_column, i);
                pane.setWidth(_width);
                pane.draw();
            }            
        }
    },
    
    getPane    : {_type: "Method", 
        _method : function(_colum, _row) {
            return this.children.get(_colum + ":" + _row);
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "Button",
    _package        : "ui.std",
	_extends		: ["ui.base.Container"],   
     
    label           : {_type: "ui.label", _getter: true},
    
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.build(_p);
            this.draw();
		}
	},
    
    build           : {_type: "Method", 
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
 * */
createClass({
	_name 			: "Text",
    _package        : "ui.std",
	_extends		: ["ui.base.Element"],
    
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.build();
            this.draw();
		}
	},
    
    build           : {_type: "Method", 
        _method: function() {
            this.domFirstElement = document.createElement("div");            
            this.domFirstElement.className = "uiStdLabel";
        }
    }
});

/*
 * 
 * */
createClass({
	_name 			: "Image",
    _package        : "ui.std",
	_extends		: ["ui.base.Element"],
    
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.build();
            this.draw();
		}
	},
    
    build           : {_type: "Method", 
        _method: function() {
            this.domFirstElement = document.createElement("img");            
            this.domFirstElement.className = "uiStdImage";
        }
    }
});