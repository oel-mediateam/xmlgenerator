$(document).ready(function () {
	
    var showMoreXML = false, // boolean to flag whether the more XML tab is open or closed
        topicNum = 5, // total number of topics to start out with
        groupCounter = 0,
        copy,
        entered = false,
		fileError = false,
        dropZone = document.getElementById('drop_zone'); // hold the id of the file drop zone
		
    // call to initialize the UI interactions
    initialize();
	
    // function to initialize the UI interactions
    function initialize() {
		
        // check for File API support
        if (window.File && window.FileReader && window.FileList) {
			
            $('#browse, #closeFile').click(function () {
				
                $('#fileModel').modal('toggle');
                
				$('#fileResult').html('');
                
				$('.loader').hide();
				
            });
			
        } else {
			
            $('#browse')
                .addClass('disabled')
                .removeClass('btn-primary')
                .addClass('btn-danger')
                .html('<i class="icon-warning-sign icon-white"></i> Your browser does not support local file upload.');
				
        }
		
        // Setup the file drop zone upload dnd listeners.
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
		
        // hide the final xml textarea
        $('#xmlArea').hide();
			
        // hide the loading gif image for file upload
        $('.loader').hide();
			
        // bind the click event to close the
        // "Are You Sure" modal
        $('#closeRUModel').bind('click', function () {
			
            // enable the modal's opening and closing toggle
            $('#areUSure').modal('toggle');
			
        });
		
        // bind the click event to close the
        // "Sorry" modal
        $('#closeSRYModel').bind('click', function () {
            
			// enable the modal's opening and closing toggle
            $('#sorryNoCanDo').modal('toggle');
			
        });
		
        // bind the click event to the show more XML
        // tab on top of the page
        $('#player a').bind('click', function () {
				
            // if the show more tab is closed, ...
            if (showMoreXML === false) {
				
                $('.tab-pane').show('slow'); // slowly open the tab
				
                $(this).removeClass('tabShadow'); // remove the tab shadow class
				
                $(this).html('<i class="icon-chevron-up"></i> SELECT A DIFFERENT XML FILE'); // replace the html
				
                showMoreXML = true; // flag the tab is opened
				
            } else { // else if show more tab is opened, ...
                
				$('.tab-pane').hide('slow'); // slowly hide the tab
                
				$(this).addClass('tabShadow'); // add the tab shawdow class
                
				$(this).html('<i class="icon-chevron-down"></i> SELECT A DIFFERENT XML FILE'); // replace the html
				
                showMoreXML = false; // flag the tab is closed
				
            }
        });
		
        // bind on change event for group text input
        $('#groups').bind('change', function () {
				
            var numGroup;
			
            $(this).val().replace('/(\s)/', '');
				
            if (isNaN($(this).val())) {
					
                if (entered == true) {
					
                    $(this).val(copy)
						
                } else {
					
                    $(this).val('').attr('placeholder', 'enter a number').addClass('error');
						
                }
				
            } else {
				
                if ($(this).hasClass('error')) {
						
                    $(this).removeClass('error');
					
                }
				
                if ($(this).val().match(' ')) {
					
                    $(this).val('').attr('placeholder', 'i.e.: 2, 3, 5, etc.');
						
                    if (!$('#group').hasClass('hide')) {
						
                        $('.groupRow').html('');
                        
						$('#group').addClass('hide');
						
                    }
					
                } else {
					
                    numGroup = $(this).val();
					
                    if (numGroup != 0) {

                        showGroup(numGroup);
						
                    } else if (numGroup == 0) {
						
                        if (!$('#group').hasClass('hide')) {
								
                            $('.groupRow').html('');
								
                            $('#group').addClass('hide');
							
                        }
						
                        groupCounter = 0;
						
                    } else {
						
                        if (!$('#group').hasClass('hide')) {
							
                            $('#group').addClass('hide');
							
                        }
						
                        $('.groupRow').html('');
                        
						groupCounter = 0;
						
                    }
					
                    copy = numGroup;
                    
					entered = true;
					
                }
				
                addGroupSelection($(this).val());
				
            }
			
        });
		
        // bind on change event to show embed code on the first video
        bindExRes(1);
        bindExRes(2);
        bindExRes(3);
		bindExRes(4);
		bindExRes(5);
		
        // apply tinymce to the description textareas		
        applyTinymce('#vDes1');
        applyTinymce('#vDes2');
        applyTinymce('#vDes3');
		applyTinymce('#vDes4');
		applyTinymce('#vDes5');
		
    } // closing initialize function
	
    // function to show group text fields
    function showGroup(gNum) {
		
        var i, minus = false;
		
		if ($('#group').hasClass('hide')) {
							
           $('#group').removeClass('hide');
							
        }
		
        if (gNum > groupCounter) {
            gNum = gNum - groupCounter;
            minus = false;
			
        } else {
			
            gNum = groupCounter - gNum;
           
		    minus = true;
			
        }
		
        if (minus == false) {
			
            for (i = 0; i < gNum; i++) {
				
                $('.groupRow').append('<div class="span2"><input type="text" class="span2" placeholder="group ' + (groupCounter + 1) + '" /></div>');
                
				groupCounter++;
				
            }
			
        } else {
			
            for (i = 0; i < gNum; i++) {
				
                $('.groupRow div.span2:last').remove();
                
				groupCounter--;
				
            }
			
        }
		
    }

    function addGroupSelection(i) {
		
        $('.groupSelect').html('<option value=" " selected></option><option value="0">0</option>');
		
        for (var j = 0; j < i; j++) {
			
            $('.groupSelect').append('<option value="' + (j + 1) + '">' + (j + 1) + '</option>');
			
        }
		
    }
	
    // function to bind show hide external embed code text box
    function bindExRes(i) {
		
        $('input[name=src' + i + ']').bind('click', function () {
				
            var yesNo = $(this).val();
			
            if (yesNo == "yes") {
				
                if ($('#embedTxt' + i + '').hasClass('hide')) {
					
                    $('#embedTxt' + i + '').removeClass('hide');
					
                }
				
            } else {
				
                if (!$('#embedTxt' + i + '').hasClass('hide')) {
					
                    $('#embedTxt' + i + '').addClass('hide');
                    $('#srcEmbed' + i + '').val('');
					
                }
				
            }
			
        });
		
    }
	
	// bind click event to add more than one topic
        $('#plusMoreTopic').bind('click', function () {
				
            // holds the number of topic to add
            var numToAdd = $('#topicNumInput').val();
			
            // if the numToAdd is a number, ...
            if (!isNaN(numToAdd)) {
				
                // use loop to add how ever many topic specified
                for (var i = 1; i <= numToAdd; i++) {
					
                    // increment the topicNum by 1
                    topicNum++;
					
                    // append a topic input field and a note textarea to the existing topics on the page
            		$('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span7"><label for="fName' + topicNum + '">File Name:</label><input type="text" class="span7" name="fName' + topicNum + '" id="fName' + topicNum + '"/></div><div class="span2"><label for="group' + topicNum + '">Group Number:</label><select type="text" name="group' + topicNum + '" id="group' + topicNum + '" class="span2 groupSelect"></select></div><div class="span2"><label>External Source:</label><label class="radio inline"><input type="radio" name="src' + topicNum + '" id="src' + topicNum + '" value="yes" /> Yes </label><label class="radio inline"><input type="radio" name="src' + topicNum + '" value="no" checked /> No </label></div><div class="span7"><label for="topic' + topicNum + '">Video title:</label><input type="text" class="span7" name="topic' + topicNum + '" id="topic' + topicNum + '"/></div><div class="span4"><label for="vidAuth' + topicNum + '">Video author(s):</label><input type="text" class="span4" name="vidAuth' + topicNum + '" id="vidAuth' + topicNum + '"/></div><div class="span11 hide" id="embedTxt' + topicNum + '"><label for="srcEmbed' + topicNum + '">External Embed Code:</label><input type="text" class="span11" name="srcEmbed' + topicNum + '" id="srcEmbed' + topicNum + '"/></div><div class="span11"><label for="vDes' + topicNum + '">Video description:</label><textarea class="span11" name="vDes' + topicNum + '" id="vDes' + topicNum + '"></textarea></div></div></div></div>');
			
					bindExRes(topicNum);
		    		applyTinymce('#vDes'+topicNum);
					addGroupSelection(groupCounter);
						
                }
				
                // reset the number of topic to add back to 5
                $('#topicNumInput').val(5);
				
                // if the error for invalid number of topic to add is show, ...
                if ($('#topicNumInput').hasClass('error') === true) {
					
                    $('#topicNumInput').removeClass('error'); // remove the error class to remove the error
					
                }
				
                // hide the error message fast
                $('.errorText').hide('fast');
					
            } else { // else if the number of topic to add is not an number, ...
               
			    // if the error is not shown, ...
                if ($('#topicNumInput').hasClass('error') === false) {
					
                    $('#topicNumInput').addClass('error'); // add error class
					
                }
				
                // show the error slowly
                $('.errorText').show('slow');
				
            }
        });
		
        // bind click event to add one (1) topic only
        $('#plusTopic').bind('click', function () {
				
            // increment topicNum by 1
            topicNum++;
			
            // append a topic input field and a note textarea to the existing topics on the page
            $('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span7"><label for="fName' + topicNum + '">File Name:</label><input type="text" class="span7" name="fName' + topicNum + '" id="fName' + topicNum + '"/></div><div class="span2"><label for="group' + topicNum + '">Group Number:</label><select type="text" name="group' + topicNum + '" id="group' + topicNum + '" class="span2 groupSelect"></select></div><div class="span2"><label>External Source:</label><label class="radio inline"><input type="radio" name="src' + topicNum + '" id="src' + topicNum + '" value="yes" /> Yes </label><label class="radio inline"><input type="radio" name="src' + topicNum + '" value="no" checked /> No </label></div><div class="span7"><label for="topic' + topicNum + '">Video title:</label><input type="text" class="span7" name="topic' + topicNum + '" id="topic' + topicNum + '"/></div><div class="span4"><label for="vidAuth' + topicNum + '">Video author(s):</label><input type="text" class="span4" name="vidAuth' + topicNum + '" id="vidAuth' + topicNum + '"/></div><div class="span11 hide" id="embedTxt' + topicNum + '"><label for="srcEmbed' + topicNum + '">External Embed Code:</label><input type="text" class="span11" name="srcEmbed' + topicNum + '" id="srcEmbed' + topicNum + '"/></div><div class="span11"><label for="vDes' + topicNum + '">Video description:</label><textarea class="span11" name="vDes' + topicNum + '" id="vDes' + topicNum + '"></textarea></div></div></div></div>');
			
			bindExRes(topicNum);
		    applyTinymce('#vDes'+topicNum);
			addGroupSelection(groupCounter);
			
        });
		
        // bind click event to remove the last topic on the page
        $('#minusTopic').bind('click', function () {
			
			// hold the current last topic
            var lastTopic = $('div.topic:last');
            
			// if total number of topics is greater than 1, ...
            if (topicNum > 1) {
                				
				lastTopic.remove(); // remove last topic
                
				topicNum--; // decrement total number of topic by 1
                
				$('#areUSure').modal('toggle'); // close the "Are You Sure" model
					
            } else { // else if total number of topics less than and equal to 1, ...
                
				// alert the users
                $('#areUSure').modal('toggle'); // close the "Are You Sure" model
                
				$('#sorryNoCanDo').modal('toggle');
				
            }
        });
		
        // bind the click event to scroll all the way up the page
        $('#backToTop').bind('click', function () {
			
            // animate the html and the body
            $('html, body')
                .animate({
                scrollTop: 0 // all the way to the top
            }, 'slow'); // slowly
            
			$('#down').show(); // show the "All the Way Down" button
				
        });
		
        // bind the click event to scroll all the way down the page
        $('#down').bind('click', function (event) {
				
            // prevent the page from doing default event
            event.preventDefault();
			
            // animate the html and the body
            $('html, body')
                .animate({
                scrollTop: $(this.hash)
                    .offset()
                    .top // all the way down
            }, 'slow'); // slowly
			
        });
		
        // bind the click event to get the xml code
        $('#getCode').bind('click', function () {
				
            // create the current date
            var createdOnDate = new Date();
			
            // hold the current date and time
            var displayDateTime = (createdOnDate.getMonth() + 1) + '/' + (createdOnDate.getDate()) + '/' + createdOnDate.getFullYear() + '|' + createdOnDate.getHours() + ':' + createdOnDate.getMinutes() + ':' + createdOnDate.getSeconds();
						
            // output the XML to the output textarea
            $('#xmlOutput').val('<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated on ' + displayDateTime + ' -->\n<wall>\n' + getPlayerSetup() + getTopics() + '</wall>');
				
            // bind the fancybox event to open and close
            $('a#getCode')
                .fancybox({
                'hideOnContentClick': false,
                'scrolling': 'auto',
                'autoScale': true,
                'autoDimensions': true,
                'centerOnScroll': true
            });
			
            $('#xmlError').html('');
			$('#xmlError').append('<ul>');
						
			if (fileError) {
				
				$('#xmlError ul').append('<li>One or more of the video file name is not specified.</li>');
				
			}
						
            $('#xmlError').append('</ul>');
			
        });
	
    // get the player setup data
    function getPlayerSetup() {
		
        // variable to hold the starting setup nodes
        var value = '<!-- VIDEO WALL SETUP -->\n';
		
        // add the setup node
        value += '<setup>\n';
		
        /* THE IMAGE TYPE INPUT FIELD */
		
        // if the image type input field is equal to jpg, ...
        if ($('#imageType').val() === 'jpg') {
				
            // add the <imgFormat /> to the value variable
            value += '<imgFormat /> <!-- default image type applied -->\n';
			
        } else {
		
            // add the image type to the value variable
            value += '<imgFormat>' + $('#imageType').val() + '</imgFormat>\n';
        }
		
		/* THE GROUP INPUT FIELD */
		if ($('#groups').val() == 0 || isEmpty($('#groups').val())) {
			
			value += '<group total="0" />\n';
			
		} else {
			
			value += '<group total="'+$('#groups').val()+'">\n';
			
			for (var i = 0; i < $('#groups').val(); i++) {
				
				value += '<name group="'+(i+1)+'">'+ $('.groupRow input:eq('+i+')').val() +'</name>\n';
				
			}
			
			value += '</group>\n';
						
		}
		
        // end the value variable with </setup>
        value += '</setup>\n';
		
        // return the value in the value variable
        return value;
		
    }
	
    // get the topic data
    function getTopics() {
		
        // hold the topics in the variable
        var value = '<!-- VIDEOS -->\n';
		var fileName, group, author, title, description, src;
		
        // loop through the topics to get the title and the notes
        for (var i = 1; i <= topicNum; i++) {
			
			// if the current fileName is empty, ...
            if (isEmpty($('#fName' + i).val())) {
					
                // add the "REQUIRED" to the fileName
                fileName = 'REQUIRED';
					
                // add the error class
                $('#fName' + i).addClass('error');
					
                // place the word "REQUIRED" to the fileName input field
                $('#fName' + i).attr('placeholder', 'REQUIRED');
					
                // set the fileError to true
                fileError = true;
				
            } else { // if the current fileName is NOT empty, ...
			
                // add the fileName and replace any ampersand to the value variable
                fileName = $('#fName' + i).val();
					
                // if the current fileName has the error class, ...
                if ($('#fName' + i).hasClass('error')) {
                    
					// remove the class
                    $('#fName' + i).removeClass('error');
					
                    // set the fileError to false
                    fileError = false;
                }
				
            }
			
			group = $('#group'+i).val().replace(" ","");
			
			value += '<video fileName="'+fileName+'" group="'+group+'">\n';
			
			// add the topic title and replace any ampersand to the value variable
			title = $('#topic' + i).val().replace('\&', '&amp;');
			
			if (title == '' || title == undefined) {
				title = '';
			}
			
			src = $('#srcEmbed'+i).val();
			
			if ($('#src'+i+ ':checked').val() == 'yes') {
				value += '<src><![CDATA['+src+']]></src>\n';
			} else {
				value += '<src></src>\n';
			}
			
			author = $('#vidAuth'+i).val();
			
			if (author == '' || author == undefined) {
				author = '';
			}
			
			description = $('#vDes'+i).val();
			
			if (description == '' || description == undefined) {
				description = '';
			} else {
				description = '<![CDATA['+description+']]>';
			}
			
			value += '<author>'+author+'</author>\n';
			value += '<title>'+title+'</title>\n';
			value += '<description>'+description+'</description>\n';
			value += '</video>\n';
            
        }
		
        // return value to the function
        return value;
    }
	
    // check for empty field
    function isEmpty(str) {
		
        var strRE = /^[\s ]*$/gi;
		
        return strRE.test(str);
		
    }
	
    // function to handle file uploads
    function handleFileSelect(evt) {
		
        // FileList object; hold the first file
        var file = evt.dataTransfer.files[0];
		
        // holds the results of the file reading and uploading
        var output;
		
        // stop and preven the default functions
        evt.stopPropagation();
        evt.preventDefault();
		
        // if the file type is an text or xml, ...
        if (file.type != 'text/xml') {
			
            // set the results to output variable
            output = '<p style="color:#f00"><strong>' + escape(file.name) + '</strong> is not an XML file. It is a(n) ' + (file.type || 'unknown') + ' file type. Please try again.</p>';
			
        } else { // if it is an xml, ...
			
            // set the result to the output variable
            output = '<p><strong>' + escape(file.name) + '</strong> - ' + file.size + ' bytes' + '</p>';
            output += '<p>Uploading ...</p>';
			
			// show the loading indicator
        	$('.loader').show();
			
            // load the xml file
            loadXML(file);
			
        }
		
        // display the output
        $('#fileResult').html(output);
		
    }
	
    // function to handle the drag event
    function handleDragOver(evt) {
		
        // prevent default function and events
        evt.stopPropagation();
        evt.preventDefault();
		
        // IMPORTANT: Make to set the transfer as a copy of the original file
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		
    }
	
    // function to load the XML
    function loadXML(file) {
		
        // if the file exists, ...
        if (file) {
			
            // create a new file reader
            var reader = new FileReader();
			
            // load the file usin the reader
            reader.onload = (function (theFile) {
				
                return function (e) {
					
                    // create a new DOM Parser
                    var parser = new DOMParser();
					
                    // variable to hold the XML data
                    var xmlDoc = parser.parseFromString(e.target.result, "text/xml");
					
                    // output progress
                    $('#fileResult').append('<p>Reading ... </p>');
						
                    // if the xml is undefinded, ..
                    if (xmlDoc.getElementsByTagName("wall")[0] == undefined) {
						
                        // display the error
                        $('#fileResult').append('<p class="error"><i class="icon-warning-sign icon"></i> This XML file is not the correct file for this player. Please double check your XML file and try again.</p>');
						
                    } else {
						
                        // parse the xml
                        parseXML(xmlDoc);
						
                    }
					
                };
				
              // pass in the file to the reader
            })(file);
			
            // read the file as a text with UTF-8 encoding
            reader.readAsText(file, 'UTF-8');
			
        } else {
		
            // display the error
            $('#fileResult').append('<p><i class="icon-warning-sign icon-white"></i> Failed to read XML.</p>');
			
        }
		
    }
	
    // function to parse the xml, ...
    function parseXML(xml) {
		
        // varibles to hold the nodes in xml
        var totalTopic = xml.getElementsByTagName("video").length,
            needMore = xml.getElementsByTagName("video").length - topicNum,
            imageType,
			groupTotal = xml.getElementsByTagName("group")[0].attributes.getNamedItem("total").value;
			
        // display the progress
        $('#fileResult').append('<p>Filling form ...</p>');
		
        // if the imgFormat node is not empty, ...
        if (!xml.getElementsByTagName("imgFormat")[0].childNodes.length == 0) {
			
            // get the image type
            imageType = xml.getElementsByTagName("imgFormat")[0].childNodes[0].nodeValue;
			
            // set the image type to the image type list
            $("#imageType").val(imageType);
        }
        
		// get total group
		if (groupTotal > 0) {
			$('#groups').val(groupTotal);
			showGroup(groupTotal);
			fillGroup(groupTotal,xml);
		}
		
		// loop through to add more topic first if needed
		addVideos(needMore,xml);
		
        // display the result
        $('#fileResult').append('<p>Finished! Your XML has been uploaded successfully.</p>');
			
        // remove the loader
        $('.loader').hide();
		
    }
	
	function fillGroup(i,x) {
		
		for (var j = 0; j < i; j++) {
			
			$('.groupRow input:eq('+j+')').val(x.getElementsByTagName("name")[j].childNodes[0].nodeValue);
			
		}
		
	}
	
	function addVideos(m,x) {
		
		for (var i = 1; i <= m; i++) {
			
            // increment the topicNum by 1
            topicNum++;
			
            // add the topic input fields
            $('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span7"><label for="fName' + topicNum + '">File Name:</label><input type="text" class="span7" name="fName' + topicNum + '" id="fName' + topicNum + '"/></div><div class="span2"><label for="group' + topicNum + '">Group Number:</label><select type="text" name="group' + topicNum + '" id="group' + topicNum + '" class="span2 groupSelect"></select></div><div class="span2"><label>External Source:</label><label class="radio inline"><input type="radio" name="src' + topicNum + '" id="src' + topicNum + '" value="yes" /> Yes </label><label class="radio inline"><input type="radio" name="src' + topicNum + '" value="no" checked /> No </label></div><div class="span7"><label for="topic' + topicNum + '">Video title:</label><input type="text" class="span7" name="topic' + topicNum + '" id="topic' + topicNum + '"/></div><div class="span4"><label for="vidAuth' + topicNum + '">Video author(s):</label><input type="text" class="span4" name="vidAuth' + topicNum + '" id="vidAuth' + topicNum + '"/></div><div class="span11 hide" id="embedTxt' + topicNum + '"><label for="srcEmbed' + topicNum + '">External Embed Code:</label><input type="text" class="span11" name="srcEmbed' + topicNum + '" id="srcEmbed' + topicNum + '"/></div><div class="span11"><label for="vDes' + topicNum + '">Video description:</label><textarea class="span11" name="vDes' + topicNum + '" id="vDes' + topicNum + '"></textarea></div></div></div></div>');
			
			bindExRes(topicNum);
			applyTinymce('#vDes'+topicNum);
			addGroupSelection(groupCounter);
			
        }
		
		fillVideo(x);
		
	}
	
	function fillVideo(x) {
		
		// loop through all the topics
        for (var i = 0; i < topicNum; i++) {
			
			var file = x.getElementsByTagName("video")[i].attributes.getNamedItem("fileName").value,
				group,
				src,
				author,
				title,
				description;
			
			// group
			if (x.getElementsByTagName("video")[i].attributes.getNamedItem("group").value == undefined || isEmpty(x.getElementsByTagName("video")[i].attributes.getNamedItem("group").value)) {
				
				group = "";
				
			} else {
				
				group = x.getElementsByTagName("video")[i].attributes.getNamedItem("group").value;
				
			}
			
			// external source
			if (x.getElementsByTagName("src")[i].childNodes.length == 0 || isEmpty(x.getElementsByTagName("src")[i].childNodes.nodeValue)) {
				
				$('input:radio[name=src' + (i + 1) +']:nth(1)').attr('checked',true);
				
			} else {
				
				$('input:radio[name=src' + (i + 1) +']:nth(0)').attr('checked',true);
				
				src = x.getElementsByTagName("src")[i].childNodes[0].nodeValue;
				
				if ($('#embedTxt' + (i + 1)).hasClass('hide')) {
					
                    $('#embedTxt' + (i + 1)).removeClass('hide');
					
                }
				
				
				$('#srcEmbed'+(i+1)).val(src);
				
			}
			
			// author
			if (x.getElementsByTagName("author")[i].childNodes.length == 0 || isEmpty(x.getElementsByTagName("author")[i].childNodes[0].nodeValue)) {
				
				author = "";
				
			} else {
				
				author = x.getElementsByTagName("author")[i].childNodes[0].nodeValue;
				
			}
			
			// title
			if (x.getElementsByTagName("title")[i].childNodes.length == 0 || isEmpty(x.getElementsByTagName("title")[i].childNodes[0].nodeValue)) {
				
				title = "";
				
			} else {
				
				title = x.getElementsByTagName("title")[i].childNodes[0].nodeValue;
				
			}
			
			// description
			if (x.getElementsByTagName("description")[i].childNodes.length == 0 || isEmpty(x.getElementsByTagName("description")[i].childNodes[0].nodeValue)) {
				
				description = "";

			} else {
				
				description = x.getElementsByTagName("description")[i].childNodes[0].nodeValue;
				
			}
			
			$('#fName'+(i+1)).val(file);
			$('#group'+(i+1)).val(group);
			$('#vidAuth'+(i+1)).val(author);
			$('#topic'+(i+1)).val(title);
			$('#vDes'+(i+1)).val(description);
			
		}
		
	}
	
    // function to add the Tiny MCE
    function applyTinymce(id) {
		
        $(id).tinymce({
            // Location of TinyMCE script
            script_url: 'scripts/tiny_mce/tiny_mce.js',
            // General options
            theme: "advanced",
            skin: "o2k7",
            skin_variant: "silver",
            plugins: "autolink,lists,pagebreak,table,advlink,iespell,inlinepopups,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
            // Theme options
            theme_advanced_buttons1: "bold,italic,underline,forecolor,|,justifyleft,justifycenter,justifyright,|,bullist,numlist,sub,sup,|,link,unlink,charmap,|,tablecontrols,|,visualaid,|,cut,copy,paste,removeformat,code,cleanup",
            theme_advanced_buttons2: "",
            theme_advanced_buttons3: "",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            //theme_advanced_statusbar_location : "bottom",
            theme_advanced_resizing: true,
            // Example content CSS (should be your site CSS)
            content_css: "css/tinymce.css",
            // Drop lists for link/image/media/template dialogs
            template_external_list_url: "lists/template_list.js",
            external_link_list_url: "lists/link_list.js",
        });
		
    }
	
});