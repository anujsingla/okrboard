import {
  TextArea,
  TextInput,
  Button,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectVariant,
  FormGroup,
  Spinner,
  Form,
  Grid,
  GridItem
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { find, map, isEmpty, filter } from 'lodash';
import { ILabel } from '../models/shared';
import { useMutation, useQuery, queryCache } from 'react-query';
import { createKeyResult, editKeyResult, getAllDepartments, getUsers, getObjectives } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { ModalType } from './Objectives';
import { ReactQueryConstant } from '../models/reactQueryConst';
import Slider from 'react-input-slider';

interface IProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  modalType: ModalType;
  keyResultData: any;
}

export interface IFormData {
  departmentName?: ILabel;
  objectiveName?: ILabel;
  ownerName?: ILabel;
  keyResultTitle?: string;
  resultType?: string;
  description?: string;
  currentState?: number;
  targetState?: number;
}

const formInitState: IFormData = {
  keyResultTitle: '',
  resultType: '',
  description: '',
  departmentName: {
    label: '',
    value: ''
  },
  ownerName: {
    label: '',
    value: ''
  },
  objectiveName: {
    label: '',
    value: ''
  },
  currentState: 0,
  targetState: 100
};

export function KeyResultsModal(props: IProps) {
  const { isModalOpen, onCloseModal, modalType, keyResultData } = props;
  const [values, setValues] = useState(formInitState);
  const [isSelectDepartmentOpen, setIsSelectDepartmentOpen] = useState(false);
  const [isSelectUserOpen, setIsSelectUserOpen] = useState(false);
  const [isSelectObjectiveOpen, setIsSelectObjectiveOpen] = useState(false);

  const [cKeyResult, { isLoading }] = useMutation(createKeyResult, {
    onError: () => {
      addDangerMessage('Error in creating Key Result.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully created Key Result.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.KEY_RESULTS);
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
    }
  });
  const [editKeyResultData] = useMutation(editKeyResult, {
    onError: () => {
      addDangerMessage('Error in editing Key Result.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully edited Key Result.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.KEY_RESULTS);
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
    }
  });

  const departmentsData = useQuery(ReactQueryConstant.DEPARTMENTS, getAllDepartments, {
    staleTime: Infinity
  });

  const usersData = useQuery(ReactQueryConstant.USERS, getUsers, {
    staleTime: Infinity
  });

  const objectiveData = useQuery(ReactQueryConstant.OBJECTIVES, getObjectives, {
    staleTime: Infinity
  });

  const toggleSelectDepartment = isExpanded => setIsSelectDepartmentOpen(isExpanded);
  const toggleSelectUser = isExpanded => setIsSelectUserOpen(isExpanded);
  const toggleSelectObjective = isExpanded => setIsSelectObjectiveOpen(isExpanded);

  const departmentOptions = map(departmentsData.data, d => ({ value: d.id, label: d.name }));
  const filterObjective = filter(objectiveData?.data, d => isEmpty(d.children));
  const objectiveOptions = map(filterObjective, d => ({ value: d.id, label: d.title }));

  const usersOptions = map(usersData.data, d => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }));

  useEffect(() => {
    if (modalType === ModalType.EDIT && !isEmpty(keyResultData)) {
      const { objective, title, owner, department, ...restValue } = keyResultData;
      setValues({
        ...values,
        ...restValue,
        departmentName: find(departmentOptions, d => d.value === department?.id),
        ownerName: find(usersOptions, d => d.value === owner?.id),
        objectiveName: find(objectiveOptions, d => d.value === objective?.id),
        keyResultTitle: title
      });
    } else {
      setValues({ ...values, ...formInitState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, keyResultData]);

  const handleModalToggle = () => {
    onCloseModal();
  };
  const keyResultPayload = () => {
    return {
      department: find(departmentsData.data, d => d.id === values.departmentName.value),
      owner: find(usersData.data, d => d.id === values.ownerName.value),
      objective: find(filterObjective, d => d.id === values.objectiveName.value),
      title: values.keyResultTitle,
      description: values.description,
      currentState: Number(values.currentState),
      targetState: Number(values.targetState)
    };
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = keyResultPayload();
      if (modalType === ModalType.EDIT && !isEmpty(keyResultData)) {
        await editKeyResultData({ payload, id: keyResultData.id });
      } else {
        await cKeyResult(payload);
      }
      onCloseModal();
    } catch (error) {}
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
  const onUserChange = (event, selection) => {
    setValues({
      ...values,
      ownerName: find(usersOptions, d => d.value === selection)
    });
    toggleSelectUser(false);
  };
  const onObjectiveChange = (event, selection) => {
    setValues({
      ...values,
      objectiveName: find(objectiveOptions, d => d.value === selection)
    });
    toggleSelectObjective(false);
  };
  const onClearUser = () => {
    setValues({
      ...values,
      ownerName: {
        label: '',
        value: ''
      }
    });
    toggleSelectUser(false);
  };
  const onClearObjective = () => {
    setValues({
      ...values,
      objectiveName: {
        label: '',
        value: ''
      }
    });
    toggleSelectObjective(false);
  };
  const onTitleChange = value => {
    setValues({
      ...values,
      keyResultTitle: value || ''
    });
  };
  const onCurrentStateChange = value => {
    setValues({
      ...values,
      currentState: value
    });
  };
  const onDescriptionChange = value => {
    setValues({
      ...values,
      description: value || ''
    });
  };

  return (
    <Modal
      className="keyresult-modal"
      title={modalType === ModalType.CREATE ? 'Create Key Result' : 'Update Key Result'}
      isOpen={isModalOpen}
      variant={ModalVariant.small}
      onClose={handleModalToggle}
      actions={[
        <>
          {!isLoading && (
            <>
              <Button isDisabled={isLoading} key="confirm" variant="primary" onClick={handleSubmit} disabled={false}>
                Submit
              </Button>
              <Button isDisabled={isLoading} key="cancel" variant="link" onClick={handleModalToggle}>
                Cancel
              </Button>
            </>
          )}
          {isLoading && <Spinner size="lg" />}
        </>
      ]}
    >
      <Form action="" onSubmit={handleSubmit}>
        <FormGroup label="Objective" fieldId={'Objective'} isRequired>
          <Select
            id="objective" //Needs to be unique, but I don't have time
            variant={SelectVariant.typeahead}
            isOpen={isSelectObjectiveOpen}
            onToggle={toggleSelectObjective}
            onSelect={onObjectiveChange}
            menuAppendTo="parent"
            onClear={onClearObjective}
            selections={values?.objectiveName?.label}
          >
            {(objectiveOptions || []).map((value, index) => (
              <SelectOption key={`${value.value}-${index}`} value={value.value}>
                {value.label}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
        {modalType === ModalType.CREATE && (
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
              {(departmentOptions || []).map((value, index) => (
                <SelectOption
                  isSelected={value.value === values.departmentName.value}
                  key={`${value.value}-${index}`}
                  value={value.value}
                >
                  {value.label}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
        )}
        <FormGroup label="Owner" fieldId={'Owner'} isRequired>
          <Select
            id="owner" //Needs to be unique, but I don't have time
            variant={SelectVariant.typeahead}
            isOpen={isSelectUserOpen}
            onToggle={toggleSelectUser}
            onSelect={onUserChange}
            menuAppendTo="parent"
            onClear={onClearUser}
            selections={values.ownerName && values.ownerName.label}
          >
            {(usersOptions || []).map((value, index) => (
              <SelectOption key={`${value.value}-${index}`} value={value.value}>
                {value.label}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Title" fieldId={'Title'} isRequired>
          <TextInput
            isRequired
            type="text"
            id="objective_title"
            name="objective_title"
            value={values.keyResultTitle}
            onChange={onTitleChange}
          />
        </FormGroup>
        <FormGroup label="Description" fieldId={'Description'} isRequired>
          <TextArea
            value={values.description}
            onChange={onDescriptionChange}
            name="objective_description"
            id="objective_description"
          />
        </FormGroup>
        <FormGroup label="Progress" fieldId={'progress'} isRequired>
          <Grid hasGutter className="align-item-center">
            <GridItem span={10}>
              <Slider x={values.currentState} onChange={v => onCurrentStateChange(v?.x)} />
            </GridItem>
            <GridItem span={2}>
              <TextInput value={values.currentState} onChange={onCurrentStateChange} id="start_start" type="number" />
            </GridItem>
          </Grid>
        </FormGroup>
      </Form>
    </Modal>
  );
}
