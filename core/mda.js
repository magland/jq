function Mda() {
	this.allocate=function(n1,n2,n3,n4,n5) {
		n1=n1||1; n2=n2||1; n3=n3||1;
		n4=n4||1; n5=n5||1;
		m_total_size=n1*n2*n3*n4*n5;
		m_data=new Float32Array(m_total_size);
		for (var i=0; i<m_total_size; i++) m_data[i]=0;
	}
	this.N1=function() {return m_dims[0];}
	this.N2=function() {return m_dims[1];}
	this.N3=function() {return m_dims[2];}
	this.N4=function() {return m_dims[3];}
	this.N5=function() {return m_dims[4];}
	this.value=function(i1,i2,i3,i4,i5) {
		if (i2===undefined) {
			return m_data[i1];
		}
		else if (i3===undefined) {
			return this.value(i1+m_dims[0]*i2);
		}
		else if (i4===undefined) {
			return this.value(i1+m_dims[0]*i2+m_dims[0]*m_dims[1]*i3);
		}
		else if (i5===undefined) {
			return this.value(i1+m_dims[0]*i2+m_dims[0]*m_dims[1]*i3+m_dims[0]*m_dims[1]*m_dims[2]*i4);
		}
		else {
			return this.value(i1 +m_dims[0]*i2 +m_dims[0]*m_dims[1]*i3 +m_dims[0]*m_dims[1]*m_dims[2]*i4 +m_dims[0]*m_dims[1]*m_dims[2]*m_dims[3]*i5);
		}
	}
	this.setValue=function(val,i1,i2,i3,i4,i5) {
		if (i2===undefined) {
			m_data[i1]=val;
		}
		else if (i3===undefined) {
			this.setValue(val,i1+m_dims[0]*i2);
		}
		else if (i4===undefined) {
			this.setValue(val,i1+m_dims[0]*i2+m_dims[0]*m_dims[1]*i3);
		}
		else if (i5===undefined) {
			this.setValue(val,i1+m_dims[0]*i2+m_dims[0]*m_dims[1]*i3+m_dims[0]*m_dims[1]*m_dims[2]*i4);
		}
		else {
			this.setValue(val,i1 +m_dims[0]*i2 +m_dims[0]*m_dims[1]*i3 +m_dims[0]*m_dims[1]*m_dims[2]*i4 +m_dims[0]*m_dims[1]*m_dims[2]*m_dims[3]*i5);
		}
	}
	this.data=function() {return m_data;}
	this.dataCopy=function() {
		var ret=new Float32Array(m_total_size);
		for (var i=0; i<m_total_size.length; i++) {
			ret[i]=m_data[i];
		}
		return ret;
	}
	this.setData=function(data) {
		m_data=data;
	}
	this.clone=function() {
		var ret=new Mda();
		ret.allocate(this.N1(),this.N2(),this.N3(),this.N4(),this.N5());
		ret.setData(this.dataCopy());
		return ret;
	}

	var m_data=new Float32Array(1);
	var m_dims=[1,1,1,1,1];
	var m_total_size=1;
}