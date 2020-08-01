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
  Form
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { find, map, isEmpty } from 'lodash';
import { ILabel } from '../models/shared';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import moment from 'moment-timezone';
import { useMutation, queryCache, useQuery } from 'react-query';
import { createObjective, editObjective, getAllDepartments, getUsers } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { ModalType } from './Objectives';
import { ReactQueryConstant } from '../models/reactQueryConst';

interface IProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  modalType: ModalType;
  objectiveData: any;
}

export interface IFormData {
  objectiveTitle?: string;
  description?: string;
  endDate?: string;
  startDate?: string;
  departmentName?: ILabel;
  ownerName?: ILabel;
}

const formInitState: IFormData = {
  objectiveTitle: '',
  description: '',
  endDate: moment().format('YYYY-MM-DD'),
  startDate: moment().format('YYYY-MM-DD'),
  departmentName: {
    label: '',
    value: ''
  },
  ownerName: {
    label: '',
    value: ''
  }
};

export function ObjectiveModal(props: IProps) {
  const { isModalOpen, onCloseModal, modalType, objectiveData } = props;
  const [values, setValues] = useState(formInitState);
  const [isSelectDepartmentOpen, setIsSelectDepartmentOpen] = useState(false);
  const [isSelectUserOpen, setIsSelectUserOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape>(null);
  const [sObjective, saveObjectiveInfo] = useMutation(createObjective, {
    onError: () => {
      addDangerMessage('Error in creating objective.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully created Objective.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
    }
  });
  const [editObjectiveData, editObjectiveInfo] = useMutation(editObjective, {
    onError: () => {
      addDangerMessage('Error in editing objective.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully edited Objective.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
    }
  });

  const departmentsData = useQuery(ReactQueryConstant.DEPARTMENTS, getAllDepartments, {
    staleTime: Infinity
  });

  const usersData = useQuery(ReactQueryConstant.USERS, getUsers, {
    staleTime: Infinity
  });

  const toggleSelectDepartment = isExpanded => setIsSelectDepartmentOpen(isExpanded);
  const toggleSelectUser = isExpanded => setIsSelectUserOpen(isExpanded);

  const departmentOptions = map(departmentsData.data, d => ({ value: d.id, label: d.name }));
  const usersOptions = map(usersData.data, d => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }));

  useEffect(() => {
    if (modalType === ModalType.EDIT && !isEmpty(objectiveData)) {
      const { title, startDate, endDate, description, owner, department } = objectiveData;
      setValues({
        ...values,
        departmentName: find(departmentOptions, d => d.value === department.id),
        ownerName: find(usersOptions, d => d.value === owner.id),
        objectiveTitle: title,
        startDate: startDate,
        endDate: endDate,
        description: description
      });
    } else {
      setValues({ ...formInitState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, objectiveData]);

  const handleModalToggle = () => {
    onCloseModal();
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (modalType === ModalType.EDIT && !isEmpty(objectiveData)) {
        const payload = {
          department: find(departmentsData.data, d => d.id === values.departmentName.value),
          owner: find(usersData.data, d => d.id === values.ownerName.value),
          title: values.objectiveTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description
        };
        await editObjectiveData({ payload, id: objectiveData.id });
      } else {
        await sObjective({
          department: find(departmentsData.data, d => d.id === values.departmentName.value),
          owner: find(usersData.data, d => d.id === values.ownerName.value),
          title: values.objectiveTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description
        });
      }
      onCloseModal();
    } catch (error) {
      onCloseModal();
    }
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
    console.log('onUserChange', selection);
    setValues({
      ...values,
      ownerName: find(usersOptions, d => d.value === selection)
    });
    toggleSelectUser(false);
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
  const onTitleChange = value => {
    setValues({
      ...values,
      objectiveTitle: value || ''
    });
  };
  const onDescriptionChange = value => {
    setValues({
      ...values,
      description: value || ''
    });
  };
  const onDatesChange = ({ startDate, endDate }) => {
    if (endDate && endDate.isSameOrAfter(startDate)) {
      setValues({
        ...values,
        startDate: moment(startDate).format('YYYY-MM-DD') || '',
        endDate: moment(endDate).format('YYYY-MM-DD') || ''
      });
    }
  };
  return (
    <Modal
      className="objective-modal"
      title="Create Objective"
      isOpen={isModalOpen}
      variant={ModalVariant.small}
      onClose={handleModalToggle}
      actions={[
        <>
          {!(saveObjectiveInfo.isLoading || editObjectiveInfo.isLoading) && (
            <>
              <Button
                isDisabled={saveObjectiveInfo.isLoading}
                key="confirm"
                variant="primary"
                onClick={handleSubmit}
                disabled={false}
              >
                Submit
              </Button>
              <Button isDisabled={saveObjectiveInfo.isLoading} key="cancel" variant="link" onClick={handleModalToggle}>
                Cancel
              </Button>
            </>
          )}
          {(saveObjectiveInfo.isLoading || editObjectiveInfo.isLoading) && <Spinner size="lg" />}
        </>
      ]}
    >
      <Form action="" onSubmit={handleSubmit}>
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
            value={values.objectiveTitle}
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
        <FormGroup label="Date" fieldId={'Date'} isRequired>
          <DateRangePicker
            onDatesChange={onDatesChange}
            startDate={moment(values.startDate)}
            endDate={moment(values.endDate)}
            onFocusChange={change => setFocusedInput(change)}
            focusedInput={focusedInput}
            startDateId={'start_date'}
            startDatePlaceholderText="Start Date"
            endDateId={'end_date'}
            endDatePlaceholderText="End Date"
            isOutsideRange={() => false}
            openDirection="up"
          />
        </FormGroup>
      </Form>
    </Modal>
  );
}
