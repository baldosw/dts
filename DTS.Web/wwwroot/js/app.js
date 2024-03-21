var tableTitle = document.getElementById("tableTitle");

var dataTable;

tinymce.init({
    selector: 'textarea',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
});

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

// Load Student Profile From Student Table
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

let dListProvince = document.getElementById('dListProvince');
let dListMunicipality = document.getElementById('dListMunicipality');
let dListBarangay = document.getElementById('dListBarangay');
let dListEntryYear = document.getElementById('dListEntryYear');
let dListStatus = document.getElementById('dListStatus');
let dListGender = document.getElementById('dListGender');

if(dListProvince != null){
    dListProvince.addEventListener('change', function () {

        var selectedProvince = dListProvince.value;

        if (selectedProvince > 0) {
            dListMunicipality.disabled = false;

            $("#dListBarangay").empty();
            
            let el = document.createElement("option");
            el.textContent = "-----Select Barangay-----";
            el.value = "";
            dListBarangay.appendChild(el);
            dListBarangay.disabled = true;
 
            getMunicipalities(selectedProvince);
        }
    });
}

if(dListMunicipality != null){
    dListMunicipality.addEventListener('change', function () {

        let selectedMunicipality = dListMunicipality.value;

        if (selectedMunicipality > 0) {
            dListBarangay.disabled = false;

            getBarangays(selectedMunicipality);
        }

    });
}


function loadStatus(statusId){
    $.ajax({
            url: `/Admin/status/GetStatus`,
            type: 'GET',
            success: function (response) {
                let statuses = response['data'];
               
                $("#dListStatus").empty();
                for (const key in statuses) {
                    let text = statuses[key]['name'];
                    let value = statuses[key]['id'];
                    let el = document.createElement("option");
                    el.textContent = text;
                    el.value = value;
                    dListStatus.appendChild(el);

                }
                // $('#dListStatus option:first').remove();
                $("#dListStatus").val(statusId);
                
                let status = $("#dListStatus option:selected").text();
                
                if(status == "Enrolled"){
                    $('#statusDateBlock').css('display','none');
                }else{
                    $('#statusDateBlock').css('display','flex');
                }
            },
            error: function (err) {
                console.log('ERROR:', err)
            }

        }
    )

}

function loadGender(genderId){
    $.ajax({
            url: `/Admin/Student/GetGenders/`,
            type: 'GET',
            success: function (response) {
                let genders = response['data']
     
                $("#dListGender").empty();
                for (const key in genders) {
                    let text = genders[key]['sex'];
                    let value = genders[key]['id'];
                    let el = document.createElement("option");
                    el.textContent = text;
                    el.value = value;
                    dListGender.appendChild(el);

                }
                $("#dListGender").val(genderId);
            },
            error: function (err) {
                console.log('ERROR:', err)
            }

        }
    )
}


function getMunicipalities(provinceId, municipalityId) {

    $.ajax({
        url: `/Admin/Student/GetMunicipalitiesByProvinceId?provinceId=${provinceId}`,
        type: 'GET',
        success: function (response) {

            let municipalities = response['data'];
            $("#dListMunicipality").empty();
            for (const key in municipalities) {

                let text = municipalities[key]['name'];
                let value = municipalities[key]['id'];
                let el = document.createElement("option");
                el.textContent = text;
                el.value = value;
                dListMunicipality.appendChild(el);

            }
            
            if(municipalityId != null && municipalityId != 'undefined' && municipalityId !== ''){
                $("#dListMunicipality").val(municipalityId);
            }else{
                $("#dListMunicipality option").first().prop("selected", true);
            }
        },
        error: function (err) {
            console.log('ERROR:', err)
        }

    }
    )


}

function getBarangays(municipalityId, barangayId) {

    $.ajax({
        url: `/Admin/Student/GetBarangaysByMunicipalityId?municipalityId=${municipalityId}`,
        type: 'GET',
        success: function (response) {
            $("#dListBarangay").empty();
            let barangays = response['data'];

            for (const key in barangays) {
                
                let text = barangays[key]['name'];
                let value = barangays[key]['id'];
                let el = document.createElement("option");
                el.textContent = text;
                el.value = value;
                dListBarangay.appendChild(el);

            }

            if(barangayId != null && barangayId != 'undefined' && barangayId !== ''){
                $("#dListBarangay").val(barangayId);
            }else {
                $("#dListBarangay option").first().prop("selected", true);
            }
        },
        error: function (err) {
            console.log('ERROR:', err)
        }

    }
    )

}

function getEntryYears(entryYear){
    $.ajax({
            url: `/Admin/Student/GetEntryYears`,
            type: 'GET',
            success: function (response) {
                let entryYears = response.data;
                $("#dListEntryYear").empty();
                for (const key in entryYears) {
                   
                    let text = entryYears[key];
                    let value = entryYears[key];
                    let el = document.createElement("option");
                    el.textContent = text;
                    el.value = value;
                    dListEntryYear.appendChild(el);

                }
                $("#dListEntryYear").val(entryYear);
            },
            error: function (err) {
                console.log('ERROR:', err)
            }

        }
    )
}


//------------------- Get All Students -------------------------------------


var studentColumns = {
 
    col: [
        { data: 'id' },
        { data: 'firstName' },
        { data: 'lastName' },
        { 
            data: 'birthdate',
            "render": function(data){
                var date = new Date(data);
                objDate = converDate(date);
                return `${objDate.month}/${objDate.day}/${objDate.year}`
            }
        },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'municipalityName' },
        { data: 'statusName' },
        { data: 'studentId' },
        { data: 'entryYear' },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center" data-bs-toggle="modal"
                        data-bs-target="#ExtralargeModal"  style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" onclick='OnClickLoadStudentProfile("/Admin/Student/GetStudentById/${data}", "student")'>
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/Student/DeleteStudent/${data}", "student")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
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
    'order': [[1, 'asc']]
}


//------------------- Get All Teachers ---------------------------------------------   

var teachersColumns = {

    ajax: {
        url: '/Admin/teacher/GetTeachers',
    },
    col: [
        { data: 'id' },
        { data: 'firstName' },
        { data: 'middleName' },
        { data: 'lastName' },
        { data: 'email' },
        { data: 'mobile' },
        { data: 'specialization' },
        { data: 'gender.sex' },
        {
            data: 'birthDate',
            "render": function(data){
                var date = new Date(data);
                objDate = converDate(date);
                return `${objDate.month}/${objDate.day}/${objDate.year}`
            }
        },
        { 
            data: 'entryDate',
            "render": function(data){
                var date = new Date(data);
                objDate = converDate(date);
                return `${objDate.month}/${objDate.day}/${objDate.year}`
            }
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/teacher/editteacher/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/teacher/DeleteTeacher/${data}", "teacher")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All Teachers --------------------------------------------- 

//------------------- Get All Enrolees ---------------------------------------------


var enroleesColumn = {
 
    col: [
        {data: "id"},
        { data: 'gradeLevel' },
        { data: 'sectionName' },
        { data: 'firstName' },
        { data: 'lastName' },
        { 
            data: 'birthdate',
            "render": function(data){
                var date = new Date(data);
                objDate = converDate(date);
                return `${objDate.month}/${objDate.day}/${objDate.year}`
            }
        },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'municipalityName' },
        { data: 'statusName' },
        { data: 'studentId' },
        { data: 'entryYear' }
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
        'order': [[1, 'asc']]
}

//------------------- Get All Enrollees ---------------------------------------------

//------------------- Get All Status ---------------------------------------------   

var statusColumns = {

    ajax: {
        url: '/Admin/status/getstatus',
    },
    col: [
        {
            data: 'id'
        },
        {
            data: 'name'
        },
        {
            data: 'description'
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/status/editstatus/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/Status/DeleteStatus/${data}", "status")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All Status ---------------------------------------------   


//------------------- Get All YearLevels ---------------------------------------------   

var yearLevelColumns = {

    ajax: {
        url: '/Admin/yearLevel/GetAllYearLevels',
    },
    col: [
        {
            data: 'id'
        },
        {
            data: 'gradeLevel'
        },
        {
            data: 'description'
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/yearLevel/editYearLevel/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/yearlevel/deleteYearLevel/${data}", "yearlevel")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All YearLevels ---------------------------------------------   


//------------------- Get All Sections ---------------------------------------------   

var sectionColumns = {

    ajax: {
        url: '/Admin/section/GetAllSections',
    },
    col: [
        {
            data: 'id'
        },
        {
            data: 'name'
        },
        {
            data: 'yearLevel.gradeLevel'
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/section/editsection/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/section/deletesection/${data}", "section")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All Sections ---------------------------------------------   

  
//------------------- Get All School Years ---------------------------------------------   

var schoolYearColumns = {

    ajax: {
        url: '/Admin/schoolyear/GetSchoolYear',
    },
    col: [
        {
            data: 'id'
        },
        {
            data: 'fromYear'
        },
        {
            data: 'toYear'
        },
        {
            data: 'studentSchoolYear'
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/schoolYear/editSchoolYear/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/schoolYear/deleteSchoolYear/${data}", "status")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All School Years  ---------------------------------------------   


//------------------- Get All Subject ---------------------------------------------   

var subjectColumns = {

    ajax: {
        url: '/Admin/subject/getsubjects',
    },
    col: [
        {
            data: 'id'
        },
        {
            data: 'name'
        },
        {
            data: 'code'
        },
        {
            data: 'description'
        },
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/subject/editsubject/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        {
            data: 'id',
            "render": function (data) {
                return `
<div class="d-flex justify-content-center">
                         <a class="btn btn-danger btn-hover text-end text-white  d-block d-flex justify-content-center" onclick='OnClickDelete("/Admin/subject/deletesubject/${data}", "subject")' style="width: 40px; height: 40px">                        
                            <i class=" ri-delete-bin-6-line"></i>  
                        </a>
                        </div>
                    `;
            }, width: "5%"
        }
    ]
}


//------------------- Get All Subject  ---------------------------------------------




//------------------- Get All Students to be enrolled -------------------------------------
 
var studentsToBeEnrolledColumns = {
   
    col: [
        { data: 'id' },
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'birthDate' },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'municipalityName' },
        { data: 'statusName' },
        { data: 'studentId' },
        { data: 'entryYear' } 
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
    'order': [[1, 'asc']]
}

//------------------- Get All Record Students ---------------------------------------------

var studentsRecordsColumns = {
    col: [
        { data: 'id' },
        { data: 'firstName' },
        { data: 'lastName' },
        {
            data: 'birthdate',
            "render": function(data){
                var date = new Date(data);
                objDate = converDate(date);
                return `${objDate.month}/${objDate.day}/${objDate.year}`
            }
        },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'municipality' },
        { data: 'status' },
        { data: 'studentId' },
        { data: 'yearLevel' },
        {data: 'schoolYear'},
        {
            data: 'id',
            "render": function (data) {

                return `
                        <div class="d-flex justify-content-center">
                             <a  class="btn btn-primary btn-hover text-end  d-block d-flex justify-content-center"  
                          style="width: 40px; height: 40px; display: flex; align-items: center; color: #fff;" href='/Admin/Record/AddRecord/${data}' target="_blank">
                                <i class=" ri-eye-line"></i>
                             </a>
                        </div>
                        `;
            }, width: "5%"
        },
        
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
    'order': [[1, 'asc']]
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



