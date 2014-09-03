$(document).ready(function () {
    var showMoreXML = false, // boolean to flag whether the more XML tab is open or closed
        topicNum = 5, // total number of topics to start out with
        lessonError = false, // boolean to flag whether there is error with the lesson input field
        instructorError = false, // boolean to flag whether there is error with the intructor input field
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
            });
        } else {
            $('#browse').addClass('disabled').removeClass('btn-primary').addClass('btn-danger').html('<i class="icon-warning-sign icon-white"></i> Your browser does not support local file upload.');
        }

        // Setup the file drop zone upload dnd listeners.
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);

        // apply tinymce to the profile textareas
        applyTinymce('#profile');

        // apply tinymce to the first 5 note textareas
        applyTinymce('#topicNote1');
        applyTinymce('#topicNote2');
        applyTinymce('#topicNote3');
        applyTinymce('#topicNote4');
        applyTinymce('#topicNote5');

        // hide the final xml textarea
        $('#xmlArea').hide();

        // hide the loading gif image for file upload
        $('.loader').hide();

        // bind the click event to close the
        // "Are You Sure" modal
        $('#closeModel').bind('click', function () {

            // enable the modal's opening and closing toggle
            $('#areUSure').modal('toggle');

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
                    $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span11" name="topic' + topicNum + '" id="topic' + topicNum + '" /><label for="topicNote' + topicNum + '">Note:</label><textarea type="text" class="span11 tinymce" name="topicNote' + topicNum + '" id="topicNote' + topicNum + '"></textarea><p><small><em>Leave it blank will default to "There are no notes for this slide."</em></small></p></div></div>');

                    // apply TinyMCE to the note textareas
                    applyTinymce('#topicNote' + topicNum);

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
            $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span11" name="topic' + topicNum + '" id="topic' + topicNum + '" /><label for="topicNote' + topicNum + '">Note:</label><textarea type="text" class="span11 tinymce" name="topicNote' + topicNum + '" id="topicNote' + topicNum + '"></textarea><p><small><em>Leave it blank will default to "There are no notes for this slide."</em></small></p></div></div>');

            // apply TinyMCE to the note textarea
            applyTinymce('#topicNote' + topicNum);

        });

        // bind click event to remove the last topic on the page
        $('#minusTopic').bind('click', function () {

            // hold the current last topic
            var lastTopic = $('.topic:nth-child(' + topicNum + ')');

            // if total number of topics is greater than 1, ...
            if (topicNum > 1) {

                lastTopic.remove(); // remove last topic
                topicNum--; // decrement total number of topic by 1
                $('#areUSure').modal('toggle'); // close the "Are You Sure" model

            } else { // else if total number of topics less than and equal to 1, ...

                // alert the users
                alert('Sorry, you are trying to remove the last topic left on the page. The XML must contains at least one topic.');

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

            // output the XML to the output textarea
            $('#xmlOutput').val('<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated on ' + displayDateTime + ' -->\n<course>\n' + getPlayerSetup() + getProfile() + getTopics() + '</course>');

            // bind the fancybox event to open and close
            $('a#getCode').fancybox({
                'hideOnContentClick': false,
                'scrolling': 'auto',
                'autoScale': true,
                'autoDimensions': true,
                'centerOnScroll': true
            });

            // if the lesson is blank, ...
            if (lessonError) {

                // display the error
                $('#xmlError').html('<p>Lesson name is required.</p>');

            }

            // if the lesson is blank, ...
            if (instructorError) {

                // display the error
                $('#xmlError').append('<p>Instructor\'s name is required.</p>');

            }

            // if the lesson is blank, ..
            if (topicError) {

                // display the error
                $('#xmlError').append('<p>One or more of your topic titles is not specified.</p>');

            }

        });

    } // closing initialize function

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

                //set the lessonError to false
                lessonError = false;
            }
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

                // set the instructorError to false
                instructorError = false;
            }
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
                value += '<topic title="REQUIRED">';

                // add the error class
                $('#topic' + i).addClass('error');

                // place the word "REQUIRED" to the topic input field
                $('#topic' + i).attr('placeholder', 'REQUIRED');

                // set the topicError to true
                topicError = true;

            } else { // if the current topic is NOT empty, ...

                // add the topic title and replace any ampersand to the value variable
                value += '<topic title="' + $('#topic' + i).val().replace('\&', '&amp;') + '">';

                // if the current topic has the error class, ...
                if ($('#topic' + i).hasClass('error')) {

                    // remove the class
                    $('#topic' + i).removeClass('error');

                    // set the topicError to false
                    topicError = false;

                }

            }

            // if the current note textarea is empty, ...
            if ($('#topicNote' + i).val() <= "" || $('#topicNote' + i).val().length <= 0 || isEmpty($('#topicNote' + i).val())) {

                // add "No notes available" to the value variable
                value += 'There are no notes for this slide.</topic>\n';

            } else { // if it is not empty, ...

                // add the note to the textarea
                value += '<![CDATA[' + $('#topicNote' + i).val() + ']]></topic>\n';

            }
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
            output = '<p style="color:#f00"><strong>' + escape(file.name) + '</strong> is not an XML file. It is a(n) ' + (file.type || 'unknown') + '. Please try again.</p>';

        } else { // if it is an xml, ...

            // show the loading indicator
            $('.loader').css('display', 'block');

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
                    if (xmlDoc.getElementsByTagName("course")[0] == undefined) {
						
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
            slideFolder,
            slideName,
            imageType,
            profile = xml.getElementsByTagName("profile")[0].childNodes[0].nodeValue;

        // display the progress
        $('#fileResult').append('<p>Filling form ...</p>');

        // set the value for the lesson input field
        $("#lesson").val(lesson);

        // set the value for the instructor
        $("#instructor").val(instructor);

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

        // if the imgType node is not empty, ...
        if (!xml.getElementsByTagName("imgType")[0].childNodes.length == 0) {

            // get the image type
            imageType = xml.getElementsByTagName("imgType")[0].childNodes[0].nodeValue;

            // set the image type to the image type list
            $("#imageType").val(imageType);

        }

        // set the profile to the profile textarea
        $("#profile").val(profile);

        // loop through to add more topic first if needed
        for (var i = 1; i <= needMore; i++) {

            // increment the topicNum by 1
            topicNum++;

            // add the topic input fields
            $('#topics').append('<div class="row topic"><hr /><div class="span1"><span class="number">' + topicNum + '</span></div><div class="span11"><label for="topic' + topicNum + '">Topic title:</label><input type="text" class="span11" name="topic' + topicNum + '" id="topic' + topicNum + '" /><label for="topicNote' + topicNum + '">Note:</label><textarea type="text" class="span11 tinymce" name="topicNote' + topicNum + '" id="topicNote' + topicNum + '"></textarea><p><small><em>Leave it blank will default to "No notes available."</em></small></p></div></div>');

            // apply the Tiny MCE
            applyTinymce('#topicNote' + topicNum);

        }

        // loop through all the topics
        for (var i = 0; i < totalTopic; i++) {

            // set the titles
            $('#topic' + (i + 1)).val(xml.getElementsByTagName("topic")[i].attributes.getNamedItem("title").value);

            // set the notes
            $('#topicNote' + (i + 1)).val(xml.getElementsByTagName("topic")[i].childNodes[0].nodeValue);

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
            theme_advanced_buttons1: "bold,italic,underline,forecolor,|,justifyleft,justifycenter,justifyright,|,bullist,numlist,sub,sup,|,link,unlink,charmap,|,tablecontrols,|,visualaid,",
            theme_advanced_buttons2: "cut,copy,paste,removeformat,code,cleanup,help",
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