// Copyright (c) 2016 iimax. All rights reserved.

var clickedElement;
var nameMapping = {
	"BODINJ": ["BodilyInjury", "BI"], 
	"PD": ["PropertyDamage", "PD"], 
	"UMBI": ["UnInsured", "UMBI"], 
	"UIM": ["Underinsured", "UIM"], 
	"MEDPAY": ["Medical", "MED"], 
	"WORKLOSS": ["WorkLoss", "WorkLoss"], 
	"ACCDEATH": ["AccDeath", "AccDeath"], 

	"COMP": ["Compre", "COMP"],
	"COLL": ["Collision", "COLL"],
	"TOW": ["Tow", "TOW"],
	"RENT": ["Rental", "RENT"],
	"UMPD": ["UMPD", "UMPD"],
	"": ["", ""]
};
document.addEventListener("mousedown", function(event){
	//console.log(event);
	//alert(event.srcElement);
	clickedElement = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(!clickedElement){ layer.msg('Unknown element'); return;}
	var _tag = clickedElement.tagName;
	if(_tag != 'SELECT'){ layer.msg('Only select element is supported'); return;}
	var _name = clickedElement.name;
	if(_name.indexOf('COMP')==0){ _name = 'COMP' }
	else if(_name.indexOf('COLL')==0){ _name = 'COLL' }
	else if(_name.indexOf('TOW')==0){ _name = 'TOW' }
	else if(_name.indexOf('RENT')==0){ _name = 'RENT' }
	else if(_name.indexOf('UMPD')==0){ _name = 'UMPD' }
	if(!_name) _name = '';
	if(!nameMapping[_name]) {nameMapping[_name] = [_name, _name]}

	var _opts = clickedElement.options, _codes = [];
	_codes.push('<pre>Select Case q.qVehicles.Item(0).'+ nameMapping[_name][0] +'\r\n');
	for (var i = 0; i < _opts.length; i++) {
		_codes.push('\tCase "' + _opts[i].value + '" \'' + _opts[i].innerText.trim() + '\r\n');
		_codes.push('\t\tCov(0).'+ nameMapping[_name][1] +' = ""\r\n');
	}
	_codes.push('\tCase Else\r\n');
	_codes.push('\t\tThrow new Exception("Unknown")\r\n');
	_codes.push('End Select\r\n<pre>');
	layer.open({
	  type: 1,
	  //skin: 'layui-layer-demo', //样式类名
	  area: ['630px', '360px'],
	  title: 'Hi',
	  closeBtn: 0,
	  shift: 2,
	  shadeClose: true, //开启遮罩关闭
	  content: _codes.join('')
	});
  }
);