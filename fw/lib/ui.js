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
    css                 : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
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

/* @class ui.base.Element
 * 
 * */
 createClass({
	_name               : "Object",
    _package            : "ui.base",
	_extends            : ["std.chainer.Node","ui.base.Stylable","ui.base.Eventable"],
    
    id                  : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    index               : {_type: "Number", _getter: true, _setter: true},
    help                : {_type: "String", _getter: true, _autoSet: true},
    
    htmlHook            : {_type: "Object", _getter: true},
    htmlFirstElement    : {_type: "Object"},
    
    /* @method constructor 
     * @param _p ({}, mandatory)
     * @param _p.help 
     * */
    constructor         : {_type: "Method", 
        _method: function(_p) {
            this.htmlHook       = _p.htmlHook;
            
            if (isFunction(_p.onClick)) {
                this.onClick = new std.proc.Event({fnRef: _p.onClick});
            }
        }
    },
    
    /* @method UiHTML.setHtmlHook 
     * @params _htmlHook ({}, mandatory) The html element which will contains 
     */
    setHtmlHook         : {_type: "Method", 
        _method: function(_htmlHook) {
            if (_htmlHook && typeof(_htmlHook.appendChild) === "function") {
                this.htmlHook = _htmlHook;
                this.htmlHook.appendChild(this.htmlFirstElement);                            
            }
        }
    },
           
    /* @method applyStyles Compare and apply if necessary the styles defined (in the attributes) to the styles applied (to the html elements).
     * */
    applyStyles         : {_type: "Method", _overloadable   : true,
        _method: function() {
            if (this.htmlFirstElement) {
                var className = this.classSys + (this.classSys ? " " : "") + (this.css ? this.css : "");
                
                if (this.htmlFirstElement.className !== className) this.htmlFirstElement.className = className;
                
                if (this.width !== null && this.htmlFirstElement.style.width !== this.width) this.htmlFirstElement.style.width = this.width;
                if (this.height !== null && this.htmlFirstElement.style.height !== this.height) this.htmlFirstElement.style.height = this.height;
                if (this.id !== null && this.htmlFirstElement.id !== this.height) this.htmlFirstElement.id = this.id;
                
                if (this.padding !== null && this.htmlFirstElement.style.padding !== this.padding) this.htmlFirstElement.style.padding = this.padding;
                if (this.paddingTop !== null && this.htmlFirstElement.style.paddingTop !== this.paddingTop) this.htmlFirstElement.style.paddingTop = this.paddingTop;
                if (this.paddingBottom !== null && this.htmlFirstElement.style.paddingBottom !== this.paddingBottom) this.htmlFirstElement.style.paddingBottom = this.paddingBottom;
                if (this.paddingLeft !== null && this.htmlFirstElement.style.paddingLeft !== this.paddingLeft) this.htmlFirstElement.style.paddingLeft = this.paddingLeft;
                if (this.paddingRight !== null && this.htmlFirstElement.style.paddingRight !== this.paddingRight) this.htmlFirstElement.style.paddingRight = this.paddingRight;
                
                if (this.margin !== null && this.htmlFirstElement.style.margin !== this.margin) this.htmlFirstElement.style.margin = this.margin;
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
                
                if (this.fontFamily !== null && this.htmlFirstElement.style.fontFamily !== this.fontFamily) this.htmlFirstElement.style.fontFamily = this.fontFamily;
                if (this.fontSize !== null && this.htmlFirstElement.style.fontSize !== this.fontSize) this.htmlFirstElement.style.fontSize = this.fontSize;
                if (this.textAlign !== null && this.htmlFirstElement.style.textAlign !== this.textAlign) this.htmlFirstElement.style.textAlign = this.textAlign;
            }
        }
    },
    
    /*
     * 
     * */
    getChildById            : {_type: "Method", _overloadable   : true,
        _method: function(_id) {
            var fn = function(_node,_id){ 
                return (_node.getId() === _id);
            };
            
            return this.findChild(fn,_id);
        }
    },
    
    /*
     * 
     * */
    getChildByPathIndex     : {_type: "Method", _overloadable   : true,
        _method: function() {
            var i, child;
            
            child = this;
            for (i = 0; i < arguments.length; i++) {
                if (implements("ui.base.Container",child)) {
                    child = child.getChildren().get(arguments[i]);
                    if (!child) return null;
                }
            }
            return child;
        }
    },
    
    /*
     * 
     * */
    getPathIndex            : {_type: "Method", _overloadable   : true,
        _method: function(_nbNode) {
            
            var i, path, element;
            
            element = this;
            path    = [];
            i       = _nbNode ? _nbNode : 1;
            
            while(i > 0) {
                path[i-1] = element.getIndex();
                element = element.getParent();
                i--;
            }
            
            return path;
        }
    },

    /*
     * 
     * */
    applyEvents         : {_type: "Method", _overloadable   : true,
        _method: function() {
            
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
	_extends            : ["ui.base.Object"],
    
    value               : {_type: "String", _getter: true, _setter: true, _autoSet: true},   
    
    /*
     * 
     * */
    applyValues         : {_type: "Method", _overloadable   : true,
        _method     : function() {
            if (this.htmlFirstElement.innerHTML !== this.value) this.htmlFirstElement.innerHTML = this.value;
        }
    },
    
    /*
     * 
     * */
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
	_extends            : ["ui.base.Object"],
    
    htmlHookChildren    : {_type: "Object", _getter: true, _setter: true},

    /*
     * 
     * */
    addElement          : {_type: "Method",
        _method: function(_element) {
            if (implements("ui.base.Object",_element)) {
                _element.setIndex(this.getNbChildren());
                this.addChild(_element);
                _element.setHtmlHook(this.getHtmlHookChildren());
            }
        }
    },

    /*
     * 
     * */
    draw                : {_type: "Method", _overloadable   : true,
        _method: function() {
            this.applyEvents();
            this.applyStyles();
        }
    },

});

/* @class ui.container.Pane
 * 
 * */
createClass({
	_name 			: "Pane",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],

    /*
     * 
     * */
    constructor     : {_type: "Method", 
        _method : function(_p) {            
            this.setClassSys("uiContainerPane");
            this.build();
            this.draw();
        }
    },
    
    /*
     * 
     * */
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
	_name 			: "Row",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbColumns       : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    /*
     * 
     * */
    constructor     : {_type: "Method", 
        _method: function(_p) {
            this.setClassSys("uiContainerRow");
            this.build();
            this.draw();
        }
    },
    
    /*
     * 
     * */
    build           : {_type: "Method", 
        _method: function() {
            var i;
            
            this.htmlFirstElement   = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);            
            this.panesSettings      = (this.panesSettings ? this.panesSettings : {});
            // Ajoute les différents panes
            for(i = 0; i < this.nbColumns; i++) {    
                this.addElement(new ui.container.Pane(this.panesSettings));
            }
        }
    }
});



/* @class ui.container.PanesV
 * 
 * */
createClass({
	_name 			: "Column",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},

    /*
     * 
     * */
    constructor     : {_type: "Method", 
        _method: function(_p) {;
            this.setClassSys("uiContainerColumn");
            this.build();
            this.draw();
        }
    },

    /*
     * 
     * */
    build           : {_type: "Method", 
        _method: function() {
            var i;
            
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            // Ajoute les différents panes
            for(i = 0; i < this.nbRows; i++) {
                this.addElement(new ui.container.Pane(this.panesSettings));
            }
        }
    }
});


/* @class ui.container.PanesS
 * 
 * */
createClass({
	_name 			: "Grid",
    _package        : "ui.container",
	_extends		: ["ui.base.Container"],
    
    nbRows          : {_type: "Number", _autoSet: true},
    nbColumns       : {_type: "Number", _autoSet: true},
    
    panesSettings   : {_type: "Object", _getter: true, _autoSet: true},
    
    /*
     * 
     * */
    constructor     : {_type: "Method", 
        _method: function(_p) {
            this.setClassSys("uiContainerGrid");
            this.build();
            this.draw();
        }
    },

    /*
     * 
     * */
    build           : {_type: "Method", 
        _method: function() {
            var i;
            
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            
            for(i = 0; i < this.nbRows; i++) {
                this.addElement(new ui.container.Row({nbColumns:this.nbColumns, panesSettings:this.panesSettings}));
            }
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
     
    text            : {_type: "ui.std.Text", _getter: true},
    
    /*
     * 
     * */
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.setClassSys("uiStdButton");
            this.build(_p);
            this.draw();
		}
	},
    
    /*
     * 
     * */
    build           : {_type: "Method", 
        _method: function(_p) {
            this.htmlFirstElement = document.createElement("div");            
            this.setHtmlHookChildren(this.htmlFirstElement);
            this.text = new ui.std.Text({value: _p.label});
            this.addElement(this.text);
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
    
    /*
     * 
     * */
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.setClassSys("uiStdText");
            this.build();
            this.draw();
		}
	},
    
    /*
     * 
     * */
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
    
    /*
     * 
     * */
    constructor		: {_type: "Method", 
        _method:function(_p) {
            this.setClassSys("uiStdImage");
            this.build();
            this.draw();
		}
	},
    
    /*
     * 
     * */
    build           : {_type: "Method", 
        _method: function() {
            this.htmlFirstElement = document.createElement("img");            
        }
    }
});