"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type EndpointDefinition = {
  id: string;
  category: string;
  title: string;
  description: string;
  method: HttpMethod;
  path: string;
  isPublic?: boolean;
  contentType?: "application/json" | "multipart/form-data";
  defaultPathParams?: Record<string, string>;
  defaultQueryParams?: Record<string, string>;
  bodyTemplate?: unknown;
};

type AuthForm = {
  userName: string;
  password: string;
};

type SignupForm = AuthForm & {
  rolesCsv: string;
};

type UploadForm = {
  userId: string;
  file: File | null;
};

const TOKEN_KEY = "smart_hostel_token";

const ENDPOINTS: EndpointDefinition[] = [
  {
    id: "user-signup",
    category: "Authentication",
    title: "User Signup",
    description: "Register a new user account.",
    method: "POST",
    path: "/user/signup",
    isPublic: true,
    bodyTemplate: { userName: "tenant1", password: "pass1234", role: ["tenant"] },
  },
  {
    id: "user-login",
    category: "Authentication",
    title: "User Login",
    description: "Login and receive JWT token.",
    method: "POST",
    path: "/user/login",
    isPublic: true,
    bodyTemplate: { userName: "tenant1", password: "pass1234" },
  },
  {
    id: "user-upload-image",
    category: "Authentication",
    title: "Upload User Image",
    description: "Upload profile image (multipart/form-data).",
    method: "POST",
    path: "/user/upload-image/{userId}",
    contentType: "multipart/form-data",
    defaultPathParams: { userId: "1" },
  },
  {
    id: "role-get-all",
    category: "Hostel Core",
    title: "Get All Roles",
    description: "Fetch role list.",
    method: "GET",
    path: "/role/get",
  },
  {
    id: "role-get-by-id",
    category: "Hostel Core",
    title: "Get Role By ID",
    description: "Fetch one role by id.",
    method: "GET",
    path: "/role/get/{id}",
    defaultPathParams: { id: "1" },
  },
  {
    id: "role-create",
    category: "Hostel Core",
    title: "Create Role",
    description: "Create a new role.",
    method: "POST",
    path: "/role/create",
    bodyTemplate: { role: "manager" },
  },
  {
    id: "role-update",
    category: "Hostel Core",
    title: "Update Role",
    description: "Update a role by id.",
    method: "PUT",
    path: "/role/update/{roleId}",
    defaultPathParams: { roleId: "1" },
    bodyTemplate: { role: "tenant" },
  },
  {
    id: "role-delete",
    category: "Hostel Core",
    title: "Delete Role",
    description: "Delete a role by id.",
    method: "DELETE",
    path: "/role/delete/{roleId}",
    defaultPathParams: { roleId: "1" },
  },
  {
    id: "floor-create",
    category: "Hostel Core",
    title: "Create Floor",
    description: "Create floor record.",
    method: "POST",
    path: "/floor/create",
    bodyTemplate: { floorNo: 1 },
  },
  {
    id: "floor-get-all",
    category: "Hostel Core",
    title: "Get Floors",
    description: "Fetch all floors.",
    method: "GET",
    path: "/floor",
  },
  {
    id: "floor-get-by-id",
    category: "Hostel Core",
    title: "Get Floor By ID",
    description: "Fetch floor by id.",
    method: "GET",
    path: "/floor/{floorId}",
    defaultPathParams: { floorId: "1" },
  },
  {
    id: "floor-delete",
    category: "Hostel Core",
    title: "Delete Floor",
    description: "Delete floor by id.",
    method: "DELETE",
    path: "/floor/delete/{floorId}",
    defaultPathParams: { floorId: "1" },
  },
  {
    id: "room-create",
    category: "Hostel Core",
    title: "Create Room",
    description: "Create room record.",
    method: "POST",
    path: "/room/create",
    bodyTemplate: { roomNo: 101, roomType: "SINGLE", floorNo: 1, perDayRentFee: 450 },
  },
  {
    id: "room-get-all",
    category: "Hostel Core",
    title: "Get Rooms",
    description: "Fetch all rooms.",
    method: "GET",
    path: "/room",
  },
  {
    id: "room-get-by-id",
    category: "Hostel Core",
    title: "Get Room By ID",
    description: "Fetch room by room id.",
    method: "GET",
    path: "/room/roomId/{roomId}",
    defaultPathParams: { roomId: "1" },
  },
  {
    id: "room-get-by-room-no",
    category: "Hostel Core",
    title: "Get Room By Number",
    description: "Fetch room by room number.",
    method: "GET",
    path: "/room/roomNo/{roomNo}",
    defaultPathParams: { roomNo: "101" },
  },
  {
    id: "room-get-by-type",
    category: "Hostel Core",
    title: "Get Rooms By Type",
    description: "Fetch rooms by roomType query.",
    method: "GET",
    path: "/room/roomType",
    defaultQueryParams: { roomType: "SINGLE" },
  },
  {
    id: "room-update",
    category: "Hostel Core",
    title: "Update Room",
    description: "Update room by id.",
    method: "PUT",
    path: "/room/update/{roomId}",
    defaultPathParams: { roomId: "1" },
    bodyTemplate: { roomNo: 101, roomType: "SINGLE", floorNo: 1, perDayRentFee: 500 },
  },
  {
    id: "room-delete",
    category: "Hostel Core",
    title: "Delete Room",
    description: "Delete room by id.",
    method: "DELETE",
    path: "/room/delete/{roomId}",
    defaultPathParams: { roomId: "1" },
  },
  {
    id: "room-type-create",
    category: "Hostel Core",
    title: "Create Room Type",
    description: "Create room type.",
    method: "POST",
    path: "/room-type/create",
    bodyTemplate: { roomType: "SINGLE" },
  },
  {
    id: "room-type-get-all",
    category: "Hostel Core",
    title: "Get Room Types",
    description: "Fetch room type list.",
    method: "GET",
    path: "/room-type",
  },
  {
    id: "room-type-get-by-name",
    category: "Hostel Core",
    title: "Get Room Type By Name",
    description: "Fetch room type by text value.",
    method: "GET",
    path: "/room-type/roomType/{roomType}",
    defaultPathParams: { roomType: "SINGLE" },
  },
  {
    id: "room-type-get-by-id",
    category: "Hostel Core",
    title: "Get Room Type By ID",
    description: "Fetch room type by id.",
    method: "GET",
    path: "/room-type/id/{roomTypeId}",
    defaultPathParams: { roomTypeId: "1" },
  },
  {
    id: "room-type-update",
    category: "Hostel Core",
    title: "Update Room Type",
    description: "Update room type by id.",
    method: "PUT",
    path: "/room-type/update/{roomTypeId}",
    defaultPathParams: { roomTypeId: "1" },
    bodyTemplate: { roomType: "DELUXE" },
  },
  {
    id: "room-type-delete",
    category: "Hostel Core",
    title: "Delete Room Type",
    description: "Delete room type by id.",
    method: "DELETE",
    path: "/room-type/delete/{roomTypeId}",
    defaultPathParams: { roomTypeId: "1" },
  },
  {
    id: "meal-type-create",
    category: "Food & Menu",
    title: "Create Meal Type",
    description: "Create meal type.",
    method: "POST",
    path: "/mealType/create",
    bodyTemplate: { mealType: "BREAKFAST" },
  },
  {
    id: "meal-type-get-all",
    category: "Food & Menu",
    title: "Get Meal Types",
    description: "Fetch meal types.",
    method: "GET",
    path: "/mealType/get",
  },
  {
    id: "meal-type-get-by-id",
    category: "Food & Menu",
    title: "Get Meal Type By ID",
    description: "Fetch meal type by id.",
    method: "GET",
    path: "/mealType/get/{mealTypeId}",
    defaultPathParams: { mealTypeId: "1" },
  },
  {
    id: "meal-type-update",
    category: "Food & Menu",
    title: "Update Meal Type",
    description: "Update meal type by id.",
    method: "PUT",
    path: "/mealType/update/{mealTypeId}",
    defaultPathParams: { mealTypeId: "1" },
    bodyTemplate: { mealType: "DINNER" },
  },
  {
    id: "meal-type-delete",
    category: "Food & Menu",
    title: "Delete Meal Type",
    description: "Delete meal type by id.",
    method: "DELETE",
    path: "/mealType/delete/{mealTypeId}",
    defaultPathParams: { mealTypeId: "1" },
  },
  {
    id: "menu-item-create",
    category: "Food & Menu",
    title: "Create Menu Item",
    description: "Create menu item.",
    method: "POST",
    path: "/menuItem/create",
    bodyTemplate: { itemName: "Rice", description: "Steamed rice" },
  },
  {
    id: "menu-item-get-all",
    category: "Food & Menu",
    title: "Get Menu Items",
    description: "Fetch menu items.",
    method: "GET",
    path: "/menuItem/get",
  },
  {
    id: "menu-item-get-by-id",
    category: "Food & Menu",
    title: "Get Menu Item By ID",
    description: "Fetch menu item by id.",
    method: "GET",
    path: "/menuItem/get/{menuItemId}",
    defaultPathParams: { menuItemId: "1" },
  },
  {
    id: "menu-item-update",
    category: "Food & Menu",
    title: "Update Menu Item",
    description: "Update menu item by id.",
    method: "PUT",
    path: "/menuItem/update/{menuItemId}",
    defaultPathParams: { menuItemId: "1" },
    bodyTemplate: { itemName: "Rice", description: "Updated description" },
  },
  {
    id: "menu-item-delete",
    category: "Food & Menu",
    title: "Delete Menu Item",
    description: "Delete menu item by id.",
    method: "DELETE",
    path: "/menuItem/delete/{menuItemId}",
    defaultPathParams: { menuItemId: "1" },
  },
  {
    id: "menu-create",
    category: "Food & Menu",
    title: "Create Menu",
    description: "Create menu by day and meal type.",
    method: "POST",
    path: "/menu/create",
    bodyTemplate: { day: "SUNDAY", mealType: "BREAKFAST", menuItems: ["Rice"] },
  },
  {
    id: "menu-get-all",
    category: "Food & Menu",
    title: "Get Menus",
    description: "Fetch all menus.",
    method: "GET",
    path: "/menu/get",
  },
  {
    id: "menu-get-by-id",
    category: "Food & Menu",
    title: "Get Menu By ID",
    description: "Fetch menu by id.",
    method: "GET",
    path: "/menu/get/{menuId}",
    defaultPathParams: { menuId: "1" },
  },
  {
    id: "menu-update",
    category: "Food & Menu",
    title: "Update Menu",
    description: "Update menu by id.",
    method: "PUT",
    path: "/menu/update/{menuId}",
    defaultPathParams: { menuId: "1" },
    bodyTemplate: { day: "MONDAY", mealType: "DINNER", menuItems: ["Rice", "Dal"] },
  },
  {
    id: "menu-delete",
    category: "Food & Menu",
    title: "Delete Menu",
    description: "Delete menu by id.",
    method: "DELETE",
    path: "/menu/delete/{menuId}",
    defaultPathParams: { menuId: "1" },
  },
  {
    id: "comment-get-all",
    category: "Community",
    title: "Get Comments",
    description: "Fetch all comments.",
    method: "GET",
    path: "/comment/get/all",
  },
  {
    id: "comment-get-by-id",
    category: "Community",
    title: "Get Comment By ID",
    description: "Fetch comment by id.",
    method: "GET",
    path: "/comment/get/{id}",
    defaultPathParams: { id: "1" },
  },
  {
    id: "comment-create",
    category: "Community",
    title: "Create Comment",
    description: "Create comment for room and user.",
    method: "POST",
    path: "/comment/create",
    bodyTemplate: { comment: "Great room", userId: 1, roomNo: 101 },
  },
  {
    id: "discussion-get-all",
    category: "Community",
    title: "Get Discussions",
    description: "Fetch all discussions.",
    method: "GET",
    path: "/discussion/get/all",
  },
  {
    id: "discussion-create",
    category: "Community",
    title: "Create Discussion",
    description: "Create new discussion.",
    method: "POST",
    path: "/discussion/create",
    bodyTemplate: { description: "Need maintenance", roomNo: 101, userId: 1 },
  },
  {
    id: "payment-method-get-all",
    category: "Payments & Finance",
    title: "Get Payment Methods",
    description: "Fetch payment methods.",
    method: "GET",
    path: "/payment-method/get",
  },
  {
    id: "payment-method-get-by-name",
    category: "Payments & Finance",
    title: "Get Payment Method By Name",
    description: "Fetch payment method by text.",
    method: "GET",
    path: "/payment-method/get/{paymentMethod}",
    defaultPathParams: { paymentMethod: "CASH" },
  },
  {
    id: "payment-purpose-get-all",
    category: "Payments & Finance",
    title: "Get Payment Purposes",
    description: "Fetch payment purposes.",
    method: "GET",
    path: "/payment-purpose/get",
  },
  {
    id: "payment-purpose-get-by-id",
    category: "Payments & Finance",
    title: "Get Payment Purpose By ID",
    description: "Fetch payment purpose by id.",
    method: "GET",
    path: "/payment-purpose/get/{paymentPurposeId}",
    defaultPathParams: { paymentPurposeId: "1" },
  },
  {
    id: "transaction-type-get-all",
    category: "Payments & Finance",
    title: "Get Transaction Types",
    description: "Fetch transaction types.",
    method: "GET",
    path: "/transaction-type/get",
  },
  {
    id: "transaction-type-get-by-name",
    category: "Payments & Finance",
    title: "Get Transaction Type By Name",
    description: "Fetch transaction type by text.",
    method: "GET",
    path: "/transaction-type/get/{transactionType}",
    defaultPathParams: { transactionType: "CREDIT" },
  },
  {
    id: "room-rent-info-get-all",
    category: "Reports",
    title: "Get Room Rent Information",
    description: "Fetch all room rent information.",
    method: "GET",
    path: "/room-rent-information/get",
  },
  {
    id: "room-rent-info-get-by-username",
    category: "Reports",
    title: "Get Room Rent By User",
    description: "Fetch room rent information by userName.",
    method: "GET",
    path: "/room-rent-information/get/{userName}",
    defaultPathParams: { userName: "tenant1" },
  },
  {
    id: "test-get",
    category: "Testing",
    title: "Test GET",
    description: "Echo test endpoint (secured).",
    method: "GET",
    path: "/test/get/{query}",
    defaultPathParams: { query: "hello" },
  },
  {
    id: "test-post",
    category: "Testing",
    title: "Test POST",
    description: "Echo test endpoint (secured).",
    method: "POST",
    path: "/test/post/{query}",
    defaultPathParams: { query: "hello" },
  },
];

export default function Home() {
  const initialEndpoint = ENDPOINTS[0];

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = localStorage.getItem(TOKEN_KEY) ?? "";
    if (!saved || isTokenExpired(saved)) return "";
    return saved;
  });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready. Use signup/login first for secured endpoints.");
  const [responseText, setResponseText] = useState("No response yet.");

  const [signupForm, setSignupForm] = useState<SignupForm>({
    userName: "",
    password: "",
    rolesCsv: "tenant",
  });
  const [loginForm, setLoginForm] = useState<AuthForm>({ userName: "", password: "" });
  const [uploadForm, setUploadForm] = useState<UploadForm>({ userId: "1", file: null });

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEndpointId, setSelectedEndpointId] = useState(initialEndpoint?.id ?? "");

  const [pathParams, setPathParams] = useState<Record<string, string>>({
    ...(initialEndpoint?.defaultPathParams ?? {}),
  });
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    ...(initialEndpoint?.defaultQueryParams ?? {}),
  });
  const [bodyText, setBodyText] = useState(
    initialEndpoint?.bodyTemplate === undefined
      ? ""
      : JSON.stringify(initialEndpoint.bodyTemplate, null, 2),
  );

  const selectedEndpoint =
    ENDPOINTS.find((endpoint) => endpoint.id === selectedEndpointId) ?? ENDPOINTS[0];

  const categories = useMemo(() => {
    const unique = new Set(ENDPOINTS.map((endpoint) => endpoint.category));
    return ["All", ...Array.from(unique)];
  }, []);

  const filteredEndpoints = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return ENDPOINTS.filter((endpoint) => {
      const matchesCategory = category === "All" || endpoint.category === category;
      const matchesSearch =
        !normalized ||
        endpoint.title.toLowerCase().includes(normalized) ||
        endpoint.path.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const stats = useMemo(() => {
    const publicCount = ENDPOINTS.filter((endpoint) => endpoint.isPublic).length;
    const secureCount = ENDPOINTS.length - publicCount;
    return [
      { title: "Total Endpoints", value: ENDPOINTS.length },
      { title: "Public", value: publicCount },
      { title: "Secured", value: secureCount },
      { title: "Categories", value: categories.length - 1 },
    ];
  }, [categories.length]);

  function updatePathParam(key: string, value: string) {
    setPathParams((prev) => ({ ...prev, [key]: value }));
  }

  function updateQueryParam(key: string, value: string) {
    setQueryParams((prev) => ({ ...prev, [key]: value }));
  }

  function applyEndpointSelection(endpoint: EndpointDefinition) {
    setSelectedEndpointId(endpoint.id);
    setPathParams({ ...(endpoint.defaultPathParams ?? {}) });
    setQueryParams({ ...(endpoint.defaultQueryParams ?? {}) });
    setBodyText(
      endpoint.bodyTemplate === undefined ? "" : JSON.stringify(endpoint.bodyTemplate, null, 2),
    );
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const roleList = signupForm.rolesCsv
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    if (roleList.length === 0) {
      setStatus("Enter at least one role.");
      return;
    }

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/signup", {
        method: "POST",
        body: {
          userName: signupForm.userName,
          password: signupForm.password,
          role: roleList,
        },
      });
      setResponseText(toPrettyResponse(result));
      setStatus("Signup successful.");
      setSignupForm({ userName: "", password: "", rolesCsv: "tenant" });
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/login", {
        method: "POST",
        body: loginForm,
      });

      const nextToken = extractToken(result);
      if (!nextToken) {
        throw new Error("Token missing in login response.");
      }
      if (isTokenExpired(nextToken)) {
        throw new Error("Received expired token.");
      }

      setToken(nextToken);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, nextToken);
      }
      setResponseText(toPrettyResponse(result));
      setStatus("Login successful. Token saved.");
      setLoginForm({ userName: "", password: "" });
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken("");
    setStatus("Logged out.");
  }

  function resolvePath(template: string): string {
    const withParams = template.replace(/\{([^}]+)\}/g, (_, key: string) => {
      const value = pathParams[key] ?? "";
      return encodeURIComponent(value.trim());
    });

    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value.trim()) {
        query.set(key, value.trim());
      }
    }

    const queryString = query.toString();
    return queryString ? `${withParams}?${queryString}` : withParams;
  }

  async function runSelectedEndpoint() {
    if (!selectedEndpoint) return;

    if (selectedEndpoint.contentType === "multipart/form-data") {
      setStatus("Use the Upload User Image panel for this multipart endpoint.");
      return;
    }

    if (!selectedEndpoint.isPublic && !token) {
      setStatus("This endpoint requires login token.");
      return;
    }

    const missingPathParam = Object.entries(pathParams).find(([, value]) => !value.trim());
    if (missingPathParam) {
      setStatus(`Path parameter '${missingPathParam[0]}' is required.`);
      return;
    }

    let parsedBody: unknown = undefined;
    const shouldSendBody = selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT";

    if (shouldSendBody && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        setStatus("Request body must be valid JSON.");
        return;
      }
    }

    try {
      setBusy(true);
      const path = resolvePath(selectedEndpoint.path);
      const result = await apiRequest<unknown>(path, {
        method: selectedEndpoint.method,
        token: selectedEndpoint.isPublic ? undefined : token,
        body: parsedBody,
      });
      setResponseText(toPrettyResponse(result));
      setStatus(`${selectedEndpoint.method} ${path} executed successfully.`);
    } catch (error) {
      setStatus(getErrorMessage(error));
      setResponseText("Request failed. Check status message.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("Login required for image upload.");
      return;
    }

    if (!uploadForm.userId.trim()) {
      setStatus("User ID is required.");
      return;
    }

    if (!uploadForm.file) {
      setStatus("Please select an image file.");
      return;
    }

    try {
      setBusy(true);
      const formData = new FormData();
      formData.append("image", uploadForm.file);

      const result = await apiRequest<unknown>(
        `/user/upload-image/${encodeURIComponent(uploadForm.userId.trim())}`,
        {
          method: "POST",
          token,
          body: formData,
        },
      );

      setResponseText(toPrettyResponse(result));
      setStatus("Image uploaded successfully.");
      setUploadForm((prev) => ({ ...prev, file: null }));
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadForm((prev) => ({ ...prev, file }));
  }

  const pathParamKeys = Object.keys(pathParams);
  const queryParamKeys = Object.keys(queryParams);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600 via-sky-600 to-emerald-500 p-[1px] shadow-2xl shadow-cyan-900/30">
          <div className="rounded-3xl bg-slate-950/80 p-6 backdrop-blur-xl sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-cyan-200">
                  Smart Hostel • Next.js 16
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Full API Control Center
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
                  Beautiful, feature-rich frontend with complete coverage of all backend methods,
                  including authentication, CRUD operations, reporting, and multipart upload.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={runSelectedEndpoint}
                  disabled={busy}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Run Selected
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={busy || !token}
                  className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Logout
                </button>
              </div>
            </div>
            <p className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              {status}
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-wider text-slate-400">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card title="Create Account" subtitle="POST /user/signup">
            <form onSubmit={handleSignup} className="grid gap-3">
              <Input
                required
                placeholder="Username"
                value={signupForm.userName}
                onChange={(value) => setSignupForm((prev) => ({ ...prev, userName: value }))}
              />
              <Input
                required
                type="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={(value) => setSignupForm((prev) => ({ ...prev, password: value }))}
              />
              <Input
                required
                placeholder="Roles (comma separated)"
                value={signupForm.rolesCsv}
                onChange={(value) => setSignupForm((prev) => ({ ...prev, rolesCsv: value }))}
              />
              <PrimaryButton disabled={busy}>Sign Up</PrimaryButton>
            </form>
          </Card>

          <Card title="Login" subtitle="POST /user/login">
            <form onSubmit={handleLogin} className="grid gap-3">
              <Input
                required
                placeholder="Username"
                value={loginForm.userName}
                onChange={(value) => setLoginForm((prev) => ({ ...prev, userName: value }))}
              />
              <Input
                required
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
              />
              <PrimaryButton disabled={busy}>Login</PrimaryButton>
            </form>
            <p className="mt-3 break-all rounded-xl bg-slate-900/80 p-2 text-xs text-emerald-200">
              Token: {token ? `${token.slice(0, 36)}...` : "Not logged in"}
            </p>
          </Card>

          <Card title="Upload User Image" subtitle="POST /user/upload-image/{userId}">
            <form onSubmit={handleImageUpload} className="grid gap-3">
              <Input
                required
                placeholder="User ID"
                value={uploadForm.userId}
                onChange={(value) => setUploadForm((prev) => ({ ...prev, userId: value }))}
              />
              <input
                required
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm"
              />
              <PrimaryButton disabled={busy || !token}>Upload</PrimaryButton>
            </form>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card title="Endpoint Catalog" subtitle="Every backend method is included">
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <Input placeholder="Search endpoint" value={search} onChange={setSearch} />
            </div>

            <div className="grid max-h-[34rem] gap-3 overflow-auto pr-1">
              {filteredEndpoints.map((endpoint) => {
                const active = endpoint.id === selectedEndpoint?.id;
                return (
                  <button
                    key={endpoint.id}
                    type="button"
                    onClick={() => applyEndpointSelection(endpoint)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-cyan-300 bg-cyan-400/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-white">{endpoint.title}</h3>
                      <span
                        className={`rounded-lg px-2 py-1 text-xs font-semibold ${methodColor(endpoint.method)}`}
                      >
                        {endpoint.method}
                      </span>
                    </div>
                    <p className="mt-2 break-all text-xs text-cyan-100">{endpoint.path}</p>
                    <p className="mt-2 text-xs text-slate-300">{endpoint.description}</p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {endpoint.isPublic ? "Public" : "JWT required"} • {endpoint.category}
                    </p>
                  </button>
                );
              })}
              {filteredEndpoints.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  No endpoints found for this filter.
                </p>
              ) : null}
            </div>
          </Card>

          <Card
            title="API Workstation"
            subtitle={selectedEndpoint ? `${selectedEndpoint.method} ${selectedEndpoint.path}` : "Select endpoint"}
          >
            {selectedEndpoint ? (
              <>
                {pathParamKeys.length > 0 ? (
                  <div className="mb-3 grid gap-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Path Params</p>
                    {pathParamKeys.map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={pathParams[key] ?? ""}
                        onChange={(value) => updatePathParam(key, value)}
                      />
                    ))}
                  </div>
                ) : null}

                {queryParamKeys.length > 0 ? (
                  <div className="mb-3 grid gap-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Query Params</p>
                    {queryParamKeys.map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={queryParams[key] ?? ""}
                        onChange={(value) => updateQueryParam(key, value)}
                      />
                    ))}
                  </div>
                ) : null}

                {(selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT") &&
                selectedEndpoint.contentType !== "multipart/form-data" ? (
                  <div className="mb-3 grid gap-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400">JSON Body</p>
                    <textarea
                      value={bodyText}
                      onChange={(event) => setBodyText(event.target.value)}
                      rows={10}
                      className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs outline-none focus:border-cyan-300"
                    />
                  </div>
                ) : null}

                {selectedEndpoint.contentType === "multipart/form-data" ? (
                  <p className="mb-3 rounded-xl border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                    This endpoint is multipart. Use the Upload User Image panel above.
                  </p>
                ) : null}

                <div className="flex gap-2">
                  <PrimaryButton
                    type="button"
                    onClick={runSelectedEndpoint}
                    disabled={busy || selectedEndpoint.contentType === "multipart/form-data"}
                  >
                    Execute
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedEndpoint) return;
                      setPathParams({ ...(selectedEndpoint.defaultPathParams ?? {}) });
                      setQueryParams({ ...(selectedEndpoint.defaultQueryParams ?? {}) });
                      setBodyText(
                        selectedEndpoint.bodyTemplate === undefined
                          ? ""
                          : JSON.stringify(selectedEndpoint.bodyTemplate, null, 2),
                      );
                    }}
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Reset Template
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/80 p-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Resolved Path</p>
                  <p className="break-all text-sm text-cyan-200">{resolvePath(selectedEndpoint.path)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300">Select an endpoint to start.</p>
            )}
          </Card>
        </section>

        <Card title="Response Viewer" subtitle="Latest API response">
          <pre className="max-h-[26rem] overflow-auto rounded-xl border border-white/10 bg-slate-900/90 p-4 text-xs text-emerald-200">
            {responseText}
          </pre>
        </Card>
      </div>
    </main>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mb-4 mt-1 text-sm text-slate-300">{subtitle}</p>
      {children}
    </article>
  );
}

function Input({
  value,
  onChange,
  className = "",
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300 ${className}`.trim()}
    />
  );
}

function PrimaryButton({
  children,
  type = "submit",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function methodColor(method: HttpMethod): string {
  if (method === "GET") return "bg-emerald-400/20 text-emerald-200";
  if (method === "POST") return "bg-sky-400/20 text-sky-200";
  if (method === "PUT") return "bg-amber-400/20 text-amber-200";
  return "bg-rose-400/20 text-rose-200";
}

function extractToken(response: unknown): string {
  if (typeof response === "string") {
    return response.replace(/^"|"$/g, "").trim();
  }

  if (response && typeof response === "object" && "token" in response) {
    const token = (response as { token?: unknown }).token;
    return typeof token === "string" ? token.trim() : "";
  }

  return "";
}

function toPrettyResponse(value: unknown): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  if (value === undefined) {
    return "No content";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Request failed.";
}

function isTokenExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
