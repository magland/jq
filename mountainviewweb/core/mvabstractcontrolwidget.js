function MVAbstractControlWidget(O,mvcontext,main_window) {
	O=O||this;
	JSQWidget(O);
	O.div().addClass('MVAbstractControlWidget');

	this.mvContext=function() {return mvcontext;};
	this.mainWindow=function() {return main_window;};

	this.title=function() {return 'title should be overridden'};
	this.updateContext=function() {console.log('updateContext should be overridden');};
	this.updateControls=function() {console.log('updateControls should be overridden');};

	//protected
	var P={};
	P.controlValue=function(name) {return controlValue(name);};
	P.setControlValue=function(name,val) {setControlValue(name,val);};
	P.setControlEnabled=function(name,val) {setControlEnabled(name,val);};
	P.createIntControl=function(name) {return createIntControl(name);};
	P.createDoubleControl=function(name) {return createIntControl(name);};
	P.createButtonControl=function(name,label,callback) {return createButtonControl(name,label,callback);};

	function controlValue(name) {
		return 0;
	}
	function setControlValue(name,val) {

	}
	function setControlEnabled(name,val) {

	}
	function createIntControl(name) {
		var ret=$('<input type=text></input>');
		return ret;
	}
	function createDoubleControl(name) {
		var ret=$('<input type=text></input>');
		return ret;
	}
	function createButtonControl(name,label,callback) {
		var ret=$('<button>'+label+'</button>');
		ret.click(callback);
		return ret;
	}

	return P;
}