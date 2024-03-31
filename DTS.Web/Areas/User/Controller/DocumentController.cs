using DTS.Common;
using DTS.DataAccess;
using DTS.Models;
using DTS.Web.Areas.User.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace DTS.Web.Controllers;

public class DocumentController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    public DocumentController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IActionResult> Index()
    {
        DocumentVm documentVm = new DocumentVm();
        documentVm.RequestTypes = _dbContext.RequestTypes.Select(entity => new SelectListItem
        {
            Text = entity.Title,
            Value = entity.Id.ToString()
        }).ToList();
        
        documentVm.Departments = _dbContext.Departments.Select(entity => new SelectListItem
        {
            Text = entity.Name,
            Value = entity.Id.ToString()
        }).ToList();
           
        return View(documentVm);
    }
    
    public IActionResult Create()
    {
        DocumentVm documentVm = new DocumentVm();
        documentVm.TrackingCode = TrackingCodeGenerator.Generate();

        documentVm.RequestTypes = _dbContext.RequestTypes.Select(rt => new SelectListItem
        {
            Value = rt.Id.ToString(),
            Text = rt.Title
        });
         
        return View(documentVm);
    }


    #region Documents Api

    [HttpGet]
    public async Task<IActionResult>  GetDocuments()
    {
        var documents = await _dbContext.Documents.AsNoTracking().ToListAsync();
        var dataJson = new { data = documents };

        return Ok(dataJson);
    }

    [HttpPost]
    public async Task<IActionResult>  CreateDocument([FromBody]DocumentVm documentVm)
    {
        Document document = new Document();
        document.CreatedDate = DateTime.Now;
        document.ModifiedDate = DateTime.Now;
        document.CreatedBy = 3;
        document.ModifiedBy = 3;
        
        if (ModelState.IsValid)
        {
            document.Title = documentVm.Title;
            document.Content = documentVm.Content;
            document.TrackingCode = documentVm.TrackingCode;
            document.DepartmentId = documentVm.DepartmentId;
            document.RequestTypeId = documentVm.RequestTypeId;
            document.Remarks = documentVm.Remarks;
            
            await _dbContext.Documents.AddAsync(document);
            await _dbContext.SaveChangesAsync();

            var dataJson = new { isSuccess = true };
            
            return Ok(dataJson);
        }
        else
        {
            var errors = ModelState.Keys
                .Select(key => new
                {
                    Field = key,
                    Error = ModelState[key].Errors.FirstOrDefault()?.ErrorMessage
                })
                .Where(item => item.Error != null)
                .ToList();
            
            var dataJson = new { isSuccess = false, errors = errors };
            return BadRequest(dataJson);
        }
 
    }

    
    #endregion
    
}