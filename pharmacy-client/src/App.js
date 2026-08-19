import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  MenuItem,
  Alert
} from "@mui/material";

const API_URL = "https://localhost:44337/api";

function App() {
  // -----------------------------
  // Medicine State
  // -----------------------------

  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMedicineDialog, setOpenMedicineDialog] =
    useState(false);

  const [medicineForm, setMedicineForm] = useState({
    fullName: "",
    notes: "",
    expiryDate: "",
    quantity: "",
    price: "",
    brand: ""
  });

  // -----------------------------
  // Sales State
  // -----------------------------

  const [sales, setSales] = useState([]);

  const [openSaleDialog, setOpenSaleDialog] =
    useState(false);

  const [saleForm, setSaleForm] = useState({
    medicineId: "",
    quantitySold: ""
  });

  const [saleMessage, setSaleMessage] = useState("");

  const [saleError, setSaleError] = useState("");

  // -----------------------------
  // Navigation
  // -----------------------------

  const [selectedTab, setSelectedTab] = useState(0);

  // -----------------------------
  // Initial Load
  // -----------------------------

  useEffect(() => {
    loadMedicines();
    loadSales();
  }, []);

  // -----------------------------
  // Medicine API
  // -----------------------------

  const loadMedicines = () => {
    fetch(`${API_URL}/Medicines`)
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => {
        console.error(
          "Error loading medicines:",
          error
        );
      });
  };

  const searchMedicines = () => {
    if (searchTerm.trim() === "") {
      loadMedicines();
      return;
    }

    fetch(
      `${API_URL}/Medicines/search?name=${encodeURIComponent(
        searchTerm
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => {
        console.error(
          "Error searching medicines:",
          error
        );
      });
  };

  // -----------------------------
  // Add Medicine
  // -----------------------------

  const handleMedicineFormChange = (event) => {
    const { name, value } = event.target;

    setMedicineForm({
      ...medicineForm,
      [name]: value
    });
  };

  const handleOpenMedicineDialog = () => {
    setMedicineForm({
      fullName: "",
      notes: "",
      expiryDate: "",
      quantity: "",
      price: "",
      brand: ""
    });

    setOpenMedicineDialog(true);
  };

  const handleCloseMedicineDialog = () => {
    setOpenMedicineDialog(false);
  };

  const handleAddMedicine = () => {
    const medicine = {
      fullName: medicineForm.fullName,
      notes: medicineForm.notes,
      expiryDate: medicineForm.expiryDate,
      quantity: Number(medicineForm.quantity),
      price: Number(medicineForm.price),
      brand: medicineForm.brand
    };

    fetch(`${API_URL}/Medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medicine)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add medicine");
        }

        return response.json();
      })
      .then(() => {
        setOpenMedicineDialog(false);

        loadMedicines();
      })
      .catch((error) => {
        console.error(
          "Error adding medicine:",
          error
        );
      });
  };

  // -----------------------------
  // Medicine Color Rules
  // -----------------------------

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();

    const expiry = new Date(expiryDate);

    const differenceInTime =
      expiry - today;

    const differenceInDays =
      differenceInTime /
      (1000 * 60 * 60 * 24);

    return (
      differenceInDays >= 0 &&
      differenceInDays < 30
    );
  };

  const getExpiryColor = (expiryDate) => {
    return isExpiringSoon(expiryDate)
      ? "#e6152a"
      : "transparent";
  };

  const getQuantityColor = (quantity) => {
    return quantity < 10
      ? "#fff59d"
      : "transparent";
  };

  // -----------------------------
  // Sales API
  // -----------------------------

  const loadSales = () => {
    fetch(`${API_URL}/Sales`)
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
      })
      .catch((error) => {
        console.error(
          "Error loading sales:",
          error
        );
      });
  };

  // -----------------------------
  // Sale Form
  // -----------------------------

  const handleSaleFormChange = (event) => {
    const { name, value } = event.target;

    setSaleForm({
      ...saleForm,
      [name]: value
    });
  };

  const handleOpenSaleDialog = () => {
    setSaleForm({
      medicineId: "",
      quantitySold: ""
    });

    setSaleMessage("");

    setSaleError("");

    setOpenSaleDialog(true);
  };

  const handleCloseSaleDialog = () => {
    setOpenSaleDialog(false);
  };

  // -----------------------------
  // Create Sale
  // -----------------------------

  const handleCreateSale = () => {
    setSaleMessage("");

    setSaleError("");

    if (
      !saleForm.medicineId ||
      !saleForm.quantitySold
    ) {
      setSaleError(
        "Please select a medicine and enter quantity."
      );

      return;
    }

    const saleRequest = {
      medicineId: Number(
        saleForm.medicineId
      ),
      quantitySold: Number(
        saleForm.quantitySold
      )
    };

    fetch(`${API_URL}/Sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(saleRequest)
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to create sale."
          );
        }

        return data;
      })
      .then((data) => {
        setSaleMessage(
          `Sale completed successfully. Total: ₹${data.totalAmount.toFixed(
            2
          )}`
        );

        setSaleForm({
          medicineId: "",
          quantitySold: ""
        });

        loadMedicines();

        loadSales();

        setTimeout(() => {
          setOpenSaleDialog(false);
          setSaleMessage("");
        }, 1500);
      })
      .catch((error) => {
        setSaleError(error.message);
      });
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <>
      {/* Header */}

      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold"
            }}
          >
            ABC Pharmacy
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation */}

      <Container sx={{ marginTop: 3 }}>

        <Paper>

          <Tabs
            value={selectedTab}
            onChange={(event, newValue) =>
              setSelectedTab(newValue)
            }
            centered
          >
            <Tab label="Medicines" />

            <Tab label="Sales" />
          </Tabs>

        </Paper>

      

        {selectedTab === 0 && (
          <Paper sx={{ padding: 3, marginTop: 2 }}>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 2
              }}
            >
              Medicine Inventory
            </Typography>

            {/* Search */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginBottom: 2
              }}
            >

              <TextField
                label="Search Medicine"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchMedicines();
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={searchMedicines}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");

                  loadMedicines();
                }}
              >
                Clear
              </Button>

            </Box>

            {/* Buttons */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginBottom: 2
              }}
            >

              <Button
                variant="contained"
                onClick={
                  handleOpenMedicineDialog
                }
              >
                Add Medicine
              </Button>

             

            </Box>

            {/* Medicine Table */}

            <TableContainer>

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>
                      <strong>
                        Medicine Name
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Expiry Date
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Quantity
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Price
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Brand
                      </strong>
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {medicines.map(
                    (medicine) => (
                      <TableRow
                        key={medicine.id}
                      >

                        <TableCell>
                          {medicine.fullName}
                        </TableCell>

                        <TableCell
                          sx={{
                            backgroundColor:
                              getExpiryColor(
                                medicine.expiryDate
                              )
                          }}
                        >
                          {new Date(
                            medicine.expiryDate
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell
                          sx={{
                            backgroundColor:
                              getQuantityColor(
                                medicine.quantity
                              )
                          }}
                        >
                          {medicine.quantity}
                        </TableCell>

                        <TableCell>
                          ₹
                          {medicine.price.toFixed(
                            2
                          )}
                        </TableCell>

                        <TableCell>
                          {medicine.brand}
                        </TableCell>

                      </TableRow>
                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </Paper>
        )}


        {selectedTab === 1 && (
          <Paper
            sx={{
              padding: 3,
              marginTop: 2
            }}
          >

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 2
              }}
            >

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold"
                }}
              >
                Sales Records
              </Typography>

              <Button
                variant="contained"
                onClick={
                  handleOpenSaleDialog
                }
              >
                New Sale
              </Button>

            </Box>

            <TableContainer>

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>
                      <strong>
                        Sale ID
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Medicine
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Quantity Sold
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Total Amount
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Sale Date
                      </strong>
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {sales.map(
                    (sale) => (
                      <TableRow
                        key={sale.id}
                      >

                        <TableCell>
                          {sale.id}
                        </TableCell>

                        <TableCell>
                          {sale.medicineName}
                        </TableCell>

                        <TableCell>
                          {sale.quantitySold}
                        </TableCell>

                        <TableCell>
                          ₹
                          {sale.totalAmount.toFixed(
                            2
                          )}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            sale.saleDate
                          ).toLocaleString()}
                        </TableCell>

                      </TableRow>
                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </Paper>
        )}

      </Container>

     

      <Dialog
        open={openMedicineDialog}
        onClose={
          handleCloseMedicineDialog
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Add Medicine
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={
              medicineForm.fullName
            }
            onChange={
              handleMedicineFormChange
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Notes"
            name="notes"
            multiline
            rows={3}
            value={
              medicineForm.notes
            }
            onChange={
              handleMedicineFormChange
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Expiry Date"
            name="expiryDate"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={
              medicineForm.expiryDate
            }
            onChange={
              handleMedicineFormChange
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            name="quantity"
            type="number"
            value={
              medicineForm.quantity
            }
            onChange={
              handleMedicineFormChange
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            inputProps={{
              step: "0.01"
            }}
            value={
              medicineForm.price
            }
            onChange={
              handleMedicineFormChange
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Brand"
            name="brand"
            value={
              medicineForm.brand
            }
            onChange={
              handleMedicineFormChange
            }
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={
              handleCloseMedicineDialog
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleAddMedicine
            }
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>

    

      <Dialog
        open={openSaleDialog}
        onClose={
          handleCloseSaleDialog
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Create New Sale
        </DialogTitle>

        <DialogContent>

          {saleMessage && (
            <Alert
              severity="success"
              sx={{ marginBottom: 2 }}
            >
              {saleMessage}
            </Alert>
          )}

          {saleError && (
            <Alert
              severity="error"
              sx={{ marginBottom: 2 }}
            >
              {saleError}
            </Alert>
          )}

          <TextField
            select
            fullWidth
            margin="normal"
            label="Medicine"
            name="medicineId"
            value={
              saleForm.medicineId
            }
            onChange={
              handleSaleFormChange
            }
          >

            {medicines.map(
              (medicine) => (
                <MenuItem
                  key={medicine.id}
                  value={medicine.id}
                >
                  {medicine.fullName}
                  {" - Stock: "}
                  {medicine.quantity}
                </MenuItem>
              )
            )}

          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Quantity to Sell"
            name="quantitySold"
            type="number"
            inputProps={{
              min: 1
            }}
            value={
              saleForm.quantitySold
            }
            onChange={
              handleSaleFormChange
            }
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={
              handleCloseSaleDialog
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={
              handleCreateSale
            }
          >
            Complete Sale
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
}

export default App;