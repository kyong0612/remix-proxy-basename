import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "~/components/link";
import { useRootLoaderData } from '~/utils/hooks';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Products List" },
  ];
};

export default function Index() {
  const {basename} = useRootLoaderData()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Products List</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to={basename}>Shop</Link>
        </li>
      </ul>
    </div>
  );
}
