import { Outlet } from "react-router";

export default function PrivateLayout() {
  return (
    <main className="flex">
      <div>This is sidebar</div>
      <Outlet />
    </main>
  );
}
