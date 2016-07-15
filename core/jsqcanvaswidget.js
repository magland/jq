function JSQCanvasWidget(O) {
	O=O||this;
	JSQWidget(O);

	O.update=function() {private_actions.emit('paint');}

	//protected methods
	var P={};
	var private_actions=new JSQObject();
	P.onPaint=function(handler) {onPaint(handler);}

	JSQ.connect(O,'sizeChanged',O,update_canvas_size);

	var m_canvas=$(document.createElement('canvas'));
	O.div().append(m_canvas);
	m_canvas.css('position','absolute');
	var m_painter=new JSQCanvasPainter(m_canvas);

	function update_canvas_size() {
		var ss=O.size();
		m_canvas[0].width=ss[0];
		m_canvas[0].height=ss[1];
		m_canvas.css({
			width:ss[0],
			height:ss[1]
		});
		O.update();
	}

	function onPaint(handler) {
		JSQ.connect(private_actions,'paint',O,run_handler,'queued');
		function run_handler(sender,args) {
			m_painter._initialize(O.size()[0],O.size()[1]);
			handler(m_painter);
			m_painter._finalize();
		}
		O.update();
	}

	return P; //protected methods
}

function JSQCanvasPainter(canvas) {
	var ctx=null;
	this._initialize=function(W,H) {
		ctx=canvas[0].getContext('2d');
		//ctx.fillStyle='black';
		//ctx.fillRect(0,0,W,H);
	}
	this._finalize=function() {
		ctx=null;
	}
	this.fillRect=function(x,y,W,H,brush) {
		if (typeof brush === 'string') brush={color:brush};
		ctx.fillStyle=brush.color;
		ctx.fillRect(x,y,W,H);
	}

}