function MVCrossCorrelogramsView(O,mvcontext,mode) {
	O=O||this;

	var pair_mode=false;
	if (mode=='Matrix_Of_Cross_Correlograms') pair_mode=true;

	MVHistogramGrid(O,mvcontext,pair_mode);
	O.div().addClass('MVCrossCorrelogramsView');

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(opts,callback) {runCalculation(opts,callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	O.loadStaticView=function(X) {loadStaticView(X);};

	var m_correlograms=[];

	var m_calculator=new MVCrossCorrelogramsViewCalculator();
	function prepareCalculation() {
		m_calculator.mlproxy_url=mvcontext.mlProxyUrl();
		m_calculator.firings=mvcontext.firings();
		m_calculator.max_dt=Number(mvcontext.option('cc_max_dt_msec',100))/1000*mvcontext.sampleRate();
		m_calculator.mode=mode;
		m_calculator.ks=JSQ.numSet2List(mvcontext.selectedClusters());
	}
	function runCalculation(opts,callback) {
		if (!m_calculator.loaded_from_static_output) {
			m_calculator.run(opts,callback);
		}
		else {
			callback({success:true});
		}
	}
	function onCalculationFinished() {
		m_correlograms=m_calculator.correlograms;

		var bin_max=max2(m_correlograms);
		var bin_min=-bin_max;
		var bin_size=20;
		var num_bins=Math.floor((bin_max-bin_min)/bin_size);
		if (num_bins<100) num_bins=100;
		if (num_bins>2000) num_bins=2000;
		var sample_freq=mvcontext.sampleRate();
		var time_width=(bin_max-bin_min)/sample_freq*1000;

		var histogram_views=[];
		for (var ii=0; ii<m_correlograms.length; ii++) {
			var k1=m_correlograms[ii].k1;
			var k2=m_correlograms[ii].k2;
			var HV=new HistogramView();
			HV.setData(m_correlograms[ii].data);
			//set colors
			HV.setBins(bin_min,bin_max,num_bins);
			HV.setProperty('k',m_correlograms[ii].k1);
			HV.setProperty('k1',m_correlograms[ii].k1);
			HV.setProperty('k2',m_correlograms[ii].k2);
			histogram_views.push(HV);
		}
    	O.setHistogramViews(histogram_views);
	}

	function loadStaticView(X) {
		var calculator_output=X["computer-output"]||{};
		m_calculator.loadStaticOutput(calculator_output);
	    //CrossCorrelogramOptions3 opts;
	    //opts.fromJsonObject(X["options"].toObject());
	    //this->setOptions(opts);
	    //HistogramView::TimeScaleMode tsm;
	    //from_string(tsm,X["time-scale-mode"].toString());
	    //this->setTimeScaleMode(tsm);
    	O.recalculate();
	}

	function max2(correlograms) {
		var ret=0;
		for (var i=0; i<correlograms.length; i++) {
			var H=correlograms[i];
			for (var j=0; j<H.data.length; j++) {
				ret=Math.max(ret,H.data[j]);
			}
		}
		return ret;
	}
	
}

function MVCrossCorrelogramsViewCalculator() {
	var that=this;

	//input
	this.mlproxy_url='';
	this.firings=new RemoteReadMda();
	this.max_dt=0;
	this.mode='All_Auto_Correlograms';
	this.ks=[];

	//output
	this.loaded_from_static_output=false;
	this.correlograms=[];

	this.loadStaticOutput=function(X) {loadStaticOutput(X);};

	this.run=function(opts,callback) {
		that.correlograms=[];
		that.firings.toMda(function(res) {
			if (!res.success) {
				console.log (that.firings.path());
				console.error(res.error);
				return;
			}
			var firings0=res.mda;
			var L=firings0.N2();
			var K=1;
			var times=[],labels=[];
			for (var i=0; i<L; i++) {
				var time0=firings0.value(1,i);
				var label0=firings0.value(2,i);
				if (label0>K) K=label0;
				times.push(time0);
				labels.push(label0);
			}

			//Assemble the correlogram objects depending on mode
		    if (that.mode == 'All_Auto_Correlograms') {
		        for (var k = 1; k <= K; k++) {
		            var CC={k1:k,k2:k};
		            that.correlograms.push(CC);
		        }
		    }
		    else if (that.mode == 'Matrix_Of_Cross_Correlograms') {
		    	for (var i=0; i<that.ks.length; i++) {
		    		for (var j=0; j<that.ks.length; j++) {
		    			var CC={k1:that.ks[i],k2:that.ks[j]};
		    			that.correlograms.push(CC);
		    		}
		    	}
		    }

		    //assemble the times organized by k
		    var the_times=[];
		    for (var k=0; k<=K; k++) {
		    	the_times.push([]);
		    }
		    for (var ii=0; ii<labels.length; ii++) {
		    	var k=labels[ii];
		    	if (k<=the_times.length) {
		    		the_times[k].push(times[ii]);
		    	}
		    }

		    //compute the cross-correlograms
		    for (var j=0; j<that.correlograms.length; j++) {
		    	var k1=that.correlograms[j].k1;
		    	var k2=that.correlograms[j].k2;
		    	that.correlograms[j].data=compute_cc_data(the_times[k1],the_times[k2],that.max_dt,(k1==k2));
		    }

			callback({success:true});
		});
	};

	function compute_cc_data(times1_in,times2_in,max_dt,exclude_matches) {
		var ret=[];
		var times1=times1_in.slice();
		var times2=times2_in.slice();
		JSQ.numSort(times1);
		JSQ.numSort(times2);

		if ((times1.length===0)||(times2.length===0)) return ret;

		var i1=0;
		for (var i2=0; i2<times2.length; i2++) {
			while ((i1+1<times1.length)&&(times1[i1]<times2[i2]-max_dt)) i1++;
			var j1=i1;
			while ((j1<times1.length)&&(times1[j1]<=times2[i2]+max_dt)) {
				var ok=true;
				if ((exclude_matches)&&(j1==i2)&&(times1[j1]==times2[i2])) ok=false;
				if (ok) {
					ret.push(times1[j1]-times2[i2]);
				}
				j1++;
			}
		}
		return ret;
	}

	function loadStaticOutput(X) {
		that.correlograms=JSQ.clone(X.correlograms||[]);
		for (var i=0; i<that.correlograms.length; i++) {
			var buf=Base64Binary.decode(that.correlograms[i].data).buffer;
			var data0=new Float64Array(buf.byteLength/8);
			var view=new DataView(buf);
			for (var j=0; j<data0.length; j++) { // can this be improved?
				data0[j]=view.getFloat64(j*8, false); //little/big endian? (true/false)
			}
			that.correlograms[i].data=data0;
		}
    	that.loaded_from_static_output=true;
	}
}

///////////////////////////////////////////////////////////////////////////////////////
// ************************ ENCODE Base64 ************************
// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5
// indices added by jfm
window.typed_arrays_alert_has_been_shown=false;
function base64ArrayBuffer(arrayBuffer,min_index,max_index) {
	
	if (typeof(Uint8Array)=='undefined') {
		if (!window.typed_arrays_alert_has_been_shown) {
			alert('Your browser does not support typed arrays. Please view this page using Chrome, FireFox, or Safari');
			window.typed_arrays_alert_has_been_shown=true;
		}
	}
	
  var base64    = '';
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var bytes         = new Uint8Array(arrayBuffer);
  if (min_index===undefined) min_index=0;
  if (max_index===undefined) max_index=bytes.byteLength-1;
  var byteLength    = max_index-min_index+1;
  var byteRemainder = byteLength % 3;
  var mainLength    = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[min_index+i] << 16) | (bytes[min_index+i + 1] << 8) | bytes[min_index+i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63;               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[min_index+mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[min_index+mainLength] << 8) | bytes[min_index+mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }
  
  return base64;
}


// ************************ DECODE Base64 ************************
/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {

		if (typeof(Uint8Array)=='undefined') {
			if (!window.typed_arrays_alert_has_been_shown) {
				alert('Your browser does not support typed arrays. Please view this page using Chrome, FireFox, or Safari');
				window.typed_arrays_alert_has_been_shown=true;
			}
		}
		
		var bytes = Math.ceil( (3*input.length) / 4.0);
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decode: function(input, arrayBuffer) {
		
		//the following added by jfm (10/4/13)
		var _keyStr_lookup={};
		for (var j=0; j<this._keyStr.length; j++) {
			_keyStr_lookup[this._keyStr[j]]=j;
		}
		
		if (typeof(Uint8Array)=='undefined') {
			if (!window.typed_arrays_alert_has_been_shown) {
				alert('Your browser does not support typed arrays. Please view this page using Chrome, FireFox, or Safari');
				window.typed_arrays_alert_has_been_shown=true;
			}
		}
		
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2)); //there was a bug here! See the comments of: http://blog.danguer.com/2011/10/24/base64-binary-decoding-in-javascript/

		var bytes = Math.ceil( (3*input.length) / 4.0);
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			
			//jfm replaced the following (10/4/13)
			//enc1 = this._keyStr.indexOf(input.charAt(j++));
			//enc2 = this._keyStr.indexOf(input.charAt(j++));
			//enc3 = this._keyStr.indexOf(input.charAt(j++));
			//enc4 = this._keyStr.indexOf(input.charAt(j++));
			enc1=_keyStr_lookup[input.charAt(j++)]||0;
			enc2=_keyStr_lookup[input.charAt(j++)]||0;
			enc3=_keyStr_lookup[input.charAt(j++)]||0;
			enc4=_keyStr_lookup[input.charAt(j++)]||0;
			
			if ((enc1<0)||(enc2<0)||(enc3<0)||(enc4<0)) {
				console.log ('################',input.slice(j-4,j),enc1,enc2,enc3,enc4);
			}

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;	
	}
};
