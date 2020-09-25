import {
  TextInput,
  Button,
  Modal,
  FormGroup,
  Spinner,
  Form
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useMutation, queryCache } from 'react-query';
import { createDepartment, editDepartment } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { ModalType } from './Objectives';
import { ReactQueryConstant } from '../models/reactQueryConst';

interface IProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  modalType: ModalType;
  departmentData: any;
}

export interface IFormData {
  name?: string;
}

const formInitState: IFormData = {
    name: ''
};

export function DepartmentModal(props: IProps) {
  const { isModalOpen, onCloseModal, modalType, departmentData } = props;
  const [values, setValues] = useState(formInitState);
  const [cDepartment, cDepartmentData] = useMutation(createDepartment, {
    onError: () => {
        addDangerMessage('Error in creating Department.');
      },
      onSuccess: () => {
        addSuccessMessage('Successfully created Department.');
      },
      onSettled: (data, error) => {
        queryCache.invalidateQueries(ReactQueryConstant.DEPARTMENTS);
      }
  });

  const [editDepartmentData, editDepartmentFormData] = useMutation(editDepartment, {
    onError: () => {
        addDangerMessage('Error in creating Department.');
      },
      onSuccess: () => {
        addSuccessMessage('Successfully created Department.');
      },
      onSettled: (data, error) => {
        queryCache.invalidateQueries(ReactQueryConstant.DEPARTMENTS);
      }
  });

  useEffect(() => {
    if (modalType === ModalType.EDIT && !isEmpty(departmentData)) {
      const { name } = departmentData;
      setValues({
        ...values,
        name
      });
    } else {
      setValues({ ...values, ...formInitState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, departmentData]);

  const handleModalToggle = () => {
    onCloseModal();
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (modalType === ModalType.EDIT && !isEmpty(departmentData)) {
        const payload = {
          // department: find(departmentsData.data, d => d.id === values.departmentName.value),
          name: values.name
        };
       await editDepartmentData({ payload, id: departmentData.id });
       setValues({ ...formInitState });
      } else {
        const payload = {
            name: values.name
        };
        await cDepartment(payload);
        setValues({ ...formInitState });
      }
      onCloseModal();
    } catch (error) {
        console.log('handleSubmit error', error);
      onCloseModal();
    }
  };

  const onNameChange = value => {
    setValues({
      ...values,
      name: value || ''
    });
  };

  const isLoadingData = () => {
      if (cDepartmentData.isLoading || editDepartmentFormData.isLoading) {
          return true;
      }
      return false;
  }

  return (
    <Modal
      className="department-modal pf-m-md"
      title={modalType === ModalType.CREATE ? "Create Department" : "Update Department"}
      key="department-modal"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <>
          {!isLoadingData() && (
            <>
              <Button isDisabled={isLoadingData()} key="confirm" variant="primary" onClick={handleSubmit} disabled={false}>
                Submit
              </Button>
              <Button isDisabled={isLoadingData()} key="cancel" variant="link" onClick={handleModalToggle}>
                Cancel
              </Button>
            </>
          )}
          {isLoadingData() && <Spinner size="lg" />}
        </>
      ]}
    >
      <Form isHorizontal action="" onSubmit={handleSubmit}>
        <FormGroup label="Name" fieldId={'departmentname'} isRequired>
          <TextInput
            isRequired
            type="text"
            id="departmentname"
            name="departmentname"
            value={values.name}
            onChange={onNameChange}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
}
