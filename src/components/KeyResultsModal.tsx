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
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Flex,
  FlexItem,
  ButtonVariant,
  InputGroupText,
  InputGroup,
  Grid,
  GridItem
} from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { find, map, isEmpty } from 'lodash';
import { ILabel } from '../models/shared';
import { useMutation } from 'react-query';
import { createObjective, editObjective } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { ModalType } from './Objectives';
import { useApplicationStateContext, useApplicationDispatchContext } from '../context/ApplicationContext';
import { fetchObjective } from '../reducers/ApplicationReducer';

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
  }
};

const ResultTypes = {
  PERCENTAGE: 'percentage',
  BINARY: 'binary',
  NUMBER: 'number'
};

const BinaryButtonType = {
  IN_PROGRESS: 'in progress',
  DONE: 'done'
};

export function KeyResultsModal(props: IProps) {
  const { isModalOpen, onCloseModal, modalType, keyResultData } = props;
  const [values, setValues] = useState(formInitState);
  const [isSelectDepartmentOpen, setIsSelectDepartmentOpen] = useState(false);
  const [isSelectUserOpen, setIsSelectUserOpen] = useState(false);
  const [isSelectObjectiveOpen, setIsSelectObjectiveOpen] = useState(false);
  const [resultType, setResultType] = useState(ResultTypes.PERCENTAGE);
  const [binaryButtonType, setBinaryButtonType] = useState(BinaryButtonType.IN_PROGRESS);

  const applicationDisptach = useApplicationDispatchContext();
  const [sObjective, { isLoading }] = useMutation(createObjective, {
    onError: () => {
      addDangerMessage('Error in creating Key Result.');
      fetchObjective(applicationDisptach);
    },
    onSuccess: () => {
      addSuccessMessage('Successfully created Key Result.');
      fetchObjective(applicationDisptach);
    }
  });
  const [editObjectiveData] = useMutation(editObjective, {
    onError: () => {
      addDangerMessage('Error in editing Key Result.');
      fetchObjective(applicationDisptach);
    },
    onSuccess: () => {
      addSuccessMessage('Successfully edited Key Result.');
      fetchObjective(applicationDisptach);
    }
  });

  const toggleSelectDepartment = isExpanded => setIsSelectDepartmentOpen(isExpanded);
  const toggleSelectUser = isExpanded => setIsSelectUserOpen(isExpanded);
  const toggleSelectObjective = isExpanded => setIsSelectObjectiveOpen(isExpanded);
  const onResultTypeChange = (val: any) => setResultType(val);
  const onBinaryButtonChange = (val: any) => setBinaryButtonType(val);

  const {
    applicationState: { department, users, objective }
  } = useApplicationStateContext();
  const departmentOptions = map(department, d => ({ value: d.id, label: d.name }));
  const objectiveOptions = map(objective, d => ({ value: d.id, label: d.name }));

  const usersOptions = map(users, d => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }));

  useEffect(() => {
    if (modalType === ModalType.EDIT && !isEmpty(keyResultData)) {
      const { title, description, owner, department } = keyResultData;
      setValues({
        ...values,
        departmentName: find(departmentOptions, d => d.value === department.id),
        ownerName: find(usersOptions, d => d.value === owner.id),
        keyResultTitle: title,
        description: description
      });
    } else {
      setValues({ ...formInitState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, keyResultData]);

  const handleModalToggle = () => {
    onCloseModal();
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (modalType === ModalType.EDIT && !isEmpty(keyResultData)) {
        const payload = {
          department: find(department, d => d.id === values.departmentName.value),
          owner: find(users, d => d.id === values.ownerName.value),
          title: values.keyResultTitle,
          description: values.description
        };
        await editObjectiveData({ payload, id: keyResultData.id });
      } else {
        await sObjective({
          department: find(department, d => d.id === values.departmentName.value),
          owner: find(users, d => d.id === values.ownerName.value),
          title: values.keyResultTitle,
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
  const onDescriptionChange = value => {
    setValues({
      ...values,
      description: value || ''
    });
  };

  const buttonleft = () => {
    return (
      <>
        <ToolbarItem>
          <Button
            onClick={() => onResultTypeChange(ResultTypes.PERCENTAGE)}
            variant={resultType === ResultTypes.PERCENTAGE ? ButtonVariant.primary : ButtonVariant.secondary}
          >
            %
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            onClick={() => onResultTypeChange(ResultTypes.BINARY)}
            variant={resultType === ResultTypes.BINARY ? ButtonVariant.primary : ButtonVariant.secondary}
          >
            Binary
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            onClick={() => onResultTypeChange(ResultTypes.NUMBER)}
            variant={resultType === ResultTypes.NUMBER ? ButtonVariant.primary : ButtonVariant.secondary}
          >
            Number
          </Button>
        </ToolbarItem>
      </>
    );
  };

  const renderPercentage = () => {
    if (resultType === ResultTypes.PERCENTAGE) {
      return (
        <Grid hasGutter>
          <GridItem span={6}>
            <FormGroup label="Start" isRequired fieldId="start_start">
              <InputGroup>
                <TextInput id="start_start" type="text" aria-label="start input field" />
                <InputGroupText id="start_p">%</InputGroupText>
              </InputGroup>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Target" isRequired fieldId="target_start">
              <InputGroup>
                <TextInput id="target_start" type="text" aria-label="target input field" />
                <InputGroupText id="target_p">%</InputGroupText>
              </InputGroup>
            </FormGroup>
          </GridItem>
        </Grid>
      );
    } else {
      return null;
    }
  };
  const renderBinary = () => {
    if (resultType === ResultTypes.BINARY) {
      return (
        <Toolbar name="resultType" id="resultType">
          <ToolbarContent className="p-l-0">
            <ToolbarGroup variant="filter-group">
              <>
                <ToolbarItem>
                  <Button
                    onClick={() => onBinaryButtonChange(BinaryButtonType.IN_PROGRESS)}
                    variant={
                      binaryButtonType === BinaryButtonType.IN_PROGRESS
                        ? ButtonVariant.primary
                        : ButtonVariant.secondary
                    }
                  >
                    In Progress
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    onClick={() => onBinaryButtonChange(BinaryButtonType.DONE)}
                    variant={
                      binaryButtonType === BinaryButtonType.DONE ? ButtonVariant.primary : ButtonVariant.secondary
                    }
                  >
                    Done
                  </Button>
                </ToolbarItem>
              </>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      );
    } else {
      return null;
    }
  };

  const renderNumber = () => {
    if (resultType === ResultTypes.NUMBER) {
      return (
        <Grid hasGutter>
          <GridItem span={6}>
            <FormGroup label="Start" isRequired fieldId="start_number">
              <InputGroup>
                <TextInput id="start_number" type="text" aria-label="start number input field" />
              </InputGroup>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Target" isRequired fieldId="target_number">
              <InputGroup>
                <TextInput id="target_number" type="text" aria-label="target number input field" />
              </InputGroup>
            </FormGroup>
          </GridItem>
        </Grid>
      );
    } else {
      return null;
    }
  };

  const buttonright = () => {
    return (
      <React.Fragment>
        {renderPercentage()}
        {renderBinary()}
        {renderNumber()}
      </React.Fragment>
    );
  };

  return (
    <Modal
      className="keyresult-modal"
      title="Create Key Result"
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
        <FormGroup label="Result Type" fieldId={'resultType'} isRequired>
          <Toolbar name="resultType" id="resultType">
            <ToolbarContent className="p-l-0">
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <ToolbarGroup variant="filter-group">{buttonleft()}</ToolbarGroup>
                </FlexItem>
                <FlexItem>
                  <ToolbarGroup>{buttonright()}</ToolbarGroup>
                </FlexItem>
              </Flex>
            </ToolbarContent>
          </Toolbar>
        </FormGroup>
      </Form>
    </Modal>
  );
}
