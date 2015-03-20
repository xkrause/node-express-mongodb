// Userlist data array for filling in info box
var contactData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    
    //first name link click
    $('#contact table tbody').on('click', 'td a.linkshowcontact', showcontactInfo);
    
    //Add contact button click
    $('#btnAddcontact').on('click', addcontact);
    
    //Delete contact link click
    $('#contact table tbody').on('click', 'td a.linkdeletecontact', deletecontact);
    
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/contact', function( data ) {
        contactData = data;
        
        //stick the contact data array into a contactlist variable in the global object
        contactlistData = data;
        
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcontact" rel="' + this.First + '">' + this.First + '</a></td>';
            tableContent += '<td>' + this.Last + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecontact" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#contact table tbody').html(tableContent);
    });
};

// Show contact Info
function showcontactInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve first name from link rel attribute
    var thisFirstName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = contactData.map(function(arrayItem) { return arrayItem.First; }).indexOf(thisFirstName);

    //get the contact object
    var thiscontactObject = contactData[arrayPosition];
    
    //populate the info box
    $('#contactInfoFirst').text(thiscontactObject.First);
    $('#contactInfoLast').text(thiscontactObject.Last);
    $('#contactInfoTitle').text(thiscontactObject.Title);
    $('#contactInfoCompany').text(thiscontactObject.Company);
    $('#contactInfoEmail').text(thiscontactObject.Email);
    $('#contactInfoMet').text(thiscontactObject.Met);
    $('#contactInfoDate').text(thiscontactObject.Date);
    $('#contactInfoComments').text(thiscontactObject.Comments);
};

// Add contact
function addcontact(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addcontact input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newcontact = {
            'First': $('#addcontact fieldset input#inputcontactFirst').val(),
            'Last': $('#addcontact fieldset input#inputcontactLast').val(),
            'Title': $('#addcontact fieldset input#inputcontactTitle').val(),
            'Company': $('#addcontact fieldset input#inputcontactCompany').val(),
            'Met': $('#addcontact fieldset input#inputcontactMet').val(),
            'Date': $('#addcontact fieldset input#inputcontactDate').val(),
            'Comments': $('#addcontact fieldset input#inputcontactComments').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newcontact,
            url: '/users/addcontact',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addcontact fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete contact
function deletecontact(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this contact?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletecontact/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
if (inputcontactFirst == "") {
    alert("First name is required");
}