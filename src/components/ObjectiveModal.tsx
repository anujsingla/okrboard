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
  FormSelect,
  FormSelectOption,
  Switch
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { find, map, isEmpty, filter } from 'lodash';
import { ILabel } from '../models/shared';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import moment from 'moment-timezone';
import { useMutation, queryCache, useQuery } from 'react-query';
import { createObjective, editObjective, getAllDepartments, getObjectives, getUsers } from '../api/apis';
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
  status?: string;
  isToggleSwitch?: boolean;
  objectiveName?: ILabel;
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
  },
  objectiveName: {
    label: '',
    value: ''
  },
  status: 'In Progress',
  isToggleSwitch: false
};

const status = ['In Progress', 'Done'];

const statusOptions = map(status, (s) => ({label: s, value: s}));

export function ObjectiveModal(props: IProps) {
  const { isModalOpen, onCloseModal, modalType, objectiveData } = props;
  const [values, setValues] = useState(formInitState);
  const [isSelectDepartmentOpen, setIsSelectDepartmentOpen] = useState(false);
  const [isSelectUserOpen, setIsSelectUserOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape>(null);
  const [isSelectObjectiveOpen, setIsSelectObjectiveOpen] = useState(false);

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

  const objectivesData = useQuery(ReactQueryConstant.OBJECTIVES, getObjectives, {
    staleTime: Infinity
  });

  const toggleSelectDepartment = isExpanded => setIsSelectDepartmentOpen(isExpanded);
  const toggleSelectUser = isExpanded => setIsSelectUserOpen(isExpanded);
  const toggleSelectObjective = isExpanded => setIsSelectObjectiveOpen(isExpanded);

  const departmentOptions = map(departmentsData?.data, d => ({ value: d.id, label: d.name }));
  const usersOptions = map(usersData?.data, d => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }));
  const filterObjective = filter(objectivesData?.data, (d) => isEmpty(d.keyResults));
  const objectiveOptions = map(filterObjective, d => ({ value: d.id, label: d.title }));

  useEffect(() => {
    if (modalType === ModalType.EDIT && !isEmpty(objectiveData)) {
      const { title, owner, department, ...restValue } = objectiveData;
      setValues({
        ...values,
        ...restValue,
        departmentName: find(departmentOptions, d => d.value === department.id),
        ownerName: find(usersOptions, d => d.value === owner.id),
        objectiveTitle: title,
        isToggleSwitch: isEmpty(objectiveData?.parent) ? false : true,
        objectiveName: find(objectiveOptions, d => d.value === objectiveData?.parent?.id),
      });
    } else {
      setValues({ ...values, ...formInitState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, objectiveData]);

  const handleModalToggle = () => {
    onCloseModal();
  };
  const objectivePayload = () => {
      return {
        department: find(departmentsData.data, d => d.id === values.departmentName.value),
        owner: find(usersData.data, d => d.id === values.ownerName.value),
        parent: find(filterObjective, d => d.id === values.objectiveName.value),
        title: values.objectiveTitle,
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
        status: values.status
      }
  }
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const payload = objectivePayload();
      if (modalType === ModalType.EDIT && !isEmpty(objectiveData)) {
        await editObjectiveData({ payload, id: objectiveData.id });
      } else {
        await sObjective(payload);
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

  const onStatusChange = value => {
    setValues({
      ...values,
      status: value || ''
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
  const onToggleSwitch = isChecked => {
    setValues({
      ...values,
      isToggleSwitch: isChecked || false
    });
  };
  const onObjectiveChange = (event, selection) => {
    setValues({
      ...values,
      objectiveName: find(objectiveOptions, d => d.value === selection)
    });
    toggleSelectObjective(false);
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
  return (
    <Modal
      className="objective-modal"
      title={modalType === ModalType.CREATE ? "Create Objective" : "Update Objective"}
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
        <FormGroup fieldId={'parentobjective'}>
        <Switch
          aria-label="parentobjective"
          label={'Parent Objective'}
          labelOff={'Parent Objective'}
          isChecked={values.isToggleSwitch}
          onChange={onToggleSwitch}
          />
      </FormGroup>
      {values.isToggleSwitch &&
        <FormGroup label="Parent Objective" fieldId={'Objective'}>
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
        </FormGroup>}
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
        <FormGroup label="Status" fieldId={'status'} isRequired>
        <FormSelect value={values.status} onChange={onStatusChange} aria-label="FormSelect Input">
        {statusOptions.map((option, index) => (
          <FormSelectOption key={index} value={option.value} label={option.label} />
        ))}
      </FormSelect>
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
