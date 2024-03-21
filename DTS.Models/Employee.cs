﻿using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace DTS.Models;

using System.ComponentModel.DataAnnotations;

public class Employee
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string MiddleName { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string LastName { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string Position { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string ContactNumberOne { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string Email { get; set; }

    [Required]
    [StringLength(400, MinimumLength = 2, ErrorMessage = "The {0} value cannot exceed {1} characters and should not be less than {2} characters ")]
    public string Address { get; set; }

    [ValidateNever]
    public Office Office { get; set; }

    [Required]
    public int OfficeId { get; set; }
 
    
}