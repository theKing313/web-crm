import Cookies from "js-cookie";

export const fetchCustomerByPhone = async () => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}&phone=${phone}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};

// Todo: add create customer api function
export const apiCreateCustomer = async ({ name, phone }) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/customers/?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};

export const apiCreateAnnouncement = async (saleData) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};
//
//Todo:  Fetch functions for contractors, accounts, warehouses, organizations
export const fetchContractors = async (query) => {
  try {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/contragents/?token=${query.token}&limit=${query.limit}&offset=0&sort=created_at%3Adesc&add_tags=false&phone=${query?.phone}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchWarehouses = async (query) => {
  try {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/warehouses/?token=${query.token}&limit=${query.limit}&offset=0`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};
export const fetchOrganizations = async (query) => {
  try {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/organizations/?token=${query.token}&limit=${query.limit}&offset=0`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const fetchPboxes = async (query) => {
  try {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/payboxes/?token=${query.token}&limit=${query.limit}&offset=0&sort=created_at%3Adesc`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const fetchProducts = async (query) => {
  try {
    // alert(JSON.stringify(query));
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/nomenclature/?token=${query.token}&name=${query.name}&limit=${query.limit}&offset=0&with_prices=false&with_balance=false&with_attributes=false&only_main_from_group=false`
    );
    // `https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77&name=%D0%B0%D0%B1&limit=100&offset=0&with_prices=false&with_balance=false&with_attributes=false&only_main_from_group=false`
    const data = await response.json();
    // alert(JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};
export const fetchAllProducts = async (query) => {
  try {
    // alert(JSON.stringify(query));
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/nomenclature/?token=${query.token}&limit=${query.limit}&offset=0&with_prices=false&with_balance=false&with_attributes=false&only_main_from_group=false`
    );
    // `https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77&name=%D0%B0%D0%B1&limit=100&offset=0&with_prices=false&with_balance=false&with_attributes=false&only_main_from_group=false`
    const data = await response.json();
    // alert(JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const createDocsSales = async ({ token, data }) => {
  // http://localhost:5173/app.tablecrm.com/api/v1/docs_sales/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77&generate_out=true
  //app.tablecrm.com/api/v1/docs_sales/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77&generate_out=true
  // alert(token);
  // alert(data);/
  // https: fetch("https://app.tablecrm.com/api/v1/sales", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`, // если нужен токен авторизации
  //   },
  //   body: JSON.stringify(payload),
  // });
  console.log(JSON.stringify(data));
  // alert(JSON.stringify(data));
  // localStorage.setItem(JSON.stringify(data));
  try {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}&generate_out=true`,
      {
        method: "POST",
        headers: {
          // "accept": "application/json",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // если нужен токен авторизации
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    // alert(data);
    return responseData;
  } catch (error) {
    alert(error);
    throw new Error("Network response was not ok");
  }
};
