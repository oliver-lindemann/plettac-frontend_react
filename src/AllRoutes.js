import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import { Paper } from "@mui/material";
import { isDesktop } from "react-device-detect";

import Login from "./features/auth/Login";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";

import StartPage from "./pages/Home";
import AllPartsPage from "./pages/AllParts";

import { ROLES } from "./config/roles";
import Part from "./features/parts/Part";

import MorePage from "./pages/MorePage";
import CenteredPulseLoader from "./components/loading/CenteredPulseLoader";
import useAuth from "./hooks/auth/useAuth";
import { TOP_NAV_HEIGHT } from "./features/navigation/TopNav";
import Changelog from "./features/changelog/Changelog";
import Redirect from "./features/auth/Redirect";
import { lazyRetry } from "./lazyLoad";

// Lazy Loading

const Feedback = lazy(() => import("./features/settings/Feedback")); // Lazy

const DeliveryNote = lazy(() =>
  import("./features/deliveryNotes/view/DeliveryNote")
); // Lazy
const AllDeliveryNotesPage = lazy(() => import("./pages/AllDeliveryNotes")); // Lazy
const NewDeliveryNote = lazy(() =>
  import("./features/deliveryNotes/NewDeliveryNote")
); // Lazy
const EditDeliveryNote = lazy(() =>
  import("./features/deliveryNotes/EditDeliveryNote")
); // Lazy

const AllInventoriesPage = lazy(() =>
  lazyRetry(() => import("./pages/AllInventories"), "AllInventories")
); // Lazy
const EditInventory = lazy(() =>
  lazyRetry(
    () => import("./features/inventories/EditInventory"),
    "EditInventory"
  )
); // Lazy
const NewInventory = lazy(() =>
  lazyRetry(() => import("./features/inventories/NewInventory"), "NewInventory")
); // Lazy

const AllCustomersPage = lazy(() => import("./pages/AllCustomers")); // Lazy
const EditCustomer = lazy(() => import("./features/customers/EditCustomer")); // Lazy
const NewCustomer = lazy(() => import("./features/customers/NewCustomer")); // Lazy

const ChangelogView = lazy(() => import("./pages/ChangelogView")); // Lazy

const AllRoutes = () => {
  const { user } = useAuth();

  return (
    <Paper
      elevation={0}
      sx={{
        pb: !!user && !isDesktop ? "50px" : 0,
        pl: isDesktop && !!user ? "240px" : 0,
      }}
      style={{ height: `calc(100% - ${TOP_NAV_HEIGHT}px)` }}
    >
      <Suspense fallback={<CenteredPulseLoader />}>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/redirect" element={<Redirect />} />

            <Route element={<RequireAuth allowedRoles={[ROLES.Standard]} />}>
              <Route element={<Changelog />}>
                <Route element={<RequireAuth allowedRoles={[ROLES.Katalog]} />}>
                  <Route path="/parts">
                    <Route index element={<AllPartsPage />} />
                    <Route path=":id" element={<Part />} />
                  </Route>
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLES.Listen]} />}>
                  <Route path="/deliveryNotes">
                    <Route index element={<AllDeliveryNotesPage />} />
                    <Route path=":id" element={<DeliveryNote />} />
                    <Route path="new" element={<NewDeliveryNote />} />
                    <Route path="edit/:id" element={<EditDeliveryNote />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.Lager]} />}>
                  <Route path="/customers">
                    <Route index element={<AllCustomersPage />} />
                    <Route path=":id" element={<EditCustomer />} />
                    <Route path="new" element={<NewCustomer />} />
                  </Route>
                </Route>

                {/* ### INVENTORIES ### */}
                <Route path="/inventories">
                  <Route index element={<AllInventoriesPage />} />
                  <Route path=":id" element={<EditInventory />} />
                  <Route path="new" element={<NewInventory />} />
                </Route>

                <Route path="/more">
                  <Route index element={<MorePage />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="changelog" element={<ChangelogView />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Paper>
  );
};

export default AllRoutes;
