import {
    TextInput,
    Button,
    Modal,
    FormGroup,
    Spinner,
    Form,
    Select, SelectVariant, SelectOption
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { find, isEmpty } from 'lodash';
import { useMutation, queryCache, useQuery } from 'react-query';
import { createUsers, editUser, getAllDepartments } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { ModalType } from './Objectives';
import { ReactQueryConstant } from '../models/reactQueryConst';
import map from 'lodash/map';
import { ILabel } from '../models/shared';

interface IProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    modalType: ModalType;
    usersData: any;
}
  
  export interface IFormData {
    firstName?: string;
    lastName?: string;
    departmentName?: ILabel;
  }
  
  const formInitState: IFormData = {
    firstName: '',
    lastName: '',
      departmentName: {
        label: '',
        value: ''
      },
  };
  
  export function UsersModal(props: IProps) {
    const { isModalOpen, onCloseModal, modalType, usersData } = props;
    const [values, setValues] = useState(formInitState);
    const [cUser, cUserData] = useMutation(createUsers, {
      onError: () => {
          addDangerMessage('Error in creating User.');
        },
        onSuccess: () => {
          addSuccessMessage('Successfully created User.');
        },
        onSettled: (data, error) => {
          queryCache.invalidateQueries(ReactQueryConstant.USERS);
        }
    });
  
    const [editUserData, editUserFormData] = useMutation(editUser, {
      onError: () => {
          addDangerMessage('Error in creating User.');
        },
        onSuccess: () => {
          addSuccessMessage('Successfully created User.');
        },
        onSettled: (data, error) => {
          queryCache.invalidateQueries(ReactQueryConstant.USERS);
        }
    });
    const [isSelectDepartmentOpen, setIsSelectDepartmentOpen] = useState(false);
    const toggleSelectDepartment = isExpanded => setIsSelectDepartmentOpen(isExpanded);

    const departmentsData = useQuery(ReactQueryConstant.DEPARTMENTS, getAllDepartments, {
        staleTime: Infinity
      });
      const departmentOptions = map(departmentsData?.data, d => ({ value: d.id, label: d.name }));
  
    useEffect(() => {
      if (modalType === ModalType.EDIT && !isEmpty(usersData)) {
        const { firstName, lastName } = usersData;
        setValues({
          ...values,
          firstName: firstName,
          lastName: lastName,
          departmentName: find(departmentOptions, d => d.value === usersData?.departments?.id),
        });
      } else {
        setValues({ ...values, ...formInitState });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalType, usersData]);
  
    const handleModalToggle = () => {
      onCloseModal();
    };
    const onDepartmentChange = (event, selection) => {
        setValues({
          ...values,
          departmentName: find(departmentOptions, d => d.value === selection)
        });
        toggleSelectDepartment(false);
      };
      const onClearDepartment = () => {
        setValues({
          ...values,
          departmentName: {
            label: '',
            value: ''
          }
        });
        toggleSelectDepartment(false);
      };
      const userPayload = () => {
        return {
            departments: [find(departmentsData?.data, d => d.id === values.departmentName.value)],
            firstName: values.firstName,
            lastName: values.lastName
          };
      }
    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const payload = userPayload();
        if (modalType === ModalType.EDIT && !isEmpty(usersData)) {
         await editUserData({ payload, id: usersData?.id });
         setValues({ ...formInitState });
        } else {
          await cUser(payload);
          setValues({ ...formInitState });
        }
        onCloseModal();
      } catch (error) {
        console.log('handleSubmit error', error);
        onCloseModal();
      }
    };
  
    const onFirstNameChange = value => {
      setValues({
        ...values,
        firstName: value || ''
      });
    };

    const onLastNameChange = value => {
        setValues({
          ...values,
          lastName: value || ''
        });
      };
  
    const isLoadingData = () => {
        if (cUserData.isLoading || editUserFormData.isLoading) {
            return true;
        }
        return false;
    }
  
    return (
      <Modal
        className="user-modal pf-m-md"
        title={modalType === ModalType.CREATE ? "Create User" : "Update User"}
        key="user-modal"
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
        <FormGroup label="Department" fieldId={'Department'} isRequired>
          <Select
            id="department" //Needs to be unique, but I don't have time
            variant={SelectVariant.typeahead}
            isOpen={isSelectDepartmentOpen}
            onToggle={toggleSelectDepartment}
            onSelect={onDepartmentChange}
            menuAppendTo="parent"
            onClear={onClearDepartment}
            selections={values.departmentName && values.departmentName.label}
          >
            {map(departmentOptions, (value, index) => (
                <SelectOption
                  key={`${value?.value}-${index}`}
                  value={value?.value}
                >
                  {value?.label}
                </SelectOption>
              ))}
          </Select>
        </FormGroup>  
        <FormGroup label="First Name" fieldId={'firstname'} isRequired>
            <TextInput
              isRequired
              type="text"
              id="firstname"
              name="firstname"
              value={values.firstName}
              onChange={onFirstNameChange}
            />
          </FormGroup>
          <FormGroup label="Last Name" fieldId={'lastname'} isRequired>
          <TextInput
            isRequired
            type="text"
            id="lastname"
            name="lastname"
            value={values.lastName}
            onChange={onLastNameChange}
          />
        </FormGroup>
        </Form>
      </Modal>
    );
  }
  