function MVAmpHistView(O,mvcontext) {
	O=O||this;
	var P=MVHistogramGrid(O,mvcontext);

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(callback) {runCalculation(callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	var m_calculator=new Calculator();
	function prepareCalculation() {
		m_calculator.firings=mvcontext.firings();
	}
	function runCalculation(callback) {
		m_calculator.run({},callback);
	}
	function onCalculationFinished() {
		//finish this!!!
		var bin_min=compute_min2(m_histograms);
		double bin_min = compute_min2(m_histograms);
    double bin_max = max2(m_histograms);
    double max00 = qMax(qAbs(bin_min), qAbs(bin_max));

    int num_bins = 200; //how to choose this?

    QList<HistogramView*> views;
    for (int ii = 0; ii < m_histograms.count(); ii++) {
        int k0 = m_histograms[ii].k;
        if (q->mvContext()->clusterIsVisible(k0)) {
            HistogramView* HV = new HistogramView;
            HV->setData(m_histograms[ii].data);
            HV->setColors(q->mvContext()->colors());
            //HV->autoSetBins(50);
            HV->setBins(bin_min, bin_max, num_bins);
            HV->setDrawVerticalAxisAtZero(true);
            HV->setXRange(MVRange(-max00, max00));
            HV->autoCenterXRange();
            HV->setProperty("k", k0);
            views << HV;
        }
    }

    q->setHistogramViews(views); //inherited
	}

	function Calculator() {
		var that=this;

		//input
		var firings=new RemoteReadMda();
    
    	//output
    	var histograms=[];

		this.run=function(opts,callback) {
			histograms=[];
			firings.toMda(function(res) {
				var firings0=res.mda;
				var L=firings0.N2();
				var K=1;
				for (var i=0; i<L; i++) {
					var label0=firings0.value(2,i);
					if (label0>K) K=label0;
				}
				for (var k=1; k<=K; k++) {
					var HH={k:k,data:[]};
					histograms.push(HH);
				}
				for (var i=0; i<L; i++) {
					var label0=firings0.value(2,i);
					var amp0=firings0.value(3,i);
					if ((label0>=1)&&(label0<=K)) {
						histograms[label0-1].data.push(amp0);
					}
				}
				callback({success:true});
			});
		}
	}
}