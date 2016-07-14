var JQ=new JQCore();

function JQCore() {
	this.connect=function(sender,signal_name,receiver,signal_or_slot_name) {connect(sender,signal_name,receiver,signal_or_slot_name);}
	this.connectToCallback=function(sender,signal_name,callback) {connectToCallback(sender,signal_name,callback);}
	this.clone=function(obj_or_array) {return clone(obj_or_array);}

	this._OM=new JQObjectManager();

	function connect(sender,signal_name,receiver,signal_or_slot_name) {
		var sender_id=sender.objectId();
		var sender_obj=JQ._OM.object(sender_id);
		if (sender_obj) {
			sender_obj._connect(signal_name,receiver,signal_or_slot_name);
		}
	}
	function connectToCallback(sender,signal_name,callback) {
		var tmp=new JQObject();
		tmp.setParent(sender); //so it gets destroyed
		tmp.declareSlot('callback',callback);
		JQ.connect(sender,signal_name,tmp,'callback');
	}
	function clone(obj_or_array) {
		return JSON.parse(JSON.stringify(obj_or_array));
	}
}

function JQObjectManager() {
	this.object=function(id) {return object(id);}
	this.addObject=function(id,obj) {addObject(id,obj);}
	this.removeObject=function(id) {removeObject(id);}

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
	var m_objects={};
}
