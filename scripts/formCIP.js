$(document).ready(function () {
    var showMoreXML = false, // boolean to flag whether the more XML tab is open or closed
        topicNum = 5, // total number of topics to start out with
		slideNum = 1,
        lessonError = false, // boolean to flag whether there is error with the lesson input field
        instructorError = false, // boolean to flag whether there is error with the intructor input field
        xPositionError = false,
        yPositionError = false,
        colorError = false,
        durationError = false,
        slideError = false,
        topicError = false, // boolean to flag whether there is error with the topic input fields
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
            $('#browse').addClass('disabled').removeClass('btn-primary').addClass('btn-danger').html('<i class="icon-warning-sign icon-white"></i> Your browser does not support local file upload.');
        }

        // Setup the file drop zone upload dnd listeners.
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);

        // apply tinymce to the profile textareas
        applyTinymce('#profile');

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


        // bind click event to add more slides to topics
        $('#plusSlide1,#plusSlide2,#plusSlide3,#plusSlide4,#plusSlide5').bind('click', function (e) {

            addMoreSlide(e);

        });

        // bind click event to add more slides to topics
        $('#minusSlide1,#minusSlide2,#minusSlide3,#minusSlide4,#minusSlide5').bind('click', function (e) {

            removeSlide(e);

        });

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

                    // append topic input fields and note textareas to the existing topics on the page					
                    $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span5"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span5" name="topic' + topicNum + '" id="topic' + topicNum + '" /></div><div class="span4"><label>Topic type:</label><fieldset><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="main" checked /> Main topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="sub" /> Sub topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="subsub" /> Sub-sub topic </label></fieldset></div><div class="span2"><label>End topic?</label><fieldset><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="y" /> Yes </label><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="n" checked/> No </label></fieldset></div><div class="offset1 span10"><fieldset id="slides' + topicNum + '"><label>Slide titles:</label><input type="text" class="span10" /><input type="text" class="span10" /><input type="text" class="span10" /></fieldset><p class="centerText"><a id="plusSlide' + topicNum + '" class="btn btn-inverse btn-mini"><i class="icon-plus icon-white"></i></a> <a class="btn btn-danger btn-mini" id="minusSlide' + topicNum + '"><i class="icon-minus icon-white"></i></a></p></div></div></div></div>');

                    $('#plusSlide' + topicNum).bind('click', function (e) {
                        addMoreSlide(e);
                    });
                    $('#minusSlide' + topicNum).bind('click', function (e) {
                        removeSlide(e);
                    });

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
            $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span5"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span5" name="topic' + topicNum + '" id="topic' + topicNum + '" /></div><div class="span4"><label>Topic type:</label><fieldset><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="main" checked /> Main topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="sub" /> Sub topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="subsub" /> Sub-sub topic </label></fieldset></div><div class="span2"><label>End topic?</label><fieldset><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="y" /> Yes </label><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="n" checked/> No </label></fieldset></div><div class="offset1 span10"><fieldset id="slides' + topicNum + '"><label>Slide titles:</label><input type="text" class="span10" /><input type="text" class="span10" /><input type="text" class="span10" /></fieldset><p class="centerText"><a id="plusSlide' + topicNum + '" class="btn btn-inverse btn-mini"><i class="icon-plus icon-white"></i></a> <a class="btn btn-danger btn-mini" id="minusSlide' + topicNum + '"><i class="icon-minus icon-white"></i></a></p></div></div></div></div>');

            $('#plusSlide' + topicNum).bind('click', function (e) {
                addMoreSlide(e);
            });
            $('#minusSlide' + topicNum).bind('click', function (e) {
                removeSlide(e);
            });

        });

        // bind click event to remove the last topic on the page
        $('#minusTopic').bind('click', function () {

            // hold the current last topic
            var lastTopic = $('.topic:nth-child(' + topicNum + ')');

            // if total number of topics is greater than 1, ...
            if (topicNum > 1) {

                $('#plusSlide' + topicNum).unbind('click', function (e) {
                    addMoreSlide(e);
                });
                $('#minusSlide' + topicNum).unbind('click', function (e) {
                    removeSlide(e);
                });

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
            $('html, body').animate({

                scrollTop: 0 // all the way to the top

            }, 'slow'); // slowly

            $('#down').show(); // show the "All the Way Down" button

        });

        // bind the click event to scroll all the way down the page
        $('#down').bind('click', function (event) {

            // prevent the page from doing default event
            event.preventDefault();

            // animate the html and the body
            $('html, body').animate({

                scrollTop: $(this.hash).offset().top // all the way down

            }, 'slow'); // slowly

        });

        // bind the click event to get the xml code
        $('#getCode').bind('click', function () {

            // create the current date
            var createdOnDate = new Date();

            // hold the current date and time
            var displayDateTime = (createdOnDate.getMonth() + 1) + '/' + (createdOnDate.getDate()) + '/' + createdOnDate.getFullYear() + '|' + createdOnDate.getHours() + ':' + createdOnDate.getMinutes() + ':' + createdOnDate.getSeconds();
			
			slideNum = 1;
			
            // output the XML to the output textarea
            $('#xmlOutput').val('<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated on ' + displayDateTime + ' -->\n<topics>\n' + getPlayerSetup() + getProfile() + getTopics() + '</topics>');

            // bind the fancybox event to open and close
            $('a#getCode').fancybox({
                'hideOnContentClick': false,
                'scrolling': 'auto',
                'autoScale': true,
                'autoDimensions': true,
                'centerOnScroll': true
            });

            $('#xmlError').html('');
            $('#xmlError').append('<ul>');

            // if the lesson is blank, ...
            if (lessonError) {

                // display the error
                $('#xmlError ul').append('<li>Lesson name is required.</li>');

            }

            // if the lesson is blank, ...
            if (instructorError) {

                // display the error
                $('#xmlError ul').append('<li>Instructor\'s name is required.</li>');

            }

            if (durationError) {

                $('#xmlError ul').append('<li>Duration is required.</li>');

            }

            if (xPositionError) {

                $('#xmlError ul').append('<li>Poster image textarea\'s x position must an integer value.</li>');

            }

            if (yPositionError) {

                $('#xmlError ul').append('<li>Poster image textarea\'s y position must an integer value.</li>');

            }

            if (colorError) {

                $('#xmlError ul').append('<li>Poster image textarea\'s text color hex code is invalid.</li>');

            }

            // if the topic is blank, ..
            if (topicError) {

                // display the error
                $('#xmlError ul').append('<li>One or more of your topic titles is not specified.</li>');

            }

            // if the topic is blank, ..
            if (slideError) {

                // display the error
                $('#xmlError ul').append('<li>One or more of your slide titles is not specified.</li>');

            }

            $('#xmlError').append('</ul>');

        });

    } // closing initialize function

    function addMoreSlide(e) {

        var currentTopicSlideID = e.currentTarget.id;
        var currentNumber = currentTopicSlideID.substring(9, currentTopicSlideID.length);

        $('#slides' + currentNumber).append('<input type="text" class="span10" />');

    }

    function removeSlide(e) {

        var currentTopicSlideID = e.currentTarget.id;
        var currentNumber = currentTopicSlideID.substring(10, currentTopicSlideID.length);
        var totalSlide = $('#slides' + currentNumber + ' input').length;

        if (totalSlide > 1) {
            $('#slides' + currentNumber + ' input:last').remove();
        } else {
            $('#sorryNoCanDo').modal('toggle');
        }

    }

    // get the player setup data
    function getPlayerSetup() {

        // variable to hold the starting setup nodes
        var value = '<!-- PLAYER SETUP -->\n';

        // add the setup node
        value += '<setup>\n';

        /* THE LESSON INPUT FIELD */

        // if the lesson input field is empty, ...
        if (isEmpty($('#lesson').val())) {

            // display error message
            value += '<lesson>LESSON NAME IS NOT SPECIFIED</lesson>\n';

            // add the error class to the lesson input field
            $('#lesson').addClass('error');

            // set the word REQUIRED to the input field
            $('#lesson').attr('placeholder', 'REQUIRED');

            // set the lessonError to true
            lessonError = true;

        } else { // if lesson is NOT empty, ...

            // add the lesson to the value variable
            value += '<lesson>' + $('#lesson').val() + '</lesson>\n';

            // if the lesson input field have the error class, ...
            if ($('#lesson').hasClass('error')) {

                // remove the error class
                $('#lesson').removeClass('error');

            }

            //set the lessonError to false
            lessonError = false;
        }

        /* THE INSTRUCTOR INPUT FIELD */

        // if the instructor input field is empty, ...
        if (isEmpty($('#instructor').val())) {

            // display the error message
            value += '<instructor>INSTRUCTOR\'S NAME IS NOT SPECIFIED</instructor>\n';

            // add error class to the instructor input field
            $('#instructor').addClass('error');

            // set the word REQUIRED in the input field
            $('#instructor').attr('placeholder', 'REQUIRED');

            // set the instructorError to true
            instructorError = true;

        } else { // if instructor is NOT empty, ...

            // add the instructor to the value variable
            value += '<instructor>' + $('#instructor').val() + '</instructor>\n';

            // if the instructor field have the error class, ...
            if ($('#instructor').hasClass('error')) {

                // remove the error class
                $('#instructor').removeClass('error');

            }

            // set the instructorError to false
            instructorError = false;
        }

        /* THE DURATION INPUT FIELD */

        if (isEmpty($('#duration').val())) {

            // display error message
            value += '<length>DURATION IS NOT SPECIFIED</length>\n';

            // add the error class to the lesson input field
            $('#duration').addClass('error');

            // set the word REQUIRED to the input field
            $('#duration').attr('placeholder', 'REQUIRED');

            // set the durationError to true
            durationError = true;

        } else { // if duration is NOT empty, ...

            // add the duration to the value variable
            value += '<length>' + $('#duration').val() + '</length>\n';

            // if the duration input field have the error class, ...
            if ($('#duration').hasClass('error')) {

                // remove the error class
                $('#duration').removeClass('error');

            }

            //set the durationError to false
            durationError = false;

        }

        /* THE X POSITION */

        if (isNaN($('#xPos').val())) {

            if ($('#xPos').hasClass('error') == false) {

                $('#xPos').addClass('error'); // add error class

            }

            xPositionError = true;

        } else if ($('#xPos').val().length > 0) {

            if ($('#xPos').hasClass('error')) {

                $('#xPos').removeClass('error'); // add error class

            }

            value += '<xPos>' + $('#xPos').val() + '</xPos>\n';

            xPositionError = false;

        } else {

            if ($('#xPos').hasClass('error')) {

                $('#xPos').removeClass('error'); // add error class

            }

            value += '<xPos />\n';

            xPositionError = false;

        }

        /* THE Y POSITION */

        if (isNaN($('#yPos').val())) {

            if ($('#yPos').hasClass('error') == false) {

                $('#yPos').addClass('error'); // add error class

            }

            yPositionError = true;

        } else if ($('#yPos').val().length > 0) {

            if ($('#yPos').hasClass('error')) {

                $('#yPos').removeClass('error'); // add error class

            }

            value += '<yPos>0x' + $('#yPos').val() + '</yPos>\n';

            xPositionError = false;

        } else {

            if ($('#yPos').hasClass('error')) {

                $('#yPos').removeClass('error'); // add error class

            }

            value += '<yPos />\n';

            yPositionError = false;

        }

        /* THE COLOR INPUT FIELD */

        if ($('#color').val().length == 0) {

            if ($('#color').hasClass('error')) {

                $('#color').removeClass('error'); // add error class

            }

            value += '<tColor />\n';

            colorError = false;

        } else if ($('#color').val().length < 6 || $('#color').val().length > 6) {

            if ($('#color').hasClass('error') == false) {

                $('#color').addClass('error'); // add error class

            }

            value += '<tColor />\n';

            colorError = true;

        } else {

            if ($('#color').hasClass('error')) {

                $('#color').removeClass('error'); // add error class

            }

            value += '<tColor >' + $('#color').val() + '</tColor>\n';

            colorError = false;

        }

        /* THE SLIDE FOLDER NAME INPUT FIELD */

        // if the slide folder input field is empty, ...
        if ($('#slideFolder').val().length <= 0 || $('#slideFolder').val() === '' || isEmpty($('#slideFolder').val())) {

            // add the <slideFolder /> to the value variable
            value += '<slideFolder />\n';

        } else { // if it is NOT empty

            // add the slide folder name to the value variable
            value += '<slideFolder>' + $('#slideFolder').val() + '</slideFolder>\n';

        }

        /* THE SLIDE NAME INPUT FIELD */

        // if slide input field is empty, ...
        if ($('#slide').val().length <= 0 || $('#slide').val() === '' || isEmpty($('#slide').val())) {

            // add <slideName /> to the value variable
            value += '<slideName />\n';

        } else { // if it is NOT empty, ...

            // add the slide name to the value variable
            value += '<slideName>' + $('#slide').val() + '</slideName>\n';

        }

        /* THE AUDIO FOLDER NAME INPUT FIELD */

        // if the audio folder input field is empty, ...
        if ($('#audioFolder').val().length <= 0 || $('#audioFolder').val() === '' || isEmpty($('#audioFolder').val())) {

            // add the <audioFolder /> to the value variable
            value += '<audioFolder />\n';

        } else { // if it is NOT empty

            // add the audio folder name to the value variable
            value += '<audioFolder>' + $('#audioFolder').val() + '</audioFolder>\n';

        }

        /* THE AUDIO NAME INPUT FIELD */

        // if audio input field is empty, ...
        if ($('#audio').val().length <= 0 || $('#audio').val() === '' || isEmpty($('#audio').val())) {

            // add <audioName /> to the value variable
            value += '<audioName />\n';

        } else { // if it is NOT empty, ...

            // add the slide name to the value variable
            value += '<audioName>' + $('#audio').val() + '</audioName>\n';

        }

        /* THE IMAGE TYPE INPUT FIELD */

        // if the image type input field is equal to jpg, ...
        if ($('#imageType').val() === 'jpg') {

            // add the <imgType /> to the value variable
            value += '<imgType />\n';

        } else { // if it does not, ...

            // add the image type to the value variable
            value += '<imgType>' + $('#imageType').val() + '</imgType>\n';
        }

        // end the value variable with </setup>
        value += '</setup>\n';

        // return the value in the value variable
        return value;

    }

    // get the profile data
    function getProfile() {

        // hold the starting profile data in the value variable
        var value = '<!-- PROFILE DATA -->\n';

        // add the opeing profile node to the value
        value += '<profile>';

        // if the profile textarea is empty, ...
        if ($('#profile').val().length <= 0 || $('#profile').val() === "" || isEmpty($('#profile').val())) {

            // add the pending text to the value
            value += "Instructor's profile pending...";

        } else { // if it is NOT empty, ...

            // add the profile to the value variable
            value += '<![CDATA[' + $('#profile').val() + ']]>';

        }

        // add the closing profile node to the value
        value += '</profile>\n';

        // return the value back to the function
        return value;

    }

    // get the topic data
    function getTopics() {

        // hold the topics in the variable
        var value = '<!-- TOPICS -->\n';

        // loop through the topics to get the title and the notes
        for (var i = 1; i <= topicNum; i++) {

            // if the current topic is empty, ...
            if ($('#topic' + i).val() <= "" || $('#topic' + i).val().length <= 0 || isEmpty($('#topic' + i).val())) {

                // add the "REQUIRED" to the title
                value += '<topic title="REQUIRED" type="' + $('#topicType' + i + ':checked').val() + '" end="' + $('#endTopic' + i + ':checked').val() + '">';

                // add the error class
                $('#topic' + i).addClass('error');

                // place the word "REQUIRED" to the topic input field
                $('#topic' + i).attr('placeholder', 'REQUIRED');

                // set the topicError to true
                topicError = true;

            } else { // if the current topic is NOT empty, ...

                // add the topic title and replace any ampersand to the value variable
				value += '<topic title="' + $('#topic' + i).val().replace('\&', '&amp;') + '" type="' + $('#topicType' + i + ':checked').val() + '" end="' + $('#endTopic' + i + ':checked').val() + '">';

                // if the current topic has the error class, ...
                if ($('#topic' + i).hasClass('error')) {

                    // remove the class
                    $('#topic' + i).removeClass('error');

                    // set the topicError to false
                    topicError = false;

                }

            }

            // loop thru current topic slides				
            for (var k = 0; k < $('#slides' + i + ' input').length; k++) {

                if ($('#slides' + i + ' input:eq(' + k + ')').val() <= "" || $('#slides' + i + ' input:eq(' + k + ')').val().length <= 0 || isEmpty($('#slides' + i + ' input:eq(' + k + ')').val())) {

                    // add the "REQUIRED" to the title
                    value += '\n<slide number="'+ ((slideNum < 10)? '0' + slideNum : slideNum) +'">REQUIRED</slide>';

                    // add the error class
                    $('#slides' + i + ' input:eq(' + k + ')').addClass('error');

                    // place the word "REQUIRED" to the slide input field
                    $('#slides' + i + ' input:eq(' + k + ')').attr('placeholder', 'REQUIRED');

                    // set the slideError to true
                    slideError = true;

                } else {
                    // add the topic title and replace any ampersand to the value variable
                    value += '\n<slide number="'+ ((slideNum < 10)? '0' + slideNum : slideNum) +'">' + $('#slides' + i + ' input:eq(' + k + ')').val().replace('\&', '&amp;') + '</slide>';

                    // if the current topic has the error class, ...
                    if ($('#slides' + i + ' input:eq(' + k + ')').hasClass('error')) {

                        // remove the class
                        $('#slides' + i + ' input:eq(' + k + ')').removeClass('error');

                        // set the topicError to false
                        slideError = false;

                    }
                }

				slideNum++;

            }
			
            value += '\n</topic>\n';

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

            // show the loading indicator
            $('.loader').show();

            // set the result to the output variable
            output = '<p><strong>' + escape(file.name) + '</strong> - ' + file.size + ' bytes' + '</p>';
            output += '<p>Uploading ...</p>';

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
                    if (xmlDoc.getElementsByTagName("topics")[0] == undefined) {
						
						// display the error
                        $('#fileResult').append('<p class="error"><i class="icon-warning-sign icon"></i> The uploaded XML file is not the correct file for this player. Please double check your XML file and try again.</p>');

                    } else { // if it is defined, ...

                        // parse the xml
                        parseXML(xmlDoc);

                    }

                };
                // pass in the file to the reader
            })(file);

            // read the file as a text with UTF-8 encoding
            reader.readAsText(file, 'UTF-8');

        } else { // if the file does not exist, ...

            // display the error
            $('#fileResult').append('<p><i class="icon-warning-sign icon-white"></i> Failed to read XML.</p>');

        }

    }

    // function to parse the xml, ...
    function parseXML(xml) {

        // varibles to hold the nodes in xml
        var totalTopic = xml.getElementsByTagName("topic").length,
            needMore = xml.getElementsByTagName("topic").length - topicNum,
            lesson = xml.getElementsByTagName("lesson")[0].childNodes[0].nodeValue,
            instructor = xml.getElementsByTagName("instructor")[0].childNodes[0].nodeValue,
			xPos,
			ypos,
			tColor,
			duration = xml.getElementsByTagName("length")[0].childNodes[0].nodeValue,
            slideFolder,
            slideName,
			audioFolder,
			audioName,
            imageType,
            profile = xml.getElementsByTagName("profile")[0].childNodes[0].nodeValue;

        // display the progress
        $('#fileResult').append('<p>Filling form ...</p>');

        // set the value for the lesson input field
        $("#lesson").val(lesson);

        // set the value for the instructor
        $("#instructor").val(instructor);
		
		// set the value for the duration
        $("#duration").val(duration);

        // if the slideFolder node is NOT empty, ...
        if (!xml.getElementsByTagName("slideFolder")[0].childNodes.length == 0) {

            // get the slide folder name
            slideFolder = xml.getElementsByTagName("slideFolder")[0].childNodes[0].nodeValue;

            // set the slide folder name to the slide folder input file
            $("#slideFolder").val(slideFolder);

        }

        // if the slideName node is NOT empty, ...
        if (!xml.getElementsByTagName("slideName")[0].childNodes.length == 0) {

            // get the slide name
            slideName = xml.getElementsByTagName("slideName")[0].childNodes[0].nodeValue;

            // set the slide name to slide name input file
            $("#slide").val(slideName);

        }
		
		// if the audioFolder node is NOT empty, ...
        if (!xml.getElementsByTagName("audioFolder")[0].childNodes.length == 0) {

            // get the audio folder name
            audioFolder = xml.getElementsByTagName("audioFolder")[0].childNodes[0].nodeValue;

            // set the audio folder name to the audio folder input file
            $("#audioFolder").val(audioFolder);

        }
		
		// if the audioName node is NOT empty, ...
        if (!xml.getElementsByTagName("audioName")[0].childNodes.length == 0) {

            // get the slide name
            audioName = xml.getElementsByTagName("audioName")[0].childNodes[0].nodeValue;

            // set the slide name to slide name input file
            $("#audio").val(audioName);

        }
		
        // if the imgType node is not empty, ...
        if (!xml.getElementsByTagName("imgType")[0].childNodes.length == 0) {

            // get the image type
            imageType = xml.getElementsByTagName("imgType")[0].childNodes[0].nodeValue;

            // set the image type to the image type list
            $("#imageType").val(imageType);

        }
		
		// if the xPos node is not empty, ...
        if (!xml.getElementsByTagName("xPos")[0].childNodes.length == 0) {

            // get the xPos
            xPos = xml.getElementsByTagName("xPos")[0].childNodes[0].nodeValue;

            // set the xPos to the input field
            $("#xPos").val(xPos);

        }
		
		// if the yPos node is not empty, ...
        if (!xml.getElementsByTagName("yPos")[0].childNodes.length == 0) {

            // get the yPos
            yPos = xml.getElementsByTagName("yPos")[0].childNodes[0].nodeValue;

            // set the yPos to the input field
            $("#yPos").val(yPos);

        }
		
		// if the tColor node is not empty, ...
        if (!xml.getElementsByTagName("tColor")[0].childNodes.length == 0) {

            // get the tColor
            tColor = xml.getElementsByTagName("tColor")[0].childNodes[0].nodeValue;

            // set the tColor to the input field
            $("#color").val(tColor);

        }

        // set the profile to the profile textarea
        $("#profile").val(profile);

        // loop through to add more topic first if needed
        for (var i = 1; i <= needMore; i++) {

            // increment the topicNum by 1
            topicNum++;

            // add the topic input fields
            $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><div class="row"><div class="span5"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span5" name="topic' + topicNum + '" id="topic' + topicNum + '" /></div><div class="span4"><label>Topic type:</label><fieldset><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="main" checked /> Main topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="sub" /> Sub topic </label><label class="radio inline"><input type="radio" name="topicType' + topicNum + '" id="topicType' + topicNum + '" value="subsub" /> Sub-sub topic </label></fieldset></div><div class="span2"><label>End topic?</label><fieldset><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="y" /> Yes </label><label class="radio inline"><input type="radio" name="endTopic' + topicNum + '" id="endTopic' + topicNum + '" value="n" checked/> No </label></fieldset></div><div class="offset1 span10"><fieldset id="slides' + topicNum + '"><label>Slide titles:</label><input type="text" class="span10" /><input type="text" class="span10" /><input type="text" class="span10" /></fieldset><p class="centerText"><a id="plusSlide' + topicNum + '" class="btn btn-inverse btn-mini"><i class="icon-plus icon-white"></i></a> <a class="btn btn-danger btn-mini" id="minusSlide' + topicNum + '"><i class="icon-minus icon-white"></i></a></p></div></div></div></div>');

            $('#plusSlide' + topicNum).bind('click', function (e) {
                addMoreSlide(e);
            });
            $('#minusSlide' + topicNum).bind('click', function (e) {
                removeSlide(e);
            });

        }

        // loop through all the topics
        for (var i = 0; i < totalTopic; i++) {
			
			var topicType = xml.getElementsByTagName("topic")[i].attributes.getNamedItem("type").value;
			var topicEnd = xml.getElementsByTagName("topic")[i].attributes.getNamedItem("end").value;
			var totalSlide = xml.getElementsByTagName("topic")[i].getElementsByTagName("slide").length;
			
            // set the titles
            $('#topic' + (i + 1)).val(xml.getElementsByTagName("topic")[i].attributes.getNamedItem("title").value);
			
			// set the type
			if (topicType == 'sub' || topicType == 's') {
				
				$('input:radio[name=topicType' + (i + 1) +']:nth(1)').attr('checked',true);
				
			} else if (topicType == 'subsub' || topicType == 'ss') {
				
				$('input:radio[name=topicType' + (i + 1) +']:nth(2)').attr('checked',true);
				
			} else {
				
				$('input:radio[name=topicType' + (i + 1) +']:nth(0)').attr('checked',true);
				
			}
			
			// set the end topic flag
			if (topicEnd == 'yes' || topicEnd == 'y') {
				
				$('input:radio[name=endTopic' + (i + 1) +']:nth(0)').attr('checked',true);
				
			} else {
				
				$('input:radio[name=endTopic' + (i + 1) +']:nth(1)').attr('checked',true);
				
			}
			
            // set the slides
			$('#slides' + (i + 1)).html('');
			for (var t = 0; t < totalSlide; t++) {
				var slideValue = xml.getElementsByTagName("topic")[i].getElementsByTagName("slide")[t].childNodes[0].nodeValue;
				$('#slides' + (i+1)).append('<input type="text" class="span10" value="'+ slideValue +'"/>');
			}
            

        }

        // display the result
        $('#fileResult').append('<p>Finished! Your XML has been uploaded successfully.</p>');

        // remove the loader
        $('.loader').css('display', 'none');

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