using Microsoft.AspNetCore.Mvc.Rendering;

namespace DTS.Web.Areas.User.ViewModels;

public class DocumentVm
{

    public IEnumerable<SelectListItem> RequestTypes { get; set; }

    public int Id { get; set; }
    public string TrackingCode { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public string RequestType { get; set; }
 
}