import useCustomers from "../customers/useCustomers";
import useParts from "../parts/useParts";
import useUsers from "../users/useUsers";

const usePopulatedDeliveryNote = (deliveryNote) => {

    const { users } = useUsers();
    const { customers } = useCustomers();
    const { parts } = useParts();

    if (!deliveryNote) {
        return deliveryNote;
    }

    const populateCustomer = (customerId) => customers?.find(customer => customer._id === customerId);
    const populateUser = (userId) => users?.find(user => user._id === userId);
    const populatePart = (partId) => parts?.find(part => part._id === partId);

    deliveryNote.customer = populateCustomer(deliveryNote.customer);
    deliveryNote.author = populateUser(deliveryNote.author);
    deliveryNote.warehouseWorker = populateUser(deliveryNote.warehouseWorker);
    deliveryNote.parts = deliveryNote.parts.map(partItem => (
        {
            ...partItem,
            part: populatePart(partItem.part)
        }
    ));

    return deliveryNote;
}

export default usePopulatedDeliveryNote;