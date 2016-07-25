function MVMainWindow(O,mvcontext) {
	O=O||this;
	JSQWidget(O);

	this.addControlWidget=function(W) {m_control_panel.addControlWidget(W);};
	this.addView=function(V,label) {addView(V,label);};
	this.setControlPanelVisible=function(val) {m_control_panel_visible=val; update_layout();};

	JSQ.connect(O,'sizeChanged',O,update_layout);

	var m_control_panel=new MVControlPanel(0,mvcontext);
	m_control_panel.setParent(O);
	var m_views=[];
	var m_tab_widget=new JSQTabWidget();
	m_tab_widget.setParent(O);
	var m_control_panel_visible=true;

	function addView(V,label) {
		m_views.push({
			V:V,label:label
		});
		m_tab_widget.addTab(V,label);
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
		if (!m_control_panel_visible) W1=0;
		var W2=W0-W1;

		m_control_panel.setSize(W1,O.height());
		m_control_panel.setPosition(0,0);

		m_tab_widget.setSize(W2,Math.min(W2*0.5,O.height()));
		m_tab_widget.setPosition(W1,0);
	}

}