import Cookies from "js-cookie";
// export const fetchTables = async (token) => {
//   const tokenCookie = Cookies.get("token");

//   if (tokenCookie) {
//     const response = await fetch(
//       `https://app.tablecrm.com/api/v1/docs_sales/?token=${tokenCookie}`
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   } else {
//     const response = await fetch(
//       `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   }
// };
export const fetchTables = async (query) => {
  if (query) {
    // const response = await fetch(
    //   `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`
    // );
    console.log(query);
    // const data = await fetchContractors(query);
    // const data = await fetchWarehouses(query);
    // const data = await fetchOrganizations(query);
    // Promise.all();
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    return data;
  }
};

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
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/products/?token=${query.token}&limit=${query.limit}&offset=0&search=${query.search}&sort=created_at%3Adesc`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};
