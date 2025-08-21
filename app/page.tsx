"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
// Substitui lucide-react (que falhou no CDN) por ícones do MUI, que funcionam localmente
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ------------------------------
// Helpers puros (facilitam testes)
// ------------------------------
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function validatePerson(form) {
  const nameOk = (form.name || "").trim().length >= 2;
  const ageNum = Number(form.age);
  const ageOk = Number.isFinite(ageNum) && ageNum >= 0 && ageNum <= 130;
  const phoneOk = (form.phone || "").trim().length >= 8; // validação simples
  return { ok: nameOk && ageOk && phoneOk, ageNum };
}

function addPerson(list, form) {
  const { ok, ageNum } = validatePerson(form);
  if (!ok) throw new Error("Pessoa inválida");
  return [
    ...list,
    { id: uid(), name: form.name.trim(), age: ageNum, phone: form.phone.trim(), createdAt: new Date().toISOString() },
  ];
}

function editPerson(list, id, form) {
  const { ok, ageNum } = validatePerson(form);
  if (!ok) throw new Error("Pessoa inválida");
  return list.map((p) => (p.id === id ? { ...p, name: form.name.trim(), age: ageNum, phone: form.phone.trim() } : p));
}

function deletePerson(list, id) {
  return list.filter((p) => p.id !== id);
}

function filterPeople(list, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => [p.name, String(p.age), p.phone].some((v) => (v || "").toString().toLowerCase().includes(q)));
}

// --------------------------------
// Componente principal
// --------------------------------
export default function LoginAndPeoplePage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  // feedback
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  const handleLogin = () => {
    // Exemplo simples: qualquer usuário/senha não vazios "logam"
    if (!user || !password) {
      setToast({ open: true, msg: "Preencha usuário e senha.", severity: "warning" });
      return;
    }
    setIsAuthed(true);
  };

  if (!isAuthed) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
        <Paper elevation={3} sx={{ p: 4, width: 380, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          <TextField label="Usuário" variant="outlined" fullWidth margin="normal" value={user} onChange={(e) => setUser(e.target.value)} />

          <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
            Entrar
          </Button>
        </Paper>
      </Box>
    );
  }

  return <PeopleManager showToast={(msg, severity = "success") => setToast({ open: true, msg, severity })} onCloseToast={() => setToast((t) => ({ ...t, open: false }))} toast={toast} />;
}

function PeopleManager({ showToast, onCloseToast, toast }) {
  const LS_KEY = "people";
  const [people, setPeople] = useState([]);
  const [filter, setFilter] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "" });
  const isEdit = Boolean(editingId);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPeople(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(people));
    } catch (e) {
      console.error(e);
    }
  }, [people]);

  const filtered = useMemo(() => filterPeople(people, filter), [people, filter]);

  function openAdd() {
    setEditingId(null);
    setForm({ name: "", age: "", phone: "" });
    setOpen(true);
  }

  function openEdit(p) {
    setEditingId(p.id);
    setForm({ name: p.name || "", age: String(p.age ?? ""), phone: p.phone || "" });
    setOpen(true);
  }

  function handleDelete(id) {
    if (!confirm("Remover esta pessoa?")) return;
    setPeople((prev) => deletePerson(prev, id));
    showToast("Pessoa removida");
  }

  function saveForm() {
    // valida e salva (add/edit)
    if (isEdit) {
      try {
        setPeople((prev) => editPerson(prev, editingId, form));
        showToast("Pessoa atualizada");
      } catch (e) {
        showToast("Verifique nome, idade (0-130) e telefone.", "warning");
        return;
      }
    } else {
      try {
        setPeople((prev) => addPerson(prev, form));
        showToast("Pessoa adicionada");
      } catch (e) {
        showToast("Verifique nome, idade (0-130) e telefone.", "warning");
        return;
      }
    }
    setOpen(false);
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <Box maxWidth={900} mx="auto">
        <Paper sx={{ p: 3, borderRadius: 3, mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
            <Typography variant="h5" sx={{ flex: 1 }}>
              Pessoas
            </Typography>
            <TextField
              size="small"
              placeholder="Pesquisar por nome, idade, telefone"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
           <Button
     variant="contained"
      startIcon={<AddIcon />}
     onClick={openAdd}
>
Adicionar
      </Button>

          </Stack>
        </Paper>

        <Paper sx={{ p: 0, borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Idade</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Nenhuma pessoa cadastrada.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(p)} aria-label="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p.id)} aria-label="Remover">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Modal de adicionar/editar */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Editar pessoa" : "Adicionar pessoa"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nome"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <TextField
              label="Idade"
              type="number"
              inputProps={{ min: 0, max: 130 }}
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            />
            <TextField
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveForm}>
            {isEdit ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={onCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

// --------------------------------
// Testes rápidos (dev) — não alteram UI
// Executados apenas no browser em dev. Usamos console.assert.
// --------------------------------
function runTests() {
  try {
    // uid deve gerar strings únicas
    const a = uid();
    const b = uid();
    console.assert(a !== b, "uid deve ser único");

    // validatePerson
    console.assert(validatePerson({ name: "Ana", age: 20, phone: "99999999" }).ok, "validate ok deveria ser true");
    console.assert(!validatePerson({ name: "A", age: 20, phone: "99999999" }).ok, "nome curto deveria falhar");
    console.assert(!validatePerson({ name: "Ana", age: -1, phone: "99999999" }).ok, "idade negativa deveria falhar");
    console.assert(!validatePerson({ name: "Ana", age: 200, phone: "99999999" }).ok, "idade > 130 deveria falhar");
    console.assert(!validatePerson({ name: "Ana", age: 20, phone: "123" }).ok, "telefone curto deveria falhar");

    // add/edit/delete
    let list = [];
    list = addPerson(list, { name: "Carlos", age: 30, phone: "11999998888" });
    console.assert(list.length === 1 && list[0].name === "Carlos", "addPerson deve inserir");

    const id = list[0].id;
    list = editPerson(list, id, { name: "Carlos Silva", age: 31, phone: "11911112222" });
    console.assert(list[0].name === "Carlos Silva" && list[0].age === 31, "editPerson deve atualizar");

    list = deletePerson(list, id);
    console.assert(list.length === 0, "deletePerson deve remover");

    // filterPeople
    list = [
      { id: "1", name: "Ana", age: 22, phone: "11111111" },
      { id: "2", name: "Bruno", age: 25, phone: "22222222" },
      { id: "3", name: "Carla", age: 30, phone: "33333333" },
    ];
    let f = filterPeople(list, "bru");
    console.assert(f.length === 1 && f[0].name === "Bruno", "filter deve achar Bruno");
    f = filterPeople(list, "30");
    console.assert(f.length === 1 && f[0].name === "Carla", "filter por idade deve achar Carla");
    f = filterPeople(list, "");
    console.assert(f.length === 3, "filtro vazio retorna todos");

    // Caso passe tudo
    console.info("[TESTES] Todos os testes passaram ✅");
  } catch (err) {
    console.error("[TESTES] Falhou:", err);
  }
}

if (typeof window !== "undefined") {
  // Executa após pequeno atraso para não bloquear a renderização
  setTimeout(runTests, 0);
}