import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Tooltip,
  IconButton,
  Modal,
  Grow,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@mui/material";

import { Fade, Backdrop } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { apiCreateAnnouncement } from "../../api";

import {
  fetchContractors,
  fetchAccounts,
  fetchWarehouses,
  fetchOrganizations,
  apiCreateAnnouncement,
} from "../../api/index";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)!important",
  width: "90vw",
  maxWidth: 1200,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  outline: "none",
  display: "flex",
  flexDirection: "column",
};
const productsColumns = [
  "Название товара",
  "Сумма",
  "Скидка",
  "Количество",
  "Единица",
  "Итого",
  "Действие",
];

const contractorOptions = [
  "Иванов Иван Иванович",
  "ООО Поставщик",
  "ЗАО Партнёр",
  "ИП Сидоров",
];
const accountOptions = [
  "Сбербанк",
  "Второй",
  "Первый",
  "Новый",
  "Тинькофф",
  "Наличные",
  "Счет 1",
  "Счёт 7",
];
const warehouseOptions = ["Главный склад", "Склад №2", "Удалённый склад"];
const organizationOptions = ["ООО Ромашка", "ООО Василёк", "АО Пример"];
export default function SalesDocumentForm({ isOpen, onClose, saleData }) {
  const [organization, setOrganization] = useState("Тест");
  const [priority, setPriority] = useState("");
  const [priceType, setPriceType] = useState("Тестовый вид цены");
  const priceTypes = ["Тестовый вид цены", "Тип 2", "Тип 3"];

  //States for form fields
  const [contractor, setContractor] = useState(null);
  const [contractorInput, setContractorInput] = useState("");
  const [account, setAccount] = useState(null);
  const [accountInput, setAccountInput] = useState("");

  const [warehouse, setWarehouse] = useState(null);
  const [warehouseInput, setWarehouseInput] = useState("");

  const [organizationInput, setOrganizationInput] = useState("");

  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Todo Запросы данных из API
  // const { data: contractorsData = [], isLoading: loadingContractors } =
  //   useQuery(["contractors"], fetchContractors);
  // const { data: accountsData = [], isLoading: loadingAccounts } = useQuery(
  //   ["accounts"],
  //   fetchAccounts
  // );
  // const { data: warehousesData = [], isLoading: loadingWarehouses } = useQuery(
  //   ["warehouses"],
  //   fetchWarehouses
  // );
  // const { data: organizationsData = [], isLoading: loadingOrganizations } =
  //   useQuery(["organizations"], fetchOrganizations);

  ////Add form mutation
  const [successMessage, setSuccessMessage] = useState(null);

  const { mutate: addForm, isPending: isLoadingForm } = useMutation({
    mutationKey: ["categories"],
    mutationFn: async (queries = []) => {
      const response = await apiCreateAnnouncement(queries);
      if (!response) {
        throw new Error("Ошибка при отправке данных");
      }
      return response;
    },
    onSuccess: () => {
      setSuccessMessage("Объявление успешно создано!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },
    onError: () => {
      setSuccessMessage(" Ошибка при создании объявления.");
    },
  });

  async function handleSubmit() {
    const messageData = {
      contractor,
      account,
      warehouse,
      organization,
      priority,
      priceType,

      products: [],

      createdAt: new Date().toISOString(),
      status: "draft",
    };
    console.log("Submitting form with data:", messageData);
    // addForm(messageData);
  }

  useEffect(() => {
    if (saleData) {
      setContractor(saleData.contragent_name || null);
      setOrganization(saleData.organization || null);
      setWarehouse(saleData.warehouse || null);
      setPriority(saleData.priority || "");
      setPriceType(saleData.price_type || "Тестовый вид цены");
    }
  }, [saleData]);
  if (!visible) return null;
  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Grow in={isOpen} timeout={300}>
          <Box sx={style}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" component="h2">
                Проведение документа продажи
              </Typography>

              <Box>
                <Tooltip title="Настройка">
                  <IconButton aria-label="settings" size="small" sx={{ mr: 1 }}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Закрыть">
                  <IconButton aria-label="close" size="small" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Box flex={1} display="flex" flexDirection="column" gap={2}>
                <Autocomplete
                  value={contractor}
                  onChange={(event, newValue) => setContractor(newValue)}
                  inputValue={contractorInput}
                  onInputChange={(event, newInputValue) =>
                    setContractorInput(newInputValue)
                  }
                  options={contractorOptions}
                  disablePortal
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Контрагент" size="small" />
                  )}
                  ListboxProps={{
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
                <Autocomplete
                  value={account}
                  onChange={(event, newValue) => setAccount(newValue)}
                  inputValue={accountInput}
                  onInputChange={(event, newInputValue) =>
                    setAccountInput(newInputValue)
                  }
                  options={accountOptions}
                  disablePortal
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Счёт поступления"
                      size="small"
                    />
                  )}
                  ListboxProps={{
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
                <FormControl size="small" fullWidth>
                  <Autocomplete
                    value={warehouse}
                    onChange={(event, newValue) => setWarehouse(newValue)}
                    inputValue={warehouseInput}
                    onInputChange={(event, newInputValue) =>
                      setWarehouseInput(newInputValue)
                    }
                    options={warehouseOptions}
                    disablePortal
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Склад отгрузки"
                        size="small"
                      />
                    )}
                    ListboxProps={{
                      sx: {
                        maxHeight: 200,
                        overflowY: "auto",
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                </FormControl>
                <FormControl size="small" fullWidth>
                  <Autocomplete
                    value={organization}
                    onChange={(event, newValue) => setOrganization(newValue)}
                    inputValue={organizationInput}
                    onInputChange={(event, newInputValue) =>
                      setOrganizationInput(newInputValue)
                    }
                    options={organizationOptions}
                    disablePortal
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Организация" size="small" />
                    )}
                    ListboxProps={{
                      sx: {
                        maxHeight: 200,
                        overflowY: "auto",
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                </FormControl>
                <TextField
                  label="Приоритет"
                  size="small"
                  type="number"
                  inputProps={{ min: 0, max: 10 }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Тип цены</InputLabel>
                  <Select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    label="Тип цены"
                  >
                    {priceTypes.map((pt) => (
                      <MenuItem key={pt} value={pt}>
                        {pt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="outlined" size="small">
                  Доп. параметры
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: 16, height: 16 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h4l3 6 4-12 3 6h4"
                      />
                    </svg>
                  }
                >
                  Доставка
                </Button>
              </Box>

              <Box flex={2}>
                <TextField
                  label="Выбрать контрагента"
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <Button variant="contained" size="small">
                        Выбрать
                      </Button>
                    ),
                  }}
                />
                <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        {productsColumns.map((col) => (
                          <TableCell key={col}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={productsColumns.length}
                          align="center"
                        >
                          Нет данных
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box
                sx={{
                  flexBasis: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  ml: 2,
                }}
              >
                <TextField label="Без скидки" size="small" defaultValue="0" />
                <TextField label="Скидка" size="small" defaultValue="0" />
                <Typography
                  sx={{
                    bgcolor: "#FFE599",
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "#996300",
                  }}
                  textAlign="center"
                >
                  Остаток лояльности: Не выбран контрагент!
                </Typography>
                <TextField label="Итого" size="small" defaultValue="0" />
                <TextField label="Баллами" size="small" />
                <TextField label="Рублями" size="small" />
                <Stack spacing={1} mt={2}>
                  <Stack spacing={1} mt={2}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={isLoadingForm}
                    >
                      Создать и провести
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSubmit}
                      disabled={isLoadingForm}
                    >
                      Только создать
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Grow>
      </Modal>
    </>
  );
}
