"use client";

import React from "react";
import { useAppSelector } from "@/store/store";
import { useGetUsersQuery } from "@/state/api";
import Header from "@/components/header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/data-grid-styles";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: ({ value, row: { username } }) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${value}`}
            alt={username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
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

const Users = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div className="h-[650px] w-full">
        <DataGrid
          rows={users || []}
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

export default Users;
