import React from "react";
import OrdersTable from "../components/OrdersTable";
import CustomerSearch from "../components/CustomerSearch";
import SalesDocumentForm from "../components/ui/SalesDocumentForm";

function Dashboard() {
  return (
    <div>
      <CustomerSearch />
      {/* <SalesDocumentForm /> */}
      <OrdersTable />
    </div>
  );
}

export default Dashboard;
