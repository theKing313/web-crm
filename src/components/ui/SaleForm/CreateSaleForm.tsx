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
  Divider,
  CircularProgress,
  Paper,
  styled,
  TableContainer,
} from "@mui/material";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchContractors,
  fetchOrganizations,
  fetchPboxes,
  fetchProducts,
  fetchWarehouses,
} from "../../../api";
import { CustomArrowDropDownIcon } from "../Circular/CircularProgress";
import { CustomDataIcon } from "../Data/Data";
import styles from "./index.module.scss";
import ProductSelectModal from "../../OrdersTable";
interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  qty: number;
  unit_name?: string;
}
interface SearchResultI {
  result: Array<{
    id: number;
    name: string;
    price: number;
    discount: number;
    qty: number;
    unit_name?: string;
  }>;
  count: number;
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
      paid,
      conduct,
    };
    console.log("SUBMIT >>>", payload);
    // тут вызов API POST
  };

  // 🔹 Search
  // 🔹 Search Products

  // 🔹 Обработчики

  const handleRemoveProduct = (id: number) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const {
    data: searchResults = { result: [], count: 0 },
    //  data: searchResults = []
    isLoading: isProductsLoading,
  } = useQuery<SearchResultI, Error>({
    queryKey: ["products", { search: debouncedSearch, limit: 20 }],
    queryFn: async ({ queryKey }) => {
      const [, info] = queryKey as [string, { search: string; limit: number }];
      const response = await fetchProducts({
        token: searchToken,
        name: info.search,
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
    const product = searchResults.result.find((p) => p.name === productName);
    if (product) {
      setCartProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit_name: product.unit_name,
          discount: 0,
          qty: 1,
        },
      ]);
      setSearchQuery(""); // очистить строку после выбора
    }
  };
  //
  const updateProductInCart = (id: number, updatedFields: Partial<Product>) => {
    setCartProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };
  const handlePriceChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const price = parseFloat(e.target.value) || 0;
    updateProductInCart(id, { price });
  };

  const handleDiscountChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const discount = parseFloat(e.target.value) || 0;
    updateProductInCart(id, { discount });
  };

  const handleQtyChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const qty = parseInt(e.target.value) || 1;
    updateProductInCart(id, { qty });
  };
  const total = cartProducts.reduce(
    (sum, p) => sum + (p.price - p.discount) * p.qty,
    0
  );
  // 🔹 UI
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleSelectFromModal = (product: Product) => {
    setCartProducts((prev) => [...prev, product]);
    setIsProductModalOpen(false);
  };
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
              <Button
                variant="contained"
                onClick={() => setIsProductModalOpen(true)}
              >
                Выбрать
              </Button>

              {/* Search */}
              {/* {JSON.stringify(searchResults)} */}
              <Autocomplete
                // disablePortal
                value={searchQuery}
                onInputChange={handleSearchChange}
                onChange={(_, val) => handleSelectProduct(val)}
                options={
                  searchResults?.result?.map((p: Product) => p.name) || []
                }
                // options={searchResults.map((p: any) => p.name) || []}
                loading={isProductsLoading}
                sx={{ width: "100%", height: "100%", bottom: "0" }}
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

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Скидка</TableCell>
                    <TableCell>Кол-во</TableCell>
                    <TableCell>Ед.</TableCell>
                    <TableCell>Итого</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cartProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{
                          py: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Typography>Нет данных</Typography>
                        <CustomDataIcon></CustomDataIcon>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cartProducts.map((p) => {
                      const total =
                        ((p.price || 0) - (p.discount || 0)) * (p.qty || 1);
                      return (
                        <TableRow
                          key={p.id}
                          sx={{ borderRadius: 2, bgcolor: "#f9fafb", mb: 1 }}
                        >
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              maxWidth: 200,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </TableCell>

                          <TableCell sx={{ borderBottom: "none", width: 120 }}>
                            <TextField
                              size="small"
                              type="number"
                              variant="outlined"
                              value={p.price}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handlePriceChange(p.id, e)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>

                          <TableCell sx={{ borderBottom: "none", width: 120 }}>
                            <TextField
                              size="small"
                              type="number"
                              variant="outlined"
                              value={p.discount}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleDiscountChange(p.id, e)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>

                          <TableCell sx={{ borderBottom: "none", width: 120 }}>
                            <TextField
                              size="small"
                              type="number"
                              variant="outlined"
                              value={p.qty}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleQtyChange(p.id, e)}
                              inputProps={{ min: 1, step: 1 }}
                            />
                          </TableCell>

                          <TableCell sx={{ borderBottom: "none", width: 120 }}>
                            {p.unit_name ?? "шт"}
                          </TableCell>

                          <TableCell
                            sx={{
                              borderBottom: "none",
                              width: 100,
                              fontWeight: "bold",
                            }}
                          >
                            {total.toFixed(2)}
                          </TableCell>

                          <TableCell
                            sx={{
                              borderBottom: "none",
                              textAlign: "center",
                              width: 100,
                            }}
                          >
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveProduct(p.id)}
                              sx={{ textTransform: "none" }}
                            >
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography sx={{ mt: 1 }}>
              <b>
                Итого: {Number.isFinite(total) ? total.toFixed(2) : "0.00"} ₽
              </b>
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
        {/* <OrdersTable></OrdersTable> */}
        {/* <SalesDocumentForm isOpen={true} /> */}

        <ProductSelectModal
          isOpen={isProductModalOpen}
          token={searchToken}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectFromModal}
        />
      </Box>
    </>
  );
}
