function MVControlPanel(O) {
	O=O||this;
	JSQWidget(O);

	this.addControlWidget=function(W) {addControlWidget(W);};

	JSQ.connect(O,'sizeChanged',O,update_layout);

	function addControlWidget(W) {
		m_control_widgets=W;
		W.setParent(O);
		update_layout();
	}
	function update_layout() {
		var dy=0;
		for (var i=0; i<m_control_widgets.length; i++) {
			var W=m_control_widgets[i];
			var H0=W.height();
			W.setSize(O.width(),H0);
			W.setPosition(0,dy);
			dy+=H0;
		}
	}

	var m_control_widgets=[];
}