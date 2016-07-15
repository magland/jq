// Do not use this class directly -- it is used by DiskReadMda
function RemoteReadMda() {
	var that=this;

	this.setPath=function(path,callback) {m_path=path; m_initialized=false; initialize(callback);}
	this.initialize=function(callback) {initialize(callback);}
	this.isInitialized=function() {return m_initialized;}
	this.N1=function() {return get_dim(1);}
	this.N2=function() {return get_dim(2);}
	this.N3=function() {return get_dim(3);}
	this.checksum=function() {return checksum();}
	///Retrieve a chunk of the vectorized data of size 1xN starting at position i
	this.readChunk=function(i,size,callback) {return readChunk(i,size,callback);} //returns an Mda

	function initialize(callback) {
		if (!callback) callback=function() {};
		if (m_initialized) {
			callback({success:m_initialized_success,error:m_initialized_error});
			return;
		}
		if (m_initializing) {
			setTimeout(function() {
				initialize(callback);
			},50);
			return;
		}
		m_initializing=true;
		if (m_download_failed) {
			m_initialized=true;
			m_initializing=false;
			m_initialized_success=false;
			m_initialized_error='Download already failed.';
			callback({success:m_initialized_success,error:m_initialized_error});
			return;
		}
		var url=m_path;
		var url2=url + "?a=info&output=text";
		$.get(url2,function(txt) {
			if (!txt) {
				m_download_failed=true;
				m_initialized=true;
				m_initializing=false;
				m_initialized_success=false;
				m_initialized_error='RemoteReadMda: Problem initializing mda, txt is empty: '+url2;
				callback({success:m_initialized_success,error:m_initialized_error});
				return;
			}
			var lines=txt.split('\n');
			var sizes=lines[0].split(',');
			m_info.N1=Number(sizes[0]);
			m_info.N2=Number(sizes[1]);
			m_info.N3=Number(sizes[2]);
			m_info.checksum=lines[1];
			m_info.file_last_modified=lines[2];
			m_initialized=true;
			m_initializing=false;
			m_initialized_success=true;
			m_initialized_error='';
			callback({success:m_initialized_success,error:m_initialized_error});
		});
	}
	function get_dim(d) {
		if (!m_initialized) {
			console.error('RemoteReadMda is not initialized: '+m_path);
			return 1;
		}
		if (d==1) return m_info.N1;
		if (d==2) return m_info.N2;
		if (d==3) return m_info.N3;
		return 1;
	}
	function readChunk(i,size,callback) {
		//don't make excessive calls... once we fail, that's it.
		if ((!m_initialized)||(!m_initialized_success)) {
			callback({success:false,error:'RemoteReadMda not initialized successfully'});
			return;
		}
		if (m_download_failed) {
			callback({success:false,error:'RemoteReadMda: Download already failed.'});
			return;
		}
		var X=new Mda();
		X.allocate(size,1);
		var ii1 = i; //start index of the remote array
    	var ii2 = i + size - 1; //end index of the remote array
    	var jj1 = Math.floor(ii1 / m_download_chunk_size); //start chunk index of the remote array
    	var jj2 = Math.floor(ii2 / m_download_chunk_size); //end chunk index of the remote array
    	if (jj1 == jj2) { //in this case there is only one chunk we need to worry about
        	download_chunk_at_index(jj1,function(ret) { //download the single chunk
        		if (!ret.success) {
        			callback(ret);
        			m_download_failed=true;
        			return;
        		}
        		callback({success:true,chunk:ret.chunk.getChunk(ii1-jj1*m_download_chunk_size,size)}); //starting reading at the offset of ii1 relative to the start index of the chunk
        		return;
        	}); 
        }
        else {
        	callback({success:false,error:'RemoteReadMda: Cannot handle this case yet'});
        	return;	
        }
    }
    function download_chunk_at_index(ii,callback) {
    	//FINISH!!!
    }

	var m_path='';
	var m_initializing=false;
	var m_initialized=false;
	var m_initialized_error='';
	var m_initialized_success=false;
	var m_download_chunk_size=500000;
	var m_info={
		N1:1,N2:1,N3:1,checksum:'',file_last_modified:0
	}
	var m_download_failed=false;
}