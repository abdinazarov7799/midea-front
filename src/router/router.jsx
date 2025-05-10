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
import UsersPage from "../modules/users/pages/UsersPage.jsx";
import AdminsPage from "../modules/admins/pages/AdminsPage.jsx";
import PharmaciesPage from "../modules/pharmacies/pages/PharmaciesPage.jsx";
import TranslationPage from "../modules/translations/pages/TranslationPage.jsx";
import ConstantsPage from "../modules/constants/pages/ConstantsPage.jsx";
import RegionsPage from "../modules/regions/pages/RegionsPage.jsx";
import DistrictsPage from "../modules/districts/pages/DistrictsPage.jsx";
import MedicinesPage from "../modules/medicines/pages/MedicinesPage.jsx";
import VisitsPage from "../modules/visits/pages/VisitsPage.jsx";
import MedInstitutionsPage from "../modules/med-institutions/pages/MedInstitutionsPage.jsx";
import StocksPage from "../modules/stocks/pages/StocksPage.jsx";
import DoctorsPage from "../modules/doctors/pages/DoctorsPage.jsx";
// PAGES


const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route path={"/regions"} element={<RegionsPage />}/>
              <Route path={"/districts"} element={<DistrictsPage />}/>
              <Route path={"/medicines"} element={<MedicinesPage />}/>
              <Route path={"/visits"} element={<VisitsPage />}/>
              <Route path={"/stocks"} element={<StocksPage />}/>
              <Route path={"/doctors"} element={<DoctorsPage />}/>
              <Route path={"/users"} element={<UsersPage />}/>
              <Route path={"/med-institutions"} element={<MedInstitutionsPage />}/>
              <Route path={"/admins"} element={<AdminsPage />}/>
              <Route path={"/pharmacies"} element={<PharmaciesPage />}/>
              <Route path={"/translations"} element={<TranslationPage />}/>
              <Route path={"/constants"} element={<ConstantsPage />}/>
              <Route path={"auth/*"} element={<Navigate to={"/users"} replace />}/>
              <Route path={"/"} element={<Navigate to={"/users"} replace />}/>
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
