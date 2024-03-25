using DTS.Common;
using Microsoft.AspNetCore.Mvc;

namespace DTS.Web.Controllers;

public class DocumentController : Controller
{
     
    public IActionResult Index()
    {
        return View();
    }
    
    public IActionResult Create()
    {
        @ViewData["TrackingCode"] = TrackingCodeGenerator.Generate();
        return View();
    }
    
}