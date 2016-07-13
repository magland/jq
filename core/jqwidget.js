function JQWidget(O) {
	if (!O) O=this;
	JQObject(O);
	
	O.div=function() {return m_div;}
	O.setDiv=function(div) {setDiv(div);}
	O.size=function() {return [m_size[0],m_size[1]];}
	O.setSize=function(size) {setSize(size);}
	O.position=function() {return m_position;}
	O.setPosition=function(pos) {setPosition(pos);}
	O.showFullBrowser=function() {showFullBrowser();}

	function setDiv(div_or_str) {
		m_div=$(div_or_str);
		set_div_geom();
	}
	function setSize(size) {
		if ((size[0]==m_size[0])&&(size[1]==m_size[1])) {
			return;
		}
		m_size[0]=size[0];
		m_size[1]=size[1];
		set_div_geom();
		O.emit('sizeChanged');
	}
	function setPosition(pos) {
		if ((m_position[0]==pos[0])&&(m_position[1]==pos[1])) {
			return;
		}
		m_position[0]=pos[0];
		m_position[1]=pos[1];
		set_div_geom();
		O.emit('positionChanged');
	}
	function showFullBrowser(opts) {
		if (!opts) opts={};
		opts.margin_left=opts.margin_left||10;
		opts.margin_right=opts.margin_right||10;
		opts.margin_top=opts.margin_top||10;
		opts.margin_bottom=opts.margin_bottom||10;
		if ('margin' in opts) {
			opts.margin_left=opts.margin_right=opts.margin_top=opts.margin_bottom=opts.margin;
		}

		var X=new BrowserWindow();
		JQ.connectToCallback(X,'sizeChanged',set_size);
		function set_size() {
			var ss=X.size();
			O.setSize([ss[0]-opts.margin_left-opts.margin_right,ss[1]-opts.margin_top-opts.margin_bottom]);
			O.setPosition([opts.margin_left,opts.margin_top]);
		}
		$('body').append(O.div());
		set_size();
	}

	O._set_is_widget(true);
	var m_div=$('<div></div>');
	var m_position=[0,0];
	var m_size=[0,0];
	set_div_geom();

	function set_div_geom() {
		m_div.css({
			position:'absolute',
			left:m_position[0],
			top:m_position[1],
			width:m_size[0],
			height:m_size[1]
		})
	}
}

function BrowserWindow(O) {
	if (!O) O=this;
	JQObject(O);

	O.size=function() {return [$(window).width(),$(window).height()];}

	$(window).on('resize', function() {
		O.emit('sizeChanged');
	});
}
