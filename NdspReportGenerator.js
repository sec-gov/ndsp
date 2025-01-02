//NDSP Report Generator was created by staff of the U.S. Securities and Exchange Commission.
//Data and content created by government employees within the scope of their employment
//are not subject to domestic copyright protection. 17 U.S.C. 105.

const NS = ''; /* null string */
const WS = ' '; /* one whitespace */
const ZWSP = '\u200B'; /* zero width space */
const NL = '\n';
const SEMI = ';'; /* one semicolon */
const AUTO = 'auto';
const TEXTSTYLE = 'textStyle';
const TABLEVALUE = 'tableValue';
const COMPRESS = false; /* For debugging, set false so as to inspect pdf output. */
const FILLCOLOR = '#CCE6FF'; /* blue */	
const FAILCOLOR = '#FFCCE6'; /* pink */
const GRAYCOLOR = '#CCCCCC'; /* gray */
var basename = null;

var xsdContent, xmlDoc, matrAspectsArr, detailData;
var hasTimeStamp = false;

/******* ndsp *******/

const title = 'New Derivative Securities Product Report';
const formId = 'form19b4eForm'

function createNewDerivativeSecuritiesProductReportPDF() { /* ndsp */
	memoryStatInitialize();
	var docStyles = {
		header : { fontSize : 16, bold : true, alignment : 'center' },
		header3 : { fontSize : 10, bold : true, alignment : 'center', lineHeight: 1.2 },
		header4 : { fontSize : 8, bold : true, alignment : 'center', lineHeight: 1.2 },
		sectionHeader : { fontSize : 12, bold : true, alignment : 'left', lineHeight: 1.2 },
		subSectionHeader : { fontSize : 10, bold : true, alignment : 'left', lineHeight: 1.2 },
		textStyle : { fontSize : 8 },
		tableHeader : { fontSize : 7, bold : false, alignment : 'center', fillColor : FILLCOLOR },
		tableValue : { fontSize : 6, alignment : 'left' },
		tableNameValue : { fontSize : 7, alignment : 'left' },
		failHeader: { fontSize: 9, bold: true, alignment : 'center', fillColor : FAILCOLOR }
	}

	var body = getNdspData();
	var hasoutput = body.length > 0; /* not right */
	if (!hasoutput) {
		alert('No new derivative products in '+basename.name+', no output files.');
	}
	const outname = ((basename == null) ? 'ndsp' : removeExtension(basename.name));
	
	const docDefinition = {info: 
							{title: title, 
							 PageLayout: 'OneColumn'},
						 content: body, 
						 pageOrientation : 'landscape',
						 styles: docStyles};

	const pdf = pdfMake.createPdf(docDefinition);
	pdf.download(outname + '.pdf')
}

const ndspFirstPage = [ // field, alignment, column

];
const ndspFirstPageElts = [];
for (i=0;i<ndspFirstPage.length;i++) { ndspFirstPageElts.push(ndspFirstPage[i][0]); }
const ndspFirstPageAlign = [];
for (i=0;i<ndspFirstPage.length;i++) { ndspFirstPageAlign.push(ndspFirstPage[i][1]); }
const ndspFirstPageHeaders = [];
for (i=0;i<ndspFirstPage.length;i++) { ndspFirstPageHeaders.push(ndspFirstPage[i][2]); }

const ndspLastPage = [ // field, alignment, column
];
const ndspLastPageElts = [];
for (i=0;i<ndspLastPage.length;i++) { ndspLastPageElts.push(ndspLastPage[i][0]); }
const ndspLastPageAlign = [];
for (i=0;i<ndspLastPage.length;i++) { ndspLastPageAlign.push(ndspLastPage[i][1]); }
const ndspLastPageHeaders = [];
for (i=0;i<ndspLastPage.length;i++) { ndspLastPageHeaders.push(ndspLastPage[i][2]); }

const ndspTable = [ /* xml name, alignment, width, pretty name.  ORDER is significant.  570.  */
/* pretty name has newlines because package does not support vertical-alignment. */
 [ 'xchg', 'left', 'auto', NL.repeat(2) + 'Exchange' ],
 [ 'pstngDt', 'left', 'auto', NL.repeat(1) + 'Date of Posting' ],
 [ 'frstTradDt', 'left', 'auto', NL.repeat(1) + 'Date of First Trade' ],
 [ 'ticker', 'left', 'auto', NL.repeat(2) + 'Ticker'],
 [ 'issrTyp', 'left', 'auto', NL.repeat(1) + 'Issuer' + NL + 'Type'],
 [ 'othIssrTyp', 'left', 'auto', NL.repeat(0) + 'Other' + NL + 'Issuer' + NL + 'Type'],
 [ 'clss', 'left', 'auto', NL.repeat(2) + 'Class'],
 [ 'othClss', 'left', 'auto', NL.repeat(1) + 'Other' + NL + 'Class'],
 [ 'undrlyngInstrm', 'left', 'auto', NL.repeat(1) + 'Underlying' + NL + 'Instrument'],
 [ 'usMkts', 'center', 'auto', NL.repeat(1) + 'US' + NL + 'Markets'],
 [ 'nonUsMkts', 'center', 'auto', NL.repeat(1) + 'Non-US' + NL + 'Markets'], 
 [ 'cashSttl', 'center', 'auto', NL.repeat(0) + 'Cash' + NL + 'Settle' + NL +'ment'],
 [ 'physSttl', 'center', 'auto', NL.repeat(0) + 'Physical' + NL + 'Settle' + NL +'ment'],
 [ 'amSttl', 'center', 'auto', NL.repeat(0) + 'A.M.' + NL + 'Settle' + NL +'ment'],
 [ 'pmSttl', 'center', 'auto', NL.repeat(0) + 'P.M.' + NL + 'Settle' + NL +'ment'],
 [ 'othSttl', 'left', 'auto', NL.repeat(0) + 'Other' + NL + 'Settle' + NL +'ment'],
 [ 'indxTyp', 'center', 'auto', NL.repeat(1) + 'Index' + NL + 'Type'],
 [ 'posLmts', 'center', 'auto', NL.repeat(1) + 'Position' + NL + 'Limits'],
];
const ndspCols = ndspTable.length;
const ndspElts = [];
for (i=0;i<ndspTable.length;i++) { ndspElts.push(ndspTable[i][0]); }
const ndspAlign = [];
for (i=0;i<ndspTable.length;i++) { ndspAlign.push(ndspTable[i][1]); }
const ndspWidths = [];
for (i=0;i<ndspTable.length;i++) { ndspWidths.push(ndspTable[i][2]); }
const ndspHeaders = [];
for (i=0;i<ndspTable.length;i++) { ndspHeaders.push(ndspTable[i][3]); }

function getNdspData() { /* ndsp */
	preamble = [];
	preamble.push({text: title, 
					style: 'header',
					tags: ['TITLE','/TITLE'] });	
	$.each(ndspFirstPage, function(index, val) {
		var tag = val[0];
		var align = val[1];
		var label = val[2];
		var elts = xmlDoc.getElementsByTagName(tag);
		if (elts.length > 0) {
			var content = elts[0].textContent.trim();
			if (index == 0) {
				preamble.push({
					text: content, style: 'header', tags: ['H1','/H1']});
			} else if (ndspFirstPageElts.indexOf(elts[0].localName) >= 0) {
			preamble.push({
					text: label, style: 'sectionHeader', tags: ['H2','/H2']});
			var content = elts[0].textContent.trim();
            if (tag=='date') {
                content = formatDate(content);
                }
			preamble.push({
					text: content, style: 'textStyle', tags: ['P', '/P']});
			}
		}})
	
	const lastCol = ndspCols - 1;
    var body = [];
	var row = [];
	const ndspRows = xmlDoc.getElementsByTagName('ndsp');
	const lastRow = ndspRows.length - 1;

	$.each(ndspHeaders, function(i, val) {
		isFirstCol = (i == 0);
		isLastCol = (i == lastCol);
		row.push({
			text: val,
			tags: []
                .concat(isFirstCol ? ['Table','TR'] : [])
                .concat(['TH','/TH'])
                .concat(isLastCol ? ['/TR'] : [] ),
			style: 'tableHeader', unbreakable:true
		});
	});
	body.push(row);

	$.each(ndspRows, function (j, ndspRow) {
		row = [];
        isFirstRow = (j == 0);
		isLastRow = (j == lastRow);
		$.each(ndspElts, function(i, local_name) {
			isFirstCol = (i == 0);
			isLastCol = (i == lastCol);
			content = WS; /* really empty cells aren't handled by the tagging code */
			/* columns might be empty so first see if there is a value in the XML */
			nodes = ndspRow.getElementsByTagName(local_name);
			if (nodes.length > 0) {
				child = nodes[0]
				content = child.textContent.trim(); 
				if (ndspAlign[i] == 'right') {
					content = addCommas(content);
				}
			}
			row.push({ 
				text: content,
				tags: []
					.concat(isFirstCol ? ['TR'] : [])
					.concat(['TD','/TD'])
					.concat(isLastCol ? ['/TR'] : [] )
					.concat(isLastCol && isLastRow ? ['/Table'] : [] ),
				style: 'tableValue', 
				unbreakable:true, 
				alignment: ndspAlign[i]
			});
		});
		body.push(row);
	});
    
	postamble = [];
	$.each(ndspLastPage, function(index, val) {
		var tag = val[0];
		var align = val[1];
		var label = val[2];
		var elts = xmlDoc.getElementsByTagName(tag);
		if (elts.length > 0) {
			var content = elts[0].textContent.trim();
			if (ndspLastPageElts.indexOf(elts[0].localName) >= 0) {
			postamble.push({
					text: label, style: 'sectionHeader', tags: ['H2','/H2']});
			var content = elts[0].textContent.trim();
			postamble.push({
					text: content, style: 'textStyle', tags: ['P', '/P']});
			}
		}})
	
	return [preamble, NL,
			{table: { body : body,
						headerRows : 1, 
						dontBreakRows: true,
						widths : ndspWidths
					}
				},
			NL, postamble]
}

/****** utilities ******/

function formatDate(timestamp) {
    // varoius date formats, to "Aug 9, 2024" format.
	var date = new Date(timestamp);
    var txt = date.toString();
    var parts = txt.split(" ",4);
    var day = parseInt(parts[2]);
	return `${parts[1]} ${day}, ${parts[3]}`;
}

function removeExtension(filename){
	var lastDotPosition = filename.lastIndexOf('.');
	if (lastDotPosition === -1) return filename;
	else return filename.substr(0, lastDotPosition);
}

function loadXML() {
	var oFiles = document.getElementById('xmlFile').files;
	var isValid = true;
	try {
		var reader = new FileReader();
		basename = oFiles[0];
		reader.readAsText(oFiles[0]);
	} catch (err) {
		alert(err);
	}
	reader.onloadend = function() {
		try {
			if (xsdContent != null) {
				isValid = validateXMLContent(reader.result, oFiles[0].name);
			}
			if (isValid) {
				if (window.DOMParser) {
					var parser = new DOMParser();
					xmlDoc = $.parseXML(reader.result);
				} else if (window.ActiveXObject) {
					xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
					xmlDoc.async = false;
					xmlDoc.loadXML(reader.result);
				}
				if (xmlDoc.getElementsByTagName('timestamp')[0] != null) {
					hasTimeStamp = true;
				}
				if (xmlDoc.getElementsByTagName('notHeldOrderHandlingCustomerReport')[0] != null) {
					/* b3 */
					createNotHeldOrderHandlingCustomerReportPDF({});
				} else if (xmlDoc.getElementsByTagName('heldOrderRoutingPublicReport')[0] != null) {
					// a1
					createHeldOrderRoutingPublicReportPDF();
				} else if (xmlDoc.getElementsByTagName('heldExemptNotHeldOrderRoutingCustomerReport')[0] != null) {
					// b1
					createHeldExemptNotHeldOrderRoutingCustomerReport();
				} else if (xmlDoc.getElementsByTagName('dailyMarketDataReport')[0] != null) {
					// d m d r
					createDailyMarketDataReportPDF();
				} else if (xmlDoc.getElementsByTagName('ndspRpt')[0] != null) {
					// d m d r
					createNewDerivativeSecuritiesProductReportPDF();
				} else {
					alert('NO MATCH');
				}
			}
			document.getElementById(formId).reset();
		} catch (err) {
			alert(err);
		}
	}
}

function validateXMLContent(xmlContent, xmlFileName) {
	var isValid = true;
	var Module = {
		xml : xmlContent,
		schema : xsdContent,
		arguments : [ '--noout', '--schema', 'ndsp.xsd', xmlFileName ]
	};
	var validationMessage = validateXML(Module);
	if (validationMessage.indexOf('fails') >= 0) {
		isValid = false;
		alert(validationMessage);
	}
	return isValid;
}

function loadXSD() {
	var oFiles = document.getElementById('xsdFile').files;
	try {
		var reader = new FileReader();
		reader.readAsText(oFiles[0]);
		reader.onloadend = function() {xsdContent = reader.result;};
	} catch (err) {
		alert(err);
	}
}

function addCommas(number) {
	var x = number.split('.');
	var y = x[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	if (x[1] != null) {
		y = y + '.' + x[1];
	}
	return y;
}

/**** memory metering ****/

var memoryMessages = [{used:0}];

function memoryStatInitialize() {
	memoryMessages = [{used:0}];
}

function memoryStat(msg,popup) {
	if (window.performance == undefined || window.performance.memory == undefined) return;
	var memory = window.performance.memory;
	var used = Math.round(memory.usedJSHeapSize/(1024*1024));
	var total = Math.round(memory.totalJSHeapSize/(1024*1024));
	var previous = memoryMessages[memoryMessages.length-1]
	var change = used - previous.used;
	var record = {msg:msg,used:used,total:total,change:change};
	memoryMessages.push(record);
	if (popup) {
		alert(JSON.stringify(record));
	}
}
