function MVTemplatesView(O,mvcontext) {
	O=O||this;
	MVAbstractView(O,mvcontext);

	O.setTemplates=function(templates) {setTemplates(templates);}

	JSQ.connect(O,'sizeChanged',O,update_layout);

	var m_panel_widget=new JSQPanelWidget();
	m_panel_widget.setParent(O);

	var m_templates=new Mda();

	function update_layout() {
		var ss=O.size();
		m_panel_widget.setPosition([5,5]);
		m_panel_widget.setSize([ss[0]-10,ss[1]-10]);
	}

	function setTemplates(templates) {
		var M=templates.N1();
		var T=templates.N2();
		m_panel_widget.clearPanels();
		for (var k=0; k<templates.N3(); k++) {
			var Y=new MVTemplatesViewPanel();
			Y.setTemplate(templates.subArray(0,0,k,M,T,1));
			m_panel_widget.addPanel(0,k,Y);
		}
	}

	update_layout();
}

function MVTemplatesViewPanel(O) {
	O=O||this;
	var CW=JSQCanvasWidget(O);

	this.setTemplate=function(template) {m_template=template; render();}

	CW.onPaint(function(painter) {
		console.log('testing ....');
		painter.fillRect(20,0,20,10,'green');
	});

	var m_template=new Mda();

	function render() {
		var M=m_template.N1();
		var T=m_template.N2();
		var val=m_template.value(0);
	}
}
