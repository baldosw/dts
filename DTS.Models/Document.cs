using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace DTS.Models;

public class Document
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string Title { get; set; }

    [Required]
    [StringLength(400, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string Content { get; set; }

    [Display(Name = "From Department")]
    public int FromDepartment { get; set; }

    [ValidateNever]
    public Department Department { get; set; }

    [Display(Name = "Created By")]
    public int CreatedBy { get; set; }
    
    [Display(Name = "Modified By")]
    public int ModifiedBy { get; set; }

    [ValidateNever]
    public Employee Employee { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime ModifiedDate { get; set; }
 
}