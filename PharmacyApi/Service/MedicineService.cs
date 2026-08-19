using System.Text.Json;
using PharmacyApi.Models;

namespace PharmacyApi.Services;

public class MedicineService
{
    private readonly string _filePath;

    public MedicineService(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(
            environment.ContentRootPath,
            "Data",
            "medicines.json");
    }

    public async Task<List<Medicine>> GetAllAsync()
    {
        if (!File.Exists(_filePath))
        {
            return new List<Medicine>();
        }

        var json = await File.ReadAllTextAsync(_filePath);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        return JsonSerializer.Deserialize<List<Medicine>>(json, options)
               ?? new List<Medicine>();
    }
    public async Task<Medicine> AddAsync(Medicine medicine)
    {
        var medicines = await GetAllAsync();

        medicine.Id = medicines.Count == 0
            ? 1
            : medicines.Max(x => x.Id) + 1;

        medicines.Add(medicine);

        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(medicines, options);

        await File.WriteAllTextAsync(_filePath, json);

        return medicine;
    }
    private async Task SaveMedicinesAsync(List<Medicine> medicines)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(
            medicines,
            options);

        await File.WriteAllTextAsync(
            _filePath,
            json);
    }
    public async Task<Sale> CreateSaleAsync(SaleRequest request)
    {
        var medicines = await GetAllAsync();

        var medicine = medicines.FirstOrDefault(
            x => x.Id == request.MedicineId);

        if (medicine == null)
        {
            throw new InvalidOperationException("Medicine not found.");
        }

        if (request.QuantitySold <= 0)
        {
            throw new InvalidOperationException(
                "Sale quantity must be greater than zero.");
        }

        if (request.QuantitySold > medicine.Quantity)
        {
            throw new InvalidOperationException(
                "Insufficient stock.");
        }

        medicine.Quantity -= request.QuantitySold;

        var salesFilePath = Path.Combine(
            Path.GetDirectoryName(_filePath)!,
            "sales.json");

        var sales = new List<Sale>();

        if (File.Exists(salesFilePath))
        {
            var salesJson = await File.ReadAllTextAsync(salesFilePath);

            sales = JsonSerializer.Deserialize<List<Sale>>(salesJson)
                    ?? new List<Sale>();
        }

        var sale = new Sale
        {
            Id = sales.Count == 0
                ? 1
                : sales.Max(x => x.Id) + 1,

            MedicineId = medicine.Id,

            MedicineName = medicine.FullName,

            QuantitySold = request.QuantitySold,

            TotalAmount = request.QuantitySold * medicine.Price,

            SaleDate = DateTime.Now
        };

        sales.Add(sale);

        await SaveMedicinesAsync(medicines);

        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var updatedSalesJson =
            JsonSerializer.Serialize(sales, options);

        await File.WriteAllTextAsync(
            salesFilePath,
            updatedSalesJson);

        return sale;
    }
    public async Task<List<Sale>> GetSalesAsync()
    {
        var salesFilePath = Path.Combine(
            Path.GetDirectoryName(_filePath)!,
            "sales.json");

        if (!File.Exists(salesFilePath))
        {
            return new List<Sale>();
        }

        var json = await File.ReadAllTextAsync(salesFilePath);

        return JsonSerializer.Deserialize<List<Sale>>(json)
               ?? new List<Sale>();
    }
}