import SaveIcon from "@mui/icons-material/Save";
import { Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import {
  CarouselItem,
  Col,
  FloatingLabel,
  Form,
  Spinner,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import UserSelect from "../../components/forms/UserSelect";
import DefaultContainer from "../../components/layout/DefaultContainer";

import { useRef } from "react";
import FloatingButton from "../../components/layout/FloatingButton";
import TabSlide from "../../components/layout/TabSlide";
import AddablePartsList from "../../components/parts/AddablePartsList";
import INVENTORY_STATUS from "../../config/inventoryStatus";
import useAuth from "../../hooks/auth/useAuth";
import useParts from "../../hooks/parts/useParts";
import useUsers from "../../hooks/users/useUsers";
import { LIST_STATUS_LANG } from "../../config/list";
import { TOP_NAV_HEIGHT } from "../../app/config/layout.config";
import { CallMerge } from "@mui/icons-material";

const InventoryContent = ({
  inventory,
  onFinishInventory,
  onSaveButtonClicked,
}) => {
  const { user } = useAuth();
  const { users } = useUsers();
  const { parts } = useParts();

  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(
    +(searchParams?.get("tabIndex") || 0)
  );

  const formRef = useRef();

  const [validated, setValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(inventory?.name || "");
  const [note, setNote] = useState(inventory?.note || "");
  const [assignedUsers, setAssignedUsers] = useState(
    inventory?.assignedUsers?.map((user) => user._id) || []
  );
  const [status, setStatus] = useState(
    inventory?.status || INVENTORY_STATUS.OPEN
  );
  const [inventoryParts, setInventoryParts] = useState(inventory?.parts || []);

  const onNameChanged = (e) => setName(e.target.value);
  const onNoteChanged = (e) => setNote(e.target.value);
  const onStatusChanged = (e) => setStatus(e.target.value);

  const handleSlideChanged = (value) => setTabIndex(value);
  const handleTabIndexChanged = (event, newValue) => {
    setValidated(true);
    setTabIndex(newValue);
  };

  const handleSaveInventory = async (e) => {
    e.preventDefault();
    setValidated(true);

    const form = formRef.current;
    if (form.checkValidity()) {
      const updatedInventory = {
        ...inventory,
        date: inventory?.date || new Date(),
        name: name,
        note: note,
        status: status,
        assignedUsers: assignedUsers,
        parts: inventoryParts,
      };

      try {
        setIsSaving(true);
        await onSaveButtonClicked(updatedInventory);
      } finally {
        setIsSaving(false);
      }
    } else if (tabIndex === 1) {
      setTabIndex(0);
    }
  };

  return (
    <DefaultContainer>
      <Tabs
        value={tabIndex}
        onChange={handleTabIndexChanged}
        style={{
          position: "sticky",
          zIndex: 100,
          top: TOP_NAV_HEIGHT,
          backgroundColor: "#fff",
        }}
      >
        <Tab value={0} label="Informationen" />
        <Tab value={1} label="Bauteile" />
      </Tabs>

      <TabSlide tabIndex={tabIndex} setTabIndex={handleSlideChanged}>
        <CarouselItem>
          <Form
            noValidate
            validated={validated}
            ref={formRef}
            className="col-sm-12"
          >
            <Form.Group as={Col} className="mt-3">
              <FloatingLabel label="Name der Inventur">
                <Form.Control
                  type="text"
                  placeholder="Name der Inventur"
                  value={name}
                  onChange={onNameChanged}
                  required
                  disabled={!user.isAdmin}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte gib einen Inventurnamen ein.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group as={Col} className="mt-3">
              <FloatingLabel label="Notiz">
                <Form.Control
                  type="text"
                  placeholder="Notiz"
                  value={note}
                  onChange={onNoteChanged}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group as={Col} className="mt-3">
              <UserSelect
                title="Zugewiesene Mitarbeiter"
                users={users}
                excludedUser={user}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
              />
              <Form.Text muted>
                Die zugewiesenen Mitarbeiter sind berechtigt, diese Inventur
                durchzuführen. Sie können Bauteile hinzufügen und löschen, nicht
                aber die obigen Angaben ändern.
                <br />
                Nach Erstellung der Inventur werden die angegebenen Benutzer
                darüber benachrichtigt, dass sie diese Inventur durchführen
                sollen.
              </Form.Text>
            </Form.Group>

            {inventory?._id && (
              <div className="form-floating mt-2">
                <select
                  className="form-select bg-light"
                  id="status"
                  name="status"
                  placeholder="Status"
                  value={status}
                  onChange={onStatusChanged}
                  required
                  disabled={!user.isAdmin}
                >
                  <option className="mr-3" value={INVENTORY_STATUS.OPEN}>
                    {LIST_STATUS_LANG.OPEN}
                  </option>
                  <option className="mr-3" value={INVENTORY_STATUS.IN_PROGRESS}>
                    {LIST_STATUS_LANG.IN_PROGRESS}
                  </option>
                  <option className="mr-3" value={INVENTORY_STATUS.DONE}>
                    {LIST_STATUS_LANG.DONE}
                  </option>
                </select>
                <label htmlFor="status">Status</label>
              </div>
            )}

            <Button
              startIcon={<CallMerge />}
              className="mt-2"
              variant="outlined"
              color="warning"
              onClick={onFinishInventory}
            >
              Doppelte Teile zusammenführen
            </Button>
          </Form>
        </CarouselItem>

        <CarouselItem>
          <div className="mt-3">
            <AddablePartsList
              parts={parts}
              partsList={inventoryParts}
              setPartsList={setInventoryParts}
            />
          </div>
        </CarouselItem>
      </TabSlide>

      <FloatingButton
        onClick={handleSaveInventory}
        disabled={isSaving}
        icon={
          isSaving ? (
            <Spinner />
          ) : (
            <SaveIcon fill="white" width="25px" height="25px" />
          )
        }
      ></FloatingButton>
    </DefaultContainer>
  );
};

export default InventoryContent;
