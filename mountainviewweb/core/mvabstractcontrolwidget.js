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
		if  (name in m_int_controls) return Number(m_int_controls[name].val());
		if  (name in m_double_controls) return Number(m_double_controls[name].val());
		return 0;
	}
	function setControlValue(name,val) {
		if (name in m_int_controls) m_int_controls[name].val(val);
		if (name in m_double_controls) m_double_controls[name].val(val);
	}
	function setControlEnabled(name,val) {
		//TODO
	}
	function createIntControl(name) {
		var ret=$('<input type=text></input>');
		m_int_controls[name]=ret;
		return ret;
	}
	function createDoubleControl(name) {
		var ret=$('<input type=text></input>');
		m_double_controls[name]=ret;
		return ret;
	}
	function createButtonControl(name,label,callback) {
		var ret=$('<button>'+label+'</button>');
		ret.click(callback);
		m_button_controls[name]=ret;
		return ret;
	}

	var m_int_controls=[];
	var m_double_controls=[];
	var m_button_controls=[];
	return P;
}