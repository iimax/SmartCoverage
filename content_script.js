// Copyright (c) 2016 iimax. All rights reserved.

var clickedElement,defaultCarrier='Your-CarrierName';
var nameMapping = {
	"BODINJ": ["BodilyInjury", "BI"], 
	"PD": ["PropertyDamage", "PD"], 
	"UMBI": ["UMBI", "UMBI"], 
	"UIM": ["UIM", "UIM"], 
	"MEDPAY": ["Medical", "MED"], 
	"WORKLOSS": ["WorkLoss", "WorkLoss"], 
	"ACCDEATH": ["AccDeath", "AccDeath"], 

	"COMP": ["Comprehensive", "COMP"],
	"COLL": ["Collision", "COLL"],
	"TOW": ["Tow", "TOW"],
	"RENT": ["Rental", "RENT"],
	"UMPD": ["UMPD", "UMPD"],
	"": ["", ""]
};
document.addEventListener("mousedown", function(event){
	chrome.storage.sync.get({
	    carrier: 'Your-CarrierName'
	  }, function(items) {
	    defaultCarrier = items.carrier;
	  });
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
	_codes.push('<div style="height:100%;overflow:auto;"><pre class="brush: vb; highlight: [1, '+ (_opts.length+2) +'];" id="iimax_codes" style="padding-left: 15px;">');
	_codes.push('\'Quotepro ' + nameMapping[_name][0] + '\r\n');
	for (var i = 0; i < _opts.length; i++) {
		_codes.push('\'' + _opts[i].outerHTML.trim().replace(/\n/g, "") + '\r\n');
	}
	if(_name == 'MEDPAY'){
		_codes.push('Select Case hc.NumbersOnlyString(q.QVehicles.Item(0).'+ nameMapping[_name][0] +')\r\n');
	}
	else {
		_codes.push('Select Case q.qVehicles.Item(0).'+ nameMapping[_name][0] +'\r\n');
	}
	for (var i = 0; i < _opts.length; i++) {
		_codes.push('\tCase "' + _opts[i].value + '" \'' + _opts[i].innerText.trim() + '\r\n');
		_codes.push('\t\tCov(0).'+ nameMapping[_name][1] +' = ""\r\n');
	}
	_codes.push('\tCase Else\r\n');
	_codes.push('\t\tIf q.FromWhere = 3 Then\r\n');
	_codes.push('\t\t\thc.SendReminderEmail(q, idc, "Unknown '+ nameMapping[_name][1] +' code:" & q.QVehicles.Item(0).'+ nameMapping[_name][0] +', AgentLogin, AgentPassword, ProducerCode, "'+ defaultCarrier +'")\r\n');
	_codes.push('\t\t\tMsgType = ErrorTypes.RetailError\r\n');
	_codes.push('\t\t\tNonFatalError = True\r\n');
	_codes.push('\t\t\tThrow New Exception("Data error, please restart your browser and try again with a new quote")\r\n');
	_codes.push('\t\tElse\r\n');
	_codes.push('\t\t\tThrow New Exception("Unknown '+ nameMapping[_name][1] +' code:" & q.QVehicles.Item(0).'+ nameMapping[_name][0] +')\r\n');
	_codes.push('\t\tEnd If\r\n');
	_codes.push('End Select\r\n</pre></div>');
	layer.open({
	  type: 1,
	  //skin: 'layui-layer-demo', //样式类名
	  area: ['630px', '460px'],
	  //area: '630px',
	  title: 0,
	  closeBtn: 0,
	  shift: 2,
	  shadeClose: true, //开启遮罩关闭
	  content: _codes.join(''),
	  btn: ['Copy', 'Close']
	  ,btnAlign: 'c'
	  ,yes: function(index, layero){
	    var wrapper = document.getElementById('iimax_codes');
	    var codeNode = $('table tr td.code',wrapper);
    	var range = document.createRange();
        range.selectNode(codeNode[0]);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(range);
        // Copy - requires clipboardWrite permission
        document.execCommand('copy');
	    layer.close(index);
	  },btn2: function(index, layero){
	    layer.close(index);
	  },success:function(){
	  	SyntaxHighlighter.all();
	  	SyntaxHighlighter.highlight();
	  }
	});
  }
);