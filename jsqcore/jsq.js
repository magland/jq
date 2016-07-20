var JSQ=new JSQCore();

function JSQCore() {
	this.connect=function(sender,signal,receiver,callback,connection_type) {connect(sender,signal,receiver,callback,connection_type);};
	this.emit=function(sender,signal_name,args) {emit(sender,signal_name,args);};
	this.clone=function(obj_or_array) {return clone(obj_or_array);};
	this.compare=function(X,Y) {return compare(X,Y);};
	this.computeSha1SumOfString=function(str) {return computeSha1SumOfString(str);};
	this.numSet2List=function(set) {return numSet2List(set);};
	this.numSort=function(array) {numSort(array);};

	this._object=function(id) {return object(id);};
	this._addObject=function(id,obj) {addObject(id,obj);};
	this._removeObject=function(id) {removeObject(id);};

	function connect(sender,signal_name,receiver,callback,connection_type) {
		m_connection_manager.connect(sender,signal_name,receiver,callback,connection_type);
	}
	function emit(sender,signal_name,args) {
		m_connection_manager.emit(sender,signal_name,args);
	}
	function clone(obj_or_array) {
		return JSON.parse(JSON.stringify(obj_or_array));
	}
	function compare(X,Y) {
		return (JSON.stringify(X)==JSON.stringify(Y));
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
	function computeSha1SumOfString(str) {
		return Sha1.hash(str);
	}
	function numSet2List(set) {
		var ret=[];
		for (var key in set) {
			ret.push(key);
		}
		JSQ.numSort(ret);
		return ret;
	}
	function numSort(array) {
		array.sort(function(a,b) {return (a-b);});
	}

	var m_connection_manager=new JSQConnectionManager();
	var m_objects={};
}

function JSQConnectionManager() {
	this.connect=function(sender,signal_name,receiver,callback,connection_type) {connect(sender,signal_name,receiver,callback,connection_type);}
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




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript                  (c) Chris Veness 2002-2014 / MIT Licence  */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* jshint node:true *//* global define, escape, unescape */
'use strict';


/**
 * SHA-1 hash function reference implementation.
 *
 * @namespace
 */
var Sha1 = {};


/**
 * Generates SHA-1 hash of string.
 *
 * @param   {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function(msg) {
    // convert string to UTF-8, as SHA only deals with byte-streams
    msg = msg.utf8Encode();

    // constants [§4.2.1]
    var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];

    // PREPROCESSING

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [§6.1.2]

    var W = new Array(80); var a, b, c, d, e;
    for (var i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0; b = H1; c = H2; d = H3; e = H4;

        // 3 - main loop
        for (var t=0; t<80; t++) {
            var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
            var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = Sha1.ROTL(b, 30);
            b = a;
            a = T;
        }

        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H0 = (H0+a) & 0xffffffff;
        H1 = (H1+b) & 0xffffffff;
        H2 = (H2+c) & 0xffffffff;
        H3 = (H3+d) & 0xffffffff;
        H4 = (H4+e) & 0xffffffff;
    }

    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + Sha1.toHexStr(H2) +
           Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
};


/**
 * Function 'f' [§4.1.1].
 * @private
 */
Sha1.f = function(s, x, y, z)  {
    switch (s) {
        case 0: return (x & y) ^ (~x & z);           // Ch()
        case 1: return  x ^ y  ^  z;                 // Parity()
        case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
        case 3: return  x ^ y  ^  z;                 // Parity()
    }
};

/**
 * Rotates left (circular left shift) value x by n positions [§3.2.5].
 * @private
 */
Sha1.ROTL = function(x, n) {
    return (x<<n) | (x>>>(32-n));
};


/**
 * Hexadecimal representation of a number.
 * @private
 */
Sha1.toHexStr = function(n) {
    // note can't use toString(16) as it is implementation-dependant,
    // and in IE returns signed numbers when used on full words
    var s="", v;
    for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/** Extend String object with method to encode multi-byte string to utf8
 *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
if (typeof String.prototype.utf8Encode == 'undefined') {
    String.prototype.utf8Encode = function() {
        return unescape( encodeURIComponent( this ) );
    };
}

/** Extend String object with method to decode utf8 string to multi-byte */
if (typeof String.prototype.utf8Decode == 'undefined') {
    String.prototype.utf8Decode = function() {
        try {
            return decodeURIComponent( escape( this ) );
        } catch (e) {
            return this; // invalid UTF-8? return as-is
        }
    };
}