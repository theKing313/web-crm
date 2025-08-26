import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchContractors,
  fetchOrganizations,
  fetchPboxes,
  fetchProducts,
  fetchWarehouses,
} from "../../../api";
import { CustomArrowDropDownIcon } from "../CircularProgress";
import { CustomDataIcon } from "../Data/Data";
import styles from "./index.module.scss";

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  qty: number;
}

export default function CreateSaleForm() {
  const CustomPaper = styled(Paper)({
    borderRadius: 4,
    animation: "fadeIn 0.3s ease",
  });

  // 🔹 State
  const [token, setToken] = useState("");
  const searchToken = useDebounce(token, 500);

  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<string | null>(null);
  const [account] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);
  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [priceType, setPriceType] = useState<string | null>(null);
  const [pbox, setPbox] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [paid, setPaid] = useState(0);

  const priceTypes = ["Розница", "Опт"];

  // 🔹 Запросы
  const queries = useQueries({
    queries: [
      {
        queryKey: ["contractors", searchToken, phone],
        queryFn: () =>
          fetchContractors({ token: searchToken, limit: 100, phone }),
        enabled: !!searchToken || !!phone,
      },
      {
        queryKey: ["warehouses", searchToken],
        queryFn: () => fetchWarehouses({ token: searchToken, limit: 100 }),
        enabled: !!searchToken,
      },
      {
        queryKey: ["organizations", searchToken],
        queryFn: () => fetchOrganizations({ token: searchToken, limit: 100 }),
        enabled: !!searchToken,
      },
      {
        queryKey: ["pboxes", searchToken],
        queryFn: () => fetchPboxes({ token: searchToken, limit: 100 }),
        enabled: !!searchToken,
      },
    ],
  });

  const contractorsData = queries[0].data?.result || [];
  const warehousesData = queries[1].data?.result || [];
  const organizationsData = queries[2].data?.result || [];
  const pboxesData = queries[3].data?.result || [];

  const isLoading = queries.some((q) => q.isLoading);

  // 🔹 Обработчики
  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      { id: Date.now(), name: "Товар тест", price: 100, discount: 0, qty: 1 },
    ]);
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const total = products.reduce(
    (sum, p) => sum + (p.price - p.discount) * p.qty,
    0
  );

  const handleSubmit = (conduct: boolean) => {
    const payload = {
      token,
      phone,
      customer,
      account,
      organization,
      warehouse,
      priceType,
      pbox,
      products,
      paid,
      conduct,
    };
    console.log("SUBMIT >>>", payload);
    // тут вызов API POST
  };

  // 🔹 Search
  // 🔹 Search Products
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [, setCartProducts] = useState<Product[]>([]);
  const {
    data: searchResults = [], // <-- теперь не "products", а "searchResults"
    isLoading: isProductsLoading,
  } = useQuery<any[], Error>({
    queryKey: ["products", { search: debouncedSearch, limit: 10 }],
    queryFn: async ({ queryKey }) => {
      const [, info] = queryKey as [string, { search: string; limit: number }];
      const response = await fetchProducts({
        search: info.search,
        limit: info.limit,
      });
      return response ?? [];
    },
    enabled: !!debouncedSearch,
  });

  const handleSearchChange = (_: unknown, newValue: string) => {
    setSearchQuery(newValue);
  };

  const handleSelectProduct = (productName: string | null) => {
    if (!productName) return;
    const product = searchResults.find((p) => p.name === productName);
    if (product) {
      setCartProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: 0,
          qty: 1,
        },
      ]);
      setSearchQuery(""); // очистить строку после выбора
    }
  };
  // 🔹 UI
  return (
    <>
      {/* <Box display="flex" justifyContent="center" p={2}>
        <Card sx={{ width: "100%", maxWidth: 800, borderRadius: 2 }}></Card>
      </Box> */}
      <Box className={styles.formContainer}>
        <Card className={styles.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Проведение документа продажи
            </Typography>

            {/* Токен */}
            <TextField
              label="* Токен"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              fullWidth
              size="small"
              margin="normal"
            />

            {/* Клиент */}
            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <TextField
                label="Телефон"
                placeholder="+7 (000) 000-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                fullWidth
              />
              <Button variant="outlined">Найти</Button>
            </Stack>

            <Autocomplete
              value={customer}
              onChange={(_, val) => setCustomer(val)}
              options={contractorsData.map(
                (item: { name: string }) => item.name
              )}
              loading={isLoading}
              PaperComponent={(props) => <CustomPaper {...props} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Контрагент"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading && <CircularProgress size={20} />}
                        <CustomArrowDropDownIcon />
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Реквизиты */}
            <Typography>Реквизиты</Typography>

            <Autocomplete
              value={pbox}
              onChange={(_, val) => setPbox(val)}
              options={pboxesData.map((item: { name: string }) => item.name)}
              loading={isLoading}
              PaperComponent={(props) => <CustomPaper {...props} />}
              renderInput={(params) => (
                <TextField {...params} label="* Счет" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              value={warehouse}
              onChange={(_, val) => setWarehouse(val)}
              options={warehousesData.map(
                (item: { name: string }) => item.name
              )}
              loading={isLoading}
              PaperComponent={(props) => <CustomPaper {...props} />}
              renderInput={(params) => (
                <TextField {...params} label="* Склад" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              value={organization}
              onChange={(_, val) => setOrganization(val)}
              options={organizationsData.map(
                (item: { short_name: string }) => item.short_name
              )}
              loading={isLoading}
              PaperComponent={(props) => <CustomPaper {...props} />}
              renderInput={(params) => (
                <TextField {...params} label="* Организация" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              value={priceType}
              onChange={(_, val) => setPriceType(val)}
              options={priceTypes}
              renderInput={(params) => (
                <TextField {...params} label="Тип цены" size="small" />
              )}
            />

            <Divider sx={{ my: 2 }} />

            {/* Товары */}
            <Typography variant="subtitle1">Товары</Typography>
            <Stack direction="row" spacing={1} my={1}>
              <Button variant="contained" onClick={handleAddProduct}>
                Выбрать
              </Button>

              {/* Search */}
              <Autocomplete
                disablePortal
                value={searchQuery}
                onInputChange={handleSearchChange}
                onChange={(_, val) => handleSelectProduct(val)}
                options={searchResults.map((p: any) => p.name) || []}
                loading={isProductsLoading}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Начните вводить название товара"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isProductsLoading && <CircularProgress size={18} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Stack>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Скидка</TableCell>
                  <TableCell>Кол-во</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                      colSpan={5}
                      align="center"
                    >
                      Нет данных
                      <CustomDataIcon></CustomDataIcon>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.price}</TableCell>
                      <TableCell>{p.discount}</TableCell>
                      <TableCell>{p.qty}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveProduct(p.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Typography sx={{ mt: 1 }}>
              <b>Итого: {total.toFixed(2)} ₽</b>
            </Typography>

            <TextField
              label="Оплачено, ₽"
              type="number"
              size="small"
              value={paid}
              onChange={(e) => setPaid(parseFloat(e.target.value) || 0)}
              fullWidth
              sx={{ mt: 2 }}
            />

            {/* Кнопки */}
            <Stack
              className={styles.buttons}
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              mt={3}
            >
              <Button
                variant="outlined"
                onClick={() => handleSubmit(false)}
                sx={{ minWidth: 120 }}
              >
                Создать
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSubmit(true)}
                sx={{ minWidth: 180 }}
              >
                Создать и провести
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
