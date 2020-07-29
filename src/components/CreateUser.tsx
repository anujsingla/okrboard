import React from 'react';
import { Spinner, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, FormikProps } from 'formik';
import { object, string } from 'yup';
import { useQuery, useMutation } from 'react-query';
import { getAllDepartments, createUsers } from '../api/apis';
import Select from 'react-select';
import map from 'lodash/map';
import { ILabel } from '../models/shared';
import { find } from 'lodash';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';

interface ICreateUsers {
  firstName: string;
  lastName: string;
  departmentName: ILabel;
}

const formSchema = object({
  firstName: string().required('First Name is required field'),
  lastName: string().required('Last Name is required field')
});

const initialValues: ICreateUsers = {
  firstName: '',
  lastName: '',
  departmentName: {
    label: '',
    value: '',
    key: ''
  }
};

export function CreateUser() {
  const department = useQuery('getAllDepartments', getAllDepartments);
  const [cUsers, { isLoading }] = useMutation(createUsers, {});
  const renderForms = (formikProps: FormikProps<ICreateUsers>) => {
    const { touched, errors, handleSubmit, handleChange, values, setFieldValue } = formikProps;
    const departmentOptions = map(department.data, d => ({ value: d.id, label: d.name }));
    return (
      <form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="objectiveTitle">
          <Form.Label>Department</Form.Label>
          <Select
            onChange={option => setFieldValue('departmentName', option)}
            placeholder="select department"
            name="departmentName"
            value={values.departmentName}
            options={departmentOptions}
          />
          <Form.Label>First Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="firstName"
            isInvalid={touched['firstName'] && !!errors['firstName']}
            type="text"
            placeholder="First Name"
            value={values['firstName']}
          />
          <Form.Control.Feedback type="invalid">{errors['firstName']}</Form.Control.Feedback>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="lastName"
            isInvalid={touched['lastName'] && !!errors['lastName']}
            type="text"
            placeholder="Last Name"
            value={values['lastName']}
          />
          <Form.Control.Feedback type="invalid">{errors['lastName']}</Form.Control.Feedback>
        </Form.Group>
        {isLoading && <Spinner animation="border" />}
        {!isLoading && <Button type="submit">Create Users</Button>}
      </form>
    );
  };
  const submitUsers = async (values: ICreateUsers, actions: any) => {
    try {
      await cUsers({
        departments: find(department.data, d => d.id === values.departmentName.value),
        firstName: values.firstName,
        lastName: values.lastName
      });
      addSuccessMessage('Successfully created User.');
    } catch (error) {
      addDangerMessage('Error in creating User.');
    }
  };
  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Formik validationSchema={formSchema} onSubmit={submitUsers} initialValues={initialValues}>
            {formik => renderForms(formik)}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
