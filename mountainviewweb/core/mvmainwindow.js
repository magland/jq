function MVMainWindow(O,mvcontext) {
	O=O||this;
	JSQWidget(O);

	this.addControlWidget=function(W) {m_control_panel.addControlWidget(W);};
	this.setView=function(V) {setView(V);};

	JSQ.connect(O,'sizeChanged',O,update_layout);

	var m_control_panel=new MVControlPanel(0,mvcontext);
	m_control_panel.setParent(O);
	var m_view=new MVAbstractView();
	m_view.setParent(O);

	function setView(V) {
		m_view.destroy();
		m_view=V;
		V.setParent(O);
		V.prepareCalculation();
	    V.runCalculation({},function(res) {
	        V.onCalculationFinished();
	    });
	    update_layout();
	}

	function update_layout() {
		m_control_panel.setSize(250,O.height());
		m_control_panel.setPosition(0,0);

		m_view.setSize(O.width()-250,O.height());
		m_view.setPosition(250,0);
	}

}