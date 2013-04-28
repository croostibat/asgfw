/*****************************************************************************/
/* Serialise un objet en JSON / HTML
 * 
 */

createPackage("out");

out.dump = function(_object,_html) {
    var prop,datas;
    
    prop 	= null;
    
    if (_object !== null) {
		switch(typeof(_object)) {
			case "object":
				datas = [];
				for (prop in _object) {
					datas[datas.length] = "\"" + prop + "\"" + ":" + dump(_object[prop],_html);
				}
				return (_html ? "{<div style=\"margin-left:30px\">" : "{") + datas.join((_html ? "<br/>" : ",")) + (_html ? "</div>}" : "}");
				break;
				
			case "string":
				return "\"" + _object + "\"";
				break;
				
			case "function":
			case "number":
			default:        
				return _object;
				break;
		}
	}
	return "null";
};
/*****************************************************************************/

