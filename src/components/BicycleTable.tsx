import { useEffect, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { BicycleList } from "../types/bicycleTypes";
import useBicycleData from "../hooks/useBicycle";

const AppStyledProvider = styled.div`
  height: 950px;
  width: 90%;
  margin: auto;
`;
const StyledTextField = styled(TextField)`
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled.button`
  display: block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #5b5b5b;
  margin-bottom: 10px;
  box-shadow: 1px 1px 1px 1px #a2a2a2;
  cursor: pointer;
  background-color: #dbdbdb;
  border: none;
  border-radius: 7px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background-color: #cecece;
    border-radius: 7px;
    z-index: -1;
  }

  &:after {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border: 2px solid #787878;
    background-color: white;
    border-radius: 10px;
    z-index: -2;
  }
`;

function BicycleTable() {
  const [isDescriptionPopupOpen, setIsDescriptionPopupOpen] = useState(false);
  const [popupDescription, setPopupDescription] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const bicycleList: BicycleList[] = useBicycleData();
  const [filteredBicycleList, setFilteredBicycleList] = useState<BicycleList[]>(
    []
  );

  const handleDescriptionPopupOpen = (params: GridCellParams) => {
    const description = params.row?.Description || "";
    setPopupDescription(description);
    setIsDescriptionPopupOpen(true);
  };

  const handleSearchButtonClick = () => {
    const filterBicycles = bicycleList.filter((value) => {
      return (
        value?.Make?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.Model?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.Terrain?.toString().includes(searchWord?.toLowerCase())
      );
    });
    setFilteredBicycleList(filterBicycles);
  };

  const columns: GridColDef[] = [
    {
      field: "BikeID",
      headerName: "Bike ID",
      width: 80,
      sortable: false,
    },
    { field: "Make", headerName: "Make", width: 80, sortable: false },
    {
      field: "Model",
      headerName: "Model",
      width: 130,
      sortable: false,
    },
    { field: "Year", headerName: "Year", width: 120 },
    { field: "Displacement", headerName: "Displacement", width: 120 },
    { field: "Price", headerName: "Price", width: 120 },
    { field: "Terrain", headerName: "Terrain", width: 120 },
    {
      field: "Description",
      headerName: "Description",
      sortable: false,
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => handleDescriptionPopupOpen(params)}
        >
          View Description
        </div>
      ),
    },
  ];

  const getRowHeight = (params: GridRowParams): number => {
    const description = params.row?.Description || "";
    const descriptionLength = description.length;
    const minHeight = 50;
    const extraHeightPerLine = 20;
    return minHeight + Math.ceil(descriptionLength / 40) * extraHeightPerLine;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppStyledProvider>
      <h2>Bicycle List </h2>
      <StyledTextField
        value={searchWord}
        onChange={(event) => setSearchWord(event.target.value)}
        label="Search Bicycles"
        variant="outlined"
      />

      <StyledButton onClick={handleSearchButtonClick}>SEARCH</StyledButton>

      <DataGrid
        rows={
          filteredBicycleList.length > 0 ? filteredBicycleList : bicycleList
        }
        columns={columns}
        pageSize={isSmallScreen ? 5 : 10}
        getRowHeight={getRowHeight as (params: any) => number}
        rowsPerPageOptions={isSmallScreen ? [] : [5]}
        getRowId={(row) => row.BikeID}
      />
      <Dialog
        open={isDescriptionPopupOpen}
        onClose={() => setIsDescriptionPopupOpen(false)}
      >
        <DialogTitle>Description</DialogTitle>
        <DialogContent>{popupDescription}</DialogContent>
      </Dialog>
    </AppStyledProvider>
  );
}

export default BicycleTable;
