var tableTitle = document.getElementById("tableTitle");

var dataTable;

// tinymce.init({
//     selector: 'textarea',
//     plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
//     toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
// });

var idioma =
{
    "sProcessing": "Processing...",
    "sLengthMenu": "Length _MENU_ rows",
    "sZeroRecords": "No record found",
    "sEmptyTable": "Empty records",
    "sInfo": "Show row from _START_ to _END_ Total _TOTAL_ Rows",
    "sInfoEmpty": "No rows to display 0 ",
    "sInfoFiltered": "(Filter total _MAX_ rows)",
    "sInfoPostFix": "",
    "sSearch": "Search:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Loading...",
    "oPaginate": {
        "sFirst": "First",
        "sLast": "Last",
        "sNext": "Next",
        "sPrevious": "Previous"
    },
    "oAria": {
        "sSortAscending": ": Sort Ascending",
        "sSortDescending": ": Sort Descending"
    },
    "buttons": {
        "copyTitle": 'Copy Title',
        "copyKeys": 'Use your keyboard or menu to select the copy command',
        "copySuccess": {
            "_": '%d files has been copied',
            "1": '1 file has been copied'
        },

        "pageLength": {
            "_": "Show %d rows",
            "-1": "Display All Rows"
        }
    }
};

function convertDateTimeToTimeStamp(dateTime){
    let newDateTime = new Date(dateTime);
    return newDateTime.getTime() / 1000;  
}

 
function checkIfPropertyExistsThenGetValue(arrayObj, propertyName, callback) {
    arrayObj.forEach(function(obj) {
        if (obj.hasOwnProperty(propertyName)) {
            callback(obj[propertyName]);
            return;
        }
    });
 
    callback(null);
}
function validateInput(field, value, minimumLength, maximumLength) {
 
    if (!value) {
        return `${field} is required.`;
    }

    if (value.length < minimumLength || value.length > maximumLength) {
        return `${field} value cannot exceed ${maximumLength} characters and should not be less than ${minimumLength} characters.`;
    }
    
    return null;
}

function validateSelect(field, value) {
    if (!value) {
        return `${field} is required.`;
    }
    return null;
}

function validateValueIfNullOrUndefined(value) {
    if (value === null || value === undefined) {
        return false;  
    } else {
        return true;  
    }
}
 
function pushNotify(changesTitle, changesText, changesStatus) {
    new Notify({
        status:  changesStatus,
        title: changesTitle,
        text: changesText,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 'outline',
        position: 'right top'
    })
}
function generateTrackingCode(length = 12) {
    const alphabetChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericChars = "0123456789";
    let trackingCode = "";

    for (let i = 0; i < length; i++) {
        if (i < 6) {
            trackingCode += alphabetChars.charAt(Math.floor(Math.random() * alphabetChars.length));
        } else {
            trackingCode += numericChars.charAt(Math.floor(Math.random() * numericChars.length));
        }
    }

    return trackingCode.toUpperCase();
}
  
function converDate(strDate) {
    var date = new Date(strDate);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return { month, day, year }

}

function convertDateToLabel(strDate) {
    let date = converDate(strDate)

    return date.month + "-" + date.day + "-" + date.year;
}

function converDateToInputBox(strDate) {

    let date = converDate(strDate)

    return date.year + "-" + date.month + "-" + date.day;
}

// Delete 

function OnClickDelete(url, entity, returlUrl = "") {

    Swal.fire({
        title: `Are you sure you want to delete this ${entity}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
             
                $.ajax({
                    url: url,
                    type: 'DELETE',
                    success: function (data) {
                        console.log(data)
                        if (data.success) {
                             
                            console.log("RETURNURL", returlUrl)
                            
                            if(returlUrl !== ""){
                                window.location.href = returlUrl;
                            }
                            
                            if(dataTable != null){
                                dataTable.ajax.reload();
                            }
                             
                            toastr.success(data.message);
                            Swal.fire(
                                'Deleted!',
                                `The ${entity} has been deleted.`,
                                'success'
                            )
                        } else {
                            
                            toastr.error(data.message)
                           
                        }
                    },
                    error: function (err) {
                        console.log('ERROR:', err)
                    }


                }
                )

            } catch (e) {
               

                Swal.fire(
                    'Ooops!',
                    'Something went wrong',
                    'failed'
                )
            }

        }
    })
}

function loadDocumentFromDatabase(urlFromClient){
    $(document).ready(function() {
        $.ajax({
            url: urlFromClient,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response && response.data && response.data.title) {
                    // Populate the input box within the modal with the title
                    console.log(response.data)
                    $('#updateTitle').val(response.data.title);
                    $('#updateContent').val(response.data.content);
                    $('#updateRemarks').val(response.data.remarks);
                    $('#updateDepartmentId').val(response.data.departmentId);
                    $('#updateRequestTypeId').val(response.data.requestTypeId);
                    $('#updateTrackingCode').text(response.data.trackingCode);
                    $('#updateId').val(response.data.id);
                    $('#modalUpdateDocument').modal('show');
                } else {
                    console.error('Title not found in the response.');
                }
            },
            error: function(xhr, status, error) {

                console.error(xhr.responseText);
            }
        });
    });
}
 
function OnClickLoadStudentProfile(url, entity) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            
            $('.errorField').each(function(index){
                $(this).text('');
              
            });

            getMunicipalities(data.provinceId, data.municipalityId);
            getBarangays(data.municipalityId, data.barangayId);
            getEntryYears(data.entryYear);
            loadStatus(data.status.id);
            loadGender(data.genderId)
 
            $('#profileId').val(data.id);
            $('#txtProfileId').val(data.id);

            $('#profileFirstName').text(data.firstName);
            $('#txtProfileFirstName').val(data.firstName);

            $('#profileMiddleName').text(data.middleName);
            $('#txtProfileMiddleName').val(data.middleName);

            $('#profileLastName').text(data.lastName);
            $('#txtProfileLastName').val(data.lastName);

            $('#profileEmail').text(data.email);
            $('#txtProfileEmail').val(data.email);

            $('#profileMobile').text(data.mobile);
            $('#txtProfileMobile').val(data.mobile);

            $('#profileBirthDate').text(convertDateToLabel(data.birthdate));
            $('#txtProfileBirthDate').val(converDateToInputBox(data.birthdate));

            $('#profileBarangay').text(data.barangay.name);
            $('#dListBarangay').val(data.barangayId);

            $('#profileMunicipality').text(data.municipality.name);
            $('#dListMunicipality').val(data.municipalityId);

            $('#profileProvince').text(data.province.name);
            $('#dListProvince').val(data.provinceId);

            $('#profileStatusId').text(data.status.name);
            $('#dListStatus').val(data.status.id);
           
            $('#profileStudentId').text(data.studentId);
            $('#txtStudentId').val(data.studentId);

            $('#profileGenderId').text(data.gender.sex);
            $('#dListGender').val(data.genderId);

            $('#profileLRN').text(data.lrn);
            $('#txtLRN').val(data.lrn);

            $('#profileEntryYearId').text(data.entryYear);

            $('.delIconDismissedDate').eq(0).css('display', 'none');
            $('.delIconDroppedOutDate').eq(0).css('display', 'none');
            $('.delIconTransferredDate').eq(0).css('display', 'none');
            $('.delIconGraduatedDate').eq(0).css('display', 'none');
        

            if(data.entryDate != null){
                $('#profileEntryDate').text(convertDateToLabel(data.entryDate));
            }

            if(data.entryDate !== null ){
                $('#txtEntryDate').val(converDateToInputBox(data.entryDate));
            }else{
                $('#txtEntryDate').val("");
            }
          
         
            if(data.droppedOutDate != null){
                $('#profileDroppedOutDate').text(convertDateToLabel(data.droppedOutDate));
                $('.delIconDroppedOutDate').eq(0).css('display', 'inline-block');
            } else{
                $('#profileDroppedOutDate').text("");
            }

            if(data.transferredDate != null){
                $('#profileTransferredDate').text(convertDateToLabel(data.transferredDate));
                $('.delIconTransferredDate').eq(0).css('display', 'block');
            }else{
                $('#profileTransferredDate').text("");
            }

            if(data.dismissedDate != null){
                $('#profileDismissedDate').text(convertDateToLabel(data.dismissedDate));
                $('.delIconDismissedDate').eq(0).css('display', 'block');
            }else{
                $('#profileDismissedDate').text("");
            }

            if(data.graduatedDate != null){
                $('#profileGraduatedDate').text(convertDateToLabel(data.graduatedDate));
                $('.delIconGraduatedDate').eq(0).css('display', 'block');
            }else{
                $('#profileGraduatedDate').text("");
            }
              
            let status = data.status.name;
            
            switch (status) {
                case "Enrolled":
                   if(data.entryDate != null){
                       $('#txtStatusDate').val(converDateToInputBox(data.entryDate));
                   }else{
                       $('#txtStatusDate').val("");
                   }
                    break;
                case "Dropped Out":
                    if(data.droppedOutDate != null) {
                        $('#txtStatusDate').val(converDateToInputBox(data.droppedOutDate));
                    }else{
                        $('#txtStatusDate').val("");
                    }
                    break;
                case "Transferred":
                    console.log('transferredDateee', data.transferredDate)
                    if(data.transferredDate !== null) {
                        $('#txtStatusDate').val(converDateToInputBox(data.transferredDate));
                    }else{
                        $('#txtStatusDate').val("");
                    }
                    break;
                case "Dismissed":
                    if(data.dismissedDate != null) {
                        $('#txtStatusDate').val(converDateToInputBox(data.dismissedDate));
                    }else{
                        $('#txtStatusDate').val("");
                    }
                    break;
                case "Graduated":
                    if(data.graduatedDate != null) {
                        $('#txtStatusDate').val(converDateToInputBox(data.graduatedDate));
                    }else{
                        $('#txtStatusDate').val("");
                    }
                    break;
            }
 
        },
        error: function (err) {
            console.log('ERROR:', err)
        }
    }
    )
}
 

//------------------- Get All Documents -------------------------------------


var documentColumns = {
    ajax: {
        url: '/user/document/getdocuments',
    },
    col: [
        { data: 'id' },
        {data: 'department'},
        { data: 'trackingCode' },
        { data: 'title' },         
        { data: 'content', className: 'truncate'  },
        {data: 'requestType'},
        {data: 'remarks'},
        {data:'createdTimestamp', visible: false},
        {
            data: 'id',
            "render": function (data) {
                return `
                        <div class="d-flex justify-content-center">
                            <a class="btn btn-info btn-hover text-end text-white d-block d-flex justify-content-center align-items-center dropdown-toggle pl-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 30px; height: 30px">                                                
                            </a>
                             <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"   >
                                <a class="dropdown-item" href="#" onclick='loadDocumentFromDatabase("/user/document/getdocument/${data}")' style = "font-size: 12px !important;"   id = "btnUpdateDocumentModal" >
                                <i class="bi bi-pencil-square" ></i>
                                Update</a>
                                <a class="dropdown-item" href="#" style = "font-size: 12px !important;">
                                   <i class="bi bi-printer"></i>
                                    Print
                                </a>                          
                            </div>                             
                        </div>
                    `;
            }, width: "5%"
        }
    ],
    colDefs: [
        {
            'targets': 0,
            'checkboxes': {
                'selectRow': true
            }
        }
    ],
    'select': {
        'style': 'multi'
    },
    'order': [[1, 'desc']]
}
 
 function loadDataTable(ajaxColumns) {
    dataTable = $('#dataTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": idioma,
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 50, "Display All"]],
        dom: 'Bfrt<"col-md-6 inline"i> <"col-md-6 inline"p>',
        ajax: ajaxColumns.ajax.url,
        columns: ajaxColumns.col,
        columnDefs: ajaxColumns.colDefs,
        order: ajaxColumns.order,
        select: ajaxColumns.select,
        buttons: {
            dom: {
                container: {
                    tag: 'div',
                    className: 'flexcontent'
                },
                buttonLiner: {
                    tag: null
                }
            },
            buttons: [

                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i> Excel',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export excel btn-success',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'csvHtml5',
                    text: '<i class="fa fa-file-text-o"></i> CSV',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export csv btn-info',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'print',
                    text: '<i class="fa fa-print"></i> Print',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export imprimir btn-dark',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'pageLength',
                    titleAttr: 'Registros a mostrar',
                    className: 'selectTable'
                }
            ]
        },
        "createdRow": function(row, data, index) {
            $(row).find('.paginate_button').css('font-size', '12px'); // Adjust font size
        }
    });


    return dataTable;
}




function loadSearchTable(ajaxColumns){

    dataTable = $('#dataTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "processing": false,
        "serverSide": true,
        "info": true,
        "autoWidth": true,
        "language": idioma,
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 50, "Display All"]],
        dom: 'Bfrt<"col-md-6 inline"i> <"col-md-6 inline"p>',
        ajax: ajaxColumns.ajax.url,
        columns: ajaxColumns.col,
        columnDefs: ajaxColumns.colDefs,
        order: ajaxColumns.order,
        select: ajaxColumns.select,
        buttons: {
            dom: {
                container: {
                    tag: 'div',
                    className: 'flexcontent'
                },
                buttonLiner: {
                    tag: null
                }
            },
            buttons: [

                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i> Excel',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export excel btn-success',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'csvHtml5',
                    text: '<i class="fa fa-file-text-o"></i> CSV',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export csv btn-info',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'print',
                    text: '<i class="fa fa-print"></i> Print',
                    title: tableTitle.textContent,
                    className: 'btn btn-app export imprimir btn-dark',
                    exportOptions: {
                        columns: ':not(.not-export-column)'
                    }
                },
                {
                    extend: 'pageLength',
                    titleAttr: 'Registros a mostrar',
                    className: 'selectTable'
                }
            ]


        },
        "initComplete": function (settings, json) {
            // Access the JSON response data here
            console.log(json);
        }

    });


    return dataTable;
}


function loadSelectionTable(ajaxColumns) {
    dataTable = $('.selectionTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "language": idioma,
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 50, "Display All"]],
        dom: 'Bfrt<"col-md-6 inline"i> <"col-md-6 inline"p>',
        ajax: ajaxColumns.ajax.url,
        columns: ajaxColumns.col,
        'columnDefs': [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            }
        ],
        'select': {
            'style': 'multi'
        },
        'order': [[1, 'asc']],
        buttons: {
            dom: {
                container: {
                    tag: 'div',
                    className: 'flexcontent'
                },
                buttonLiner: {
                    tag: null
                }
            },
            buttons: [

                {
                    extend: 'pageLength',
                    titleAttr: 'Registros a mostrar',
                    className: 'selectTable'
                }
            ]


        },


    });

    return dataTable;
}


