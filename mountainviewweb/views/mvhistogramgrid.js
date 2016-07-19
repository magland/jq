function MVHistogramGrid(O,mvcontext) {
	O=O||this;
	var P=MVAbstractView(O,mvcontext);

	O.prepareCalculation=function() {console.log ('prepareCalculation() should be overloaded.');};
	O.runCalculation=function(callback) {console.log ('runCalculation() should be overloaded.');};
	O.onCalculationFinished=function() {console.log ('onCalculationFinished() should be overloaded.');};

	JSQ.connect(O,'sizeChanged',O,update_layout);
	JSQ.connect(mvcontext,'optionsChanged',O,O.recalculate);
	JSQ.connect(mvcontext,'currentClusterPairChanged',O,do_highlighting_and_captions;
	JSQ.connect(mvcontext,'selectedClusterPairsChanged',O,do_highlighting_and_captions);

	//protected methods
	P.setHorizontalScaleAxis=function(opts) {setHorizontalScaleAxis(opts);};
	P.setHistogramViews=function(views) {setHistogramViews(views);};
	P.histogramViews=function() {return m_histogram_views;};
    P.setPairMode=function(val) {m_pair_mode=val;};
    P.pairMode=function() {return m_pair_mode;};

	var m_panel_widget=new MVPanelWidget();
	m_panel_widget.setParent(O);
	var m_pair_mode=true;
	var m_num_columns=-1;
	var m_horizontal_scale_axis_data={use_it:false,label:'for exampe 100 ms'};

	function update_layout() {
		var ss=O.size();
		m_panel_widget.setPosition([5,5]);
		m_panel_widget.setSize([ss[0]-10,ss[1]-10]);
	}
	function do_highlighting_and_captions() {
		//TODO: highlight the current and selected pairs and set the captions
		/*
		var k=O.mvContext().currentCluster();
		var ks=O.mvContext().selectedClusters();
		for (var i=0; i<m_template_panels.length; i++) {
			var Y=m_template_panels[i];
			var k0=Y.property('k');
			if (k0==k) Y.div().addClass('current');
			else Y.div().removeClass('current');
			if (k0 in ks) Y.div().addClass('selected');
			else Y.div().removeClass('selected');
		}
		*/
	}
	function setHorizontalScaleAxis(opts) {
		m_horizontal_scale_axis_data=JSQ.clone(opts);
	}
	function setHistogramViews(views) {
		m_panel_widget.clearPanels();
		var NUM=views.length;
		var num_rows = Math.floor(sqrt(NUM));
		if (num_rows < 1) num_rows=1;
		var num_cols=Math.floor((NUM+num_rows-1)/num_rows);
		m_num_columns=num_cols;

		for (var jj=0; jj<NUM; jj++) {
			var HV=views[jj];
			var row0=Math.floor(jj/num_cols);
			var col0=jj-row0*num_cols;
			m_panel_widget.addPanel(row0,col0,HV);
		}

		if (m_horizontal_scale_axis_data.use_it) {
			//TODO: do the scale axis
		}

		do_highlighting_and_captions();
	}

}