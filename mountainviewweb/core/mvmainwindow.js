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
		update_layout();
		setTimeout(function() {
			V.recalculate();
		},10);
	}

	function update_layout() {
		var W0=O.width();
		var H0=O.height();
		var W1=W0/3;
		if (W1<250) W1=250;
		if (W1>800) W1=800;
		var W2=W0-W1;

		m_control_panel.setSize(W1,O.height());
		m_control_panel.setPosition(0,0);

		m_view.setSize(W2,O.height());
		m_view.setPosition(W1,0);
	}

}