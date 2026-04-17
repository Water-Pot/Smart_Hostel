"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

type Role = { roleId?: number; role?: string };
type Floor = { floorId?: number; floorNo?: number };
type Room = {
  roomId?: number;
  roomNo?: number;
  perDayRentFee?: number;
  floor?: { floorNo?: number };
  roomType?: { roomType?: string };
};
type MenuItem = { itemName?: string };
type MealType = { mealType?: string };
type Day = { day?: string };
type Menu = {
  menuId?: number;
  day?: Day;
  mealType?: MealType;
  menuItems?: MenuItem[];
};

type LoginResponse = string | { token?: string };

const TOKEN_KEY = "smart_hostel_token";

export default function Home() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    const savedToken = localStorage.getItem(TOKEN_KEY) ?? "";
    if (!savedToken) return "";
    if (isTokenExpired(savedToken)) {
      localStorage.removeItem(TOKEN_KEY);
      return "";
    }
    return savedToken;
  });
  const [status, setStatus] = useState("Welcome! Connect your backend account to start.");
  const [busy, setBusy] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  const [signupForm, setSignupForm] = useState({
    userName: "",
    password: "",
    roleCsv: "tenant",
  });

  const [loginForm, setLoginForm] = useState({
    userName: "",
    password: "",
  });

  const [roleForm, setRoleForm] = useState({ role: "" });
  const [floorForm, setFloorForm] = useState({ floorNo: "" });
  const [roomForm, setRoomForm] = useState({
    roomNo: "",
    roomType: "",
    floorNo: "",
    perDayRentFee: "",
  });
  const [mealTypeForm, setMealTypeForm] = useState({ mealType: "" });
  const [menuItemForm, setMenuItemForm] = useState({ itemName: "", description: "" });
  const [menuForm, setMenuForm] = useState({ day: "", mealType: "", menuItemsCsv: "" });

  const isAuthenticated = Boolean(token);

  const stats = useMemo(
    () => [
      { title: "Roles", value: roles.length },
      { title: "Floors", value: floors.length },
      { title: "Rooms", value: rooms.length },
      { title: "Menus", value: menus.length },
    ],
    [roles.length, floors.length, rooms.length, menus.length],
  );

  const loadDashboard = useCallback(async (activeToken: string) => {
    if (!activeToken) return;
    if (isTokenExpired(activeToken)) {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setStatus("Session expired. Please login again.");
      return;
    }

    try {
      setBusy(true);
      const [roleData, floorData, roomData, menuData] = await Promise.all([
        apiRequest<Role[]>("/role/get", { token: activeToken }),
        apiRequest<Floor[]>("/floor", { token: activeToken }),
        apiRequest<Room[]>("/room", { token: activeToken }),
        apiRequest<Menu[]>("/menu/get", { token: activeToken }),
      ]);

      setRoles(Array.isArray(roleData) ? roleData : []);
      setFloors(Array.isArray(floorData) ? floorData : []);
      setRooms(Array.isArray(roomData) ? roomData : []);
      setMenus(Array.isArray(menuData) ? menuData : []);
      setStatus("Dashboard refreshed successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load dashboard.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const timer = window.setTimeout(() => {
      void loadDashboard(token);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [token, loadDashboard]);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rolesFromInput = signupForm.roleCsv
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    if (rolesFromInput.length === 0) {
      setStatus("Provide at least one role for signup.");
      return;
    }

    try {
      setBusy(true);
      const response = await apiRequest<string>("/user/signup", {
        method: "POST",
        body: {
          userName: signupForm.userName,
          password: signupForm.password,
          role: rolesFromInput,
        },
      });
      setStatus(typeof response === "string" ? response : "Signup successful.");
      setSignupForm({ userName: "", password: "", roleCsv: "tenant" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setBusy(true);
      const response = await apiRequest<LoginResponse>("/user/login", {
        method: "POST",
        body: loginForm,
      });

      const tokenValue = extractToken(response);
      if (!tokenValue) {
        throw new Error("Login succeeded but token was missing in response.");
      }
      if (isTokenExpired(tokenValue)) {
        throw new Error("Received an expired token. Please try logging in again.");
      }
      setToken(tokenValue);
      localStorage.setItem(TOKEN_KEY, tokenValue);
      setStatus("Login successful.");
      setLoginForm({ userName: "", password: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setRoles([]);
    setFloors([]);
    setRooms([]);
    setMenus([]);
    setStatus("Logged out successfully.");
  }

  async function createRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setBusy(true);
      await apiRequest("/role/create", {
        method: "POST",
        token,
        body: { role: roleForm.role },
      });
      setRoleForm({ role: "" });
      await loadDashboard(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create role.");
    } finally {
      setBusy(false);
    }
  }

  async function createFloor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setBusy(true);
      await apiRequest("/floor/create", {
        method: "POST",
        token,
        body: { floorNo: Number(floorForm.floorNo) },
      });
      setFloorForm({ floorNo: "" });
      await loadDashboard(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create floor.");
    } finally {
      setBusy(false);
    }
  }

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setBusy(true);
      await apiRequest("/room/create", {
        method: "POST",
        token,
        body: {
          roomNo: Number(roomForm.roomNo),
          roomType: roomForm.roomType,
          floorNo: Number(roomForm.floorNo),
          perDayRentFee: Number(roomForm.perDayRentFee),
        },
      });
      setRoomForm({ roomNo: "", roomType: "", floorNo: "", perDayRentFee: "" });
      await loadDashboard(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create room.");
    } finally {
      setBusy(false);
    }
  }

  async function createMealType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setBusy(true);
      await apiRequest("/mealType/create", {
        method: "POST",
        token,
        body: { mealType: mealTypeForm.mealType },
      });
      setMealTypeForm({ mealType: "" });
      setStatus("Meal type added.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create meal type.");
    } finally {
      setBusy(false);
    }
  }

  async function createMenuItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setBusy(true);
      await apiRequest("/menuItem/create", {
        method: "POST",
        token,
        body: menuItemForm,
      });
      setMenuItemForm({ itemName: "", description: "" });
      setStatus("Menu item added.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create menu item.");
    } finally {
      setBusy(false);
    }
  }

  async function createMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    const menuItems = menuForm.menuItemsCsv
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (menuItems.length === 0) {
      setStatus("Please add at least one menu item name.");
      return;
    }

    try {
      setBusy(true);
      await apiRequest("/menu/create", {
        method: "POST",
        token,
        body: {
          day: menuForm.day,
          mealType: menuForm.mealType,
          menuItems,
        },
      });
      setMenuForm({ day: "", mealType: "", menuItemsCsv: "" });
      await loadDashboard(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create menu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600 via-sky-600 to-emerald-500 p-[1px] shadow-2xl shadow-sky-900/40">
          <div className="rounded-3xl bg-slate-950/80 p-6 backdrop-blur-xl sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-cyan-200">
                  Smart Digital Hostel
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Next.js Control Center
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                  A modern frontend for your Spring Boot backend with authentication,
                  live dashboards, and quick management actions.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadDashboard(token)}
                  disabled={!isAuthenticated || busy}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={!isAuthenticated || busy}
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

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-xl font-semibold">Create Account</h2>
            <p className="mb-4 mt-1 text-sm text-slate-300">Public endpoint: /user/signup</p>
            <form onSubmit={handleSignup} className="grid gap-3">
              <input
                required
                value={signupForm.userName}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, userName: event.target.value }))
                }
                placeholder="Username"
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              />
              <input
                required
                type="password"
                value={signupForm.password}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              />
              <input
                required
                value={signupForm.roleCsv}
                onChange={(event) =>
                  setSignupForm((prev) => ({ ...prev, roleCsv: event.target.value }))
                }
                placeholder="Roles (comma separated)"
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              />
              <button
                disabled={busy}
                className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sign up
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-xl font-semibold">Login</h2>
            <p className="mb-4 mt-1 text-sm text-slate-300">Public endpoint: /user/login</p>
            <form onSubmit={handleLogin} className="grid gap-3">
              <input
                required
                value={loginForm.userName}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, userName: event.target.value }))
                }
                placeholder="Username"
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
              <input
                required
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
              <button
                disabled={busy}
                className="rounded-xl bg-violet-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Connect
              </button>
            </form>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Roles" subtitle="/role/get + /role/create">
            <SimpleList
              items={roles.map((role) => role.role || "unknown")}
              emptyLabel="No roles loaded"
            />
            <form onSubmit={createRole} className="mt-4 flex gap-2">
              <input
                required
                value={roleForm.role}
                onChange={(event) => setRoleForm({ role: event.target.value })}
                placeholder="New role"
                className="flex-1 rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-300"
              />
              <ActionButton disabled={!isAuthenticated || busy}>Add</ActionButton>
            </form>
          </Panel>

          <Panel title="Floors" subtitle="/floor + /floor/create">
            <SimpleList
              items={floors.map((floor) => `Floor ${floor.floorNo ?? "?"}`)}
              emptyLabel="No floors loaded"
            />
            <form onSubmit={createFloor} className="mt-4 flex gap-2">
              <input
                required
                type="number"
                min={1}
                value={floorForm.floorNo}
                onChange={(event) => setFloorForm({ floorNo: event.target.value })}
                placeholder="Floor no"
                className="flex-1 rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-300"
              />
              <ActionButton disabled={!isAuthenticated || busy}>Add</ActionButton>
            </form>
          </Panel>

          <Panel title="Rooms" subtitle="/room + /room/create">
            <div className="max-h-52 overflow-auto rounded-xl border border-white/10 bg-slate-900/60">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300">
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Floor</th>
                    <th className="px-3 py-2">Rent/day</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-3 text-center text-slate-400">
                        No rooms loaded
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => (
                      <tr key={getRoomKey(room)} className="border-b border-white/5">
                        <td className="px-3 py-2">{room.roomNo ?? "-"}</td>
                        <td className="px-3 py-2">{room.roomType?.roomType ?? "-"}</td>
                        <td className="px-3 py-2">{room.floor?.floorNo ?? "-"}</td>
                        <td className="px-3 py-2">{room.perDayRentFee ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <form onSubmit={createRoom} className="mt-4 grid gap-2 sm:grid-cols-2">
              <InputField
                required
                type="number"
                placeholder="Room no"
                value={roomForm.roomNo}
                onChange={(value) => setRoomForm((prev) => ({ ...prev, roomNo: value }))}
              />
              <InputField
                required
                placeholder="Room type"
                value={roomForm.roomType}
                onChange={(value) => setRoomForm((prev) => ({ ...prev, roomType: value }))}
              />
              <InputField
                required
                type="number"
                placeholder="Floor no"
                value={roomForm.floorNo}
                onChange={(value) => setRoomForm((prev) => ({ ...prev, floorNo: value }))}
              />
              <InputField
                required
                type="number"
                placeholder="Rent/day"
                value={roomForm.perDayRentFee}
                onChange={(value) =>
                  setRoomForm((prev) => ({ ...prev, perDayRentFee: value }))
                }
              />
              <ActionButton disabled={!isAuthenticated || busy} className="sm:col-span-2">
                Create room
              </ActionButton>
            </form>
          </Panel>

          <Panel title="Menus" subtitle="/menu/get + /menu/create">
            <SimpleList
              items={menus.map(
                (menu) =>
                  `${menu.day?.day ?? "?"} • ${menu.mealType?.mealType ?? "?"} • ${
                    menu.menuItems?.map((item) => item.itemName).filter(Boolean).join(", ") ||
                    "No items"
                  }`,
              )}
              emptyLabel="No menu loaded"
            />
            <form onSubmit={createMenu} className="mt-4 grid gap-2">
              <InputField
                required
                placeholder="Day (e.g. Friday)"
                value={menuForm.day}
                onChange={(value) => setMenuForm((prev) => ({ ...prev, day: value }))}
              />
              <InputField
                required
                placeholder="Meal type (e.g. dinner)"
                value={menuForm.mealType}
                onChange={(value) => setMenuForm((prev) => ({ ...prev, mealType: value }))}
              />
              <InputField
                required
                placeholder="Menu items (comma separated names)"
                value={menuForm.menuItemsCsv}
                onChange={(value) => setMenuForm((prev) => ({ ...prev, menuItemsCsv: value }))}
              />
              <ActionButton disabled={!isAuthenticated || busy}>Create menu</ActionButton>
            </form>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Quick Add: Meal Type" subtitle="/mealType/create">
            <form onSubmit={createMealType} className="flex gap-2">
              <input
                required
                value={mealTypeForm.mealType}
                onChange={(event) => setMealTypeForm({ mealType: event.target.value })}
                placeholder="e.g. breakfast"
                className="flex-1 rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              />
              <ActionButton disabled={!isAuthenticated || busy}>Add</ActionButton>
            </form>
          </Panel>

          <Panel title="Quick Add: Menu Item" subtitle="/menuItem/create">
            <form onSubmit={createMenuItem} className="grid gap-2 sm:grid-cols-2">
              <InputField
                required
                placeholder="Item name"
                value={menuItemForm.itemName}
                onChange={(value) =>
                  setMenuItemForm((prev) => ({ ...prev, itemName: value }))
                }
              />
              <InputField
                placeholder="Description"
                value={menuItemForm.description}
                onChange={(value) =>
                  setMenuItemForm((prev) => ({ ...prev, description: value }))
                }
              />
              <ActionButton disabled={!isAuthenticated || busy} className="sm:col-span-2">
                Create menu item
              </ActionButton>
            </form>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({
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
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mb-4 mt-1 text-sm text-slate-300">{subtitle}</p>
      {children}
    </article>
  );
}

function ActionButton({
  children,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      className={`rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {children}
    </button>
  );
}

function SimpleList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  const keyedItems = useMemo(() => {
    const occurrenceByItem = new Map<string, number>();
    return items.map((item) => {
      const occurrence = (occurrenceByItem.get(item) ?? 0) + 1;
      occurrenceByItem.set(item, occurrence);
      return { key: `${item}-${occurrence}`, label: item };
    });
  }, [items]);

  return (
    <ul className="max-h-52 space-y-2 overflow-auto rounded-xl border border-white/10 bg-slate-900/60 p-3">
      {items.length === 0 ? (
        <li className="text-sm text-slate-400">{emptyLabel}</li>
      ) : (
        keyedItems.map((item) => (
          <li key={item.key} className="rounded-lg bg-white/5 px-3 py-2 text-sm">
            {item.label}
          </li>
        ))
      )}
    </ul>
  );
}

function InputField({
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

function extractToken(response: LoginResponse): string {
  if (typeof response === "string") {
    return response.replace(/^"|"$/g, "").trim();
  }

  return (response.token ?? "").trim();
}

function getRoomKey(room: Room): string {
  if (room.roomId !== undefined) return `room-id-${room.roomId}`;
  if (room.roomNo !== undefined) return `room-no-${room.roomNo}`;

  return `room-${room.floor?.floorNo ?? "x"}-${room.roomType?.roomType ?? "x"}-${room.perDayRentFee ?? "x"}`;
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
