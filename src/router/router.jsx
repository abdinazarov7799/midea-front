import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import OverlayLoader from "../components/OverlayLoader.jsx";
import TranslationPage from "../modules/translations/pages/TranslationPage.jsx";
import ConstantsPage from "../modules/constants/pages/ConstantsPage.jsx";
import WarehousesPage from "../modules/warehouses/WarehousesPage.jsx";
import WarehouseWorkersContainer from "../modules/warehouse-workers/WarehouseWorkersContainer.jsx";
import WarehouseSectionsPage from "../modules/warehouse-sections/WarehouseSectionsPage.jsx";
import TeamLeadsPage from "../modules/team-leads/TeamLeadsPage.jsx";
import CategoriesPage from "../modules/categories/CategoriesPage.jsx";
import ProductsPage from "../modules/products/ProductsPage.jsx";
import ManagersPage from "../modules/managers/ManagersPage.jsx";
import DealersPage from "../modules/dealers/DealersPage.jsx";
import CouriersPage from "../modules/couriers/CouriersPage.jsx";
import ClientsPage from "../modules/clients/ClientsPage.jsx";

import CreateOrderPage from "../modules/tg-web-app/CreateOrderPage.jsx";
import CreateClientPage from "../modules/tg-web-app/CreateClientPage.jsx";
import AddStockPage from "../modules/tg-web-app/AddStockPage.jsx";
import ReturnedOrderViewPage from "../modules/tg-web-app/ReturnedOrderViewPage.jsx";
import ReturnedOrderPage from "../modules/tg-web-app/ReturnedOrderPage.jsx";
import WareHouseSendItemPage from "../modules/tg-web-app/WareHouseSendItemPage.jsx";
import WarehouseSendItemViewPage from "../modules/tg-web-app/WarehouseSendItemViewPage.jsx";
import OrdersPage from "../modules/orders/OrdersPage.jsx";
import StockMovementsPage from "../modules/stocks-movements/StockMovementsPage.jsx";
import PaymentsPage from "../modules/payments/PaymentsPage.jsx";
import AccrualsPage from "../modules/accruals/AccrualsPage.jsx";
import WarehouseTransferPage from "../modules/tg-web-app/WarehouseTransferPage.jsx";
import WarehouseTransferFormPage from "../modules/tg-web-app/WarehouseTransferFormPage.jsx";
import CourierOrdersPage from "../modules/tg-web-app/CourierOrders.jsx";
import CourierOrderViewPage from "../modules/tg-web-app/CourierOrderViewPage.jsx";
import InventoryPage from "../modules/inventory/InventoryPage.jsx";
import BalanceScreen from "../modules/tg-web-app/BalanceScreen.jsx";
import PaymentListScreen from "../modules/tg-web-app/PaymentListScreen.jsx";
import PaymentConfirmScreen from "../modules/tg-web-app/PaymentConfirmScreen.jsx";
import InventoryViewPage from "../modules/inventory/view/InventoryViewPage.jsx";
import RolesPage from "../modules/roles/pages/RolesPage.jsx";
import VWOrdersPage from "../modules/tg-web-app/VWOrders.jsx";
import ViewVWOrdersPage from "../modules/tg-web-app/ViewVWOrders.jsx";
import ViewStocks from "../modules/tg-web-app/ViewStocks.jsx";
import AdminsPage from "../modules/admins/AdminsPage.jsx";
import ViewOrdersPage from "../modules/tg-web-app/ViewOrders.jsx";
import BotOrdersPage from "../modules/tg-web-app/BotOrders.jsx";
// PAGES


const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route path={"/categories"} element={<CategoriesPage />}/>
              <Route path={"/products"} element={<ProductsPage />}/>
              <Route path={"/warehouses"} element={<WarehousesPage />}/>
              <Route path={"/warehouse-workers"} element={<WarehouseWorkersContainer />}/>
              <Route path={"/warehouse-sections"} element={<WarehouseSectionsPage />}/>
              <Route path={"/team-leads"} element={<TeamLeadsPage />}/>
              <Route path={"/managers"} element={<ManagersPage />}/>
              <Route path={"/dealers"} element={<DealersPage />}/>
              <Route path={"/couriers"} element={<CouriersPage />}/>
              <Route path={"/clients"} element={<ClientsPage />}/>
              <Route path={"/translations"} element={<TranslationPage />}/>
              <Route path={"/constants"} element={<ConstantsPage />}/>
              <Route path={"/orders"} element={<OrdersPage />}/>
              <Route path={"/stock-movements"} element={<StockMovementsPage />}/>
              <Route path={"/payments"} element={<PaymentsPage />}/>
              <Route path={"/accruals"} element={<AccrualsPage />}/>
              <Route path={"/roles"} element={<RolesPage />}/>
              <Route path={"/inventories"} element={<InventoryPage />}/>
              <Route path={"/admins"} element={<AdminsPage />}/>
              <Route path={"/inventory/:id"} element={<InventoryViewPage />}/>
              <Route path={"auth/*"} element={<Navigate to={"/categories"} replace />}/>
              <Route path={"/"} element={<Navigate to={"/categories"} replace />}/>
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"/create-order-form/:roleId/:userId/:dealerId"} element={<CreateOrderPage />}/>
            <Route path={"/create-client-form/:roleId/:userId"} element={<CreateClientPage />}/>
            <Route path={"/add-stock/:roleId/:userId"} element={<AddStockPage />}/>
            <Route path={"/returned-order/:roleId/:userId"} element={<ReturnedOrderPage />}/>
            <Route path={"/returned-order-view/:id/:userId/:roleId"} element={<ReturnedOrderViewPage />} />

            <Route path={"/warehouse-send-item/:roleId/:userId"} element={<WareHouseSendItemPage />}/>
            <Route path={"/warehouse-send-item-view/:id/:roleId/:userId"} element={<WarehouseSendItemViewPage />}/>
            <Route path={"/warehouse-transfers/:roleId/:userId"} element={<WarehouseTransferPage />}/>
            <Route path={"/warehouse-transfers-form/:roleId/:userId"} element={<WarehouseTransferFormPage />}/>

            <Route path={"/view-stocks/:roleId/:userId/:dealerId"} element={<ViewStocks />}/>

            <Route path={"/view-orders/:roleId/:userId"} element={<BotOrdersPage />}/>
            <Route path={"/view-order/:id/:roleId/:userId"} element={<ViewOrdersPage />}/>
            <Route path={"/view-warehouse-worker-orders/:roleId/:userId"} element={<VWOrdersPage />}/>
            <Route path={"/view-vw-order/:id/:roleId/:userId"} element={<ViewVWOrdersPage />}/>

            <Route path={"/view-courier-orders/:roleId/:userId"} element={<CourierOrdersPage />}/>
            <Route path={"/view-courier-order/:id/:roleId/:userId"} element={<CourierOrderViewPage />}/>

            <Route path={"/view-payment-history/:roleId/:userId"} element={<PaymentListScreen />}/>
            <Route path={"/view-payment-confirm/:id/:roleId/:userId"} element={<PaymentConfirmScreen />}/>
            <Route path={"/view-balance/:roleId/:userId"} element={<BalanceScreen />}/>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
