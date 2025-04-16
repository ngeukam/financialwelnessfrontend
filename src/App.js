import './App.css';
import Home from './pages/Home';
import Layout from './layout/layout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute';
import { toast, ToastContainer } from 'react-toastify';
import Auth from './pages/Auth';
import store from './redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
// import { Provider } from 'react-redux';
import { fetchSidebar } from './redux/reducer/sidebardata';
import { useEffect, useState } from 'react';
import DynamicForm from './pages/DynamicForm';
import 'react-toastify/dist/ReactToastify.css';
import './style/style.css';
import ManageCategories from './pages/category/ManageCategories';
import ManageProducts from './pages/products/ManageProducts';
import Error404Page from './pages/Error404Page';
// import ManageWarhouse from './pages/warehouse/ManageWarehouse';
import ManageUsers from './pages/users/ManageUsers';
import ManageModuleUrls from './pages/module/ManageModuleUrls';
import CreatePurchaseOrder from './pages/purchaseorder/CreatePurchaseOrder';
import ManagePurchaseOrder from './pages/purchaseorder/ManagePurchaseOrder';
import ManageData from './pages/datamanagement/ManageData';
import Wallet from './pages/Wallet';
import ManageFinance from './pages/financemanagement/ManageFinance';
import CreateGoal from './pages/financemanagement/CreateGoal';
import CreateExpense from './pages/financemanagement/CreateExpense';
import CreateIncome from './pages/financemanagement/CreateIncome';
import useApi from './hooks/APIHandler';

function App() {
  const { status, error, items } = useSelector(state => state.sidebardata);
  const { isLoggedIn } = useSelector(state => state.isLoggedInReducer);
  const dispatch = useDispatch();
  const { callApi } = useApi();
  const GoalsApplyWallet = async () => {
    const response = await callApi({ url: 'personalfinance/goals-apply-wallet/', method: 'POST' });
    if (response?.data?.details?.length > 0) {
      toast.success(response.data?.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // Exécute immédiatement au premier rendu
    GoalsApplyWallet();

    // Puis toutes les 5 minutes (300000 ms)
    const intervalId = setInterval(GoalsApplyWallet, 100000);

    // Nettoyage à la suppression du composant
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  useEffect(() => {
    if (status == 'idle') {
      dispatch(fetchSidebar());
    }
  }, [status, dispatch])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchSidebar());
    }
  }, [isLoggedIn])
  const router = createBrowserRouter(
    [
      { path: "/auth", element: <Auth /> },
      {
        path: "/",
        element: <Layout sidebarList={items} />,
        errorElement: <Layout sidebarList={items} childPage={<Error404Page />} />,
        children: [
          { path: "/", element: <ProtectedRoute element={<Home />} /> },
          { path: "/home", element: <ProtectedRoute element={<Home />} /> },
          { path: "/form/:formName/:id?", element: <ProtectedRoute element={<DynamicForm />} /> },
          { path: "/manage/category", element: <ProtectedRoute element={<ManageCategories />} /> },
          { path: "/pf/manage/finance", element: <ProtectedRoute element={<ManageFinance />} /> },
          { path: "/pf/wallet", element: <ProtectedRoute element={<Wallet />} /> },
          { path: "/manage/product", element: <ProtectedRoute element={<ManageProducts />} /> },
          { path: "/manage/data", element: <ProtectedRoute element={<ManageData />} /> },
          { path: "/manage/users", element: <ProtectedRoute element={<ManageUsers />} /> },
          { path: "/manage/moduleurls", element: <ProtectedRoute element={<ManageModuleUrls />} /> },
          { path: "/create/po", element: <ProtectedRoute element={<CreatePurchaseOrder />} /> },
          { path: "/pf/create/goal", element: <ProtectedRoute element={<CreateGoal />} /> },
          { path: "/pf/create/goal/:id?", element: <ProtectedRoute element={<CreateGoal />} /> },
          { path: "/pf/create/expense", element: <ProtectedRoute element={<CreateExpense />} /> },
          { path: "/pf/create/income", element: <ProtectedRoute element={<CreateIncome />} /> },
          { path: "/pf/create/income/:id?", element: <ProtectedRoute element={<CreateIncome />} /> },
          { path: "/pf/create/expense/:id?", element: <ProtectedRoute element={<CreateExpense />} /> },
          { path: "/create/po/:id?", element: <ProtectedRoute element={<CreatePurchaseOrder />} /> },
          { path: "/manage/purchaseorder", element: <ProtectedRoute element={<ManagePurchaseOrder />} /> }
        ]
      },
    ]
  )

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" theme='colored' autoclose={3000} hideProgressBar={false} style={{ marginBottom: '30px' }} />

    </>
  );
}

export default App;
