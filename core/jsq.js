var JSQ=new JSQCore();

function JSQCore() {
	this.connect=function(sender,signal,receiver,callback) {connect(sender,signal,receiver,callback);}
	this.emit=function(sender,signal_name,args) {emit(sender,signal_name,args);}
	this.clone=function(obj_or_array) {return clone(obj_or_array);}

	this._object=function(id) {return object(id);}
	this._addObject=function(id,obj) {addObject(id,obj);}
	this._removeObject=function(id) {removeObject(id);}

	function connect(sender,signal_name,receiver,callback) {
		m_connection_manager.connect(sender,signal_name,receiver,callback);
	}
	function emit(sender,signal_name,args) {
		m_connection_manager.emit(sender,signal_name,args);
	}
	function clone(obj_or_array) {
		return JSON.parse(JSON.stringify(obj_or_array));
	}
	function object(id) {
		if (id in m_objects) {
			return m_objects[id];
		}
		return null;
	}
	function addObject(id,obj) {
		m_objects[id]=obj;
	}
	function removeObject(id) {
		if (id in m_objects) {
			delete m_objects[id];
		}
	}

	var m_connection_manager=new JSQConnectionManager();
	var m_objects={};
}

function JSQConnectionManager() {
	this.connect=function(sender,signal_name,receiver,callback) {connect(sender,signal_name,receiver,callback);}
	this.emit=function(sender,signal_name,args) {emit(sender,signal_name,args);}

	function signal(sender_id,signal_name) {
		var code=sender_id+'-'+signal_name;
		if (!(code in m_signals)) {
			m_signals[code]={
				sender_id:sender_id,
				signal_name:signal_name,
				connections:[]
			}
		}
		return m_signals[code];
	}
	function connect(sender,signal_name,receiver,callback,connection_type) {
		var SS=signal(sender.objectId(),signal_name);
		var receiver_id=null;
		if (receiver) receiver_id=receiver.objectId();
		var CC={
			receiver_id:receiver_id,
			callback:callback,
			connection_type:connection_type||'direct', //should direct be the default?
			scheduled:false
		}
		SS.connections.push(CC);
	}
	function emit(sender,signal_name,args) {
		var sender_id=sender.objectId();
		var code=sender_id+'-'+signal_name;
		if (code in m_signals) {
			var SS=m_signals[code];
			for (var j=0; j<SS.connections.length; j++) {
				var CC=SS.connections[j];
				if ((!CC.receiver_id)||(JSQ._object(CC.receiver_id))) { //make sure receiver has not been destroyed
					if (CC.connection_type=='direct') {
						CC.callback(sender,args);
					}
					else if (CC.connection_type=='queued') {
						schedule_trigger_connection(CC,sender,args);
					}
				}
				else {
					/// TODO: delete this connection because the receiver has been destroyed
				}
			}
		}
	}
	function schedule_trigger_connection(CC,sender,args) {
		if (CC.scheduled) return;
		CC.scheduled=true;
		setTimeout(function() {
			CC.scheduled=false;
			if ((!CC.receiver_id)||(JSQ._object(CC.receiver_id))) { //make sure object has not been destroyed
				CC.callback(sender,args);
			}
		},1);
	}
	var m_signals={};
}

