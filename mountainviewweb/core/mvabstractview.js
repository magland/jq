function MVAbstractView(O,mvcontext) {
	O=O||this;
	JSQWidget(O);

	O.mvContext=function() {return mvcontext;};
	O.recalculate=function() {recalculate();};

	O.prepareCalculation=function() {console.log ('prepareCalculation() should be overloaded.');};
	O.runCalculation=function(callback) {console.log ('runCalculation() should be overloaded.');};
	O.onCalculationFinished=function() {console.log ('onCalculationFinished() should be overloaded.');};

	function recalculate() {
		O.prepareCalculation();
	    O.runCalculation({},function(res) {
	        O.onCalculationFinished();
	    });
	}
}
