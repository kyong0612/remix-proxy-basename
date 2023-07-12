import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "~/components/link";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Products List" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Products List</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
      </ul>
    </div>
  );
}
