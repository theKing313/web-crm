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
  createDocsSales,
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
  const handleSubmit = async (conduct: boolean) => {
    const payload = [
      {
        number: "", // строка
        dated: Date.now(), // unix в мс, как int64
        operation: "Заказ",
        tags: "",
        parent_docs_sales: 0,
        comment: "",
        client: 0,
        contragent: 0,
        contract: 0,
        organization: 0,
        loyality_card_id: 0,
        warehouse: 0,
        paybox: 0,
        tax_included: true,
        tax_active: true,
        settings: {
          repeatability_period: "minutes",
          repeatability_value: 0,
          date_next_created: 0,
          transfer_from_weekends: true,
          skip_current_month: true,
          repeatability_count: 0,
          default_payment_status: false,
          repeatability_tags: false,
          repeatability_status: true,
        },
        sales_manager: 0,
        paid_rubles: paid || 0,
        paid_lt: 0,
        status: true,
        goods: cartProducts.map((p) => ({
          price_type:
            priceTypes.indexOf(priceType ?? "") >= 0
              ? priceTypes.indexOf(priceType ?? "")
              : 0,
          price: p.price ?? 0,
          quantity: p.qty ?? 1,
          unit: 0, // ID единицы измерения
          unit_name: p.unit_name || "шт", // строка
          tax: 0,
          discount: p.discount ?? 0,
          sum_discounted: ((p.price ?? 0) - (p.discount ?? 0)) * (p.qty ?? 1),
          status: "string", // <-- лучше "string", чтобы совпало с их схемой
          nomenclature: String(p.id), // строка
          nomenclature_name: p.name ?? "",
        })),
        priority: 10,
      },
    ];

    try {
      const response = await createDocsSales({
        token: searchToken,
        data: payload,
      });

      if (response) {
        console.log("Документ успешно создан:", response);
        alert("Документ создан");
        window.location.reload();
      } else {
        console.error("Ошибка создания документа:", response);
      }
    } catch (error) {
      console.error("Сетевая ошибка:", error);
    }
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

            <TableContainer sx={{ overflowX: "hidden" }}>
              <Table size="small" sx={{ minWidth: { xs: "100%", sm: 700 } }}>
                {/* Заголовки скрываем на мобилке */}
                <TableHead
                  sx={{ display: { xs: "none", sm: "table-header-group" } }}
                >
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
                      <TableCell colSpan={7} align="center">
                        <Typography>Нет данных</Typography>
                        <CustomDataIcon />
                      </TableCell>
                    </TableRow>
                  ) : (
                    cartProducts.map((p) => {
                      const total =
                        ((p.price || 0) - (p.discount || 0)) * (p.qty || 1);
                      return (
                        <TableRow
                          key={p.id}
                          sx={{
                            display: { xs: "block", sm: "table-row" },
                            mb: { xs: 2, sm: 0 },
                            p: { xs: 2, sm: 0 },
                            borderRadius: 2,
                            bgcolor: "#f9fafb",
                          }}
                        >
                          {/* Название */}
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "block", sm: "table-cell" },
                              fontWeight: "bold",
                            }}
                          >
                            {p.name}
                          </TableCell>

                          {/* Для мобилки — блок с полями */}
                          <Box
                            sx={{
                              display: { xs: "flex", sm: "none" },
                              flexDirection: "column",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <TextField
                              label="Цена"
                              size="small"
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceChange(p.id, e)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                            <TextField
                              label="Скидка"
                              size="small"
                              type="number"
                              value={p.discount}
                              onChange={(e) => handleDiscountChange(p.id, e)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                            <TextField
                              label="Кол-во"
                              size="small"
                              type="number"
                              value={p.qty}
                              onChange={(e) => handleQtyChange(p.id, e)}
                              inputProps={{ min: 1, step: 1 }}
                            />
                            <Typography variant="body2">
                              Ед.: {p.unit_name ?? "шт"}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              Итого: {total.toFixed(2)} ₽
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveProduct(p.id)}
                            >
                              Удалить
                            </Button>
                          </Box>

                          {/* Для десктопа — обычные ячейки */}
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            <TextField
                              size="small"
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceChange(p.id, e)}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            <TextField
                              size="small"
                              type="number"
                              value={p.discount}
                              onChange={(e) => handleDiscountChange(p.id, e)}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            <TextField
                              size="small"
                              type="number"
                              value={p.qty}
                              onChange={(e) => handleQtyChange(p.id, e)}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            {p.unit_name ?? "шт"}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            {total.toFixed(2)}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "none",
                              display: { xs: "none", sm: "table-cell" },
                            }}
                          >
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveProduct(p.id)}
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
