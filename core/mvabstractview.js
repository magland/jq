function MVAbstractView(O,mvcontext) {
	O=O||this;
	JQWidget(O);

	O.prepareCalculation=function() {console.log ('prepareCalculation() should be overloaded.');}
	O.runCalculation=function() {console.log ('runCalculation() should be overloaded.');}
	O.onCalculationFinished=function() {console.log ('onCalculationFinished() should be overloaded.');}
}
