import useCustomers from "../customers/useCustomers";
import useParts from "../parts/useParts";
import useUsers from "../users/useUsers";

const usePopulatedDeliveryNotes = (deliveryNotes) => {

    const { users } = useUsers();
    const { customers } = useCustomers();
    const { parts } = useParts();

    const populateCustomer = (customerId) => customers?.find(customer => customer._id === customerId);
    const populateUser = (userId) => users?.find(user => user._id === userId);
    const populatePart = (partId) => parts?.find(part => part._id === partId);

    for (const deliveryNote of deliveryNotes) {
        deliveryNote.customer = populateCustomer(deliveryNote.customer);
        deliveryNote.author = populateUser(deliveryNote.author);
        deliveryNote.warehouseWorker = populateUser(deliveryNote.warehouseWorker);
        deliveryNote.parts = deliveryNote.parts.map(partItem => (
            {
                ...partItem,
                part: populatePart(partItem.part)
            }
        ));
    }

    return deliveryNotes;
}

export default usePopulatedDeliveryNotes;