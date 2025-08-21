"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // aqui você pode fazer a chamada para API ou validação
    console.log("Usuário:", user);
    console.log("Senha:", password);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Usuário"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}
