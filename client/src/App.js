import React, { useState, useEffect } from "react";
import { HexGrid, Layout, Hexagon, Text } from "react-hexgrid";
import "./App.css";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

const getCoordinates = (x, y, idx) => {
  switch (idx) {
    case 0:
      return [x, y - 1];
    case 1:
      return [x + 1, y - 1];
    case 2:
      return [x + 1, y];
    case 3:
      return [x, y + 1];
    case 4:
      return [x - 1, y + 1];
    case 5:
      return [x - 1, y];
    default:
      return [x, y];
  }
};

const getNeighborCount = (neighbors) => {
  return neighbors.filter((n) => n !== null).length;
};

function App() {
  const [show, setShow] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [cluster, setCluster] = useState({});
  const [deletingHexagon, setDeletingHexagon] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [variant, setVariant] = useState("success");
  const [notificationText, setNotificationText] = useState("");
  const [hotspotName, setHotspotName] = useState("");
  const [neighborHotspot, setNeighborHotspot] = useState("");
  const [neighborBorder, setNeighborBorder] = useState(null);

  const handleClose = () => {
    setDeletingHexagon(null);
    setShow(false);
  };
  const handleShow = (props) => {
    setDeletingHexagon(props.target.innerHTML);
    setShow(true);
  };

  const onChangeHotspotName = (e) => setHotspotName(e.target.value);
  const onChangeHotspotNeighbor = (e) => setNeighborHotspot(e.target.value);
  const onChangeHotspotNeighborBorder = (e) =>
    setNeighborBorder(e.target.value);

  const handleCloseInsertModal = () => {
    setHotspotName("");
    setNeighborHotspot("");
    setNeighborBorder(null);

    setShowInsertModal(false);
  };
  const handleShowInsertModal = (props) => {
    setShowInsertModal(true);
  };

  const handleAddHotspot = async (props) => {
    try {
      const response = await Axios.post("http://localhost:3001/api/hexagon/", {
        name: hotspotName,
        neighbor: neighborHotspot,
        border: parseInt(neighborBorder, 10),
      });
      if (response.status === 200 && response.data) {
        showNotificationTooltip("success", "Hotspot added successfully!");
        loadCluster();
        setHotspotName("");
        setNeighborHotspot("");
        setNeighborBorder(null);

        setShowInsertModal(false);
      }
    } catch (error) {
      showNotificationTooltip("danger", error.response.data.message);
    }
  };

  const handleDelete = async (props) => {
    setShow(false);
    try {
      const response = await Axios.delete(
        "http://localhost:3001/api/hexagon/" + deletingHexagon
      );
      loadCluster();
      if (response.status === 200 && response.data) {
        showNotificationTooltip("success", "Hotspot deleted successfully!");
      }
    } catch (error) {
      showNotificationTooltip("danger", "Can not delete this hotspot!");
    }
  };

  const showNotificationTooltip = (type, text) => {
    setShowNotification(true);
    setVariant(type);
    setNotificationText(text);

    setTimeout(() => {
      setShowNotification(false);
      setVariant("");
      setNotificationText("");
    }, 2000);
  };

  const loadCluster = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/api/hexagon");
      const cluster = response.data;
      let center = ["", -1];

      for (const [key, value] of Object.entries(cluster)) {
        const neighborCount = getNeighborCount(value);
        if (neighborCount > center[1]) {
          center = [key, neighborCount];
        }
      }

      const coordinates = {
        [center[0]]: [0, 0],
      };

      const queue = [center[0]];
      const visitedHexagons = [center[0]];

      while (queue.length !== 0) {
        const hexagon = queue.shift();
        const neighbors = cluster[hexagon];
        const [baseX, baseY] = coordinates[hexagon];

        neighbors.forEach((neighbor, idx) => {
          if (!neighbor || visitedHexagons.includes(neighbor)) {
            return;
          }

          visitedHexagons.push(neighbor);
          coordinates[neighbor] = getCoordinates(baseX, baseY, idx);
          queue.push(neighbor);
        });
      }

      console.log(coordinates);

      setCluster(coordinates);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    loadCluster();
  }, []);

  const hexagonSize = { x: 4, y: 4 };

  return (
    <div className="App">
      <h2 className="whiteText left-align">Covid Hexaland</h2>
      <Button variant="primary right-align" onClick={handleShowInsertModal}>
        Add Hotspot
      </Button>

      <row>
        <div className="col-md-4 offset-8">
          <Alert variant={variant} hidden={!showNotification}>
            {notificationText}
          </Alert>
        </div>
      </row>

      <HexGrid width={1200} height={600} viewBox="-50 -50 100 100">
        <Layout
          size={hexagonSize}
          flat={true}
          spacing={1.1}
          origin={{ x: 0, y: 0 }}
        >
          {Object.keys(cluster).map((hexagon) => {
            const [x, y] = cluster[hexagon];
            return (
              <Hexagon key={hexagon} q={x} r={y} s={0} onClick={handleShow}>
                <Text>{hexagon}</Text>
              </Hexagon>
            );
          })}
        </Layout>
      </HexGrid>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Hotspot</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really wanna delete this hotspot?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInsertModal} onHide={handleCloseInsertModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Hotspot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupEmail">
              <Form.Label className="left-align">Hotspot Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of hotspot you want to add"
                onChange={onChangeHotspotName}
              />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label className="left-align">Neighbor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of neighbor you want to add hotspot against"
                onChange={onChangeHotspotNeighbor}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label className="left-align">Neighbor Border</Form.Label>
              <Form.Control
                as="select"
                onChange={onChangeHotspotNeighborBorder}
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInsertModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddHotspot}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
