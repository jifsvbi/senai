"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import PeopleManager from "./page";
import UserManager from "./UserManage";

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Pessoas" />
        <Tab label="Usuários" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <PeopleManager />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserManager />
      </TabPanel>
    </Box>
  );
}
