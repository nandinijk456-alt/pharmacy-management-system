using Microsoft.AspNetCore.Mvc;
using PharmacyApi.Models;
using PharmacyApi.Services;

namespace PharmacyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly MedicineService _medicineService;

    public MedicinesController(MedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMedicines()
    {
        var medicines = await _medicineService.GetAllAsync();

        return Ok(medicines);
    }
    [HttpPost]
    public async Task<IActionResult> AddMedicine(Medicine medicine)
    {
        var result = await _medicineService.AddAsync(medicine);

        return Ok(result);
    }
    [HttpGet("search")]
    public async Task<IActionResult> SearchMedicine([FromQuery] string name)
    {
        var medicines = await _medicineService.GetAllAsync();

        if (string.IsNullOrWhiteSpace(name))
        {
            return Ok(medicines);
        }

        var result = medicines
            .Where(m => m.FullName.Contains(
                name,
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        return Ok(result);
    }
}