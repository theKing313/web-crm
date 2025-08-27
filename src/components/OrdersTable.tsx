import { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Grow,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "../api"; // <-- твой api метод

interface Category {
  id: number;
  name: string;
  count: number;
  children?: Category[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  qty: number;
  stock?: number;
  unit_name?: string;
}

interface ProductSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  token: string;
}

const categories: Category[] = [
  { id: 1, name: "Ингредиенты", count: 1015 },
  { id: 2, name: "Блюда", count: 436 },
  { id: 3, name: "Полуфабрикаты", count: 10 },
];

export default function ProductSelectModal({
  isOpen,
  onClose,
  onSelect,
  token,
}: ProductSelectModalProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allProducts", token],
    queryFn: () => fetchAllProducts({ token, limit: 100 }), // <- твой API
    enabled: isOpen && !!token,
  });

  const products = data?.result || [];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grow in={isOpen} timeout={300}>
        <Box
          sx={{
            width: "90vw",
            maxWidth: 1200,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 0,
            outline: "none",
            display: "flex",
            flexDirection: "row",
            position: "relative", // нужно для позиционирования крестика
          }}
        >
          {/* 🔹 Кнопка закрытия */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 8,
              color: "grey.600",
              zIndex: 10000000,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Левая колонка */}
          <Box sx={{ width: 250, borderRight: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
              Выбор номенклатуры
            </Typography>
            <Divider />
            <List>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat.id}
                  selected={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <ListItemText
                    primary={`${cat.name} (${cat.count})`}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Правая колонка */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Наименование</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Остатки</TableCell>
                    <TableCell>Единица</TableCell>
                    <TableCell>Действие</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p: Product) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.price ?? "—"}</TableCell>
                        <TableCell>{p.stock ?? "—"}</TableCell>
                        <TableCell>{p.unit_name ?? "шт"}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() =>
                              onSelect({
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                discount: 0,
                                qty: 1,
                              })
                            }
                          >
                            Выбрать
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}
