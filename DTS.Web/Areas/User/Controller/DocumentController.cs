using Microsoft.AspNetCore.Mvc;

namespace DTS.Web.Controllers;

public class DocumentController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
    
    public IActionResult Create()
    {
        return View();
    }
    
}