using Microsoft.AspNetCore.Mvc;
using PharmacyApi.Models;
using PharmacyApi.Services;

namespace PharmacyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly MedicineService _medicineService;

    public SalesController(MedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale(
        SaleRequest request)
    {
        try
        {
            var sale = await _medicineService.CreateSaleAsync(request);

            return Ok(sale);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
    [HttpGet]
    public async Task<IActionResult> GetSales()
    {
        var sales = await _medicineService.GetSalesAsync();

        return Ok(sales);
    }
}