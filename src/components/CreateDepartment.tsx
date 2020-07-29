import React from 'react';
import { Spinner, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, FormikProps } from 'formik';
import { object, string } from 'yup';
import { useMutation } from 'react-query';
import { addDepartment } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';

interface ICreateDepartment {
  name: string;
}

const formSchema = object({
  name: string().required('Name is a required field')
});

const initialValues: ICreateDepartment = {
  name: ''
};

export function CreateDepartment() {
  const [submitDepartment, { isLoading }] = useMutation(addDepartment, {});
  const renderForms = (formikProps: FormikProps<ICreateDepartment>) => {
    const { touched, errors, handleSubmit, handleChange, values } = formikProps;
    return (
      <form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="name"
            isInvalid={touched['name'] && !!errors['name']}
            type="text"
            placeholder="department name"
            value={values['name']}
          />
          <Form.Control.Feedback type="invalid">{errors['name']}</Form.Control.Feedback>
        </Form.Group>
        {isLoading && <Spinner animation="border" />}
        {!isLoading && <Button type="submit">Create Department</Button>}
      </form>
    );
  };
  const onSubmitDepartment = async (values: ICreateDepartment, actions: any) => {
    try {
      await submitDepartment({
        name: values.name
      });
      addSuccessMessage('Successfully created Department.');
    } catch (error) {
      addDangerMessage('Error in creating Department.');
    }
  };
  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Formik validationSchema={formSchema} onSubmit={onSubmitDepartment} initialValues={initialValues}>
            {formik => renderForms(formik)}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
