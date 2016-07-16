function MVTemplatesView(O,mvcontext) {
	O=O||this;
	MVAbstractView(O,mvcontext);
	O.div().addClass('MVTemplatesView');

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(opts,callback) {runCalculation(opts,callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	JSQ.connect(O,'sizeChanged',O,update_layout);
	JSQ.connect(mvcontext,'optionsChanged',O,O.recalculate);

	var m_panel_widget=new MVPanelWidget();
	m_panel_widget.setParent(O);
	var m_template_panels=[];
	var m_vscale_factor=2;

	m_panel_widget.onPanelClicked(panelClicked);

	var m_templates=new Mda();

	function update_layout() {
		var ss=O.size();
		m_panel_widget.setPosition([5,5]);
		m_panel_widget.setSize([ss[0]-10,ss[1]-10]);
	}

	function setTemplates(templates) {
		m_templates=templates;
		var M=templates.N1();
		var T=templates.N2();
		m_panel_widget.clearPanels();
		m_template_panels=[];
		for (var k=0; k<templates.N3(); k++) {
			var Y=new MVTemplatesViewPanel();
			Y.setProperty('k',k+1);
			Y.setChannelColors(mvcontext.channelColors());
			Y.setTemplate(templates.subArray(0,0,k,M,T,1));
			m_panel_widget.addPanel(0,k,Y);
			m_template_panels.push(Y);
		}
		update_scale_factors();
	}
	function panelClicked(ind) {
		if (ind in m_template_panels) {
			console.log('panel_clicked: '+ind);
			O.mvContext.clickCluster(m_template_panels[ind].property('k'));
		}

	}
	function update_scale_factors() {
		var min0=m_templates.minimum();
		var max0=m_templates.maximum();
		var maxabs=Math.max(Math.abs(min0),Math.abs(max0));
		if (!maxabs) maxabs=1;
		var factor=1/maxabs*m_vscale_factor;
		for (var i=0; i<m_template_panels.length; i++) {
			m_template_panels[i].setVerticalScaleFactor(factor);
		}
	}
	function Calculator() {
		var that=this;

    	//inputs
    	var mlproxy_url='';
    	var firings='';
    	var timeseries='';
    	var clip_size=100;
    	//outputs
    	var templates=new Mda();

    	this.run=function(opts,callback) {
	    	var X=new MountainProcessRunner();
	        X.setProcessorName("mv_compute_templates");
	        var params={};
	        params.timeseries = that.timeseries.path();
	        params.firings = that.firings.path();
	        params.clip_size = that.clip_size;
	        X.setInputParameters(params);
	        X.setMLProxyUrl(that.mlproxy_url);

	        var templates_fname = X.makeOutputFileUrl("templates");
	        var stdevs_fname = X.makeOutputFileUrl("stdevs");

	        X.runProcess(function(res) {
	            var templates=new RemoteReadMda();
	            templates.setPath(templates_fname);
	            templates.toMda(function(res) {
	                that.templates=res.mda;
	                callback({success:true});
	            });
	        });
	    };
    }
    var m_calculator=new Calculator();
    function prepareCalculation() {
    	m_calculator.mlproxy_url=mvcontext.mlProxyUrl();
    	m_calculator.firings=mvcontext.firings();
    	m_calculator.timeseries=mvcontext.currentTimeseries();
    	m_calculator.clip_size=mvcontext.option('clip_size');
    }
    function runCalculation(opts,callback) {
    	m_calculator.run(opts,callback);
    }
    function onCalculationFinished() {
    	setTemplates(m_calculator.templates);
    }

	update_layout();
}

function MVTemplatesViewPanel(O) {
	O=O||this;
	var CW=JSQCanvasWidget(O);
	O.div().addClass('MVTemplatesViewPanel');

	this.setChannelColors=function(list) {m_channel_colors=JSQ.clone(list);};
	this.setTemplate=function(template) {m_template=template; O.update();};
	this.setVerticalScaleFactor=function(factor) {
		m_vert_scale_factor=factor;
		O.update();
	};

	CW.onPaint(paint);

	function paint(painter) {
		var M=m_template.N1();
		var T=m_template.N2();
		var W0=O.width();
		var H0=O.height();
		var Tmid = Math.floor((T + 1) / 2) - 1;

		{
			//the midline
			var view_background=[245,245,245];
			var midline_color=lighten(view_background,0.9);
			var pt0=coord2pix(0,Tmid,0);
			var pen=painter.pen(); pen.color=midline_color; pen.width=1;
			painter.setPen(pen);
			painter.drawLine(pt0[0],0,pt0[0],H0);
		}

		for (var m=0; m<M; m++) {
			var col=get_channel_color(m+1);
			var pen=painter.pen(); pen.color=col; pen.width=1;
			painter.setPen(pen);
			{
				//the template
				var ppath=new JSQPainterPath();
				for (var t=0; t<T; t++) {
					var val=m_template.value(m,t);
					var pt=coord2pix(m,t,val);
					if (t===0) ppath.moveTo(pt);
					else ppath.lineTo(pt);
				}
				painter.drawPath(ppath);
			}
		}
    }

    function coord2pix(m,t,val) {
    	var M=m_template.N1();
    	var T=m_template.N2();
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var pctx=0,pcty=0;
    	if (T) pctx=(t+0.5)/T;
    	if (M) pcty=(m+0.5-val*m_vert_scale_factor)/M;
    	var margx=4,margy=5;
    	var x0=margx+pctx*(W0-margx*2);
    	var y0=margy+pcty*(H0-margy*2);
    	return [x0,y0];
    }

	var m_template=new Mda();
	var m_vert_scale_factor=1;
	var m_channel_colors=[];

	function lighten(col,val) {
		var ret=[col[0]*val,col[1]*val,col[2]*val];
		ret=[Math.min(255,ret[0]),Math.min(255,ret[1]),Math.min(255,ret[2])];
		return ret;
	}

	function get_channel_color(m) {
		if (m <= 0)
	        return [0,0,0];
	    if (m_channel_colors.length===0)
	        return [0,0,0];
	    return m_channel_colors[(m - 1) % m_channel_colors.length];	
	}
}
