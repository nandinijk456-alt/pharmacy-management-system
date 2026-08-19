PHARMACY MANAGEMENT SYSTEM
==========================

A Single Page Application developed for the ABC Pharmacy coding assignment.

The application allows users to view and manage medicines and maintain medicine sales records.


TECHNOLOGY STACK
================

- .NET Core 8.0
- ASP.NET Core Web API
- React.js
- JavaScript
- Material UI
- JSON for server-side data storage


PROJECT STRUCTURE
=================

PharmacyApp
|
|-- PharmacyApi
|   |
|   |-- Controllers
|   |   |-- MedicinesController.cs
|   |   |-- SalesController.cs
|   |
|   |-- Models
|   |   |-- Medicine.cs
|   |   |-- Sale.cs
|   |   |-- SaleRequest.cs
|   |
|   |-- Services
|   |   |-- MedicineService.cs
|   |
|   |-- Data
|   |   |-- medicines.json
|   |   |-- sales.json
|   |
|   |-- Program.cs
|
|-- pharmacy-client
    |
    |-- src
    |-- public
    |-- package.json


BACKEND SETUP
=============

1. CREATE THE .NET WEB API PROJECT

The backend project was created using the .NET CLI.

Command:

dotnet new webapi -n PharmacyApi

The project uses .NET Core 8.0.


2. BUILD THE PROJECT

The project was built using:

dotnet build

A successful build confirms that the API project compiles correctly.


3. RUN THE API

The backend can be started using:

dotnet run

The API runs using the URLs configured in the application's launch settings.


BACKEND IMPLEMENTATION
======================

4. MODELS

Three main models were created for the application.


MEDICINE MODEL
--------------

The Medicine model contains:

Id
FullName
Notes
ExpiryDate
Quantity
Price
Brand

These fields represent the medicine information required by the assignment.


SALE MODEL
----------

The Sale model contains:

Id
MedicineId
MedicineName
QuantitySold
TotalAmount
SaleDate

The Sale model represents a completed medicine sale.


SALEREQUEST MODEL
-----------------

SaleRequest is used to receive the information required when creating a medicine sale.

It contains the information needed to process the sale and update medicine stock.


5. CONTROLLERS
==============

Two controllers were created.


MEDICINES CONTROLLER
--------------------

MedicinesController handles medicine-related API operations.

Main operations:

GET  /api/Medicines
POST /api/Medicines
GET  /api/Medicines/search


GET MEDICINES
-------------

Returns the list of medicines stored in the system.


POST MEDICINE
-------------

Adds a new medicine to the system.


SEARCH MEDICINES
----------------

Allows medicines to be searched by medicine name.


SALES CONTROLLER
----------------

SalesController handles medicine sales and sales records.

Main operations:

GET  /api/Sales
POST /api/Sales


GET SALES
---------

Returns the sales records stored in the system.


POST SALE
---------

Creates a new medicine sale.

When a sale is created:

1. The medicine is identified.
2. The requested quantity is validated.
3. Available stock is checked.
4. The total sale amount is calculated.
5. Medicine stock is reduced.
6. The sale record is stored.


SERVICE LAYER
=============

6. MEDICINE SERVICE
-------------------

A separate MedicineService was created to handle medicine-related business logic and JSON file operations.

This keeps the business logic separate from the controllers.

The service is registered in Program.cs using scoped dependency injection:

builder.Services.AddScoped<MedicineService>();

This provides a simple separation:

Controller
    |
    v
MedicineService
    |
    v
JSON Data


JSON DATA STORAGE
=================

7. SERVER-SIDE JSON STORAGE

As required by the assignment, the application stores data in JSON files on the server.

Medicine data is stored in:

Data/medicines.json

Sales data is stored in:

Data/sales.json

Medicine and sales data are maintained separately.


FRONTEND
========

8. REACT SINGLE PAGE APPLICATION

The frontend was developed using React.js.

The React application communicates with the ASP.NET Core Web API to retrieve and update data.

Material UI is used for the user interface components.


MATERIAL UI
===========

Material UI is used for:

- Buttons
- Text fields
- Tables/Grid
- Dialogs
- Forms
- Alerts
- Layout components

This provides a consistent user interface.


MEDICINE LIST
=============

9. MEDICINE GRID

The application displays available medicines in a grid.

The following medicine attributes are displayed:

Medicine Name
Expiry Date
Quantity
Price
Brand

The Notes field is intentionally not displayed in the grid according to the assignment requirement.


COLOR INDICATORS
================

10. EXPIRY WARNING

Medicines with an expiry date less than 30 days from the current date are displayed with a RED background.

Rule:

Expiry Date < 30 Days
        |
        v
RED BACKGROUND


11. LOW STOCK WARNING

Medicines with quantity less than 10 are displayed with a YELLOW background.

Rule:

Quantity < 10
      |
      v
YELLOW BACKGROUND


SEARCH
======

12. MEDICINE SEARCH

The application provides search functionality for medicines.

Users can enter a medicine name in the search field.

Example:

Search: Paracetamol

The application displays the matching medicine records.

Search functionality was implemented as a good-to-have requirement from the assignment.


ADD MEDICINE
===========

13. ADD MEDICINE

The application provides an Add Medicine functionality.

The form contains:

Full Name
Notes
Expiry Date
Quantity
Price
Brand

After submitting the form, the medicine is sent to the Web API and stored in:

Data/medicines.json


MEDICINE SALES
==============

14. RECORD SALE

The application provides functionality to maintain medicine sales.

A user can select a medicine and enter the quantity to be sold.

The application calculates the total amount based on the medicine price.

Example:

Medicine:
Paracetamol 500mg

Price:
10.50

Quantity Sold:
2

Total Amount:
21.00


15. STOCK UPDATE

After a successful sale, the medicine stock is automatically reduced.

Example:

Previous Quantity = 25

Quantity Sold = 2

Remaining Quantity = 23

The updated medicine quantity is stored in medicines.json.


SALES HISTORY
=============

16. SALES RECORDS

The application maintains sales records separately in:

Data/sales.json

Each sales record contains:

Sale Id
Medicine Id
Medicine Name
Quantity Sold
Total Amount
Sale Date

Example:

{
  "id": 1,
  "medicineId": 1,
  "medicineName": "Paracetamol 500mg",
  "quantitySold": 2,
  "totalAmount": 21,
  "saleDate": "2026-08-19T19:49:11"
}


API ENDPOINTS
=============

MEDICINES

GET  /api/Medicines
Purpose: Get all medicines

POST /api/Medicines
Purpose: Add a new medicine

GET  /api/Medicines/search
Purpose: Search medicines


SALES

GET  /api/Sales
Purpose: Get sales records

POST /api/Sales
Purpose: Record a medicine sale


FRONTEND APPLICATION
====================

The React application runs locally on:

http://localhost:3000

The frontend communicates with the ASP.NET Core Web API running locally.


RUNNING THE APPLICATION
=======================

BACKEND
-------

Open a terminal and navigate to the API project:

cd PharmacyApi

Restore dependencies:

dotnet restore

Build the project:

dotnet build

Run the API:

dotnet run


FRONTEND
--------

Open another terminal and navigate to the React project:

cd pharmacy-client

Install dependencies:

npm install

Start the React application:

npm start

Open the application in the browser:

http://localhost:3000


ASSIGNMENT REQUIREMENTS
=======================

ASP.NET Core Web API
Status: Completed

.NET Core
Version: 8.0

React Single Page Application
Status: Completed

JavaScript Framework
React

Material UI
Status: Completed

Server-side JSON storage
Status: Completed

Display medicine list
Status: Completed

Medicine grid
Status: Completed

Notes excluded from grid
Status: Completed

Red background for expiry less than 30 days
Status: Completed

Yellow background for quantity less than 10
Status: Completed

Medicine search
Status: Completed

Add medicine
Status: Completed

Maintain medicine sales
Status: Completed

Update stock after sale
Status: Completed

Sales records
Status: Completed


IMPLEMENTATION APPROACH
=======================

The application was developed in the following sequence:

1. Created the ASP.NET Core Web API project using .NET 8.

2. Built and verified the API project.

3. Created the Medicine model.

4. Created the Sale model.

5. Created the SaleRequest model.

6. Created the Medicines Controller.

7. Created the Sales Controller.

8. Created separate JSON files for medicine and sales data.

9. Created the MedicineService for business logic and JSON operations.

10. Registered MedicineService in Program.cs using scoped dependency injection.

11. Tested the medicine API using Swagger.

12. Tested adding and retrieving medicines.

13. Tested medicine search.

14. Tested the sales API.

15. Tested stock reduction after a sale.

16. Created the React frontend.

17. Added Material UI components.

18. Connected the React frontend with the ASP.NET Core Web API.

19. Created the medicine grid.

20. Added expiry-date color indication.

21. Added low-stock color indication.

22. Added medicine search.

23. Added Add Medicine functionality.

24. Added medicine sales functionality.

25. Added sales record display.

26. Tested both Medicine and Sales functionality.


VALIDATION AND TESTING
======================

MEDICINE TESTING

- Retrieve medicine list
- Add medicine
- Search medicine
- Display medicine information
- Display expiry warning
- Display low-stock warning


SALES TESTING

- Create a sale
- Validate available stock
- Calculate total sale amount
- Reduce medicine quantity
- Store sale record
- Retrieve sales records


EXAMPLE TEST
============

Medicine:

Paracetamol 500mg
Price: 10.50
Quantity: 25

Sale:

Quantity Sold: 2

Result:

Total Amount: 21.00
Remaining Stock: 23

The sale record is stored in sales.json.


NOTES
=====

- JSON files are used for data persistence as specified in the assignment.
- Medicine and sales data are stored in separate JSON files.
- The Notes attribute is stored but not displayed in the medicine grid.
- The frontend and backend are separate applications.
- Material UI is used for the frontend interface.
- The application was tested locally using the .NET API and React development server.


FUTURE IMPROVEMENTS
===================

The following improvements could be added in a production application:

- Database storage such as SQL Server
- Authentication and authorization
- Pagination for large medicine lists
- Advanced search and filtering
- Centralized error handling
- Logging and monitoring
- Unit and integration tests
- Production deployment


AUTHOR
======

Nandini J K

Pharmacy Management System Coding Assignment
