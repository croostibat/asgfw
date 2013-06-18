createPackage("ui");
createPackage("ui.base");
createPackage("ui.container");
createPackage("ui.std");

/* @class ui.base.Stylable
 * 
 * */
createClass({
    _name               : "Stylable",
    _package            : "ui.base",
    _virtual            : "pure",
    
    classSys            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    class               : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
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

/* @class ui.base.Eventable
 * 
 * */
createClass({
    _name               : "Eventable",
    _package            : "ui.base",
    _virtual            : "pure",
       
	onClick             : {_type: "std.proc.Event", _getter: true, _autoSet: true},   
    
    applyEvents         : {_type: "Method", _method: null}
});

/* @class ui.base.Brick
 * 
 * */
 createClass({
	_name               : "Brick",
    _package            : "ui.base",
	_extends            : ["std.chainer.Node","ui.base.Stylable","ui.base.Eventable"],
    
    id                  : {_type: "std.Id", _getter: true},
    help                : {_type: "String", _getter: true, _autoSet: true},
    
    htmlHook            : {_type: "Object", _getter: true},
    htmlFirstElement    : {_type: "Object"},
    
    /* @method constructor 
     * @param _p ({}, mandatory)
     * @param _p.help 
     * */    
    constructor         : {_type: "Method", 
        _method: function(_p) {
            this.children       = new std.coll.MapArray();
            this.htmlHook       = _p.htmlHook;
            this.id             = new std.misc.Id();
            
            if (isFunction(_p.onClick)) {
                this.onClick = new std.proc.Event({fn:_p.onClick});
            }
        }
    },
    
    /* @method UiHTML.setHtmlHook 
     * @params _htmlHook ({}, mandatory) The html element which will contains 
     */
    setHtmlHook     : {_type: "Method", 
        _method: function(_htmlHook) {
            if (_htmlHook && typeof(_htmlHook.appendChild) == "function") {
                this.htmlHook = _htmlHook;
                this.htmlHook.appendChild(this.htmlFirstElement);                            
            }
        }
    },
           
    /* @method applyStyles Compare and apply if necessary the styles defined (in the attributes) to the styles applied (to the html elements).
     * */
    applyStyles     : {_type: "Method", _overloadable   : true,
        _method  : function() {
            if (this.htmlFirstElement) {
                var className = this.classSys + (this.classSys ? " " : "") + (this.class ? this.class : "");
                
                if (this.htmlFirstElement.className !== className) this.htmlFirstElement.className = className;
                if (this.htmlFirstElement.style.width !== this.width) this.htmlFirstElement.style.width = this.width;
                if (this.htmlFirstElement.style.height !== this.height) this.htmlFirstElement.style.height = this.height;

                if (this.htmlFirstElement.style.padding !== this.padding) this.htmlFirstElement.style.padding = this.padding;
                if (this.paddingTop !== null && this.htmlFirstElement.style.paddingTop !== this.paddingTop) this.htmlFirstElement.style.paddingTop = this.paddingTop;
                if (this.paddingBottom !== null && this.htmlFirstElement.style.paddingBottom !== this.paddingBottom) this.htmlFirstElement.style.paddingBottom = this.paddingBottom;
                if (this.paddingLeft !== null && this.htmlFirstElement.style.paddingLeft !== this.paddingLeft) this.htmlFirstElement.style.paddingLeft = this.paddingLeft;
                if (this.paddingRight !== null && this.htmlFirstElement.style.paddingRight !== this.paddingRight) this.htmlFirstElement.style.paddingRight = this.paddingRight;

                if (this.htmlFirstElement.style.margin !== this.margin) this.htmlFirstElement.style.margin = this.margin;
                if (this.marginTop !== null && this.htmlFirstElement.style.marginTop !== this.marginTop) this.htmlFirstElement.style.marginTop = this.marginTop;
                if (this.marginBottom !== null && this.htmlFirstElement.style.marginBottom !== this.marginBottom) this.htmlFirstElement.style.marginBottom = this.marginBottom;
                if (this.marginLeft !== null && this.htmlFirstElement.style.marginLeft !== this.marginLeft) this.htmlFirstElement.style.marginLeft = this.marginLeft;
                if (this.marginRight !== null && this.htmlFirstElement.style.marginRight !== this.marginRight) this.htmlFirstElement.style.marginRight = this.marginRight;

                if (this.borderBottomColor !== null && this.htmlFirstElement.style.borderBottomColor !== this.borderBottomColor) this.htmlFirstElement.style.borderBottomColor = this.borderBottomColor;
                if (this.borderBottomWidth !== null && this.htmlFirstElement.style.borderBottomWidth !== this.borderBottomWidth) this.htmlFirstElement.style.borderBottomWidth = this.borderBottomWidth;
                if (this.borderBottomStyle !== null && this.htmlFirstElement.style.borderBottomStyle !== this.borderBottomStyle) this.htmlFirstElement.style.borderBottomStyle = this.borderBottomStyle;

                if (this.backgroundColor !== null && this.htmlFirstElement.style.backgroundColor !== this.backgroundColor) this.htmlFirstElement.style.backgroundColor = this.backgroundColor;
                if (this.borderColor !== null && this.htmlFirstElement.style.borderColor !== this.borderColor) this.htmlFirstElement.style.borderColor = this.borderColor;
                if (this.color !== null && this.htmlFirstElement.style.color !== this.color) this.htmlFirstElement.style.color = this.color;
                
                if (this.htmlFirstElement.style.fontFamily !== this.fontFamily) this.htmlFirstElement.style.fontFamily = this.fontFamily;
                if (this.htmlFirstElement.style.fontSize !== this.fontSize) this.htmlFirstElement.style.fontSize = this.fontSize;
                if (this.htmlFirstElement.style.textAlign !== this.textAlign) this.htmlFirstElement.style.textAlign = this.textAlign;

            }
        }
    },
            
    applyEvents       : {_type: "Method", _overloadable   : true,
        _method     : function() {
            
            if (this.onActivate) {
                this.htmlFirstElement.onclick     = this.onActivate.getTrigger(this);
            }
            if (this.onClick) {
                this.htmlFirstElement.onclick     = this.onClick.getTrigger(this);
            }
        }
    }
});


/* @class ui.base.Element
 * 
 * */
createClass({
	_name               : "Element",
    _package            : "ui.base",
	_extends            : ["ui.base.Brick"],
    
    value               : {_type: "String", _getter: true, _autoSet: true},   
    
    applyValues         : {_type: "Method", _overloadable   : true,
        _method     : function() {
            if (this.htmlFirstElement.innerHTML !== this.value) this.htmlFirstElement.innerHTML = this.value;
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

/* @class ui.base.Container
 *
 * */
createClass({
	_name               : "Container",
    _package            : "ui.base",
	_extends            : ["ui.base.Brick"],
    
    htmlHookChildren    : {_type: "Object", _getter: true, _setter: true},
    coordinate          : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    addUiElement        : {_type: "Method",
        _method: function(_element) {
            if (implements("ui.base.Brick",_element)) {
                this.addChild(_element);
                _element.setHtmlHook(this.getHtmlHookChildren());
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

/* @class ui.container.Pane
 * 
 * */
createClass({
	_name 			: "Pane",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
	
    constructor     : {_type: "Method", 
        _method : function(_p) {            
            this.setClassSys("uiContainerPane");
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            this.htmlFirstElement = document.createElement("div");                 
            this.setHtmlHookChildren(this.htmlFirstElement);
        }
    }
});

/* @class ui.container.PanesH
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
            this.setClassSys("uiContainerPaneH");
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            var pane, spacer, i;
            
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            
            this.panesSettings          = (this.panesSettings ? this.panesSettings : {});
            this.panesSettings.width    = (this.panesSettings.width ? this.panesSettings.width : Math.round(100 / this.nbColumns) + "%");
            
            // Ajoute les différents panes
            for(i = 0; i < this.nbColumns; i++) {    
                pane = new ui.container.Pane(this.panesSettings);
                pane.setCoordinate(i + "," + "0");
                this.children.set(pane,i);
                this.addUiElement(pane);
            }
            
            spacer = document.createElement("div");            
            spacer.className = "spacer";
            this.htmlFirstElement.appendChild(spacer);
        }
    },
    
    getPane    : {_type: "Method", 
        _method : function(_column) {
            return this.children.get(_column);
        }
    }
});

/* @class ui.container.PanesV
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
            this.setClassSys("uiContainerPaneV");
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            var pane, spacer, i;
            
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            
            // Ajoute les différents panes
            for(i = 0; i < this.nbRows; i++) {
                pane = new ui.container.Pane(this.panesSettings);
                pane.setCoordinate("0" + "," + i);
                this.children.set(pane,i);
                this.addUiElement(pane);
            }
            
            spacer = document.createElement("div");            
            spacer.className = "spacer";
            this.htmlFirstElement.appendChild(spacer);            
        }
    },
    
    getPane    : {_type: "Method", 
        _method : function(_row) {
            return this.children.get(_row);
        }
    }
});

/* @class ui.container.PanesS
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
            this.setClassSys("uiContainerPaneS");
            this.build();
            this.draw();
        }
    },
    
    build           : {_type: "Method", 
        _method: function() {
            var pane, spacer, i, j;
            
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
                    
            for(j = 0; j < this.nbColumns; j++) {
                for(i = 0; i < this.nbRows; i++) {
                    pane = new ui.container.Pane(this.panesSettings);
                    pane.setCoordinate(i + "," + j);
                    this.children.set(pane, i + ":" + j);
                    this.addUiElement(pane);
                }
            
                spacer = document.createElement("div");            
                spacer.className = "spacer";
                this.htmlFirstElement.appendChild(spacer);
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

/* @class ui.std.Button
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
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            this.label = new ui.std.Label(_p);
            this.addUiElement(this.label);
        }
    }
});

/* @class ui.std.Text
 * 
 * */
createClass({
	_name 			: "Text",
    _package        : "ui.std",
	_extends		: ["ui.base.Element"],
    
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.setClassSys("uiStdLabel");
            this.build();
            this.draw();
		}
	},
    
    build           : {_type: "Method", 
        _method: function() {
            this.htmlFirstElement = document.createElement("div");            
        }
    }
});

/* @class ui.std.Image
 * 
 * */
createClass({
	_name 			: "Image",
    _package        : "ui.std",
	_extends		: ["ui.base.Element"],
    
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.setClassSys("uiStdImage");
            this.build();
            this.draw();
		}
	},
    
    build           : {_type: "Method", 
        _method: function() {
            this.htmlFirstElement = document.createElement("img");            
        }
    }
});