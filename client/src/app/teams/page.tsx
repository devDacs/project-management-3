"use client";

import React from "react";
import { useAppSelector } from "../redux";
import { useGetTeamsQuery } from "@/state/api";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team", width: 200 },
  {
    field: "teamProductOwner",
    headerName: "Product Owner",
    width: 150,
    renderCell: ({ row: { teamProductOwner } }) => (
      <div className="flex h-full w-full items-center justify-center">
        {!teamProductOwner ? (
          "Unassigned"
        ) : (
          <div className="h-9 w-9">
            <Image
              src={`/${teamProductOwner.profilePictureUrl}`}
              alt={teamProductOwner.username}
              width={100}
              height={50}
              className="h-full rounded-full object-cover"
            />
          </div>
        )}
      </div>
    ),
  },
  {
    field: "teamProjectManager",
    headerName: "Project Manager",
    width: 150,
    renderCell: ({ row: { teamProjectManager } }) => (
      <div className="flex h-full w-full items-center justify-center">
        {!teamProjectManager ? (
          "Unassigned"
        ) : (
          <div className="h-9 w-9">
            <Image
              src={`/${teamProjectManager.profilePictureUrl}`}
              alt={teamProjectManager.username}
              width={100}
              height={50}
              className="h-full rounded-full object-cover"
            />
          </div>
        )}
      </div>
    ),
  },
];

const CustomToolbar = () => (
  <GridToolbarContainer className="flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Teams = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div className="h-[650px] w-full">
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
          slots={{ toolbar: CustomToolbar }}
        />
      </div>
    </div>
  );
};

export default Teams;
