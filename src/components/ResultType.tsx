import React, { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, InputGroup, Form, Col } from 'react-bootstrap';

const ResultTypes = {
  PERCENTAGE: 'percentage',
  BINARY: 'binary',
  NUMBER: 'number'
};
export function ResultType() {
  const [value, setValue] = useState(ResultTypes.PERCENTAGE);
  const handleChange = (val: any) => setValue(val);
  const renderPercentage = () => {
    if (value === ResultTypes.PERCENTAGE) {
      return (
        <div className="d-flex">
          <div className="mr-1">
            <Form.Label>Start</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="0" />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div>
            <Form.Label>Target</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="100" />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderNumber = () => {
    if (value === ResultTypes.NUMBER) {
      return (
        <div className="d-flex">
          <div className="mr-1">
            <Form.Label>Start</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="0" />
            </InputGroup>
          </div>
          <div>
            <Form.Label>Target</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="100" />
            </InputGroup>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderBinary = () => {
    if (value === ResultTypes.BINARY) {
      return (
        <>
          <Form.Label>Status</Form.Label>
          <ToggleButtonGroup
            className="input-group"
            name="resulttype"
            type="radio"
            value={value}
            onChange={handleChange}
          >
            <ToggleButton variant="secondary" defaultChecked value={ResultTypes.PERCENTAGE}>
              In Progress
            </ToggleButton>
            <ToggleButton variant="secondary" value={ResultTypes.BINARY}>
              Done
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      );
    } else {
      return null;
    }
  };
  return (
    <Form.Row>
      <Form.Group as={Col} controlId="formGridEmail">
        <div className="d-flex flex-column">
          <Form.Label>Result Type</Form.Label>
          <ToggleButtonGroup name="resulttype" type="radio" value={value} onChange={handleChange}>
            <ToggleButton variant="secondary" defaultChecked value={ResultTypes.PERCENTAGE}>
              %
            </ToggleButton>
            <ToggleButton variant="secondary" value={ResultTypes.BINARY}>
              Binary
            </ToggleButton>
            <ToggleButton variant="secondary" value={ResultTypes.NUMBER}>
              Number
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridPassword">
        {renderPercentage()}
        {renderBinary()}
        {renderNumber()}
      </Form.Group>
    </Form.Row>
  );
}
