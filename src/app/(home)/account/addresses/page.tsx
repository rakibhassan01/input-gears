import { getUserAddresses } from "@/modules/account/address-actions";
import AddressView from "@/modules/account/views/address-view";

export const metadata = {
  title: "My Addresses | InputGears",
};

export default async function AddressPage() {
  const addresses = await getUserAddresses();

  return <AddressView addresses={addresses} />;
}
