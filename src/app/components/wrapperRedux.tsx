"use client"; // This makes it a client component
import { Provider } from "react-redux";
import { store } from "../../redux/store";

export default function ReduxProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}