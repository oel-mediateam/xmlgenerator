// formPG.js
// by Ethan S. Lin
// 12/14/2012 @ 12:52 PM

$(document).ready(function () {
	
    var showMoreXML = false, // boolean to flag whether the more XML tab is open or closed
        topicNum = 5, // total number of topics to start out with
		gTitleError = false,
		fileError = false,
		topicError = false,
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
		
        // bind on change event for duration text input
        $('#duration').bind('change', function () {
				
			
            $(this).val().replace('/(\s)/', '');
				
            if (isNaN($(this).val())) {
					
                    $(this).val('').attr('placeholder', 'enter a number').addClass('error');
				
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
                }
								
            }
			
        });
		
        // apply tinymce to the description textareas
		applyTinymce('#galleryDesc');		
        applyTinymce('#vDes1');
        applyTinymce('#vDes2');
        applyTinymce('#vDes3');
		applyTinymce('#vDes4');
		applyTinymce('#vDes5');
		
    } // closing initialize function
	
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
            		$('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">'+topicNum+'</span></div><div class="span11"><div class="row"><div class="span5"><label for="fName'+topicNum+'">File Name:</label><input type="text" class="span5" name="fName'+topicNum+'" id="fName'+topicNum+'"/></div><div class="span6"><label for="topic'+topicNum+'">Image title:</label><input type="text" class="span6" name="topic'+topicNum+'" id="topic'+topicNum+'"/></div><div class="span11"><label for="vDes'+topicNum+'">Images description:</label><textarea class="span11" name="vDes'+topicNum+'" id="vDes'+topicNum+'"></textarea></div></div></div></div>');
			
		    		applyTinymce('#vDes'+topicNum);
						
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
            $('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">'+topicNum+'</span></div><div class="span11"><div class="row"><div class="span5"><label for="fName'+topicNum+'">File Name:</label><input type="text" class="span5" name="fName'+topicNum+'" id="fName'+topicNum+'"/></div><div class="span6"><label for="topic'+topicNum+'">Image title:</label><input type="text" class="span6" name="topic'+topicNum+'" id="topic'+topicNum+'"/></div><div class="span11"><label for="vDes'+topicNum+'">Images description:</label><textarea class="span11" name="vDes'+topicNum+'" id="vDes'+topicNum+'"></textarea></div></div></div></div>');
			
		    applyTinymce('#vDes'+topicNum);
			
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
            $('#xmlOutput').val('<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated on ' + displayDateTime + ' -->\n<gallery>\n' + getPlayerSetup() + getTopics() + '</gallery>');
				
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
			
			if (gTitleError) {
				
				$('#xmlError ul').append('<li>Gallery title is required.</li>');
				
			}
						
			if (fileError) {
				
				$('#xmlError ul').append('<li>One or more of the image file name is not specified.</li>');
				
			}
			
			if (topicError) {
				
				$('#xmlError ul').append('<li>One or more of the image title is not specified.</li>');
				
			}
						
            $('#xmlError').append('</ul>');
			
        });
	
    // get the player setup data
    function getPlayerSetup() {
		
        // variable to hold the starting setup nodes
        var value = '<!-- PHOTO GALLERY SETUP -->\n';
		
        // add the setup node
        value += '<setup>\n';
		
		/* THE GALLERY TITLE INPUT FIELD */
		if ($('#galleryTitle').val() == 0 || isEmpty($('#galleryTitle').val())) {
			
			value += '<title />\n';
			// add the error class
			$('#galleryTitle').addClass('error');
				
			// place the word "REQUIRED" to the fileName input field
			$('#galleryTitle').attr('placeholder', 'REQUIRED');
			
			gTitleError = true;
			
		} else {
			
			value += '<title>'+$('#galleryTitle').val()+'</title>\n';
			
			if ($('#galleryTitle').hasClass('error')) {
                    
				// remove the class
				$('#galleryTitle').removeClass('error');
				
				// set the fileError to false
				gTitleError = false;
			}
						
		}
		
		/* THE GALLERY DESCRIPTION INPUT FIELD */
		if ($('#galleryDesc').val() == 0 || isEmpty($('#galleryDesc').val())) {
			
			value += '<description /> <!-- no description -->\n';
			
		} else {
			
			value += '<description><![CDATA['+$('#galleryDesc').val()+']]></description>\n';
						
		}
		
		/* THE IMAGE TYPE INPUT FIELD */
		
        // if the image type input field is equal to png, ...
        if ($('#imageType').val() === 'png') {
				
            // add the <imgType /> to the value variable
            value += '<imgFormat /> <!-- default image type applied -->\n';
			
        } else {
		
            // add the image type to the value variable
            value += '<imgFormat>' + $('#imageType').val() + '</imgFormat>\n';
        }
		
		/* THE DURATION INPUT FIELD */
		if ($('#duration').val() == 0 || isEmpty($('#duration').val())) {
			
			value += '<slideDuration /> <!-- default slide duration applied -->\n';
			
		} else {
			
			value += '<slideDuration>'+$('#duration').val()+'</slideDuration>\n';
						
		}
		
        // end the value variable with </setup>
        value += '</setup>\n';
		
        // return the value in the value variable
        return value;
		
    }
	
    // get the topic data
    function getTopics() {
		
        // hold the topics in the variable
        var value = '<!-- IMAGES -->\n';
		var fileName, title, description;
		
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
			
			value += '<image fileName="'+fileName+'">\n';
			
			// if the current image title is empty, ...
            if (isEmpty($('#topic' + i).val())) {
					
                // add the "REQUIRED" to the image title
                title = 'REQUIRED';
					
                // add the error class
                $('#topic' + i).addClass('error');
					
                // place the word "REQUIRED" to the image title input field
                $('#topic' + i).attr('placeholder', 'REQUIRED');
					
                // set the topicError to true
                topicError = true;
				
            } else { // if the current image title is NOT empty, ...
			
                // add the image title and replace any ampersand to the value variable
                title = $('#topic' + i).val().replace('\&', '&amp;');
					
                // if the current image title has the error class, ...
                if ($('#topic' + i).hasClass('error')) {
                    
					// remove the class
                    $('#topic' + i).removeClass('error');
					
                    // set the topicError to false
                    topicError = false;
                }
				
            }
			
			description = $('#vDes'+i).val();
			
			if (description == '' || description == undefined) {
				description = '';
			} else {
				description = '<![CDATA['+description+']]>';
			}
			
			value += '<title>'+title+'</title>\n';
			value += '<description>'+description+'</description>\n';
			value += '</image>\n';
            
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
                    if (xmlDoc.getElementsByTagName("gallery")[0] == undefined) {
						
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
        var totalTopic = xml.getElementsByTagName("image").length,
            needMore = xml.getElementsByTagName("image").length - topicNum,
            imageType,
			slideDur,
			title,
			desc;
			
        // display the progress
        $('#fileResult').append('<p>Filling form ...</p>');
		
        // if the imgType node is not empty, ...
        if (!xml.getElementsByTagName("imgFormat")[0].childNodes.length == 0) {
			
            // get the image type
            imageType = xml.getElementsByTagName("imgFormat")[0].childNodes[0].nodeValue;
			
            // set the image type to the image type list
            $("#imageType").val(imageType);
        }
		
		// if the slideDuration node is not empty, ...
        if (!xml.getElementsByTagName("slideDuration")[0].childNodes.length == 0) {
			
            // get the duration
            slideDur = xml.getElementsByTagName("slideDuration")[0].childNodes[0].nodeValue;
			
            // set the duration
            $("#duration").val(slideDur);
        }
			
		// set the duration
		$("#galleryTitle").val(xml.getElementsByTagName("galleryTitle")[0].childNodes[0].nodeValue);
		// set the duration
		$("#galleryDesc").val(xml.getElementsByTagName("galleryDescription")[0].childNodes[0].nodeValue);
		
		// loop through to add more topic first if needed
		addImages(needMore,xml);
		
        // display the result
        $('#fileResult').append('<p>Finished! Your XML has been uploaded successfully.</p>');
			
        // remove the loader
        $('.loader').hide();
		
    }
	
	function addImages(m,x) {
		
		for (var i = 1; i <= m; i++) {
			
            // increment the topicNum by 1
            topicNum++;
			
            // add the topic input fields
            $('#topics').append('<div class="row topic"><hr /><div class="span1"> <span class="number">'+topicNum+'</span></div><div class="span11"><div class="row"><div class="span5"><label for="fName'+topicNum+'">File Name:</label><input type="text" class="span5" name="fName'+topicNum+'" id="fName'+topicNum+'"/></div><div class="span6"><label for="topic'+topicNum+'">Image title:</label><input type="text" class="span6" name="topic'+topicNum+'" id="topic'+topicNum+'"/></div><div class="span11"><label for="vDes'+topicNum+'">Images description:</label><textarea class="span11" name="vDes'+topicNum+'" id="vDes'+topicNum+'"></textarea></div></div></div></div>');
			
			applyTinymce('#vDes'+topicNum);
			
        }
		
		fillImages(x);
		
	}
	
	function fillImages(x) {
		
		// loop through all the topics
        for (var i = 0; i < topicNum; i++) {
			
			var file = x.getElementsByTagName("image")[i].attributes.getNamedItem("fileName").value,
				title = x.getElementsByTagName("title")[i].childNodes[0].nodeValue,
				description;
			
			// description
			if (x.getElementsByTagName("description")[i].childNodes.length == 0 || isEmpty(x.getElementsByTagName("description")[i].childNodes[0].nodeValue)) {
				
				description = "";

			} else {
				
				description = x.getElementsByTagName("description")[i].childNodes[0].nodeValue;
				
			}
			
			$('#fName'+(i+1)).val(file);
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
            theme_advanced_toolbar_align: "center",
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