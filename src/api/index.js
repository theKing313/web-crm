import Cookies from "js-cookie";
export const fetchTables = async () => {
  const token = Cookies.get("token");

  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
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
//Todo:  Fetch functions for contractors, accounts, warehouses, organizations
export const fetchContractors = async (query) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/contractors/?token=${token}&search=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};
export const fetchAccounts = async (query) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/accounts/?token=${token}&search=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};
export const fetchWarehouses = async (query) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/warehouses/?token=${token}&search=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};
export const fetchOrganizations = async (query) => {
  const token = Cookies.get("token");
  if (token) {
    const response = await fetch(
      `https://app.tablecrm.com/api/v1/organizations/?token=${token}&search=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
};
