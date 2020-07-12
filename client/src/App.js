import React, { useState, useEffect } from "react";
import { HexGrid, Layout, Hexagon, Text } from "react-hexgrid";
import "./App.css";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {NotificationContainer, NotificationManager} from 'react-notifications';

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
  const [cluster, setCluster] = useState({});
  const [deletingHexagon, setDeletingHexagon] = useState(null);

  const handleClose = () => {
    setDeletingHexagon(null);
    setShow(false);
  };
  const handleShow = (props) => {
    setDeletingHexagon(props.target.innerHTML);
    setShow(true);
  };

  const handleDelete = async (props) => {
    setShow(false);
    try {
      const response = await Axios.delete("http://localhost:3001/api/hexagon/" + deletingHexagon);
      loadCluster();
      if (response.status === 200 && response.data) {
        NotificationManager.success("Deleted successfully", "Hexaland");
      }
    } catch (error) {
      NotificationManager.error(error.message, "Hexaland");
    }
  }

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
      <h2 className="whiteText">Covid Hexaland</h2>
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
          <Modal.Title>Delete Hexagon</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really wanna delete this hexagon?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <NotificationContainer/>
    </div>
  );
}

export default App;
