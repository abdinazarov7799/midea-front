import React, {lazy, Suspense} from "react";
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

const TranslationPage = lazy(() => import("../modules/translations/pages/TranslationPage.jsx"));
const ConstantsPage = lazy(() => import("../modules/constants/pages/ConstantsPage.jsx"));
const WarehousesPage = lazy(() => import("../modules/warehouses/WarehousesPage.jsx"));
const WarehouseWorkersContainer = lazy(() => import("../modules/warehouse-workers/WarehouseWorkersContainer.jsx"));
const WarehouseSectionsPage = lazy(() => import("../modules/warehouse-sections/WarehouseSectionsPage.jsx"));
const TeamLeadsPage = lazy(() => import("../modules/team-leads/TeamLeadsPage.jsx"));
const CategoriesPage = lazy(() => import("../modules/categories/CategoriesPage.jsx"));
const ProductsPage = lazy(() => import("../modules/products/ProductsPage.jsx"));
const ManagersPage = lazy(() => import("../modules/managers/ManagersPage.jsx"));
const DealersPage = lazy(() => import("../modules/dealers/DealersPage.jsx"));
const CouriersPage = lazy(() => import("../modules/couriers/CouriersPage.jsx"));
const ClientsPage = lazy(() => import("../modules/clients/ClientsPage.jsx"));
const OrdersPage = lazy(() => import("../modules/orders/OrdersPage.jsx"));
const StockMovementsPage = lazy(() => import("../modules/stocks-movements/StockMovementsPage.jsx"));
const PaymentsPage = lazy(() => import("../modules/payments/PaymentsPage.jsx"));
const AccrualsPage = lazy(() => import("../modules/accruals/AccrualsPage.jsx"));
const InventoryPage = lazy(() => import("../modules/inventory/InventoryPage.jsx"));
const InventoryViewPage = lazy(() => import("../modules/inventory/view/InventoryViewPage.jsx"));
const InventoryV2Page = lazy(() => import("../modules/inventoryV2/InventoryV2Page.jsx"));
const RolesPage = lazy(() => import("../modules/roles/pages/RolesPage.jsx"));
const AdminsPage = lazy(() => import("../modules/admins/AdminsPage.jsx"));

const CreateOrderPage = lazy(() => import("../modules/tg-web-app/CreateOrderPage.jsx"));
const CreateClientPage = lazy(() => import("../modules/tg-web-app/CreateClientPage.jsx"));
const AddStockPage = lazy(() => import("../modules/tg-web-app/AddStockPage.jsx"));
const ReturnedOrderPage = lazy(() => import("../modules/tg-web-app/ReturnedOrderPage.jsx"));
const ReturnedOrderViewPage = lazy(() => import("../modules/tg-web-app/ReturnedOrderViewPage.jsx"));
const WareHouseSendItemPage = lazy(() => import("../modules/tg-web-app/WareHouseSendItemPage.jsx"));
const WarehouseSendItemViewPage = lazy(() => import("../modules/tg-web-app/WarehouseSendItemViewPage.jsx"));
const WarehouseTransferPage = lazy(() => import("../modules/tg-web-app/WarehouseTransferPage.jsx"));
const WarehouseTransferFormPage = lazy(() => import("../modules/tg-web-app/WarehouseTransferFormPage.jsx"));
const ViewStocks = lazy(() => import("../modules/tg-web-app/ViewStocks.jsx"));
const BotOrdersPage = lazy(() => import("../modules/tg-web-app/BotOrders.jsx"));
const ViewOrdersPage = lazy(() => import("../modules/tg-web-app/ViewOrders.jsx"));
const VWOrdersPage = lazy(() => import("../modules/tg-web-app/VWOrders.jsx"));
const ViewVWOrdersPage = lazy(() => import("../modules/tg-web-app/ViewVWOrders.jsx"));
const CourierOrdersPage = lazy(() => import("../modules/tg-web-app/CourierOrders.jsx"));
const CourierOrderViewPage = lazy(() => import("../modules/tg-web-app/CourierOrderViewPage.jsx"));
const PaymentListScreen = lazy(() => import("../modules/tg-web-app/PaymentListScreen.jsx"));
const PaymentConfirmScreen = lazy(() => import("../modules/tg-web-app/PaymentConfirmScreen.jsx"));
const BalanceScreen = lazy(() => import("../modules/tg-web-app/BalanceScreen.jsx"));
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
              <Route path={"/inventories-v2"} element={<InventoryV2Page />}/>
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
