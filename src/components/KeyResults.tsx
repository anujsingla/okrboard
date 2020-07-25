import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, FormikProps } from 'formik';
import { object, string } from 'yup';
import { ResultType } from './ResultType';
import Select from 'react-select';
import { ILabel } from '../models/shared';
import { useQuery, useMutation } from 'react-query';
import { getAllDepartments, getObjectives, createKeyResult } from '../api/workstation';
import map from 'lodash/map';
import { find } from 'lodash';

// https://anujsingla.atlassian.net/plugins/servlet/ac/okrplugin_prod/post-install#!/okr-explorer?expandedItems=%5B%2275330-0%22,%2275332-1%22,%2275331-1%22,%2275333-1%22,%2275335-1%22,%2275336-1%22,%2275337-1%22,%2275334-1%22,%2275338-2%22,%2275342-3%22,%2275345-3%22,%2275346-3%22,%2275343-3%22,%2275339-2%22,%2275340-3%22,%2275344-3%22,%2275341-3%22,%220-0%22,%2275347-0%22%5D&assigneeIds=null&intervalId=9914&groupIds=null&gradeId=0&OKRTypeId=3

interface ICreateWorkstation {
  keyResultTitle: string;
  resultType: string;
  description: string;
  workstationName: ILabel;
  objectiveName: ILabel;
}

const formSchema = object({
  keyResultTitle: string().required('Name is a required field'),
  resultType: string(),
  description: string().required('Description is a required field')
});

const initialValues: ICreateWorkstation = {
  keyResultTitle: '',
  resultType: '',
  description: '',
  workstationName: {
    label: '',
    value: '',
    key: ''
  },
  objectiveName: {
    label: '',
    value: '',
    key: ''
  }
};

export function KeyResults() {
  const workstation = useQuery('getAllDepartments', getAllDepartments);
  const objective = useQuery('getAllObjective', getObjectives);
  const [createKResult] = useMutation(createKeyResult, {});

  const renderForms = (formikProps: FormikProps<ICreateWorkstation>) => {
    const { setFieldValue, touched, errors, handleSubmit, handleChange, values } = formikProps;
    const workstationOptions = map(workstation.data, d => ({ value: d.id, label: d.name }));
    const objectiveOptions = map(objective.data, d => ({ value: d.id, label: d.title }));

    return (
      <form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="keyResultTitle">
          <Form.Label>Department</Form.Label>
          <Select
            onChange={option => setFieldValue('workstationName', option)}
            placeholder="select department"
            name="workstationName"
            value={values.workstationName}
            options={workstationOptions}
          />
          <Form.Label>Objective</Form.Label>
          <Select
            onChange={option => setFieldValue('objectiveName', option)}
            placeholder="select objective"
            name="objectiveName"
            value={values.objectiveName}
            options={objectiveOptions}
          />
          <Form.Label>Key Result Title</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="keyResultTitle"
            isInvalid={touched['keyResultTitle'] && !!errors['keyResultTitle']}
            type="text"
            placeholder="key Result title"
            value={values['keyResultTitle']}
          />
          <Form.Control.Feedback type="invalid">{errors['keyResultTitle']}</Form.Control.Feedback>
          <ResultType />
          <Form.Control.Feedback type="invalid">{errors['resultType']}</Form.Control.Feedback>
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="description"
            isInvalid={touched['description'] && !!errors['description']}
            type="text"
            placeholder="description"
            value={values['description']}
          />
          <Form.Control.Feedback type="invalid">{errors['description']}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Create Key Result</Button>
      </form>
    );
  };
  const submitKeyResult = (values: ICreateWorkstation, actions: any) => {
    createKResult({
      department: find(workstation.data, d => d.id === values.workstationName.value),
      description: values.description,
      objective: find(objective.data, d => d.id === values.objectiveName.value),
      title: values.keyResultTitle,
      owner: {
        id: 2,
        firstName: 'first name',
        lastName: 'last name',
        departments: [
          {
            id: 1,
            name: 'dummy department',
            children: []
          }
        ]
      },
      type: {
        label: 'percentage',
        type: 'percentage'
      }
    });
  };
  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Formik validationSchema={formSchema} onSubmit={submitKeyResult} initialValues={initialValues}>
            {formik => renderForms(formik)}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
