using Microsoft.AspNetCore.Mvc.Rendering;

namespace DTS.Web.Areas.User.ViewModels;

public class DocumentVm
{

    public IEnumerable<SelectListItem> RequestTypes { get; set; }
    public IEnumerable<SelectListItem> Departments { get; set; }

    public int Id { get; set; }
    public string TrackingCode { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public string RequestType { get; set; }
    public int RequestTypeId { get; set; }

    public string  Department { get; set; }

    public int DepartmentId { get; set; }

    public string Remarks { get; set; }

    public int CreatedById { get; set; }

    public DateTime CreatedDate { get; set; }
 
}