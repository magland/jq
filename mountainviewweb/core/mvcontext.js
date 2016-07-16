function MVContext(O) {
	O=O||this;
	JSQObject(O);

	this.setMLProxyUrl=function(mlproxy_url) {m_mlproxy_url=mlproxy_url;};
	this.setTimeseries=function(X) {m_timeseries=X;};
	this.setFirings=function(X) {m_firings=X;};
	this.setOption=function(name,val) {setOption(name,val)};;

	this.mlProxyUrl=function() {return m_mlproxy_url;};
	this.currentTimeseries=function() {return m_timeseries;};
	this.firings=function() {return m_firings;};
	this.option=function(name) {return JSQ.clone(m_options[name]);};

	/////////////////////////////////////////////////
	// COLORS
    this.clusterColor=function(k) {return clusterColor(k);};
    this.channelColor=function(m) {return channelColor(m);};
    this.color=function(name, default_color) {return color(name,default_color);};
    this.colors=function() {return JSQ.clone(m_colors);};
    this.channelColors=function() {return JSQ.clone(m_channel_colors);};
    this.clusterColors=function() {return JSQ.clone(m_cluster_colors);};
    this.setClusterColors=function(list) {m_cluster_colors=JSQ.clone(list);};
    this.setChannelColors=function(list) {m_channel_colors=JSQ.clone(list);};
    this.setColors=function(map) {m_colors=JSQ.clone(map);};

    function setOption(name,val) {
    	if (JSQ.compare(val,m_options[name])) return;
    	m_options[name]=JSQ.clone(val);
    	O.emit('optionsChanged');
    }
    function clusterColor(k) {
    	if (k <= 0)
	        return [0,0,0];
	    if (m_cluster_colors.length===0)
	        return [0,0,0];
	    return m_cluster_colors[(k - 1) % m_cluster_colors.length];
    }
    function channelColor(m) {
    	if (m <= 0)
	        return [0,0,0];
	    if (m_channel_colors.length===0)
	        return [0,0,0];
	    return m_channel_colors[(m - 1) % m_channel_colors.length];	
    }
    function color(name,default_color) {
    	if (name in m_colors) return m_colors[name];
    	else return default_color;
    }

    var m_colors={};
    var m_channel_colors=mv_default_channel_colors();
    var m_cluster_colors=[];

	var m_mlproxy_url='';
	var m_timeseries=new RemoteReadMda();
	var m_firings=new RemoteReadMda();
	var m_options={clip_size:100};
}

function mv_default_channel_colors() {
	var ret=[];
	ret.push([40,40,40]);
	ret.push([64,32,32]);
	ret.push([32,64,32]);
	ret.push([32,32,112]);
	return ret;
}